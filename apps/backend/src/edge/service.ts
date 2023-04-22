import { graphRepository } from "graph/repository";
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
    return edgeRepository.findByGraphId(graphId);
  }

  return edgeRepository.findAll();
}

async function create(body: CreateRequest["body"]) {
  const { graphId } = body;

  const graph = await graphRepository.findById(graphId);

  if (!graph) {
    throw new NotFoundError("物流图不存在");
  }

  return edgeRepository.create(body);
}

async function updateById(id: string, body: UpdateByIdRequest["body"]) {
  const { graphId } = body;

  const oldExam = await edgeRepository.findById(id);

  if (!oldExam) {
    throw new NotFoundError("路线不存在");
  }

  if (graphId) {
    const graph = await graphRepository.findById(graphId);

    if (!graph) {
      throw new NotFoundError("物流图不存在");
    }
  }

  await edgeRepository.updateById(id, { ...oldExam, ...body });
}

async function removeById(id: string) {
  const oldExam = await edgeRepository.findById(id);

  if (!oldExam) {
    throw new NotFoundError("路线不存在");
  }

  await edgeRepository.removeById(id);
}
