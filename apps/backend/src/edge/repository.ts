import { Edge } from "shared-types";
import { query } from "utils/database";
import { ServiceUnavailableError } from "utils/http-error";

export const edgeRepository = {
  findAll,
  findById,
  findAllByGraphId,
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

async function findAllByGraphId(graphId: string) {
  return query<Edge>(
    `
      SELECT *
      FROM edge
      WHERE graphId = $1
    `,
    [graphId]
  );
}

async function create(creator: Omit<Edge, "id">) {
  const { sourceId, targetId, cost, graphId } = creator;

  const rows = await query<Edge>(
    `
      INSERT INTO edge (id, sourceId, targetId, cost, graphId)
      VALUES (RANDOM_ID, $1, $2, $3, $4)
      RETURNING *
    `,
    [sourceId, targetId, cost, graphId]
  );

  if (!rows[0]) {
    throw new ServiceUnavailableError("添加失败，请稍后再试");
  }

  return rows[0];
}

async function updateById(id: string, graph: Edge) {
  const { sourceId, targetId, cost, graphId } = graph;

  await query(
    `
      UPDATE edge
      SET sourceId = $2,
        targetId = $3,
        cost = $4,
        graphId = $5
      WHERE id = $1
    `,
    [id, sourceId, targetId, cost, graphId]
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
