import { Router } from "express";
import { validate } from "middlewares/validate";
import { edgeController } from "./controller";
import {
  createRequestSchema,
  removeByIdRequestSchema,
  updateByIdRequestSchema,
} from "./types";

export const edgeRouter: Router = Router();

edgeRouter.get("/", edgeController.findAll);

edgeRouter.post("/", validate(createRequestSchema), edgeController.create);

edgeRouter.patch(
  "/:id",
  validate(updateByIdRequestSchema),
  edgeController.updateById
);

edgeRouter.delete(
  "/:id",
  validate(removeByIdRequestSchema),
  edgeController.removeById
);
