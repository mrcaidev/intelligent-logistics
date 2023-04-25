import { NotFoundError } from "utils/http-error";
import { graphRepository } from "./repository";
import { CreateRequest, UpdateByIdRequest } from "./types";

export const graphService = {
  findAll,
  create,
  updateById,
  removeById,
};

async function findAll() {
  return graphRepository.findAll();
}

async function create(body: CreateRequest["body"]) {
  return graphRepository.create(body);
}

async function updateById(id: string, body: UpdateByIdRequest["body"]) {
  const oldGraph = await graphRepository.findById(id);

  if (!oldGraph) {
    throw new NotFoundError("物流方案不存在");
  }

  await graphRepository.updateById(id, { ...oldGraph, ...body });
}

async function removeById(id: string) {
  const oldGraph = await graphRepository.findById(id);

  if (!oldGraph) {
    throw new NotFoundError("物流方案不存在");
  }

  await graphRepository.removeById(id);
}
