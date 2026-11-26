import type { LlmProvider } from "./provider";

// Mock Provider：确定性、零成本、零网络，单测 / E2E 的前提。
// TODO(TDD): 按轮次从固定 JSON 返回预设意图 / 发言 / 阵容 / 共识。
export class MockProvider implements LlmProvider {
  async chatJson(): Promise<unknown> {
    return {};
  }

  async chatStream(
    _model: string,
    _system: string,
    _user: string,
    onDelta: (delta: string) => void,
  ): Promise<string> {
    const text = "（mock 发言）";
    onDelta(text);
    return text;
  }
}
