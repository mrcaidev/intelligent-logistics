import express, { Express } from "express";
import { goodsRouter } from "./goods";
import { handleError } from "./middlewares/handle-error";

export const app: Express = express();

app.use(express.json());

app.get("/healthz", (_, res) => {
  res.status(200).json({ message: "OK", data: null });
});

app.use("/goods", goodsRouter);

app.use(handleError);
