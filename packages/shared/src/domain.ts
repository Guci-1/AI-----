import { z } from "zod";

// =====================================================================
// 领域核心类型（同时承担：类型推导 + 运行时校验 + LLM 输出校验）
// 命名一律遵循 docs/specs/ubiquitous-language.md
// =====================================================================

// ── 讨论状态（6 态）──────────────────────────────────────────
export const DiscussionStatusSchema = z.enum([
  "generating",
  "ready",
  "running",
  "paused",
  "finished",
  "interrupted",
]);
export type DiscussionStatus = z.infer<typeof DiscussionStatusSchema>;

// ── 参会角色 ───────────────────────────────────────────
export const ParticipantRoleSchema = z.enum(["HOST", "EXPERT"]);
export type ParticipantRole = z.infer<typeof ParticipantRoleSchema>;

// ── 主持人 / 专家（阵容生成 LLM 输出，不含 id/order）──────────────
export const HostSchema = z.object({
  name: z.string().min(1),
  title: z.string().min(1),
});
export type Host = z.infer<typeof HostSchema>;

export const ExpertSchema = z.object({
  name: z.string().min(1),
  title: z.string().min(1),
  stance: z.string().min(1),
  color: z.string().min(1),
});
export type Expert = z.infer<typeof ExpertSchema>;

export const LineupSchema = z.object({
  host: HostSchema,
  experts: z.array(ExpertSchema).min(2).max(8),
});
export type Lineup = z.infer<typeof LineupSchema>;

// ── 共识 / 分歧（结构化、可追溯、覆盖式）────────────────────────
export const ConsensusItemSchema = z.object({
  statement: z.string(),
  supporters: z.array(z.string()), // 支持者（专家姓名）
  opponents: z.array(z.string()), // 反对者（专家姓名）
});
export type ConsensusItem = z.infer<typeof ConsensusItemSchema>;

export const ConsensusSnapshotSchema = z.object({
  consensus: z.array(ConsensusItemSchema).max(5),
  divergences: z.array(ConsensusItemSchema).max(5),
});
export type ConsensusSnapshot = z.infer<typeof ConsensusSnapshotSchema>;

// ── 意图（专家「想发言」信号；内部事件，不推前端）───────────────
// grab=抢答, rebut=反驳, supplement=补充, silent=静默
export const IntentTypeSchema = z.enum(["grab", "rebut", "supplement", "silent"]);
export type IntentType = z.infer<typeof IntentTypeSchema>;

// 定向目标：previous=上一发言者, expert=特定专家, host=主持人, topic=主题新角度
export const IntentTargetSchema = z.object({
  kind: z.enum(["previous", "expert", "host", "topic"]),
  expertId: z.string().optional(), // kind=expert 时指定
});
export type IntentTarget = z.infer<typeof IntentTargetSchema>;

export const IntentSchema = z.object({
  expertId: z.string(),
  type: IntentTypeSchema,
  target: IntentTargetSchema.optional(),
  strength: z.enum(["strong", "medium", "weak"]).optional(),
  publicThought: z.string().max(20).optional(), // 公开思考摘要（脱敏）
});
export type Intent = z.infer<typeof IntentSchema>;
