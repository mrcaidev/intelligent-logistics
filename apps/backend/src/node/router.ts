import { Router } from "express";
import { validate } from "middlewares/validate";
import { nodeController } from "./controller";
import {
  createRequestSchema,
  removeByIdRequestSchema,
  updateByIdRequestSchema,
} from "./types";

export const nodeRouter: Router = Router();

nodeRouter.get("/", nodeController.findAll);

nodeRouter.post("/", validate(createRequestSchema), nodeController.create);

nodeRouter.patch(
  "/:id",
  validate(updateByIdRequestSchema),
  nodeController.updateById
);

nodeRouter.delete(
  "/:id",
  validate(removeByIdRequestSchema),
  nodeController.removeById
);
