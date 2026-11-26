import type { Host } from "@ai-panel/shared";
import ColorDot from "../common/ColorDot";

const HOST_COLOR = "#94a3b8";

export default function HostCard({ host }: { host: Host }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
      <ColorDot color={HOST_COLOR} />
      <div>
        <p className="text-sm font-semibold text-slate-800">{host.name}</p>
        <p className="text-xs text-slate-500">{host.title}</p>
      </div>
      <span className="ml-auto rounded bg-slate-200 px-2 py-0.5 text-xs text-slate-600">主持人</span>
    </div>
  );
}
