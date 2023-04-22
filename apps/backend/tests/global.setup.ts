import { query } from "utils/database";

export async function setup() {
  await query(`
    CREATE TABLE IF NOT EXISTS graph (
      id TEXT,
      name TEXT
    );
    CREATE TABLE IF NOT EXISTS edge (
      id TEXT,
      source TEXT,
      target TEXT,
      cost NUMERIC,
      graphId TEXT
    );
    CREATE TABLE IF NOT EXISTS good (
      id TEXT,
      name TEXT,
      createdAt NUMERIC,
      source TEXT,
      target TEXT,
      isVip BOOLEAN,
      graphId TEXT
    );
    DELETE FROM graph;
    DELETE FROM edge;
    DELETE FROM good;
    INSERT INTO graph (id, name) VALUES
    ('g1', 'graph');
    INSERT INTO edge (id, source, target, cost, graphId) VALUES
    ('e1', 'A', 'B', 2, 'g1'),
    ('e2', 'A', 'C', 1, 'g1'),
    ('e3', 'A', 'D', 6, 'g1'),
    ('e4', 'B', 'C', 7, 'g1'),
    ('e5', 'C', 'D', 4, 'g1');
    INSERT INTO good (id, name, createdAt, source, target, isVip, graphId) VALUES
    ('1', 'Beef', 1682153000000, 'A', 'D', FALSE, 'g1'),
    ('2', 'Pork', 1682153000001, 'B', 'C', TRUE, 'g1'),
    ('3', 'Milk', 1682153000002, 'B', 'D', FALSE, 'g1');
  `);
}

export async function teardown() {
  await query(`
    DROP TABLE IF EXISTS graph;
    DROP TABLE IF EXISTS edge;
    DROP TABLE IF EXISTS good;
  `);
}
