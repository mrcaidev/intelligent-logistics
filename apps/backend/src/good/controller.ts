import { NextFunction, Request, Response } from "express";
import { goodService } from "./service";
import {
  CreateRequest,
  FindAllRequest,
  RemoveByIdRequest,
  UpdateByIdRequest,
} from "./types";

export const goodController = {
  findAll,
  create,
  updateById,
  removeById,
  deliver,
};

async function findAll(req: FindAllRequest, res: Response, next: NextFunction) {
  try {
    const data = await goodService.findAll(req.query);
    return res.status(200).json({ data });
  } catch (error) {
    return next(error);
  }
}

async function create(req: CreateRequest, res: Response, next: NextFunction) {
  try {
    const data = await goodService.create(req.body);
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
    await goodService.updateById(req.params.id, req.body);
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
    await goodService.removeById(req.params.id);
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
}

async function deliver(_: Request, res: Response, next: NextFunction) {
  try {
    const data = await goodService.deliver();
    return res.status(200).json({ data });
  } catch (error) {
    return next(error);
  }
}
