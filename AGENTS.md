# AGENTS.md — AI 协作全局规则

本文件是 AI 助手在本仓库工作时的最高行为准则。开始任何编码 / 文档任务前，先读 `docs/specs/` 下对应文档。

## 1. 项目一句话

「AI Panel Studio」= AI 圆桌讨论本地 Web 应用：输入话题 + 专家人数 → 生成主持人与专家阵容 → 确认 → 演播厅实时讨论 → 主持人总结。完整定位与范围见 `docs/specs/project-charter.md`。

## 2. 必读文档（优先级从高到低）

| 文档 | 作用 |
|---|---|
| `docs/specs/project-charter.md` | 范围（做/不做）、技术框架、技术约束、上限保护 |
| `docs/specs/ubiquitous-language.md` | 术语唯一来源，命名必须遵循 |
| `docs/specs/bounded-contexts.md` | 限界上下文与职责边界 |
| `docs/specs/acceptance-criteria.md` | 验收标准（Given-When-Then，done 的定义） |
| `docs/specs/open-questions.md` | 待决项（当前已全部闭合） |

## 3. 铁律（不可违反）

1. **密钥隔离**：LLM API Key 仅后端环境变量；前端零 LLM、零密钥。
2. **契约单一来源**：Zod Schema 只在 `packages/shared` 定义，前后端共享；改契约先改 shared。
3. **命名唯一来源**：表/字段/事件/接口名必须取自 `ubiquitous-language.md`，禁止自造同义词。
4. **决策权归属**：发言调度是唯一决策者（纯代码）；主持人无派发权；观察员不参与调度、不发言。
5. **事件溯源纪律**：只落最终态（`speech.done`），流式 `speech.delta` 不落库；内部事件（意图 / 隐藏 CoT）绝不进 Event、绝不推给前端。
6. **CoT 隔离**：隐藏推理（reasoning）必须丢弃，只暴露 `public_thought`。
7. **上限保护**：40 轮 / 15 分钟 / 200 次 LLM 调用 / 同时 3 场 / LLM 并发 8。
8. **测试确定性**：单测与 E2E 默认 `LLM_PROVIDER=mock`；CI 不跑真实 LLM。

## 4. 领域术语速查（详见 ubiquitous-language.md）

- 讨论(Discussion)：中央聚合；一个讨论一个话题。
- 轮(Turn)：**仅专家发言计 1 轮**；主持人发言为「插曲」、不计轮。
- 调度器(Scheduler)：纯代码，唯一决策者。
- 观察员(Observer)：第 6 Agent，每 5 轮提炼，覆盖式输出。
- 共识/分歧：结构化对象 `{statement, supporters[], opponents[]}`，各上限 5 条。
- 公开思考摘要(public_thought)：待机=空、准备发言=显示、发言中=「组织语言中」。
- 状态：6 态 `generating / ready / running / paused / finished / interrupted`。

## 5. 目录与架构

- `packages/shared`：Zod 契约（类型 + 运行时校验 + LLM 输出校验）
- `packages/server`：Express + 讨论引擎 + Prisma（SQLite）
- `packages/web`：Vite + React + TS + Tailwind（纯渲染 + SSE/REST 订阅）
- `docs/specs/`：规格文档（版本化）
- `tests/`：E2E

## 6. 开发流程

SDD（数据建模 + 契约）→ DDD（前端组件页面）→ TDD（核心逻辑测试先行）→ E2E（端到端闭环）。每阶段以 `acceptance-criteria.md` 为「done」判据。

## 7. 反幻觉守则

- 不编造业务规则、数值阈值、状态流转；一切以 docs/specs 与已确认结论为准。
- 未在文档/对话中确认的字段名、接口名，不得臆造。
- 改文档遵循「增量更新 + Changelog」；不覆盖未确认内容。

## 8. 关键数值（默认，来自已确认结论）

- 专家人数 2–8，默认 4。
- 评分公式 `Score = Strength + Collision + Silence − Recency − Monopoly`（权重见 TDD 阶段）。
- 硬规则：防连麦 gap=0、防垄断 M=3、主持人 H=6、冷场 K=1、点名 S=4。
