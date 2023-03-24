import type { NextFunction, Request, Response } from "express";
import { GoodsService } from "./service";
import type { CreateRequest, DeleteRequest, UpdateRequest } from "./types";

export class GoodsController {
  public static async findAll(_: Request, res: Response, next: NextFunction) {
    try {
      const goods = await GoodsService.findAll();
      return res.status(200).json({ message: "", data: goods });
    } catch (error) {
      return next(error);
    }
  }

  public static async create(
    req: CreateRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const good = await GoodsService.create(req.body);
      return res.status(201).json({ message: "", data: good });
    } catch (error) {
      return next(error);
    }
  }

  public static async update(
    req: UpdateRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const good = await GoodsService.updateById(req.params.id, req.body);
      return res.status(200).json({ message: "", data: good });
    } catch (error) {
      return next(error);
    }
  }

  public static async delete(
    req: DeleteRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      await GoodsService.deleteById(req.params.id);
      return res.status(204).end();
    } catch (error) {
      return next(error);
    }
  }
}
