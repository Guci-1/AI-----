# 限界上下文地图

> 状态：✅ 已确认 · 最后更新：2026-11-26

## 上下文总览

| 上下文 | 核心实体 / 聚合 | 职责 | 关键集成点 |
|---|---|---|---|
| 阵容生成 (Lineup) | Lineup, Host, Expert | 话题 + 人数 → 主持人 + 专家；Zod 校验；编辑文本；重生成 | 输出 Lineup 给讨论运行时 |
| 讨论运行时 (Discussion Runtime) | Discussion, Turn, Speech, Status | 状态机（6 态）、发言循环、主持人控场、P4 收尾 | 调用调度器选人；触发观察员 |
| 发言调度 (Scheduling) | Intent, Scheduler（纯代码） | 意图收集 → 硬规则 + Score 评分 → 定下一位发言者 | 消费专家意图；输出发言权 |
| 共识提炼 (Consensus) | Consensus, Divergence, Observer | 每 5 轮提炼；覆盖式输出结构化条目（statement+支持者+反对者）；滑窗输入 | 读 transcript；写共识/分歧 |
| 事件溯源 (Event Sourcing) | Event | 事件落库（权威源）、SSE 推送、断线续传、回放重放 | 读库重放；SSE 订阅 |
| LLM 接入 (LLM Provider) | Provider（openai 兼容 / mock） | 意图/发言/阵容/共识四类调用；超时/重试/限流 | 被调度器、观察员、阵容生成调用 |

## 上下文边界与交互

```
用户 → 阵容生成 → (确认) → 讨论运行时 ──调用──> 发言调度 ──调用──> LLM 接入
                              │                              ▲
                              └──触发──> 共识提炼 ──调用──────┘
                              │
                              └──产出──> 事件溯源 ──SSE/回放──> 前端
```

## 上下文职责铁律

- **发言调度**是唯一决策者（纯代码），**讨论运行时**只编排流程，**主持人**无派发权。
- **共识提炼**独立于调度与主持，由观察员 Agent 专责。
- **事件溯源**只落最终态（`speech.done`），流式 `speech.delta` 不进库。
- **LLM 接入**通过 `LLM_PROVIDER=mock` 提供确定性替代，供单测/E2E。

## Changelog
- 2026-11-26 初次固化
