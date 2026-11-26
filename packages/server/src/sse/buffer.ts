// 内存环形缓冲（每场保留最近 N 条热事件；权威源仍是数据库 Event 表）。
export class RingBuffer<T> {
  private items: T[] = [];

  constructor(private capacity = 200) {}

  push(item: T): void {
    this.items.push(item);
    if (this.items.length > this.capacity) {
      this.items.shift();
    }
  }

  getAll(): T[] {
    return [...this.items];
  }
}
