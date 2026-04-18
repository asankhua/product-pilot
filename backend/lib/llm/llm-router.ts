// LLM Router - Primary/fallback routing logic
//
// Strategy:
//   1. Try Groq API (primary) up to 3 times with exponential backoff
//   2. On persistent failure, fallback to OpenRouter (auto or explicit model)
//   3. Select model based on step complexity (heavy vs light tasks)
//
// Heavy steps (3, 5, 6, 7, 8) → llama-3.3-70b-versatile
// Light steps (1, 2, 4, 9) → llama-3.1-8b-instant

import { GroqConfig, createGroqCompletion } from "./groq-client";
import { OpenRouterConfig, createOpenRouterCompletion } from "./openrouter-client";

const HEAVY_STEPS = [3, 5, 6, 7, 8];
const MAX_RETRIES = 3;

export function getModelForStep(stepNumber: number): string {
  return HEAVY_STEPS.includes(stepNumber)
    ? "llama-3.3-70b-versatile"
    : "llama-3.1-8b-instant";
}

export async function routeLLMRequest(
  stepNumber: number,
  messages: Array<{ role: string; content: string }>,
  options: { temperature?: number; maxTokens?: number; stream?: boolean }
): Promise<ReadableStream | string> {
  // TODO: Implement retry logic with exponential backoff + fallback
  throw new Error("Not implemented");
}
