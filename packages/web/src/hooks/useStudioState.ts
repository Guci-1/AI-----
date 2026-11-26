import { useCallback, useReducer } from "react";
import type { EventEnvelope } from "@ai-panel/shared";
import { eventReducer } from "../lib/eventReducer";
import { createInitialViewState, type StudioViewState } from "../lib/types";

// 演播厅视图状态：useReducer 承载，事件流折叠成状态。
// 实时（SSE）与回放（定时器）都通过 applyEvents 驱动，共用 eventReducer。

type Action = { type: "apply"; events: EventEnvelope[] };

function reducer(state: StudioViewState, action: Action): StudioViewState {
  return action.events.reduce(eventReducer, state);
}

export function useStudioState(discussionId: string) {
  const [state, dispatch] = useReducer(reducer, discussionId, createInitialViewState);

  const applyEvent = useCallback(
    (event: EventEnvelope) => dispatch({ type: "apply", events: [event] }),
    [],
  );
  const applyEvents = useCallback(
    (events: EventEnvelope[]) => dispatch({ type: "apply", events }),
    [],
  );

  return { state, applyEvent, applyEvents };
}
