import { query } from "utils/database";
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

async function create(good: Good) {
  const { id, name, createdAt, source, target, isVip, graphId } = good;

  await query(
    `
      INSERT INTO good
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `,
    [id, name, createdAt, source, target, isVip, graphId]
  );
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
