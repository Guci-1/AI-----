import type {
  CreateDiscussionInput,
  DiscussionSummary,
  DiscussionDetail,
  ControlAction,
  EventListResponse,
  ConsensusSnapshot,
} from "@ai-panel/shared";

const BASE = "/api";

async function json<T>(res: Response): Promise<T> {
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  return res.json() as Promise<T>;
}

// 纯文本视图响应（shared 未定义，本地声明）
export interface ResultResponse {
  topic: string;
  transcript: { expertId: string; text: string }[];
  consensus: ConsensusSnapshot | null;
  summary: string | null;
}

export const api = {
  listDiscussions: () =>
    fetch(`${BASE}/discussions`).then((r) => json<{ discussions: DiscussionSummary[] }>(r)),

  getDiscussion: (id: string) =>
    fetch(`${BASE}/discussions/${id}`).then((r) => json<DiscussionDetail>(r)),

  createDiscussion: (input: CreateDiscussionInput) =>
    fetch(`${BASE}/discussions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    }).then((r) => json<DiscussionDetail>(r)),

  confirm: (id: string) =>
    fetch(`${BASE}/discussions/${id}/confirm`, { method: "POST" }).then((r) => json<DiscussionDetail>(r)),

  regenerate: (id: string) =>
    fetch(`${BASE}/discussions/${id}/regenerate`, { method: "POST" }).then((r) => json<DiscussionDetail>(r)),

  control: (id: string, action: ControlAction) =>
    fetch(`${BASE}/discussions/${id}/control`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    }).then((r) => json<DiscussionDetail>(r)),

  getEvents: (id: string) =>
    fetch(`${BASE}/discussions/${id}/events`).then((r) => json<EventListResponse>(r)),

  getResult: (id: string) =>
    fetch(`${BASE}/discussions/${id}/result`).then((r) => json<ResultResponse>(r)),
};
