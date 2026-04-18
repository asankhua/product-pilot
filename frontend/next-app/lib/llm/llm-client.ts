// LLM Client for Frontend API Routes
// Wraps Groq and OpenRouter APIs with retry logic

interface LLMConfig {
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
  stream: boolean;
}

// Step-specific model assignments
const STEP_MODELS: Record<number, { groq: string; openrouter: string }> = {
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

const MAX_RETRIES = 3;

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getModelForStep(stepNumber: number, provider: 'groq' | 'openrouter'): string {
  return STEP_MODELS[stepNumber]?.[provider] || "llama-3.3-70b-versatile";
}

function getPrimaryProvider(stepNumber: number): 'groq' | 'openrouter' {
  return stepNumber % 2 === 1 ? 'groq' : 'openrouter';
}

// Call Groq API
async function callGroq(config: LLMConfig, messages: Array<{ role: string; content: string }>): Promise<Response> {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${config.apiKey}`
    },
    body: JSON.stringify({
      model: config.model,
      messages,
      temperature: config.temperature,
      max_tokens: config.maxTokens,
      stream: config.stream
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Groq API error: ${response.status} - ${error}`);
  }

  return response;
}

// Call OpenRouter API
async function callOpenRouter(config: LLMConfig, messages: Array<{ role: string; content: string }>): Promise<Response> {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${config.apiKey}`,
      "HTTP-Referer": process.env.APP_URL || "http://localhost:3000",
      "X-Title": "Product Pilot"
    },
    body: JSON.stringify({
      model: config.model,
      messages,
      temperature: config.temperature,
      max_tokens: config.maxTokens,
      stream: config.stream
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenRouter API error: ${response.status} - ${error}`);
  }

  return response;
}

// Route LLM request with retry and fallback
export async function routeLLMRequest(
  stepNumber: number,
  messages: Array<{ role: string; content: string }>,
  options: { temperature?: number; maxTokens?: number; stream?: boolean } = {}
): Promise<Response> {
  const temperature = options.temperature ?? 0.7;
  const maxTokens = options.maxTokens ?? 2048;
  const stream = options.stream ?? true;

  const primaryProvider = getPrimaryProvider(stepNumber);
  const secondaryProvider = primaryProvider === 'groq' ? 'openrouter' : 'groq';

  // Try primary provider
  try {
    if (primaryProvider === 'groq') {
      const groqConfig: LLMConfig = {
        apiKey: process.env.GROQ_API_KEY || "",
        model: getModelForStep(stepNumber, 'groq'),
        temperature,
        maxTokens,
        stream
      };
      return await callGroqWithRetry(groqConfig, messages);
    } else {
      const openrouterConfig: LLMConfig = {
        apiKey: process.env.OPENROUTER_API_KEY || "",
        model: getModelForStep(stepNumber, 'openrouter'),
        temperature,
        maxTokens,
        stream
      };
      return await callOpenRouterWithRetry(openrouterConfig, messages);
    }
  } catch (error) {
    console.warn(`Step ${stepNumber}: ${primaryProvider} failed, switching to ${secondaryProvider}`);

    // Try secondary provider
    try {
      if (secondaryProvider === 'groq') {
        const groqConfig: LLMConfig = {
          apiKey: process.env.GROQ_API_KEY || "",
          model: getModelForStep(stepNumber, 'groq'),
          temperature,
          maxTokens,
          stream
        };
        return await callGroqWithRetry(groqConfig, messages);
      } else {
        const openrouterConfig: LLMConfig = {
          apiKey: process.env.OPENROUTER_API_KEY || "",
          model: getModelForStep(stepNumber, 'openrouter'),
          temperature,
          maxTokens,
          stream
        };
        return await callOpenRouterWithRetry(openrouterConfig, messages);
      }
    } catch (fallbackError) {
      throw new Error(`Step ${stepNumber}: Both providers failed`);
    }
  }
}

// Call Groq with retries
async function callGroqWithRetry(config: LLMConfig, messages: Array<{ role: string; content: string }>): Promise<Response> {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await callGroq(config, messages);
    } catch (error) {
      const isRateLimit = error instanceof Error && 
        (error.message.includes("429") || error.message.includes("rate limit"));
      
      if (isRateLimit && attempt < MAX_RETRIES) {
        await sleep(Math.pow(2, attempt) * 1000);
        continue;
      }
      
      if (attempt === MAX_RETRIES) {
        throw error;
      }
      
      throw error;
    }
  }
  throw new Error("Max retries exceeded");
}

// Call OpenRouter with retries
async function callOpenRouterWithRetry(config: LLMConfig, messages: Array<{ role: string; content: string }>): Promise<Response> {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await callOpenRouter(config, messages);
    } catch (error) {
      const isRateLimit = error instanceof Error && 
        (error.message.includes("429") || error.message.includes("rate limit"));
      
      if (isRateLimit && attempt < MAX_RETRIES) {
        await sleep(Math.pow(2, attempt) * 1000);
        continue;
      }
      
      if (attempt === MAX_RETRIES) {
        throw error;
      }
      
      throw error;
    }
  }
  throw new Error("Max retries exceeded");
}

// Parse streaming response and yield chunks
export async function* streamLLMResponse(stepNumber: number, response: Response): AsyncGenerator<string> {
  if (!response.body) {
    throw new Error("No response body");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content || 
                          parsed.choices?.[0]?.text || 
                          '';
            if (content) {
              yield content;
            }
          } catch {
            // Skip invalid JSON
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}
