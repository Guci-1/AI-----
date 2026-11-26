import express from "express";
import { discussionsRouter } from "./routes/discussions";
import { streamRouter } from "./routes/stream";

export function createApp() {
  const app = express();

  // 简易 CORS（本地开发：前端 Vite 端口不同）
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "*");
    if (req.method === "OPTIONS") return res.sendStatus(204);
    next();
  });

  app.use(express.json());
  app.use("/api", discussionsRouter);
  app.use("/api", streamRouter);

  return app;
}
