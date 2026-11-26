import { Router, type Response } from "express";
import { prisma } from "../db/client";

export const discussionsRouter = Router();

const notImplemented = (res: Response) =>
  res.status(501).json({ error: "TODO: 引擎接入后实现" });

// GET /api/discussions —— 首页列表
discussionsRouter.get("/discussions", async (_req, res) => {
  const list = await prisma.discussion.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, topic: true, expertCount: true, status: true, createdAt: true, finishedAt: true },
  });
  res.json({
    discussions: list.map((d) => ({
      id: d.id,
      topic: d.topic,
      expertCount: d.expertCount,
      status: d.status,
      createdAt: d.createdAt.toISOString(),
      finishedAt: d.finishedAt?.toISOString() ?? null,
    })),
  });
});

// GET /api/discussions/:id —— 讨论详情（含阵容 / 共识 / 总结）
discussionsRouter.get("/discussions/:id", async (req, res) => {
  const d = await prisma.discussion.findUnique({
    where: { id: req.params.id },
    include: { participants: { orderBy: { order: "asc" } } },
  });
  if (!d) return res.status(404).json({ error: "not found" });

  const host = d.participants.find((p) => p.role === "HOST");
  const experts = d.participants.filter((p) => p.role === "EXPERT");

  res.json({
    id: d.id,
    topic: d.topic,
    expertCount: d.expertCount,
    status: d.status,
    lineup: host
      ? {
          host: { name: host.name, title: host.title ?? "" },
          experts: experts.map((e) => ({
            id: e.id,
            name: e.name,
            title: e.title ?? "",
            stance: e.stance ?? "",
            color: e.color ?? "",
          })),
        }
      : null,
    consensus: d.consensus ? JSON.parse(d.consensus) : null,
    summary: d.summary,
    createdAt: d.createdAt.toISOString(),
    finishedAt: d.finishedAt?.toISOString() ?? null,
  });
});

// GET /api/discussions/:id/events —— 全量事件（回放 / 恢复）
discussionsRouter.get("/discussions/:id/events", async (req, res) => {
  const events = await prisma.event.findMany({
    where: { discussionId: req.params.id },
    orderBy: { id: "asc" },
  });
  res.json({
    events: events.map((e) => ({
      id: e.id,
      discussionId: e.discussionId,
      type: e.type,
      payload: JSON.parse(e.payload),
      createdAt: e.createdAt.toISOString(),
    })),
  });
});

// —— 以下为引擎接入后实现的端点（骨架阶段占位）——

// POST /api/discussions —— 创建讨论（generating）
discussionsRouter.post("/discussions", (_req, res) => notImplemented(res));

// POST /api/discussions/:id/confirm —— 确认阵容 → running
discussionsRouter.post("/discussions/:id/confirm", (_req, res) => notImplemented(res));

// POST /api/discussions/:id/regenerate —— 重新生成阵容
discussionsRouter.post("/discussions/:id/regenerate", (_req, res) => notImplemented(res));

// PATCH /api/discussions/:id/lineup —— 编辑阵容文本字段
discussionsRouter.patch("/discussions/:id/lineup", (_req, res) => notImplemented(res));

// POST /api/discussions/:id/control —— 暂停 / 继续 / 终止
discussionsRouter.post("/discussions/:id/control", (_req, res) => notImplemented(res));

// GET /api/discussions/:id/result —— 纯文本视图
discussionsRouter.get("/discussions/:id/result", async (req, res) => {
  const d = await prisma.discussion.findUnique({ where: { id: req.params.id } });
  if (!d) return res.status(404).json({ error: "not found" });
  const speeches = await prisma.event.findMany({
    where: { discussionId: d.id, type: "speech.done" },
    orderBy: { id: "asc" },
  });
  res.json({
    topic: d.topic,
    transcript: speeches.map((s) => {
      const p = JSON.parse(s.payload) as { expertId: string; text: string };
      return { expertId: p.expertId, text: p.text };
    }),
    consensus: d.consensus ? JSON.parse(d.consensus) : null,
    summary: d.summary,
  });
});
