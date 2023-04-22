import { graphRepository } from "graph/repository";
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

async function create(body: CreateRequest["body"]) {
  const { graphId } = body;

  const graph = await graphRepository.findById(graphId);

  if (!graph) {
    throw new NotFoundError("物流图不存在");
  }

  return goodRepository.create(body);
}

async function updateById(id: string, body: UpdateByIdRequest["body"]) {
  const { graphId } = body;

  const oldGood = await goodRepository.findById(id);

  if (!oldGood) {
    throw new NotFoundError("物品不存在");
  }

  if (graphId) {
    const graph = await graphRepository.findById(graphId);

    if (!graph) {
      throw new NotFoundError("物流图不存在");
    }
  }

  await goodRepository.updateById(id, { ...oldGood, ...body });
}

async function removeById(id: string) {
  const oldGood = await goodRepository.findById(id);

  if (!oldGood) {
    throw new NotFoundError("物品不存在");
  }

  await goodRepository.removeById(id);
}
