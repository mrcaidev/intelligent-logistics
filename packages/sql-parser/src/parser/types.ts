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
 * which expects the FIELD OPERATOR to VALUE.
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
 * Abstract syntax trees of SELECT statement.
 */
export type SelectAST = {
  table: string;
  fields: "*" | string[];
  conditions: Condition[][];
};

/**
 * Abstract syntax trees of INSERT statement.
 */
export type InsertAST = {
  table: string;
  assignments: Assignment[];
};

/**
 * Abstract syntax trees of UPDATE statement.
 */
export type UpdateAST = {
  table: string;
  assignments: Assignment[];
  conditions: Condition[][];
};

/**
 * Abstract syntax trees of DELETE statement.
 */
export type DeleteAST = {
  table: string;
  conditions: Condition[][];
};

/**
 * Abstract syntax trees of CREATE statement.
 */
export type CreateAST = {
  table: string;
  definitions: Definition[];
};

/**
 * Abstract syntax trees.
 */
export type AST =
  | ({ type: "select" } & SelectAST)
  | ({ type: "insert" } & InsertAST)
  | ({ type: "update" } & UpdateAST)
  | ({ type: "delete" } & DeleteAST)
  | ({ type: "create" } & CreateAST);
