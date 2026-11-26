// LLM Provider 抽象：屏蔽 OpenAI 兼容实现与 Mock 实现的差异。
export interface LlmProvider {
  // 结构化 JSON 输出（阵容 / 意图 / 共识），返回未校验的解析结果
  chatJson(model: string, system: string, user: string): Promise<unknown>;

  // 流式文本输出（专家 / 主持人发言），边生成边回调 delta，返回完整文本
  chatStream(
    model: string,
    system: string,
    user: string,
    onDelta: (delta: string) => void,
  ): Promise<string>;
}
