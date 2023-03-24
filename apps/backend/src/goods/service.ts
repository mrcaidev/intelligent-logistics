import { generateRandomId } from "common";
import { HttpError } from "src/utils/error";
import { GoodsRepository } from "./repository";
import type { CreateRequest, Good, UpdateRequest } from "./types";

export class GoodsService {
  public static async findAll() {
    return GoodsRepository.findAll();
  }

  public static async create(dto: CreateRequest["body"]) {
    const id = generateRandomId();
    const createdAt = new Date().toISOString();
    const good = { ...dto, id, createdAt };

    await GoodsRepository.create(good);

    return good;
  }

  public static async updateById(id: string, dto: UpdateRequest["body"]) {
    const oldGood = await GoodsRepository.findById(id);

    if (!oldGood) {
      throw new HttpError(404, `Good ${id} not found`);
    }

    const newGood = { ...oldGood, ...dto } as Good;

    await GoodsRepository.updateById(id, newGood);

    return newGood;
  }

  public static async deleteById(id: string) {
    const good = await GoodsRepository.findById(id);

    if (!good) {
      throw new HttpError(404, `Good ${id} not found`);
    }

    await GoodsRepository.deleteById(id);
  }
}
