import { Router } from "express";
import { validate } from "middlewares/validate";
import { graphController } from "./controller";
import {
  createRequestSchema,
  removeByIdRequestSchema,
  updateByIdRequestSchema,
} from "./types";

export const graphRouter: Router = Router();

graphRouter.get("/", graphController.findAll);

graphRouter.post("/", validate(createRequestSchema), graphController.create);

graphRouter.patch(
  "/:id",
  validate(updateByIdRequestSchema),
  graphController.updateById
);

graphRouter.delete(
  "/:id",
  validate(removeByIdRequestSchema),
  graphController.removeById
);
