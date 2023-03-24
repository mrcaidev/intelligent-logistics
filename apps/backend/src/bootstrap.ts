import { query } from "./utils/database";

export async function bootstrap() {
  await query(`
    CREATE TABLE goods (
      id NUMERIC,
      name TEXT,
      createdAt TEXT,
      source TEXT,
      target TEXT,
      isVip BOOLEAN,
      graphId TEXT
    )
  `);

  await query(`
    CREATE TABLE graphs (
      id TEXT,
      name TEXT
    )
  `);

  await query(`
    CREATE TABLE edges (
      id TEXT,
      source TEXT,
      target TEXT,
      cost NUMERIC,
      graphId TEXT
    )
  `);
}
