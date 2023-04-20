/**
 * Assigns VALUE to FIELD.
 */
export type Assignment = {
  field: string;
  value: unknown;
};

/**
 * Expects FIELD OPERATOR to VALUE.
 */
export type Condition = {
  field: string;
  operator: string;
  value: unknown;
};

/**
 * Defines FIELD to be of type TYPE.
 */
export type Definition = {
  field: string;
  type: string;
};

/**
 * The AST of a SELECT statement.
 */
export type SelectAST = {
  type: "select";
  table: string;
  fields: "*" | string[];
  conditions: Condition[][];
};

/**
 * The AST of an INSERT statement.
 */
export type InsertAST = {
  type: "insert";
  table: string;
  fields: "*" | string[];
  values: unknown[][];
};

/**
 * The AST of an UPDATE statement.
 */
export type UpdateAST = {
  type: "update";
  table: string;
  assignments: Assignment[];
  conditions: Condition[][];
};

/**
 * The AST of a DELETE statement.
 */
export type DeleteAST = {
  type: "delete";
  table: string;
  conditions: Condition[][];
};

/**
 * The AST of a CREATE statement.
 */
export type CreateAST = {
  type: "create";
  table: string;
  ifNotExists: boolean;
  definitions: Definition[];
};

/**
 * The AST of a DROP statement.
 */
export type DropAST = {
  type: "drop";
  table: string;
  ifExists: boolean;
};

/**
 * The AST of a SQL statement.
 */
export type AST =
  | SelectAST
  | InsertAST
  | UpdateAST
  | DeleteAST
  | CreateAST
  | DropAST;
