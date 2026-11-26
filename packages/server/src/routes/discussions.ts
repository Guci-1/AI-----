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

// PATCH /api/discussions/:id/experts/:expertId —— 编辑专家文本字段（不增删专家）
discussionsRouter.patch("/discussions/:id/experts/:expertId", async (req, res) => {
  const { name, title, stance, color } = req.body ?? {};
  const updated = await prisma.participant.updateMany({
    where: { id: req.params.expertId, discussionId: req.params.id, role: "EXPERT" },
    data: { name, title, stance, color },
  });
  if (updated.count === 0) return res.status(404).json({ error: "expert not found" });
  res.json({ ok: true });
});

// POST /api/discussions/:id/control —— 暂停 / 继续 / 终止
discussionsRouter.post("/discussions/:id/control", (_req, res) => notImplemented(res));

// GET /api/discussions/:id/result —— 纯文本视图（完整 transcript：专家 + 主持人，带姓名/色块）
discussionsRouter.get("/discussions/:id/result", async (req, res) => {
  const d = await prisma.discussion.findUnique({
    where: { id: req.params.id },
    include: { participants: true },
  });
  if (!d) return res.status(404).json({ error: "not found" });

  const events = await prisma.event.findMany({
    where: { discussionId: d.id, type: { in: ["speech.done", "host.speech"] } },
    orderBy: { id: "asc" },
  });

  const byId = new Map(d.participants.map((p) => [p.id, p]));
  const host = d.participants.find((p) => p.role === "HOST");

  const transcript = events.map((ev) => {
    if (ev.type === "host.speech") {
      const p = JSON.parse(ev.payload) as { text: string; kind: string };
      return {
        role: "host",
        speakerId: "host",
        speakerName: host?.name ?? "主持人",
        speakerTitle: host?.title ?? "",
        color: "#94a3b8",
        text: p.text,
        kind: p.kind,
      };
    }
    const p = JSON.parse(ev.payload) as { expertId: string; text: string };
    const part = byId.get(p.expertId);
    return {
      role: "expert",
      speakerId: p.expertId,
      speakerName: part?.name ?? p.expertId,
      speakerTitle: part?.title ?? "",
      color: part?.color ?? "#64748b",
      text: p.text,
    };
  });

  res.json({
    topic: d.topic,
    transcript,
    consensus: d.consensus ? JSON.parse(d.consensus) : null,
    summary: d.summary,
  });
});
