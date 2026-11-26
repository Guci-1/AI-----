import type { TranscriptEntry } from "../../lib/types";
import ColorDot from "../common/ColorDot";
import TranscriptItem from "./TranscriptItem";

export default function TranscriptPanel({
  transcript,
  streaming,
}: {
  transcript: TranscriptEntry[];
  streaming: TranscriptEntry | null;
}) {
  const empty = transcript.length === 0 && !streaming;
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600">
        讨论实录
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {empty ? (
          <p className="text-sm text-slate-400">讨论尚未开始</p>
        ) : (
          <>
            {transcript.map((entry) => (
              <TranscriptItem key={entry.eventId} entry={entry} />
            ))}
            {streaming && (
              <div className="flex gap-2">
                <div className="mt-0.5">
                  <ColorDot color={streaming.color} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-800">{streaming.speakerName}</span>
                    <span className="text-xs text-slate-400">{streaming.speakerTitle}</span>
                    <span className="animate-pulse text-xs text-blue-500">正在输入…</span>
                  </div>
                  <p className="whitespace-pre-wrap text-sm text-slate-700">{streaming.text}</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
