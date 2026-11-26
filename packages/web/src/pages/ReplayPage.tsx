import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { useReplay } from "../hooks/useReplay";
import StudioStage from "../components/stage/StudioStage";
import ConsensusPanel from "../components/consensus/ConsensusPanel";

export default function ReplayPage() {
  const { id } = useParams<{ id: string }>();
  const [textView, setTextView] = useState(false);

  const { data: eventsData } = useQuery({
    queryKey: ["events", id],
    queryFn: () => api.getEvents(id!),
    enabled: !!id,
  });

  const { data: result } = useQuery({
    queryKey: ["result", id],
    queryFn: () => api.getResult(id!),
    enabled: !!id,
  });

  const events = eventsData?.events ?? [];
  const { state, index, total, playing, replay } = useReplay(id!, events);

  return (
    <div className="flex h-screen flex-col bg-slate-50">
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold text-slate-900">回放</h1>
          <span className="text-sm text-slate-500">
            {index} / {total}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={replay}
            disabled={playing || events.length === 0}
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100 disabled:opacity-50"
          >
            重新播放
          </button>
          <button
            type="button"
            onClick={() => setTextView((v) => !v)}
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100"
          >
            {textView ? "动画视图" : "纯文本视图"}
          </button>
        </div>
      </div>

      {textView ? (
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-3xl">
            {result ? (
              <>
                <h2 className="text-xl font-bold text-slate-900">{result.topic}</h2>
                <div className="mt-4 space-y-3">
                  {result.transcript.map((t, i) => (
                    <p key={i} className="text-sm text-slate-700">
                      <span className="font-medium">{t.speakerName}：</span>
                      <span className="whitespace-pre-wrap">{t.text}</span>
                    </p>
                  ))}
                </div>
                <div className="mt-6">
                  <h3 className="mb-2 text-base font-semibold text-slate-800">共识与分歧</h3>
                  <ConsensusPanel consensus={result.consensus} />
                </div>
                {result.summary && (
                  <div className="mt-6">
                    <h3 className="mb-2 text-base font-semibold text-slate-800">总结</h3>
                    <p className="whitespace-pre-wrap text-sm text-slate-700">{result.summary}</p>
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-slate-400">加载中…</p>
            )}
          </div>
        </div>
      ) : (
        <div className="min-h-0 flex-1">
          <StudioStage state={state} />
        </div>
      )}
    </div>
  );
}
