import type {
  Assignment,
  AST,
  Condition,
  CreateAST,
  Database,
  DeleteAST,
  InsertAST,
  Row,
  Schema,
  SelectAST,
  UpdateAST,
} from "common";
import { Validator } from "src/validator";
import { DatabaseManagerError } from "./error";
import { Guard } from "./guard";

/**
 * An abstract database manager, which provides an API to run ASTs, and
 * handles the concurrency control, but leaves the implementation of
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
   * Reads an database and returns the object.
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
    }
  }

  /**
   * Runs the AST of a SELECT statement.
   */
  private async select<T extends Row>(ast: SelectAST) {
    const { table, fields, conditions } = ast;

    const database = await this.readDatabase();
    if (!database[table]) {
      throw new DatabaseManagerError(`Table ${table} does not exist`);
    }

    await this.guards[table]!.waitToRead();

    const validator = new Validator(database[table]!.schema);
    validator.validateSelect(ast);

    const filter = Manager.buildFilter(conditions);
    const selector = Manager.buildSelector(fields);
    const rows = database[table]!.rows.filter(filter).map(selector);

    this.guards[table]!.finishReading();

    return rows as T[];
  }

  /**
   * Runs the AST of an INSERT statement.
   */
  private async insert<T extends Row>(ast: InsertAST) {
    const { table, fields, values } = ast;

    const database = await this.readDatabase();
    if (!database[table]) {
      throw new DatabaseManagerError(`Table ${table} does not exist`);
    }

    await this.guards[table]!.waitToWrite();

    const validator = new Validator(database[table]!.schema);
    validator.validateInsert(ast);

    const row = Manager.buildRow(fields, values, database[table]!.schema);
    database[table]!.rows.push(row);
    await this.writeDatabase(database);

    this.guards[table]!.finishWriting();

    return [] as T[];
  }

  /**
   * Runs the AST of an UPDATE statement.
   */
  private async update<T extends Row>(ast: UpdateAST) {
    const { table, assignments, conditions } = ast;

    const database = await this.readDatabase();
    if (!database[table]) {
      throw new DatabaseManagerError(`Table ${table} does not exist`);
    }

    await this.guards[table]!.waitToWrite();

    const validator = new Validator(database[table]!.schema);
    validator.validateUpdate(ast);

    const filter = Manager.buildFilter(conditions);
    const updater = Manager.buildUpdater(assignments);
    database[table]!.rows.filter(filter).forEach(updater);
    await this.writeDatabase(database);

    this.guards[table]!.finishWriting();

    return [] as T[];
  }

  /**
   * Runs the AST of a DELETE statement.
   */
  private async delete<T extends Row>(ast: DeleteAST) {
    const { table, conditions } = ast;

    const database = await this.readDatabase();
    if (!database[table]) {
      throw new DatabaseManagerError(`Table ${table} does not exist`);
    }

    await this.guards[table]!.waitToWrite();

    const validator = new Validator(database[table]!.schema);
    validator.validateDelete(ast);

    const filter = Manager.buildFilter(conditions);
    database[table]!.rows = database[table]!.rows.filter((row) => !filter(row));

    await this.writeDatabase(database);

    this.guards[table]!.finishWriting();

    return [] as T[];
  }

  /**
   * Runs the AST of a CREATE statement.
   */
  private async create<T extends Row>(ast: CreateAST) {
    const { table, definitions } = ast;

    const database = await this.readDatabase();
    if (database[table]) {
      throw new DatabaseManagerError(`Table ${table} already exists`);
    }

    const validator = new Validator([]);
    validator.validateCreate(ast);

    database[table] = { schema: definitions, rows: [] };
    this.guards[table] = new Guard();
    await this.writeDatabase(database);

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
   * Builds a row according to the given fields and values,
   * which is an object with the fields as keys and the values as values.
   * If the fields is "*", then the row will contain all fields in the schema.
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
}
