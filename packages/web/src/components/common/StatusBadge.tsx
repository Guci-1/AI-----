import type { DiscussionStatus } from "@ai-panel/shared";

const STATUS_TEXT: Record<DiscussionStatus, string> = {
  generating: "生成中",
  ready: "待确认",
  running: "进行中",
  paused: "已暂停",
  finished: "已完成",
  interrupted: "已中断",
};

const STATUS_STYLE: Record<DiscussionStatus, string> = {
  generating: "bg-blue-100 text-blue-700",
  ready: "bg-amber-100 text-amber-700",
  running: "bg-green-100 text-green-700",
  paused: "bg-yellow-100 text-yellow-700",
  finished: "bg-slate-100 text-slate-700",
  interrupted: "bg-red-100 text-red-700",
};

export default function StatusBadge({ status }: { status: DiscussionStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLE[status]}`}
    >
      {STATUS_TEXT[status]}
    </span>
  );
}
