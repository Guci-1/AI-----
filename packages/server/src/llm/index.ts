import { env } from "../config/env";
import type { LlmProvider } from "./provider";
import { MockProvider } from "./mock";
import { OpenAIProvider } from "./openai";

// 工厂：按 LLM_PROVIDER 选择实现
export function createProvider(): LlmProvider {
  return env.llm.provider === "mock" ? new MockProvider() : new OpenAIProvider();
}
