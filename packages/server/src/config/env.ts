import "dotenv/config";

// 环境变量与默认值（单点读取，其余模块从这里取配置）
export const env = {
  port: Number(process.env.PORT ?? 3001),
  llm: {
    provider: process.env.LLM_PROVIDER ?? "mock",
    baseUrl: process.env.LLM_BASE_URL ?? "",
    apiKey: process.env.LLM_API_KEY ?? "",
    modelIntent: process.env.LLM_MODEL_INTENT ?? "",
    modelSpeech: process.env.LLM_MODEL_SPEECH ?? "",
    timeoutIntentMs: 8_000,
    timeoutSpeechMs: 30_000,
    maxRetries: 2,
    maxConcurrency: 8,
  },
  limits: {
    maxRounds: 40,
    maxDurationMs: 15 * 60 * 1000,
    maxLlmCalls: 200,
    maxConcurrentDiscussions: 3,
  },
};
