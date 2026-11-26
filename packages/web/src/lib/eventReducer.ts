import type { EventEnvelope, Host, RosterExpert, ConsensusSnapshot } from "@ai-panel/shared";
import type { StudioViewState, TranscriptEntry } from "./types";
import { expertsFromRoster } from "./types";

// =====================================================================
// 核心渲染契约：把事件流折叠成视图状态。实时（SSE）与回放（定时器）共用。
// 注意：supporters/opponents 存的是专家姓名（见 domain.ts 注释）。
// =====================================================================

const HOST_COLOR = "#94a3b8"; // 主持人固定色

export function eventReducer(state: StudioViewState, event: EventEnvelope): StudioViewState {
  switch (event.type) {
    case "discussion.created": {
      const p = event.payload as { topic: string; expertCount: number };
      return { ...state, topic: p.topic };
    }

    case "lineup.ready": {
      const p = event.payload as { host: Host; experts: RosterExpert[] };
      return { ...state, host: p.host, experts: expertsFromRoster(p.experts), status: "ready" };
    }

    case "discussion.started":
      return { ...state, status: "running" };

    case "host.speech": {
      const p = event.payload as {
        kind: "opening" | "followup" | "transition" | "summary";
        text: string;
        targetExpertId?: string;
      };
      const entry: TranscriptEntry = {
        eventId: event.id,
        speakerId: "host",
        speakerName: state.host?.name ?? "主持人",
        speakerTitle: state.host?.title ?? "",
        color: HOST_COLOR,
        role: "host",
        text: p.text,
        kind: p.kind,
      };
      return { ...state, transcript: [...state.transcript, entry] };
    }

    case "expert.status": {
      const p = event.payload as { expertId: string; status: "idle" | "preparing" | "speaking"; publicThought?: string };
      const experts = new Map(state.experts);
      const e = experts.get(p.expertId);
      if (e) {
        experts.set(p.expertId, { ...e, status: p.status, publicThought: p.publicThought ?? e.publicThought });
      }
      return { ...state, experts };
    }

    case "speech.delta": {
      // 流式增量：追加到 streaming 条目（视觉"边想边说"）
      const p = event.payload as { expertId: string; delta: string };
      const e = state.experts.get(p.expertId);
      const streaming: TranscriptEntry =
        state.streaming && state.streaming.speakerId === p.expertId
          ? { ...state.streaming, text: state.streaming.text + p.delta }
          : {
              eventId: event.id,
              speakerId: p.expertId,
              speakerName: e?.name ?? p.expertId,
              speakerTitle: e?.title ?? "",
              color: e?.color ?? "#64748b",
              role: "expert",
              text: p.delta,
            };
      return { ...state, streaming };
    }

    case "speech.done": {
      const p = event.payload as { expertId: string; text: string; publicThought?: string };
      const e = state.experts.get(p.expertId);
      const entry: TranscriptEntry = {
        eventId: event.id,
        speakerId: p.expertId,
        speakerName: e?.name ?? p.expertId,
        speakerTitle: e?.title ?? "",
        color: e?.color ?? "#64748b",
        role: "expert",
        text: p.text,
      };
      // 发言结束：该专家回待机、清空公开思考
      const experts = new Map(state.experts);
      if (e) experts.set(p.expertId, { ...e, status: "idle", publicThought: null });
      return { ...state, transcript: [...state.transcript, entry], streaming: null, experts };
    }

    case "consensus.updated": {
      const p = event.payload as ConsensusSnapshot;
      return { ...state, consensus: p };
    }

    case "discussion.paused":
      return { ...state, status: "paused" };

    case "discussion.resumed":
      return { ...state, status: "running" };

    case "discussion.finished": {
      const p = event.payload as { summary: string };
      return { ...state, status: "finished", summary: p.summary };
    }

    case "discussion.interrupted":
      return { ...state, status: "interrupted" };

    default:
      return state;
  }
}

// 由事件数组折叠出完整状态（回放 / 恢复用）
export function reduceEvents(discussionId: string, events: EventEnvelope[]): StudioViewState {
  let state: StudioViewState = {
    discussionId,
    topic: "",
    status: "generating",
    host: null,
    experts: new Map(),
    transcript: [],
    streaming: null,
    consensus: null,
    summary: null,
  };
  for (const ev of events) state = eventReducer(state, ev);
  return state;
}
