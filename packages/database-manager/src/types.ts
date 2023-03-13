/**
 * Assignment expression,
 * which assigns VALUE to the FIELD.
 */
export type Assignment = {
  field: string;
  value: unknown;
};

/**
 * Conditional expression,
 * which expects the FIELD OPERATOR to the VALUE.
 */
export type Condition = {
  field: string;
  operator: string;
  value: unknown;
};

/**
 * Definition expression,
 * which defines the FIELD to be TYPE.
 */
export type Definition = {
  field: string;
  type: string;
};

/**
 * Abstract syntax tree of SELECT statement.
 */
export type SelectAST = {
  table: string;
  fields: "*" | string[];
  conditions: Condition[][];
};

/**
 * Abstract syntax tree of INSERT statement.
 */
export type InsertAST = {
  table: string;
  fields: "*" | string[];
  values: unknown[];
};

/**
 * Abstract syntax tree of UPDATE statement.
 */
export type UpdateAST = {
  table: string;
  assignments: Assignment[];
  conditions: Condition[][];
};

/**
 * Abstract syntax tree of DELETE statement.
 */
export type DeleteAST = {
  table: string;
  conditions: Condition[][];
};

/**
 * Abstract syntax tree of CREATE statement.
 */
export type CreateAST = {
  table: string;
  definitions: Definition[];
};

/**
 * Abstract syntax tree.
 */
export type AST =
  | ({ type: "select" } & SelectAST)
  | ({ type: "insert" } & InsertAST)
  | ({ type: "update" } & UpdateAST)
  | ({ type: "delete" } & DeleteAST)
  | ({ type: "create" } & CreateAST);

export type Schema = { field: string; type: string }[];

export type Row = Record<string, unknown>;

export type Table = {
  schema: Schema;
  rows: Row[];
};

export type Database = Record<string, Table>;

export type Result = {
  rows: Row[];
  rowCount: number;
};
