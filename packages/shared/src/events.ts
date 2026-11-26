import { z } from "zod";
import { HostSchema, ExpertSchema, ConsensusSnapshotSchema } from "./domain";

// =====================================================================
// 事件溯源：前端消费的唯一事件格式（实时 SSE 与回放 REST 共用）
// 纪律：speech.delta 仅实时流式推送、不落库；内部事件（意图/隐藏 CoT）绝不出现在此。
// =====================================================================

export const EventTypeSchema = z.enum([
  "discussion.created",
  "lineup.ready",
  "discussion.started",
  "host.speech",
  "expert.status",
  "speech.delta",
  "speech.done",
  "consensus.updated",
  "discussion.paused",
  "discussion.resumed",
  "discussion.finished",
  "discussion.interrupted",
]);
export type EventType = z.infer<typeof EventTypeSchema>;

// ── 各事件 payload ───────────────────────────────────────────
export const DiscussionCreatedPayloadSchema = z.object({
  topic: z.string(),
  expertCount: z.number().int(),
});

export const LineupReadyPayloadSchema = z.object({
  host: HostSchema,
  experts: z.array(ExpertSchema),
});

export const HostSpeechPayloadSchema = z.object({
  kind: z.enum(["opening", "followup", "transition", "summary"]),
  text: z.string(),
  targetExpertId: z.string().optional(),
});

export const ExpertStatusPayloadSchema = z.object({
  expertId: z.string(),
  status: z.enum(["idle", "preparing", "speaking"]),
  publicThought: z.string().optional(),
});

export const SpeechDeltaPayloadSchema = z.object({
  expertId: z.string(),
  delta: z.string(),
});

export const SpeechDonePayloadSchema = z.object({
  expertId: z.string(),
  text: z.string(),
  publicThought: z.string().optional(),
});

export const ConsensusUpdatedPayloadSchema = ConsensusSnapshotSchema;

export const DiscussionFinishedPayloadSchema = z.object({
  summary: z.string(),
});

// ── 事件信封（落库 + SSE/REST 传输）──────────────────────────
export const EventEnvelopeSchema = z.object({
  id: z.number().int(), // 全局自增（数据库主键）
  discussionId: z.string(),
  type: EventTypeSchema,
  payload: z.unknown(), // 结构随 type 变化，见上方各 payload schema
  createdAt: z.string(),
});
export type EventEnvelope = z.infer<typeof EventEnvelopeSchema>;
