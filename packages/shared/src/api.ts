import { z } from "zod";
import {
  DiscussionStatusSchema,
  RosterSchema,
  ConsensusSnapshotSchema,
} from "./domain";
import { EventEnvelopeSchema } from "./events";

// =====================================================================
// REST / SSE 契约（DTO）
// 路由清单：
//   POST   /api/discussions                    创建讨论（topic + expertCount）
//   GET    /api/discussions                    首页列表
//   GET    /api/discussions/:id                讨论详情
//   POST   /api/discussions/:id/confirm        确认阵容 → running
//   POST   /api/discussions/:id/regenerate     重新生成阵容
//   PATCH  /api/discussions/:id/experts/:expertId  编辑专家文本字段（不增删专家）
//   POST   /api/discussions/:id/control        控制（pause | resume | stop）
//   GET    /api/discussions/:id/events         全量事件（回放 / 恢复）
//   GET    /api/discussions/:id/result         纯文本视图（transcript + 共识 + 总结）
//   GET    /api/discussions/:id/stream         SSE 实时（Last-Event-ID 续传 + 心跳）
// =====================================================================

// ── 创建讨论 ───────────────────────────────────────────
export const CreateDiscussionInputSchema = z.object({
  topic: z.string().min(1).max(200),
  expertCount: z.number().int().min(2).max(8).default(4),
});
export type CreateDiscussionInput = z.infer<typeof CreateDiscussionInputSchema>;

// ── 讨论摘要（首页列表项）───────────────────────────────
export const DiscussionSummarySchema = z.object({
  id: z.string(),
  topic: z.string(),
  expertCount: z.number().int(),
  status: DiscussionStatusSchema,
  createdAt: z.string(),
  finishedAt: z.string().nullable().optional(),
});
export type DiscussionSummary = z.infer<typeof DiscussionSummarySchema>;

// ── 讨论详情 ───────────────────────────────────────────
export const DiscussionDetailSchema = z.object({
  id: z.string(),
  topic: z.string(),
  expertCount: z.number().int(),
  status: DiscussionStatusSchema,
  lineup: RosterSchema.nullable(),
  consensus: ConsensusSnapshotSchema.nullable(),
  summary: z.string().nullable(),
  createdAt: z.string(),
  finishedAt: z.string().nullable(),
});
export type DiscussionDetail = z.infer<typeof DiscussionDetailSchema>;

// ── 控制 ───────────────────────────────────────────
export const ControlActionSchema = z.enum(["pause", "resume", "stop"]);
export type ControlAction = z.infer<typeof ControlActionSchema>;

// ── 编辑阵容（仅文本字段，不增删专家）─────────────────────
export const EditLineupInputSchema = z.object({
  name: z.string().min(1).optional(),
  title: z.string().min(1).optional(),
  stance: z.string().min(1).optional(),
  color: z.string().min(1).optional(),
});
export type EditLineupInput = z.infer<typeof EditLineupInputSchema>;

// ── 事件列表响应（回放 / 恢复）───────────────────────────
export const EventListResponseSchema = z.object({
  events: z.array(EventEnvelopeSchema),
});
export type EventListResponse = z.infer<typeof EventListResponseSchema>;
