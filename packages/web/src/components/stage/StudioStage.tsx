import type { ControlAction } from "@ai-panel/shared";
import type { StudioViewState } from "../../lib/types";
import StatusBadge from "../common/StatusBadge";
import ConsensusPanel from "../consensus/ConsensusPanel";
import ExpertStage from "../studio/ExpertStage";
import HostPanel from "../studio/HostPanel";
import TranscriptPanel from "../studio/TranscriptPanel";

// 纯视觉容器：只接收 state 渲染，不 fetch、不订阅 SSE。回放页与演播厅页复用。
export default function StudioStage({
  state,
  onControl,
}: {
  state: StudioViewState;
  onControl?: (action: ControlAction) => void;
}) {
  const experts = Array.from(state.experts.values());
  const lastHostText = [...state.transcript].reverse().find((t) => t.role === "host")?.text;
  const canControl = !!onControl && (state.status === "running" || state.status === "paused");

  return (
    <div className="flex h-full flex-col bg-slate-50 text-slate-900">
      <header className="flex items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <h1 className="truncate text-lg font-semibold">{state.topic || "未命名讨论"}</h1>
          <StatusBadge status={state.status} />
        </div>
        {canControl && (
          <div className="flex shrink-0 items-center gap-2">
            {state.status === "running" ? (
              <button
                onClick={() => onControl?.("pause")}
                className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                暂停
              </button>
            ) : (
              <button
                onClick={() => onControl?.("resume")}
                className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                继续
              </button>
            )}
            <button
              onClick={() => onControl?.("stop")}
              className="rounded-md border border-red-300 bg-white px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              结束
            </button>
          </div>
        )}
      </header>

      <div className="flex min-h-0 flex-1 flex-col md:flex-row md:flex-wrap">
        <section className="flex-1 min-h-0 overflow-y-auto border-b border-slate-200 bg-white md:grow-0 md:basis-1/3 md:border-b-0 md:border-r xl:basis-1/4">
          <HostPanel host={state.host} latestHostText={lastHostText} />
          <ExpertStage experts={experts} />
        </section>
        <section className="flex-1 min-h-0 overflow-y-auto border-b border-slate-200 bg-white md:grow-0 md:basis-2/3 md:border-b-0 xl:basis-1/2">
          <TranscriptPanel transcript={state.transcript} streaming={state.streaming} />
        </section>
        <section className="flex-1 min-h-0 overflow-y-auto bg-white md:grow-0 md:basis-full xl:basis-1/4">
          <ConsensusPanel consensus={state.consensus} />
        </section>
      </div>
    </div>
  );
}
