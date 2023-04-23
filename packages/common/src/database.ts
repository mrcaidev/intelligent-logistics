import { Definition } from "ast";

/**
 * Contains the column definitions of a table.
 */
export type Schema = Definition[];

/**
 * Contains the data of a single record.
 */
export type Row = Record<string, unknown>;

/**
 * Contains the schema and records of a table.
 */
export type Table = {
  schema: Schema;
  rows: Row[];
};

/**
 * Contains multiple tables.
 */
export type Database = Record<string, Table>;
