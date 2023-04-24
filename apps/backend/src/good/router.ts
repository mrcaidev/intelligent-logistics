import { Router } from "express";
import { validate } from "middlewares/validate";
import { goodController } from "./controller";
import {
  createRequestSchema,
  findAllRequestSchema,
  removeByIdRequestSchema,
  updateByIdRequestSchema,
} from "./types";

export const goodRouter: Router = Router();

goodRouter.get("/", validate(findAllRequestSchema), goodController.findAll);

goodRouter.post("/", validate(createRequestSchema), goodController.create);

goodRouter.patch(
  "/:id",
  validate(updateByIdRequestSchema),
  goodController.updateById
);

goodRouter.delete(
  "/:id",
  validate(removeByIdRequestSchema),
  goodController.removeById
);

goodRouter.post("/deliver", goodController.deliver);
