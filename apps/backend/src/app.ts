import express, { type Express } from "express";
import { goodsRouter } from "./goods";
import { handleError } from "./middlewares/handle-error";
import { rootRouter } from "./root";

export const app: Express = express();

app.use(express.json());

app.use("/", rootRouter);
app.use("/goods", goodsRouter);

app.use(handleError);
