import type {
  CreateAST,
  DeleteAST,
  InsertAST,
  SelectAST,
  UpdateAST,
} from "src/parser";

/**
 * Schema of a table.
 */
export type Schema = { field: string; type: string }[];

/**
 * Result of running a SQL statement.
 */
type Result = {
  rows: Record<string, unknown>[];
  rowCount: number;
};

/**
 * The bridge between the SQL runner and the database file.
 */
export type ORM = {
  getSchema: (table: string) => Schema;
  select: (ast: SelectAST) => Result;
  insert: (ast: InsertAST) => Result;
  update: (ast: UpdateAST) => Result;
  delete: (ast: DeleteAST) => Result;
  create: (ast: CreateAST) => Result;
};
