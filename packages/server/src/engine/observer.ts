// 观察员（第 6 Agent）：不参与调度、不发言，只读 transcript 提炼共识/分歧。
// TODO(TDD): 实现提炼调用（输入 = 最近 15 条发言 + 上一版共识/分歧，滑窗）。
export function shouldObserve(turn: number): boolean {
  // 每 5 轮（专家发言）触发一次
  return turn > 0 && turn % 5 === 0;
}
