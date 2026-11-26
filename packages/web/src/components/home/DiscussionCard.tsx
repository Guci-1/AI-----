import type { DiscussionStatus, DiscussionSummary } from "@ai-panel/shared";
import { Link } from "react-router-dom";
import StatusBadge from "../common/StatusBadge";

function target(id: string, status: DiscussionStatus): string {
  if (status === "running" || status === "paused") return `/d/${id}/studio`;
  if (status === "generating" || status === "ready") return `/d/${id}/lineup`;
  return `/d/${id}/replay`;
}

export default function DiscussionCard({ d }: { d: DiscussionSummary }) {
  return (
    <Link
      to={target(d.id, d.status)}
      className="block rounded-lg border border-slate-200 bg-white p-4 hover:border-blue-300 hover:shadow-sm"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="truncate text-sm font-medium text-slate-800">{d.topic}</h3>
        <StatusBadge status={d.status} />
      </div>
      <div className="mt-2 flex items-center gap-3 text-xs text-slate-400">
        <span>{d.expertCount} 位专家</span>
        <span>{new Date(d.createdAt).toLocaleString("zh-CN")}</span>
      </div>
    </Link>
  );
}
