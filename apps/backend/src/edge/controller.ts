import { NextFunction, Response } from "express";
import { edgeService } from "./service";
import {
  CreateRequest,
  FindAllRequest,
  RemoveByIdRequest,
  UpdateByIdRequest,
} from "./types";

export const edgeController = {
  findAll,
  create,
  updateById,
  removeById,
};

async function findAll(req: FindAllRequest, res: Response, next: NextFunction) {
  try {
    const edges = await edgeService.findAll(req.query);
    return res.status(200).json({ data: edges });
  } catch (error) {
    return next(error);
  }
}

async function create(req: CreateRequest, res: Response, next: NextFunction) {
  try {
    const edge = await edgeService.create(req.body);
    return res.status(201).json({ data: edge });
  } catch (error) {
    return next(error);
  }
}

async function updateById(
  req: UpdateByIdRequest,
  res: Response,
  next: NextFunction
) {
  try {
    await edgeService.updateById(req.params.id, req.body);
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
}

async function removeById(
  req: RemoveByIdRequest,
  res: Response,
  next: NextFunction
) {
  try {
    await edgeService.removeById(req.params.id);
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
}
