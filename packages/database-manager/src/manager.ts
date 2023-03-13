import { readFile, writeFile } from "fs/promises";
import { DatabaseManagerError } from "./error";
import type { TableGuard } from "./table-guard";
import type {
  Assignment,
  Condition,
  CreateAST,
  Database,
  DeleteAST,
  InsertAST,
  Row,
  Schema,
  SelectAST,
  UpdateAST,
} from "./types";
import { Validator } from "./validator";

export class DatabaseManager {
  private tableGuards: Record<string, TableGuard> = {};

  constructor(private database: string) {}

  public async select(ast: SelectAST) {
    const { table, fields, conditions } = ast;

    await this.tableGuards[table]!.waitToRead();

    const database = await this.readDatabase();

    const validator = new Validator(database[table]!.schema);
    validator.validateSelect(ast);

    const filter = DatabaseManager.buildFilter(conditions);
    const selector = DatabaseManager.buildSelector(fields);
    const resultRows = database[table]!.rows.filter(filter).map(selector);

    this.tableGuards[table]!.finishReading();

    return { rows: resultRows, rowCount: resultRows.length };
  }

  public async insert(ast: InsertAST) {
    const { table, fields, values } = ast;

    await this.tableGuards[table]!.waitToWrite();

    const database = await this.readDatabase();

    const validator = new Validator(database[table]!.schema);
    validator.validateInsert(ast);

    const row = DatabaseManager.buildRow(
      fields,
      values,
      database[table]!.schema
    );
    database[table]!.rows.push(row);
    await this.writeDatabase(database);

    this.tableGuards[table]!.finishWriting();

    return { rows: [], rowCount: 1 };
  }

  public async update(ast: UpdateAST) {
    const { table, assignments, conditions } = ast;

    await this.tableGuards[table]!.waitToWrite();

    const database = await this.readDatabase();

    const validator = new Validator(database[table]!.schema);
    validator.validateUpdate(ast);

    const filter = DatabaseManager.buildFilter(conditions);
    const updater = DatabaseManager.buildUpdater(assignments);
    database[table]!.rows.filter(filter).forEach(updater);

    await this.writeDatabase(database);

    this.tableGuards[table]!.finishWriting();

    return { rows: [], rowCount: 0 };
  }

  public async delete(ast: DeleteAST) {
    const { table, conditions } = ast;

    await this.tableGuards[table]!.waitToWrite();

    const database = await this.readDatabase();

    const validator = new Validator(database[table]!.schema);
    validator.validateDelete(ast);

    const filter = DatabaseManager.buildFilter(conditions);
    database[table]!.rows = database[table]!.rows.filter((row) => !filter(row));

    await this.writeDatabase(database);

    this.tableGuards[table]!.finishWriting();

    return { rows: [], rowCount: 0 };
  }

  public async create(ast: CreateAST) {
    const { table, definitions } = ast;

    await this.tableGuards[table]!.waitToWrite();

    const database = await this.readDatabase();

    const validator = new Validator([]);
    validator.validateCreate(ast);

    database[table] = { schema: definitions, rows: [] };
    await this.writeDatabase(database);

    this.tableGuards[table]!.finishWriting();

    return { rows: [], rowCount: 0 };
  }

  private async readDatabase() {
    const buffer = await readFile(this.database);
    return JSON.parse(buffer.toString()) as Database;
  }

  private async writeDatabase(data: Database) {
    const text = JSON.stringify(data);
    await writeFile(this.database, text);
  }

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

  private static buildFilter(conditions: Condition[][]) {
    const orFilters = conditions.map((group) => {
      const andFilters = group.map(DatabaseManager.conditionToFilter);
      return (row: Row) => andFilters.every((filter) => filter(row));
    });
    return (row: Row) => orFilters.some((filter) => filter(row));
  }

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

  private static buildUpdater(assignments: Assignment[]) {
    return (row: Row) => {
      for (const { field, value } of assignments) {
        row[field] = value;
      }
    };
  }

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
        throw new DatabaseManagerError(`Unknown operator: ${operator}`);
    }
  }
}
