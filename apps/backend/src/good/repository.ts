import { Good } from "shared-types";
import { query } from "utils/database";
import { ServiceUnavailableError } from "utils/http-error";

export const goodRepository = {
  findAll,
  findById,
  findAllByGraphId,
  create,
  updateById,
  removeById,
};

async function findAll() {
  return query<Good>(
    `
      SELECT *
      FROM good
    `
  );
}

async function findById(id: string) {
  const rows = await query<Good>(
    `
      SELECT *
      FROM good
      WHERE id = $1
    `,
    [id]
  );
  return rows[0];
}

async function findAllByGraphId(graphId: string) {
  return query<Good>(
    `
      SELECT *
      FROM good
      WHERE graphId = $1
    `,
    [graphId]
  );
}

async function create(creator: Omit<Good, "id" | "createdAt">) {
  const { name, sourceId, targetId, isVip, graphId } = creator;

  const rows = await query<Good>(
    `
      INSERT INTO good (id, name, createdAt, sourceId, targetId, isVip, graphId)
      VALUES (RANDOM_ID, $1, CURRENT_TIMESTAMP, $2, $3, $4, $5)
      RETURNING *
    `,
    [name, sourceId, targetId, isVip, graphId]
  );

  if (!rows[0]) {
    throw new ServiceUnavailableError("添加失败，请稍后再试");
  }

  return rows[0];
}

async function updateById(id: string, good: Good) {
  const { name, sourceId, targetId, isVip, graphId } = good;

  await query(
    `
      UPDATE good
      SET name = $2,
        sourceId = $3,
        targetId = $4,
        isVip = $5,
        graphId = $6
      WHERE id = $1
    `,
    [id, name, sourceId, targetId, isVip, graphId]
  );
}

async function removeById(id: string) {
  await query(
    `
      DELETE FROM good
      WHERE id = $1
    `,
    [id]
  );
}
