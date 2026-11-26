import type {
  DiscussionStatus,
  ConsensusSnapshot,
  Host,
  RosterExpert,
} from "@ai-panel/shared";

// 专家视图状态（小窗渲染用）
export interface ExpertView {
  id: string;
  name: string;
  title: string;
  stance: string;
  color: string;
  status: "idle" | "preparing" | "speaking";
  publicThought: string | null;
}

// 一条 transcript 条目（主持人或专家发言）
export interface TranscriptEntry {
  eventId: number;
  speakerId: string; // expertId 或 "host"
  speakerName: string;
  speakerTitle: string;
  color: string;
  role: "host" | "expert";
  text: string;
  kind?: "opening" | "followup" | "transition" | "summary";
}

// 演播厅视图状态（eventReducer 折叠结果）
export interface StudioViewState {
  discussionId: string;
  topic: string;
  status: DiscussionStatus;
  host: Host | null;
  experts: Map<string, ExpertView>;
  transcript: TranscriptEntry[];
  streaming: TranscriptEntry | null; // 流式发言的进行中条目
  consensus: ConsensusSnapshot | null;
  summary: string | null;
}

export function createInitialViewState(discussionId: string): StudioViewState {
  return {
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
}

// 由 lineup 构建 experts Map（辅助）
export function expertsFromRoster(experts: RosterExpert[]): Map<string, ExpertView> {
  const map = new Map<string, ExpertView>();
  for (const e of experts) {
    map.set(e.id, {
      id: e.id,
      name: e.name,
      title: e.title,
      stance: e.stance,
      color: e.color,
      status: "idle",
      publicThought: null,
    });
  }
  return map;
}
