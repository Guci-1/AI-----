import { useEffect, useState } from "react";
import type { EventEnvelope } from "@ai-panel/shared";
import { eventReducer } from "../lib/eventReducer";
import { startPlayback } from "../lib/playback";
import { createInitialViewState, type StudioViewState } from "../lib/types";

// 回放：本地定时器按固定节拍逐条喂事件给 eventReducer。
// MVP 仅"从头自动播"，播放完毕后 done=true。
export function useReplay(discussionId: string, events: EventEnvelope[]) {
  const [state, setState] = useState<StudioViewState>(() => createInitialViewState(discussionId));
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);

  const play = () => {
    setState(createInitialViewState(discussionId));
    setIndex(0);
    setDone(false);
    setPlaying(true);
    startPlayback(events.length, {
      onEvent: (i) => {
        setState((s) => eventReducer(s, events[i]));
        setIndex(i + 1);
      },
      onDone: () => {
        setPlaying(false);
        setDone(true);
      },
    });
  };

  // 自动播放
  useEffect(() => {
    if (events.length > 0) play();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events.length]);

  return { state, index, total: events.length, playing, done, replay: play };
}
