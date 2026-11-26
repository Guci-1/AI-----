import type { DiscussionStatus } from "@ai-panel/shared";

// 6 态状态机：generating / ready / running / paused / finished / interrupted
// 说明：用户提前结束 = 走 P4 总结后归 finished，不单列 stopped。
const transitions: Record<DiscussionStatus, DiscussionStatus[]> = {
  generating: ["ready"],
  ready: ["running"],
  running: ["paused", "finished", "interrupted"],
  paused: ["running", "finished", "interrupted"],
  finished: [],
  interrupted: [],
};

export function canTransition(from: DiscussionStatus, to: DiscussionStatus): boolean {
  return transitions[from]?.includes(to) ?? false;
}
