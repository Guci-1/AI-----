import type { LlmProvider } from "./provider";

// OpenAI 兼容实现（可接 DeepSeek / 通义 / Kimi / Ollama 等）。
// TODO(TDD): 实现 chatJson（JSON mode）与 chatStream（SSE 解析 + 超时 + 重试 + 信号量）。
export class OpenAIProvider implements LlmProvider {
  async chatJson(): Promise<unknown> {
    throw new Error("OpenAIProvider.chatJson 未实现（TDD 阶段）");
  }

  async chatStream(): Promise<string> {
    throw new Error("OpenAIProvider.chatStream 未实现（TDD 阶段）");
  }
}
