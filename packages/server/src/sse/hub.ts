import type { Response } from "express";
import { RingBuffer } from "./buffer";

export interface SseEvent {
  id: number;
  type: string;
  payload: unknown;
  createdAt?: string;
}

// SSE 频道管理：按 discussionId 分频道，维护连接注册表与内存热缓冲。
export class SseHub {
  private channels = new Map<string, Set<Response>>();
  private buffers = new Map<string, RingBuffer<SseEvent>>();

  subscribe(discussionId: string, res: Response): void {
    if (!this.channels.has(discussionId)) {
      this.channels.set(discussionId, new Set());
    }
    this.channels.get(discussionId)!.add(res);
  }

  unsubscribe(discussionId: string, res: Response): void {
    this.channels.get(discussionId)?.delete(res);
  }

  // 实时广播（事件已落库、带 id 后调用）
  broadcast(discussionId: string, event: SseEvent): void {
    let buf = this.buffers.get(discussionId);
    if (!buf) {
      buf = new RingBuffer<SseEvent>(200);
      this.buffers.set(discussionId, buf);
    }
    buf.push(event);

    const frame = `id: ${event.id}\nevent: ${event.type}\ndata: ${JSON.stringify(event)}\n\n`;
    for (const res of this.channels.get(discussionId) ?? []) {
      res.write(frame);
    }
  }

  getBuffer(discussionId: string): SseEvent[] {
    return this.buffers.get(discussionId)?.getAll() ?? [];
  }
}

// 单例
export const hub = new SseHub();
