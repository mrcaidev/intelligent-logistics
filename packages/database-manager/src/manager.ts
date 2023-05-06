import { LockManager } from "lock";
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
} from "shared-types";
import { DatabaseManagerError } from "./error";
import { Validator } from "./validator";

/**
 * An implementation of database management system,
 * which can provide database-level concurrency control,
 * validate ASTs, and run them against an underlying JSON database.
 */
export abstract class Manager {
  /**
   * Controls concurrent I/O operations on database level.
   */
  private lockManager = new LockManager();

  /**
   * Delegates reading implementation to subclasses.
   */
  protected abstract readDatabase(): Promise<Database>;

  /**
   * Delegates writing implementation to subclasses.
   */
  protected abstract writeDatabase(database: Database): Promise<void>;

  /**
   * Runs an AST.
   */
  public async run<T extends Row>(ast: AST) {
    switch (ast.type) {
      case "select":
        return this.safeRead<T>(() => this.select(ast));
      case "insert":
        return this.safeWrite<T>(() => this.insert(ast));
      case "update":
        return this.safeWrite<T>(() => this.update(ast));
      case "delete":
        return this.safeWrite<T>(() => this.delete(ast));
      case "create":
        return this.safeWrite<T>(() => this.create(ast));
      case "drop":
        return this.safeWrite<T>(() => this.drop(ast));
    }
  }

  /**
   * Runs the AST of a SELECT statement.
   */
  private async select(ast: SelectAST) {
    const { table: tableName, fields, conditions } = ast;

    const database = await this.readDatabase();
    const table = database[tableName];

    if (!table) {
      throw new DatabaseManagerError(`Table ${tableName} does not exist`);
    }

    new Validator(table.schema).validate(ast);

    const filter = Manager.buildFilter(conditions);
    const selector = Manager.buildSelector(fields);
    return table.rows.filter(filter).map(selector);
  }

  /**
   * Runs the AST of an INSERT statement.
   */
  private async insert(ast: InsertAST) {
    const { table: tableName, fields, values, returning } = ast;

    const database = await this.readDatabase();
    const table = database[tableName];

    if (!table) {
      throw new DatabaseManagerError(`Table ${tableName} does not exist`);
    }

    new Validator(table.schema).validate(ast);

    const insertedRows = values.map((value) =>
      Manager.buildRow(fields, value, table.schema)
    );
    table.rows = [...table.rows, ...insertedRows];

    await this.writeDatabase(database);

    if (Array.isArray(returning) && returning.length === 0) {
      return [];
    }

    const selector = Manager.buildSelector(returning);
    return insertedRows.map(selector);
  }

  /**
   * Runs the AST of an UPDATE statement.
   */
  private async update(ast: UpdateAST) {
    const { table: tableName, assignments, conditions, returning } = ast;

    const database = await this.readDatabase();
    const table = database[tableName];

    if (!table) {
      throw new DatabaseManagerError(`Table ${tableName} does not exist`);
    }

    new Validator(table.schema).validate(ast);

    const filter = Manager.buildFilter(conditions);
    const updater = Manager.buildUpdater(assignments);
    const updatedRows = table.rows.filter(filter);
    updatedRows.forEach(updater);

    await this.writeDatabase(database);

    if (Array.isArray(returning) && returning.length === 0) {
      return [];
    }

    const selector = Manager.buildSelector(returning);
    return updatedRows.map(selector);
  }

  /**
   * Runs the AST of a DELETE statement.
   */
  private async delete(ast: DeleteAST) {
    const { table: tableName, conditions, returning } = ast;

    const database = await this.readDatabase();
    const table = database[tableName];

    if (!table) {
      throw new DatabaseManagerError(`Table ${tableName} does not exist`);
    }

    new Validator(table.schema).validate(ast);

    const filter = Manager.buildFilter(conditions);
    const deletedRows = table.rows.filter(filter);
    table.rows = table.rows.filter((row) => !filter(row));

    await this.writeDatabase(database);

    if (Array.isArray(returning) && returning.length === 0) {
      return [];
    }

    const selector = Manager.buildSelector(returning);
    return deletedRows.map(selector);
  }

  /**
   * Runs the AST of a CREATE statement.
   */
  private async create(ast: CreateAST) {
    const { table: tableName, ifNotExists, definitions } = ast;

    const database = await this.readDatabase();

    if (database[tableName] && ifNotExists) {
      return [];
    }

    if (database[tableName] && !ifNotExists) {
      throw new DatabaseManagerError(`Table ${tableName} already exists`);
    }

    new Validator().validate(ast);

    database[tableName] = { schema: definitions, rows: [] };

    await this.writeDatabase(database);

    return [];
  }

  /**
   * Runs the AST of a DROP statement.
   */
  private async drop(ast: DropAST) {
    const { table: tableName, ifExists } = ast;

    const database = await this.readDatabase();

    if (!database[tableName] && ifExists) {
      return [];
    }

    if (!database[tableName] && !ifExists) {
      throw new DatabaseManagerError(`Table ${tableName} does not exist`);
    }

    delete database[tableName];

    await this.writeDatabase(database);

    return [];
  }

  /**
   * Acquire S lock before reading the database,
   * and release it on completion or error.
   */
  private safeRead<T>(readFn: () => Promise<Row[]>) {
    try {
      this.lockManager.acquireSharedLock();
      return readFn() as Promise<T[]>;
    } finally {
      this.lockManager.releaseSharedLock();
    }
  }

  /**
   * Acquire X lock before writing the database,
   * and release it on completion or error.
   */
  private safeWrite<T>(writeFn: () => Promise<Row[]>) {
    try {
      this.lockManager.acquireExclusiveLock();
      return writeFn() as Promise<T[]>;
    } finally {
      this.lockManager.releaseExclusiveLock();
    }
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
   * which is an object with the fields as keys
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
}
