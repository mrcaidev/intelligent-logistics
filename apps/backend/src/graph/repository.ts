import { query } from "utils/database";
import { ServiceUnavailableError } from "utils/http-error";
import { Graph } from "./types";

export const graphRepository = {
  findAll,
  findById,
  create,
  updateById,
  removeById,
};

async function findAll() {
  return query<Graph>(
    `
      SELECT *
      FROM graph
    `
  );
}

async function findById(id: string) {
  const rows = await query<Graph>(
    `
      SELECT *
      FROM graph
      WHERE id = $1
    `,
    [id]
  );
  return rows[0];
}

async function create(creator: Omit<Graph, "id">) {
  const { name } = creator;

  const rows = await query<Graph>(
    `
      INSERT INTO graph (id, name)
      VALUES (RANDOM_ID, $1)
      RETURNING *
    `,
    [name]
  );

  if (!rows[0]) {
    throw new ServiceUnavailableError("添加失败，请稍后再试");
  }

  return rows[0];
}

async function updateById(id: string, graph: Graph) {
  const { name } = graph;

  await query(
    `
      UPDATE graph
      SET name = $2
      WHERE id = $1
    `,
    [id, name]
  );
}

async function removeById(id: string) {
  await query(
    `
      DELETE FROM graph
      WHERE id = $1;
      DELETE FROM edge
      WHERE graphId = $1;
      DELETE FROM good
      WHERE graphId = $1;
    `,
    [id]
  );
}
