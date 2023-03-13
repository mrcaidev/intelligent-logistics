/**
 * Description of the fields and their types.
 */
export type Schema = { field: string; type: string }[];

/**
 * A row of data in a table.
 */
export type Row = Record<string, unknown>;

/**
 * Table in a database.
 */
export type Table = {
  schema: Schema;
  rows: Row[];
};

/**
 * The structure of the JSON file as a database.
 */
export type Database = Record<string, Table>;

/**
 * The result of a query.
 */
export type Result = {
  rows: Row[];
  rowCount: number;
};
