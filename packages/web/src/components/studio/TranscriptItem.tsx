import type { TranscriptEntry } from "../../lib/types";
import ColorDot from "../common/ColorDot";

export default function TranscriptItem({ entry }: { entry: TranscriptEntry }) {
  return (
    <div className="flex gap-2">
      <div className="mt-0.5">
        <ColorDot color={entry.color} />
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-800">{entry.speakerName}</span>
          <span className="text-xs text-slate-400">{entry.speakerTitle}</span>
          <span
            className={`rounded px-1 text-xs ${
              entry.role === "host" ? "bg-slate-100 text-slate-500" : "bg-blue-50 text-blue-500"
            }`}
          >
            {entry.role === "host" ? "主持人" : "专家"}
          </span>
        </div>
        <p className="whitespace-pre-wrap text-sm text-slate-700">{entry.text}</p>
      </div>
    </div>
  );
}
