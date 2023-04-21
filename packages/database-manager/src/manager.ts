import {
  Assignment,
  AST,
  Condition,
  CreateAST,
  Database,
  DeleteAST,
  DropAST,
  InsertAST,
  Row,
  Schema,
  SelectAST,
  UpdateAST,
} from "common";
import { DatabaseManagerError } from "./error";
import { Guard } from "./guard";
import { Validator } from "./validator";

/**
 * An abstract database manager, which provides an API to run ASTs,
 * controls concurrency, but leaves the implementation of
 * reading and writing the database to its subclasses.
 */
export abstract class Manager {
  /**
   * The guards of every table, used to control
   * the concurrency of reading and writing on every table.
   */
  private guards: Record<string, Guard> = {};

  constructor(protected databaseName: string) {}

  /**
   * Reads a database and returns the object.
   */
  protected abstract readDatabase(): Promise<Database>;

  /**
   * Writes an object to the database.
   */
  protected abstract writeDatabase(database: Database): Promise<void>;

  /**
   * Runs an AST.
   */
  public async run<T extends Row>(ast: AST) {
    switch (ast.type) {
      case "select":
        return this.select<T>(ast);
      case "insert":
        return this.insert<T>(ast);
      case "update":
        return this.update<T>(ast);
      case "delete":
        return this.delete<T>(ast);
      case "create":
        return this.create<T>(ast);
      case "drop":
        return this.drop<T>(ast);
    }
  }

  /**
   * Runs the AST of a SELECT statement.
   */
  private async select<T extends Row>(ast: SelectAST) {
    const { table: tableName, fields, conditions } = ast;

    const database = await this.readDatabase();
    const table = database[tableName];

    if (!table) {
      throw new DatabaseManagerError(`Table ${tableName} does not exist`);
    }

    const guard = this.getGuard(tableName);
    await guard.waitToRead();

    const validator = new Validator(table.schema);
    validator.validate(ast);

    const filter = Manager.buildFilter(conditions);
    const selector = Manager.buildSelector(fields);
    const rows = table.rows.filter(filter).map(selector);

    guard.finishReading();

    return rows as T[];
  }

  /**
   * Runs the AST of an INSERT statement.
   */
  private async insert<T extends Row>(ast: InsertAST) {
    const { table: tableName, fields, values } = ast;

    const database = await this.readDatabase();
    const table = database[tableName];

    if (!table) {
      throw new DatabaseManagerError(`Table ${tableName} does not exist`);
    }

    const guard = this.getGuard(tableName);
    await guard.waitToWrite();

    const validator = new Validator(table.schema);
    validator.validate(ast);

    const insertedRows = values.map((value) =>
      Manager.buildRow(fields, value, table.schema)
    );
    table.rows = [...table.rows, ...insertedRows];

    await this.writeDatabase(database);

    guard.finishWriting();

    return [] as T[];
  }

  /**
   * Runs the AST of an UPDATE statement.
   */
  private async update<T extends Row>(ast: UpdateAST) {
    const { table: tableName, assignments, conditions } = ast;

    const database = await this.readDatabase();
    const table = database[tableName];

    if (!table) {
      throw new DatabaseManagerError(`Table ${tableName} does not exist`);
    }

    const guard = this.getGuard(tableName);
    await guard.waitToWrite();

    const validator = new Validator(table.schema);
    validator.validate(ast);

    const filter = Manager.buildFilter(conditions);
    const updater = Manager.buildUpdater(assignments);
    table.rows.filter(filter).forEach(updater);

    await this.writeDatabase(database);

    guard.finishWriting();

    return [] as T[];
  }

  /**
   * Runs the AST of a DELETE statement.
   */
  private async delete<T extends Row>(ast: DeleteAST) {
    const { table: tableName, conditions } = ast;

    const database = await this.readDatabase();
    const table = database[tableName];

    if (!table) {
      throw new DatabaseManagerError(`Table ${tableName} does not exist`);
    }

    const guard = this.getGuard(tableName);
    await guard.waitToWrite();

    const validator = new Validator(table.schema);
    validator.validate(ast);

    const filter = Manager.buildFilter(conditions);
    table.rows = table.rows.filter((row) => !filter(row));

    await this.writeDatabase(database);

    guard.finishWriting();

    return [] as T[];
  }

