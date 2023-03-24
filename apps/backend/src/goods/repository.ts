import { query } from "src/utils/database";
import type { Good } from "./types";

export class GoodsRepository {
  public static async findAll() {
    const goods = await query<Good>("SELECT * FROM goods");
    return goods;
  }

  public static async findById(id: string) {
    const [good] = await query<Good>(`SELECT * FROM goods WHERE id = ${id}`);
    return good;
  }

  public static async create(good: Good) {
    const { id, name, createdAt, source, target, isVip, graphId } = good;

    await query(`
      INSERT INTO goods (id, name, createdAt, source, target, isVip, graphId)
      VALUES (
        ${id},
        ${name},
        ${createdAt},
        ${source},
        ${target},
        ${isVip},
        ${graphId}
      )
    `);
  }

  public static async updateById(id: string, good: Good) {
    const { name, source, target, graphId } = good;

    await query(`
      UPDATE goods
      SET name = ${name},
        source = ${source},
        target = ${target},
        graphId = ${graphId}
      WHERE id = ${id}
    `);
  }

  public static async deleteById(id: string) {
    await query(`DELETE FROM goods WHERE id = ${id}`);
  }
}
