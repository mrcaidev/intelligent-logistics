import { NextFunction, Request, Response } from "express";
import { graphService } from "./service";
import { CreateRequest, RemoveByIdRequest, UpdateByIdRequest } from "./types";

export const graphController = {
  findAll,
  create,
  updateById,
  removeById,
};

async function findAll(_: Request, res: Response, next: NextFunction) {
  try {
    const graphs = await graphService.findAll();
    return res.status(200).json({ data: graphs });
  } catch (error) {
    return next(error);
  }
}

async function create(req: CreateRequest, res: Response, next: NextFunction) {
  try {
    const graph = await graphService.create(req.body);
    return res.status(201).json({ data: graph });
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
    await graphService.updateById(req.params.id, req.body);
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
    await graphService.removeById(req.params.id);
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
}
