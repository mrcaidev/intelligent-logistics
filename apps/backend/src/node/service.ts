import { NotFoundError } from "utils/http-error";
import { nodeRepository } from "./repository";
import { CreateRequest, UpdateByIdRequest } from "./types";

export const nodeService = {
  findAll,
  create,
  updateById,
  removeById,
};

async function findAll() {
  return nodeRepository.findAll();
}

async function create(body: CreateRequest["body"]) {
  return nodeRepository.create(body);
}

async function updateById(id: string, body: UpdateByIdRequest["body"]) {
  const oldNode = await nodeRepository.findById(id);

  if (!oldNode) {
    throw new NotFoundError("节点不存在");
  }

  await nodeRepository.updateById(id, { ...oldNode, ...body });
}

async function removeById(id: string) {
  const oldNode = await nodeRepository.findById(id);

  if (!oldNode) {
    throw new NotFoundError("节点不存在");
  }

  await nodeRepository.removeById(id);
}
