import type { Host } from "@ai-panel/shared";
import ColorDot from "../common/ColorDot";

const HOST_COLOR = "#94a3b8";

export default function HostPanel({
  host,
  latestHostText,
}: {
  host: Host | null;
  latestHostText?: string;
}) {
  return (
    <div className="border-b border-slate-200 bg-slate-100 p-3">
      <div className="flex items-center gap-2">
        <ColorDot color={HOST_COLOR} />
        <span className="text-sm font-semibold text-slate-800">{host?.name ?? "主持人"}</span>
        {host?.title && <span className="text-xs text-slate-500">{host.title}</span>}
      </div>
      {latestHostText && (
        <p className="mt-1 line-clamp-2 text-xs text-slate-500">{latestHostText}</p>
      )}
    </div>
  );
}
