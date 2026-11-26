import type { Intent, IntentType } from "@ai-panel/shared";

// 专家运行时状态（只存内存，不入库；重启即 interrupted，不续跑）
export interface ExpertRuntimeState {
  expertId: string;
  speakCount: number; // c_i：累计专家发言次数
  gap: number; // 距上次发言的「专家发言」轮数
}

// 讨论运行时状态（内存态）
export interface DiscussionRuntimeState {
  turn: number; // 仅专家发言递增
  lastSpeakerId: string | null;
  lastHostTurn: number; // 主持人上次发言时的 turn 值
  experts: Map<string, ExpertRuntimeState>;
  controlFlags: { pause: boolean; stop: boolean };
}

// 调度器决策输出：要么某专家发言，要么触发主持人
export type SchedulingDecision =
  | { kind: "expert"; expertId: string; intentType: IntentType }
  | {
      kind: "host";
      reason: "opening" | "cold_field" | "silent_expert" | "forced_transition" | "summary";
    };
