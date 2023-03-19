import { generateRandomId } from "common";
import { query } from "src/utils/database";
import type { CreateDto } from "./dto";
import type { Good } from "./models";

export class GoodsRepository {
  public static async findAll() {
    const goods = await query<Good>("SELECT * FROM goods");
    return goods;
  }

  public static async findById(id: string) {
    const [good] = await query<Good>(`SELECT * FROM goods WHERE id = ${id}`);
    return good;
  }

  public static async create(dto: CreateDto) {
    const { name, source, target, isVip, graphId } = dto;

    const id = generateRandomId();
    const createdAt = new Date().toISOString();

    await query(`
      INSERT INTO goods (id, name, createdAt, source, target, isVip, graphId)
      VALUES (${id}, ${name}, ${createdAt}, ${source}, ${target}, ${isVip}, ${graphId})
    `);

    return { id, createdAt, ...dto } as Good;
  }

  public static async update(id: string, dto: Good) {
    const { name, source, target, graphId } = dto;

    await query(`
      UPDATE goods
      SET name = ${name},
        source = ${source},
        target = ${target},
        graphId = ${graphId}
      WHERE id = ${id}
    `);

    return dto;
  }

  public static async delete(id: string) {
    await query(`DELETE FROM goods WHERE id = ${id}`);
  }
}
