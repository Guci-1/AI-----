# 验收标准集（Given-When-Then）

> 状态：✅ 已确认 · 最后更新：2026-11-26

### 首页展示讨论列表
- [Happy Path] GIVEN 存在多场不同状态的讨论 WHEN 用户打开首页 THEN 按「进行中 / 待确认 / 已完成 / 已中断」分组展示，各讨论显示话题、人数、状态徽标。
- [Exception] GIVEN 无任何讨论 WHEN 打开首页 THEN 显示空态引导「发起新讨论」。

### 发起新讨论并生成阵容
- [Happy Path] GIVEN 用户输入话题与专家人数（2–8，默认 4） WHEN 点击发起 THEN 讨论进入 generating 状态，完成后展示主持人 + 专家阵容（姓名/职业 Title/立场/颜色）。
- [Exception] GIVEN 阵容生成输出未通过 Zod 校验 WHEN 首次失败 THEN 自动重试 1 次；仍失败则提示用户重来。

### 确认 / 编辑 / 重新生成阵容
- [Happy Path] GIVEN 阵容已生成 WHEN 用户编辑某专家姓名/立场 THEN 修改生效并可确认进入演播厅。
- [Happy Path] GIVEN 阵容已生成 WHEN 用户点击重新生成 THEN 整体重新生成一套阵容。

### 观看实时讨论（专家发言）
- [Happy Path] GIVEN 讨论处于 running WHEN 主持人开场后 THEN 专家按调度结果发言，每次 1–2 句，无机械轮流。
- [Exception] GIVEN 连续多轮无专家想发言 WHEN 触发冷场 THEN 主持人介入追问/串联。

### 专家状态小窗
- [Happy Path] GIVEN 讨论运行中 WHEN 某专家提交意图 THEN 其小窗由「待机」转「准备发言」并显示公开思考摘要；被选中后转「发言中」。
- [Exception] GIVEN 模型产出隐藏推理 WHEN 推送到前端 THEN 该内容被丢弃，绝不在小窗展示。

### 实时共识与分歧
- [Happy Path] GIVEN 讨论运行中 WHEN 累计 5 条专家发言 THEN 观察员提炼并覆盖式更新共识/分歧区域。

### 主持人总结
- [Happy Path] GIVEN 讨论自然收敛或触达上限 WHEN 触发 P4 THEN 观察员先强制提炼一次，再由主持人以自然语言总结，页面不展示 JSON 原文。

### 回放
- [Happy Path] GIVEN 一场已结束讨论 WHEN 用户点击回放 THEN 按固定节拍（800ms–1.5s）从头自动重放整场过程（发言/状态/共识更新）。

### 直接看结果
- [Happy Path] GIVEN 一场已结束讨论 WHEN 用户选择「直接看结果」 THEN 展示完整 transcript + 共识/分歧 + 总结（跳过动画）。

### 暂停 / 继续 / 提前结束
- [Happy Path] GIVEN 讨论运行中 WHEN 用户点击暂停 THEN 状态转 paused 且暂停推进；继续则恢复 running。
- [Happy Path] GIVEN 讨论运行中 WHEN 用户点击结束 THEN 走 P4 总结流程，状态归 finished。

### 多讨论并行隔离
- [Happy Path] GIVEN 用户并发运行两场讨论 WHEN 分别观察 THEN 状态、事件流、transcript、共识/分歧互不串台。

### 断线恢复
- [Happy Path] GIVEN 用户中途刷新运行中的讨论页 WHEN 重新进入 THEN 先拉取历史事件铺到最新状态，再以 Last-Event-ID 增量续传。

## Changelog
- 2026-11-26 初次固化
