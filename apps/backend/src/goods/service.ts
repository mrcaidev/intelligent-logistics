import { HttpError } from "src/utils/error";
import type { CreateDto } from "./dto";
import { GoodsRepository } from "./repository";

export class GoodsService {
  public static async findAll() {
    return GoodsRepository.findAll();
  }

  public static async create(dto: CreateDto) {
    return GoodsRepository.create(dto);
  }

  public static async update(id: string, dto: CreateDto) {
    const oldGood = await GoodsRepository.findById(id);

    if (!oldGood) {
      throw new HttpError(404, `Good ${id} not found`);
    }

    const newGood = { ...oldGood, ...dto };

    await GoodsRepository.update(id, newGood);

    return newGood;
  }

  public static async delete(id: string) {
    const good = await GoodsRepository.findById(id);

    if (!good) {
      throw new HttpError(404, `Good ${id} not found`);
    }

    await GoodsRepository.delete(id);
  }
}
