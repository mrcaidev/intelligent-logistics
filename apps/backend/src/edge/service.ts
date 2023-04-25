import { graphRepository } from "graph/repository";
import { nodeRepository } from "node/repository";
import { NotFoundError } from "utils/http-error";
import { edgeRepository } from "./repository";
import { CreateRequest, FindAllRequest, UpdateByIdRequest } from "./types";

export const edgeService = {
  findAll,
  create,
  updateById,
  removeById,
};

async function findAll(query: FindAllRequest["query"]) {
  const { graphId } = query;

  if (graphId) {
    return edgeRepository.findAllByGraphId(graphId);
  }

  return edgeRepository.findAll();
}

async function create(body: CreateRequest["body"]) {
  const { sourceId, targetId, graphId } = body;

  const source = await nodeRepository.findById(sourceId);

  if (!source) {
    throw new NotFoundError("起点不存在");
  }

  const target = await nodeRepository.findById(targetId);

  if (!target) {
    throw new NotFoundError("终点不存在");
  }

  const graph = await graphRepository.findById(graphId);

  if (!graph) {
    throw new NotFoundError("物流方案不存在");
  }

  return edgeRepository.create(body);
}

async function updateById(id: string, body: UpdateByIdRequest["body"]) {
  const { sourceId, targetId, graphId } = body;

  const oldEdge = await edgeRepository.findById(id);

  if (!oldEdge) {
    throw new NotFoundError("道路不存在");
  }

  if (sourceId) {
    const source = await nodeRepository.findById(sourceId);
    if (!source) {
      throw new NotFoundError("起点不存在");
    }
  }

  if (targetId) {
    const target = await nodeRepository.findById(targetId);
    if (!target) {
      throw new NotFoundError("终点不存在");
    }
  }

  if (graphId) {
    const graph = await graphRepository.findById(graphId);
    if (!graph) {
      throw new NotFoundError("物流方案不存在");
    }
  }

  await edgeRepository.updateById(id, { ...oldEdge, ...body });
}

async function removeById(id: string) {
  const oldEdge = await edgeRepository.findById(id);

  if (!oldEdge) {
    throw new NotFoundError("道路不存在");
  }

  await edgeRepository.removeById(id);
}
