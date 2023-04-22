import { query } from "utils/database";
import { ServiceUnavailableError } from "utils/http-error";
import { Good } from "./types";

export const goodRepository = {
  findAll,
  findById,
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
  const [good] = await query<Good>(
    `
      SELECT * FROM good
      WHERE id = $1
    `,
    [id]
  );
  return good;
}

async function create(creator: Omit<Good, "id" | "createdAt">) {
  const { name, source, target, isVip, graphId } = creator;

  const rows = await query<Good>(
    `
      INSERT INTO good
      VALUES (RANDOM_ID, $1, CURRENT_TIMESTAMP, $2, $3, $4, $5)
      RETURNING *
    `,
    [name, source, target, isVip, graphId]
  );

  if (!rows[0]) {
    throw new ServiceUnavailableError("添加失败，请稍后再试");
  }

  return rows[0];
}

async function updateById(id: string, good: Good) {
  const { name, source, target, graphId } = good;

  await query(
    `
      UPDATE good
      SET name = $2,
        source = $3,
        target = $4,
        graphId = $5
      WHERE id = $1
    `,
    [id, name, source, target, graphId]
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
