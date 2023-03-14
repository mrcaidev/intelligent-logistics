/**
 * Assigns the VALUE to the FIELD.
 */
export type Assignment = {
  field: string;
  value: unknown;
};

/**
 * Expects the FIELD OPERATOR to the VALUE.
 */
export type Condition = {
  field: string;
  operator: string;
  value: unknown;
};

/**
 * Defines the FIELD to be of type TYPE.
 */
export type Definition = {
  field: string;
  type: string;
};

/**
 * The AST of a SELECT statement.
 */
export type SelectAST = {
  table: string;
  fields: "*" | string[];
  conditions: Condition[][];
};

/**
 * The AST of an INSERT statement.
 */
export type InsertAST = {
  table: string;
  fields: "*" | string[];
  values: unknown[];
};

/**
 * The AST of an UPDATE statement.
 */
export type UpdateAST = {
  table: string;
  assignments: Assignment[];
  conditions: Condition[][];
};

/**
 * The AST of a DELETE statement.
 */
export type DeleteAST = {
  table: string;
  conditions: Condition[][];
};

/**
 * The AST of a CREATE statement.
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
