import { Router } from "express";
import { GoodsController } from "./controller";

export const goodsRouter: Router = Router();

goodsRouter.get("/", GoodsController.findAll);
goodsRouter.post("/", GoodsController.create);
goodsRouter.put("/:id", GoodsController.update);
goodsRouter.delete("/:id", GoodsController.delete);
