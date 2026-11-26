import { useEffect } from "react";
import type { EventEnvelope } from "@ai-panel/shared";

// SSE 实时订阅：EventSource 连接 /stream，收到事件回调。
// 断线续传依赖浏览器 EventSource 自动重连时发送的 Last-Event-ID（服务端据此补缺）。
export function useSSE(discussionId: string, onEvent: (ev: EventEnvelope) => void): void {
  useEffect(() => {
    const es = new EventSource(`/api/discussions/${discussionId}/stream`);

    es.onmessage = (e) => {
      try {
        onEvent(JSON.parse(e.data) as EventEnvelope);
      } catch {
        // 忽略心跳等非 JSON 帧
      }
    };

    return () => es.close();
  }, [discussionId, onEvent]);
}
