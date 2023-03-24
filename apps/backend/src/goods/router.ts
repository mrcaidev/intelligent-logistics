import { Router } from "express";
import { validate } from "src/middlewares/validate";
import { GoodsController } from "./controller";
import { createReqSchema, deleteReqSchema, updateReqSchema } from "./types";

export const goodsRouter: Router = Router();

goodsRouter.get("/", GoodsController.findAll);
goodsRouter.post("/", validate(createReqSchema), GoodsController.create);
goodsRouter.patch("/:id", validate(updateReqSchema), GoodsController.update);
goodsRouter.delete("/:id", validate(deleteReqSchema), GoodsController.delete);
