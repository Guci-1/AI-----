// DiscussionEngine：编排单场讨论的运行循环。
//
// 流程（TODO/TDD 实现）：
//   ready → 开场(host) → [意图收集(并行) → 调度器选人 → 专家发言 / 主持人控场]
//        → 每 5 轮观察员提炼 → 上限触达或收敛 → P4 强制提炼 + 总结 → finished
// 控制：pause / resume / stop（每轮开始前检查 controlFlags）。
export class DiscussionEngine {
  // TODO(TDD): 实现 start() / pause() / resume() / stop()
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}
}
