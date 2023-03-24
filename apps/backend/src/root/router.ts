import { Router } from "express";

export const rootRouter: Router = Router();

rootRouter.get("/healthz", (_, res) => {
  return res.status(200).json({ message: "", data: null });
});
