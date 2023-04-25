import { query } from "./utils/database";

export async function bootstrap() {
  await query(`
    CREATE TABLE IF NOT EXISTS graph (
      id TEXT,
      name TEXT
    );
    CREATE TABLE IF NOT EXISTS node (
      id TEXT,
      name TEXT
    );
    CREATE TABLE IF NOT EXISTS edge (
      id TEXT,
      sourceId TEXT,
      targetId TEXT,
      cost NUMERIC,
      graphId TEXT
    );
    CREATE TABLE IF NOT EXISTS good (
      id TEXT,
      name TEXT,
      createdAt NUMERIC,
      sourceId TEXT,
      targetId TEXT,
      isVip BOOLEAN,
      graphId TEXT
    );
  `);
}
