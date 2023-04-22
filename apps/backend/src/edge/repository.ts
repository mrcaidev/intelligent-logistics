import { query } from "utils/database";
import { ServiceUnavailableError } from "utils/http-error";
import { Edge } from "./types";

export const edgeRepository = {
  findAll,
  findById,
  create,
  updateById,
  removeById,
};

async function findAll() {
  return query<Edge>(
    `
      SELECT *
      FROM edge
    `
  );
}

async function findById(id: string) {
  const rows = await query<Edge>(
    `
      SELECT *
      FROM edge
      WHERE id = $1
    `,
    [id]
  );
  return rows[0];
}

async function create(creator: Omit<Edge, "id">) {
  const { source, target, cost, graphId } = creator;

  const rows = await query<Edge>(
    `
      INSERT INTO edge (id, source, target, cost, graphId)
      VALUES (RANDOM_ID, $1, $2, $3, $4)
      RETURNING *
    `,
    [source, target, cost, graphId]
  );

  if (!rows[0]) {
    throw new ServiceUnavailableError("添加失败，请稍后再试");
  }

  return rows[0];
}

async function updateById(id: string, graph: Edge) {
  const { source, target, cost, graphId } = graph;

  await query(
    `
      UPDATE edge
      SET source = $2,
        target = $3,
        cost = $4,
        graphId = $5
      WHERE id = $1
    `,
    [id, source, target, cost, graphId]
  );
}

async function removeById(id: string) {
  await query(
    `
      DELETE FROM edge
      WHERE id = $1
    `,
    [id]
  );
}
