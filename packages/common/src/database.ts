/**
 * The outline of a table, including its fields and corresponding types.
 */
export type Schema = { field: string; type: string }[];

/**
 * A row of data in a table.
 */
export type Row = Record<string, unknown>;

/**
 * A table in a database.
 */
export type Table = {
  schema: Schema;
  rows: Row[];
};

/**
 * A database.
 */
export type Database = Record<string, Table>;
