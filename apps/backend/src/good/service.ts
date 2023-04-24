import { getMostPrior, getShortestPath } from "delivery-scheduler";
import { edgeRepository } from "edge/repository";
import { graphRepository } from "graph/repository";
import { NotFoundError, UnprocessableContentError } from "utils/http-error";
import { goodRepository } from "./repository";
import { CreateRequest, FindAllRequest, UpdateByIdRequest } from "./types";

export const goodService = {
  findAll,
  create,
  updateById,
  removeById,
  deliver,
};

async function findAll(query: FindAllRequest["query"]) {
  const { graphId } = query;

  if (graphId) {
    return goodRepository.findAllByGraphId(graphId);
  }

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

async function deliver() {
  const goods = await goodRepository.findAll();
  const good = getMostPrior(goods);

  if (!good) {
    throw new UnprocessableContentError("没有物品需要运送");
  }

  const edges = await edgeRepository.findByGraphId(good.graphId);
  const path = getShortestPath(edges, good.source, good.target);

  if (path.nodes.length === 0) {
    throw new UnprocessableContentError("没有合适的路径");
  }

  await goodRepository.removeById(good.id);

  return { good, ...path };
}
