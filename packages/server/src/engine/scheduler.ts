import type { Intent } from "@ai-panel/shared";
import type { DiscussionRuntimeState, SchedulingDecision } from "./types";

// =====================================================================
// 发言调度器：纯代码，唯一决策者。
// TODO(TDD): 实现硬规则 + Score 评分，并用 Vitest 断言各场景胜出者。
//
// 硬规则（默认值，来自已确认结论）：
//   防连麦 gap=0 排除（上一位发言者）
//   防垄断 M=3（c_i - min(c_j) >= 3 排除；排除后无人可选则跳过）
//   主持人 H=6（每 6 轮专家发言强制串联）
//   冷场 K=1（本轮全体 silent 触发主持人）
//   点名 S=4（某专家 gap >= 4 且 silent 触发主持人点名）
//   上限：40 轮 / 15 分钟 / 200 次调用（任一触达 → P4 总结）
//
// 评分公式（权重见 TDD）：
//   Score = Strength + Collision + Silence − Recency − Monopoly
//   Strength:   强=3 / 中=2 / 弱=1
//   Collision:  反驳·上一发言者=+4; 抢答=+3; 反驳·特定专家=+2; 补充·上一=+1; 其他=0
//   Silence:    gap 3~4=+2; gap>=5=+3
//   Recency:    max(0, 3 − gap)
//   Monopoly:   2 × max(0, c_i − avg_c)
//   同分决胜：Collision 高 → c_i 低 → 随机
// =====================================================================
export function decideNext(
  _state: DiscussionRuntimeState,
  _intents: Intent[],
): SchedulingDecision {
  throw new Error("scheduler.decideNext 未实现（TDD 阶段）");
}
