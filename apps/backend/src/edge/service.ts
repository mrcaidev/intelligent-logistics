import { NotFoundError } from "utils/http-error";
import { edgeRepository } from "./repository";
import { CreateRequest, UpdateByIdRequest } from "./types";

export const edgeService = {
  findAll,
  create,
  updateById,
  removeById,
};

async function findAll() {
  return edgeRepository.findAll();
}

async function create(body: CreateRequest["body"]) {
  return edgeRepository.create(body);
}

async function updateById(id: string, body: UpdateByIdRequest["body"]) {
  const oldExam = await edgeRepository.findById(id);

  if (!oldExam) {
    throw new NotFoundError("路线不存在");
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
