import { Node } from "shared-types";
import { query } from "utils/database";
import { ServiceUnavailableError } from "utils/http-error";

export const nodeRepository = {
  findAll,
  findById,
  create,
  updateById,
  removeById,
};

async function findAll() {
  return query<Node>(
    `
      SELECT *
      FROM node
    `
  );
}

async function findById(id: string) {
  const rows = await query<Node>(
    `
      SELECT *
      FROM node
      WHERE id = $1
    `,
    [id]
  );
  return rows[0];
}

async function create(creator: Omit<Node, "id">) {
  const { name } = creator;

  const rows = await query<Node>(
    `
      INSERT INTO node (id, name)
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

async function updateById(id: string, node: Node) {
  const { name } = node;

  await query(
    `
      UPDATE node
      SET name = $2
      WHERE id = $1
    `,
    [id, name]
  );
}

async function removeById(id: string) {
  await query(
    `
      DELETE FROM node
      WHERE id = $1;
      DELETE FROM edge
      WHERE sourceId = $1 OR targetId = $1;
      DELETE FROM good
      WHERE sourceId = $1 OR targetId = $1;
    `,
    [id]
  );
}
