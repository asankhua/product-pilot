// LLM Router - Load distribution between Groq and OpenRouter
//
// Strategy:
//   Distribute AI calls between Groq and OpenRouter based on step number
//   Odd steps (1,3,5,7,9) → Groq
//   Even steps (2,4,6,8) → OpenRouter
//
// Each provider has its own retry logic (3 attempts with backoff)
// If one provider fails completely, automatically switch to the other

import { GroqConfig, createGroqCompletion, parseGroqStream } from "./groq-client";
import { OpenRouterConfig, createOpenRouterCompletion, parseOpenRouterStream } from "./openrouter-client";

const MAX_RETRIES = 3;

// Step-specific model assignments
const STEP_MODELS = {
  1: { groq: "meta-llama/llama-4-scout-17b-16e-instruct", openrouter: "anthropic/claude-3.5-sonnet" },
  2: { groq: "meta-llama/llama-4-scout-17b-16e-instruct", openrouter: "anthropic/claude-3.5-sonnet" },
  3: { groq: "meta-llama/llama-4-scout-17b-16e-instruct", openrouter: "anthropic/claude-3.5-sonnet" },
  4: { groq: "meta-llama/llama-4-scout-17b-16e-instruct", openrouter: "openai/gpt-4o" },
  5: { groq: "meta-llama/llama-4-scout-17b-16e-instruct", openrouter: "anthropic/claude-3.5-sonnet" },
  6: { groq: "meta-llama/llama-4-scout-17b-16e-instruct", openrouter: "anthropic/claude-3.5-sonnet" },
  7: { groq: "meta-llama/llama-4-scout-17b-16e-instruct", openrouter: "openai/gpt-4o" },
  8: { groq: "meta-llama/llama-4-scout-17b-16e-instruct", openrouter: "anthropic/claude-3.5-sonnet" },
  9: { groq: "meta-llama/llama-4-scout-17b-16e-instruct", openrouter: "openai/gpt-4o-mini" }
};

export function getModelForStep(stepNumber: number, provider: 'groq' | 'openrouter'): string {
  return STEP_MODELS[stepNumber as keyof typeof STEP_MODELS]?.[provider] || "llama-3.3-70b-versatile";
}

// Determine primary provider based on step number
// Odd steps → Groq, Even steps → OpenRouter
export function getPrimaryProvider(stepNumber: number): 'groq' | 'openrouter' {
  return stepNumber % 2 === 1 ? 'groq' : 'openrouter';
}

// Sleep helper for exponential backoff
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Call Groq with retries
async function callGroqWithRetry(
  stepNumber: number,
  messages: Array<{ role: string; content: string }>,
  options: { temperature: number; maxTokens: number; stream: boolean }
): Promise<ReadableStream> {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const groqConfig: GroqConfig = {
        apiKey: process.env.GROQ_API_KEY || "",
        model: getModelForStep(stepNumber, 'groq'),
        temperature: options.temperature,
        maxTokens: options.maxTokens,
        stream: options.stream,
      };

      return await createGroqCompletion(groqConfig, messages);
    } catch (error) {
      const isRateLimit = error instanceof Error && 
        (error.message.includes("429") || error.message.includes("rate limit"));
      
      if (isRateLimit && attempt < MAX_RETRIES) {
        await sleep(Math.pow(2, attempt) * 1000);
        continue;
      }
      
      if (attempt === MAX_RETRIES) {
        throw new Error(`Groq failed after ${MAX_RETRIES} attempts: ${error}`);
      }
      
      throw error;
    }
  }
  
  throw new Error("Groq: Max retries exceeded");
}

// Call OpenRouter with retries
async function callOpenRouterWithRetry(
  stepNumber: number,
  messages: Array<{ role: string; content: string }>,
  options: { temperature: number; maxTokens: number; stream: boolean }
): Promise<ReadableStream> {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const openrouterConfig: OpenRouterConfig = {
        apiKey: process.env.OPENROUTER_API_KEY || "",
        model: getModelForStep(stepNumber, 'openrouter'),
        temperature: options.temperature,
        maxTokens: options.maxTokens,
        stream: options.stream,
        fallbackModels: ["anthropic/claude-3.5-sonnet", "openai/gpt-4o"],
      };

      return await createOpenRouterCompletion(openrouterConfig, messages);
    } catch (error) {
      const isRateLimit = error instanceof Error && 
        (error.message.includes("429") || error.message.includes("rate limit"));
      
      if (isRateLimit && attempt < MAX_RETRIES) {
        await sleep(Math.pow(2, attempt) * 1000);
        continue;
      }
      
      if (attempt === MAX_RETRIES) {
        throw new Error(`OpenRouter failed after ${MAX_RETRIES} attempts: ${error}`);
      }
      
      throw error;
    }
  }
  
  throw new Error("OpenRouter: Max retries exceeded");
}

export async function routeLLMRequest(
  stepNumber: number,
  messages: Array<{ role: string; content: string }>,
  options: { temperature?: number; maxTokens?: number; stream?: boolean } = {}
): Promise<ReadableStream> {
  const temperature = options.temperature ?? 0.7;
  const maxTokens = options.maxTokens ?? 2048;
  const stream = options.stream ?? true;

  const primaryProvider = getPrimaryProvider(stepNumber);
  const secondaryProvider = primaryProvider === 'groq' ? 'openrouter' : 'groq';

  console.log(`Step ${stepNumber}: Primary provider = ${primaryProvider}`);

  // Try primary provider first
  try {
    if (primaryProvider === 'groq') {
      return await callGroqWithRetry(stepNumber, messages, { temperature, maxTokens, stream });
    } else {
      return await callOpenRouterWithRetry(stepNumber, messages, { temperature, maxTokens, stream });
    }
  } catch (error) {
    console.warn(`Step ${stepNumber}: ${primaryProvider} failed, switching to ${secondaryProvider}`);
    
    // Try secondary provider
    try {
      if (secondaryProvider === 'groq') {
        return await callGroqWithRetry(stepNumber, messages, { temperature, maxTokens, stream });
      } else {
        return await callOpenRouterWithRetry(stepNumber, messages, { temperature, maxTokens, stream });
      }
    } catch (fallbackError) {
      throw new Error(`Step ${stepNumber}: Both providers failed. Primary: ${error}, Secondary: ${fallbackError}`);
    }
  }
}

// Streaming generator with provider detection
export async function* streamLLMResponse(
  stepNumber: number,
  messages: Array<{ role: string; content: string }>,
  options?: { temperature?: number; maxTokens?: number }
): AsyncGenerator<string> {
  const primaryProvider = getPrimaryProvider(stepNumber);
  const stream = await routeLLMRequest(stepNumber, messages, { ...options, stream: true });
  
  // Parse based on which provider was used
  // Note: In case of failover, this might not match, so we try both
  try {
    if (primaryProvider === 'groq') {
      for await (const chunk of parseGroqStream(stream)) {
        yield chunk;
      }
    } else {
      for await (const chunk of parseOpenRouterStream(stream)) {
        yield chunk;
      }
    }
  } catch {
    // If primary parser fails, try the other one
    try {
      if (primaryProvider === 'groq') {
        for await (const chunk of parseOpenRouterStream(stream)) {
          yield chunk;
        }
      } else {
        for await (const chunk of parseGroqStream(stream)) {
          yield chunk;
        }
      }
    } catch {
      // Last resort: try to read as text
      const reader = stream.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        yield decoder.decode(value);
      }
    }
  }
}
