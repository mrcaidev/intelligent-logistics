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
 * Abstract syntax trees.
 */
export type AST =
  | {
      type: "select";
      table: string;
      fields: "*" | string[];
      conditions: Condition[][];
    }
  | {
      type: "insert";
      table: string;
      assignments: Assignment[];
    }
  | {
      type: "update";
      table: string;
      assignments: Assignment[];
      conditions: Condition[][];
    }
  | {
      type: "delete";
      table: string;
      conditions: Condition[][];
    }
  | {
      type: "create";
      table: string;
      definitions: Definition[];
    };
