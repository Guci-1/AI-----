// 回放节拍：本地定时器按固定节拍逐条喂事件给 eventReducer。
// MVP：仅"从头自动播"，暂停/拖动/倍速留待后续。

export interface PlaybackOptions {
  onEvent: (index: number) => void;
  onDone: () => void;
  getDelay?: (index: number, total: number) => number;
}

// 固定节拍（发言类事件可稍长；MVP 统一 800ms）
export function defaultDelay(_index: number, _total: number): number {
  return 800;
}

// 返回一个取消函数
export function startPlayback(total: number, opts: PlaybackOptions): () => void {
  let cancelled = false;
  let i = 0;

  const step = () => {
    if (cancelled) return;
    if (i >= total) {
      opts.onDone();
      return;
    }
    opts.onEvent(i);
    i += 1;
    const delay = opts.getDelay ? opts.getDelay(i, total) : defaultDelay(i, total);
    setTimeout(step, delay);
  };

  step();
  return () => {
    cancelled = true;
  };
}
