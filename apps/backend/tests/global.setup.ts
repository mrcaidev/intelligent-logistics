import { query } from "utils/database";

export async function setup() {
  await query(
    `
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
      DELETE FROM graph;
      DELETE FROM node;
      DELETE FROM edge;
      DELETE FROM good;
      INSERT INTO graph VALUES
      ('g1', 'Airline');
      INSERT INTO node VALUES
      ('n1', 'A'),
      ('n2', 'B'),
      ('n3', 'C'),
      ('n4', 'D');
      INSERT INTO edge VALUES
      ('e1', 'n1', 'n2', 2, 'g1'),
      ('e2', 'n1', 'n3', 1, 'g1'),
      ('e3', 'n1', 'n4', 6, 'g1'),
      ('e4', 'n2', 'n3', 7, 'g1'),
      ('e5', 'n3', 'n4', 4, 'g1');
      INSERT INTO good VALUES
      ('1', 'Beef', 1682153000001, 'n1', 'n4', FALSE, 'g1'),
      ('2', 'Pork', 1682153000002, 'n2', 'n3', TRUE, 'g1'),
      ('3', 'Milk', 1682153000003, 'n2', 'n4', FALSE, 'g1');
    `
  );
}

export async function teardown() {
  await query(
    `
      DROP TABLE IF EXISTS graph;
      DROP TABLE IF EXISTS node;
      DROP TABLE IF EXISTS edge;
      DROP TABLE IF EXISTS good;
    `
  );
}
