import type { NextFunction, Request, Response } from "express";
import type { CreateDto } from "./dto";
import { GoodsService } from "./service";

export class GoodsController {
  public static async findAll(_: Request, res: Response, next: NextFunction) {
    try {
      const goods = await GoodsService.findAll();
      res.status(200).json({ message: "", data: goods });
    } catch (error) {
      next(error);
    }
  }

  public static async create(
    req: Request<never, CreateDto>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const good = await GoodsService.create(req.body);
      res.status(201).json({ message: "", data: good });
    } catch (error) {
      next(error);
    }
  }

  public static async update(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const good = await GoodsService.update(req.params.id, req.body);
      res.status(200).json({ message: "", data: good });
    } catch (error) {
      next(error);
    }
  }

  public static async delete(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      await GoodsService.delete(req.params.id);
      res.status(204).json({ message: "", data: null });
    } catch (error) {
      next(error);
    }
  }
}
