import { Router } from "express";
import { prisma } from "../db/client";
import { hub } from "../sse/hub";

export const streamRouter = Router();

const HEARTBEAT_INTERVAL_MS = 15_000;

// GET /api/discussions/:id/stream —— SSE 实时通道（Last-Event-ID 断线续传 + 心跳）
streamRouter.get("/discussions/:id/stream", async (req, res) => {
  const discussionId = req.params.id;

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
  });
  res.flushHeaders?.();

  // 心跳保活
  const heartbeat = setInterval(() => res.write(`: heartbeat\n\n`), HEARTBEAT_INTERVAL_MS);

  // 断线续传：补发 Last-Event-ID 之后的缺失事件（权威源 = 数据库）
  const lastEventId = Number(req.headers["last-event-id"] ?? 0);
  const missed = await prisma.event.findMany({
    where: { discussionId, id: { gt: lastEventId } },
    orderBy: { id: "asc" },
  });
  for (const ev of missed) {
    res.write(
      `id: ${ev.id}\nevent: ${ev.type}\ndata: ${JSON.stringify({
        id: ev.id,
        discussionId: ev.discussionId,
        type: ev.type,
        payload: JSON.parse(ev.payload),
        createdAt: ev.createdAt.toISOString(),
      })}\n\n`,
    );
  }

  hub.subscribe(discussionId, res);

  req.on("close", () => {
    clearInterval(heartbeat);
    hub.unsubscribe(discussionId, res);
  });
});
