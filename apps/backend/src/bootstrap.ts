import { query } from "./utils/database";

export async function bootstrap() {
  await query(`
    CREATE TABLE IF NOT EXISTS goods (
      id TEXT,
      name TEXT,
      createdAt TEXT,
      source TEXT,
      target TEXT,
      isVip BOOLEAN,
      graphId TEXT
    )
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS graphs (
      id TEXT,
      name TEXT
    )
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS edges (
      id TEXT,
      source TEXT,
      target TEXT,
      cost NUMERIC,
      graphId TEXT
    )
  `);
}
