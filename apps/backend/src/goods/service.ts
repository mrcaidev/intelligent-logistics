import { generateRandomId } from "common";
import { NotFoundError } from "utils/http-error";
import { goodRepository } from "./repository";
import { CreateRequest, UpdateByIdRequest } from "./types";

export const goodService = {
  findAll,
  create,
  updateById,
  removeById,
};

async function findAll() {
  return goodRepository.findAll();
}

async function create(creator: CreateRequest["body"]) {
  const id = generateRandomId();
  const createdAt = new Date().getTime();

  const good = { ...creator, id, createdAt };

  await goodRepository.create(good);

  return good;
}

async function updateById(id: string, updater: UpdateByIdRequest["body"]) {
  const oldGood = await goodRepository.findById(id);

  if (!oldGood) {
    throw new NotFoundError("物品不存在");
  }

  await goodRepository.updateById(id, { ...oldGood, ...updater });
}

async function removeById(id: string) {
  const oldGood = await goodRepository.findById(id);

  if (!oldGood) {
    throw new NotFoundError("物品不存在");
  }

  await goodRepository.removeById(id);
}
