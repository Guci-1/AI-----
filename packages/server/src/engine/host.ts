// 主持人控场触发：主持人无自主开口权，所有发言由代码调度器触发。
// TODO(TDD): 实现触发判定（开场 / 冷场 / 沉默点名 / 强制串联 / 总结）。
export function hostTriggerReason(_turn: number, _lastHostTurn: number): string | null {
  return null;
}
