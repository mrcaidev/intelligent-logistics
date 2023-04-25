import { NextFunction, Request, Response } from "express";
import { nodeService } from "./service";
import { CreateRequest, RemoveByIdRequest, UpdateByIdRequest } from "./types";

export const nodeController = {
  findAll,
  create,
  updateById,
  removeById,
};

async function findAll(_: Request, res: Response, next: NextFunction) {
  try {
    const data = await nodeService.findAll();
    return res.status(200).json({ data });
  } catch (error) {
    return next(error);
  }
}

async function create(req: CreateRequest, res: Response, next: NextFunction) {
  try {
    const data = await nodeService.create(req.body);
    return res.status(201).json({ data });
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
    await nodeService.updateById(req.params.id, req.body);
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
    await nodeService.removeById(req.params.id);
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
}
