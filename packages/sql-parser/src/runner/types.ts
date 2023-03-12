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
 * The bridge between the SQL runner and the database file.
 */
export type ORM = {
  getSchema: (table: string) => Schema;
  select: (ast: SelectAST) => Record<string, unknown>[];
  insert: (ast: InsertAST) => void;
  update: (ast: UpdateAST) => void;
  delete: (ast: DeleteAST) => void;
  create: (ast: CreateAST) => void;
};
