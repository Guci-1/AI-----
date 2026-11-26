import type { ExpertView } from "../../lib/types";
import ColorDot from "../common/ColorDot";

const STATUS_TEXT: Record<ExpertView["status"], string> = {
  idle: "待机",
  preparing: "准备发言",
  speaking: "发言中",
};

export default function ExpertStatusWindow({ expert }: { expert: ExpertView }) {
  const speaking = expert.status === "speaking";
  return (
    <div
      className={`flex flex-col gap-1 rounded-lg border p-3 ${
        speaking ? "border-blue-300 bg-blue-50" : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex items-center gap-2">
        <ColorDot color={expert.color} />
        <span className="truncate text-sm font-medium text-slate-800">{expert.name}</span>
        <span className="ml-auto shrink-0 text-xs text-slate-400">{STATUS_TEXT[expert.status]}</span>
      </div>
      <p className="truncate text-xs text-slate-500">{expert.title}</p>
      {expert.status === "preparing" && expert.publicThought ? (
        <p className="text-xs text-slate-400">{expert.publicThought}</p>
      ) : expert.status === "speaking" ? (
        <p className="text-xs text-blue-500">组织语言中…</p>
      ) : null}
    </div>
  );
}
