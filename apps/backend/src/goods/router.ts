import { Router } from "express";
import { validate } from "src/middlewares/validate";
import { GoodsController } from "./controller";
import {
  createRequestSchema,
  deleteRequestSchema,
  updateRequestSchema,
} from "./types";

export const goodsRouter: Router = Router();

goodsRouter.get("/", GoodsController.findAll);
goodsRouter.post("/", validate(createRequestSchema), GoodsController.create);
goodsRouter.patch(
  "/:id",
  validate(updateRequestSchema),
  GoodsController.update
);
goodsRouter.delete(
  "/:id",
  validate(deleteRequestSchema),
  GoodsController.delete
);
