import cors from "cors";
import { edgeRouter } from "edge/router";
import express, { Express } from "express";
import { rateLimit } from "express-rate-limit";
import { goodRouter } from "good/router";
import { graphRouter } from "graph/router";
import { handleError } from "middlewares/handle-error";
import { nodeRouter } from "node/router";
import { rootRouter } from "root/router";
import { bootstrap } from "./bootstrap";

bootstrap();

export const app: Express = express();

app.use(cors());
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 100,
    message: { error: "请求过于频繁，请稍后再试" },
    legacyHeaders: false,
    standardHeaders: true,
  })
);
app.use(express.json());

app.use("/", rootRouter);
app.use("/graphs", graphRouter);
app.use("/nodes", nodeRouter);
app.use("/edges", edgeRouter);
app.use("/goods", goodRouter);

app.use(handleError);

if (import.meta.env.PROD) {
  app.listen(3000, () => {
    console.log("Server is listening on port 3000...");
  });
}