  /**
   * Runs the AST of a CREATE statement.
   */
  private async create<T extends Row>(ast: CreateAST) {
    const { table: tableName, ifNotExists, definitions } = ast;

    const database = await this.readDatabase();

    if (database[tableName] && ifNotExists) {
      return [] as T[];
    }

    if (database[tableName] && !ifNotExists) {
      throw new DatabaseManagerError(`Table ${tableName} already exists`);
    }

    const validator = new Validator([]);
    validator.validate(ast);

    database[tableName] = { schema: definitions, rows: [] };

    await this.writeDatabase(database);

    return [] as T[];
  }

  /**
   * Runs the AST of a DROP statement.
   */
  private async drop<T extends Row>(ast: DropAST) {
    const { table: tableName, ifExists } = ast;

    const database = await this.readDatabase();

    if (!database[tableName] && ifExists) {
      return [] as T[];
    }

    if (!database[tableName] && !ifExists) {
      throw new DatabaseManagerError(`Table ${tableName} does not exist`);
    }

    const guard = this.getGuard(tableName);
    await guard.waitToWrite();

    delete database[tableName];

    await this.writeDatabase(database);

    guard.finishWriting();

    return [] as T[];
  }

  /**
   * Builds a selector function according to the given fields,
   * which accepts a row and returns a new row with only the selected fields.
   */
  private static buildSelector(fields: "*" | string[]) {
    if (fields === "*") {
      return (row: Row) => row;
    }

    return (row: Row) => {
      const selectedRow: Row = {};
      for (const field of fields) {
        selectedRow[field] = row[field];
      }
      return selectedRow;
    };
  }

  /**
   * Builds a filter function according to the given conditions,
   * which accepts a row and returns true if the row matches the conditions,
   * or false otherwise.
   */
  private static buildFilter(conditions: Condition[][]) {
    if (conditions.length === 0) {
      return () => true;
    }

    const orFilters = conditions.map((group) => {
      const andFilters = group.map(Manager.conditionToFilter);
      return (row: Row) => andFilters.every((filter) => filter(row));
    });
    return (row: Row) => orFilters.some((filter) => filter(row));
  }

  /**
   * Builds rows according to the given fields and values,
   * each of which is an object with the fields as keys
   * and the values as values.
   */
  private static buildRow(
    fields: "*" | string[],
    values: unknown[],
    schema: Schema
  ) {
    return Object.fromEntries(
      fields === "*"
        ? schema.map(({ field }, index) => [field, values[index]])
        : fields.map((field, index) => [field, values[index]])
    );
  }

  /**
   * Builds an updater function according to the given assignments,
   * which accepts a row and updates it in place.
   */
  private static buildUpdater(assignments: Assignment[]) {
    return (row: Row) => {
      for (const { field, value } of assignments) {
        row[field] = value;
      }
    };
  }

  /**
   * Builds a filter function according to the given condition,
   * which accepts a row and returns true if the row matches the condition,
   * or false otherwise.
   */
  private static conditionToFilter(condition: Condition) {
    const { field, operator, value } = condition;

    switch (operator) {
      case "=":
        return (row: Row) => row[field] === value;
      case "!=":
        return (row: Row) => row[field] !== value;
      case ">":
        return (row: Row) => (row[field] as number) > (value as number);
      case ">=":
        return (row: Row) => (row[field] as number) >= (value as number);
      case "<":
        return (row: Row) => (row[field] as number) < (value as number);
      case "<=":
        return (row: Row) => (row[field] as number) <= (value as number);
      default:
        throw new DatabaseManagerError(`Invalid operator: ${operator}`);
    }
  }

  /**
   * Gets the guard for a table. If it does not yet exist,
   * creates and returns a new guard for the table.
   */
  private getGuard(table: string) {
    const guard = this.guards[table];

    if (guard) {
      return guard;
    }

    const newGuard = new Guard();
    this.guards[table] = newGuard;
    return newGuard;
  }
}
