// OpenRouter API client wrapper
// Unified gateway to 300+ models via https://openrouter.ai/api/v1/chat/completions
//
// Routing strategies:
//   - openrouter/auto: Intelligent model selection by NotDiamond
//   - Explicit model: anthropic/claude-3.5-sonnet, openai/gpt-4o, etc.
//   - Fallback chain: Primary → Secondary → Tertiary
//
// Required headers:
//   - Authorization: Bearer $OPENROUTER_API_KEY
//   - HTTP-Referer: $APP_URL
//   - X-Title: Product Pilot

export interface OpenRouterConfig {
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
  stream: boolean;
  fallbackModels?: string[];
}

export async function createOpenRouterCompletion(
  config: OpenRouterConfig,
  messages: Array<{ role: string; content: string }>
): Promise<ReadableStream> {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
      "HTTP-Referer": process.env.APP_URL || "http://localhost:3000",
      "X-Title": "Product Pilot",
    },
    body: JSON.stringify({
      model: config.model,
      messages,
      temperature: config.temperature,
      max_tokens: config.maxTokens,
      stream: config.stream,
      models: config.fallbackModels || undefined,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenRouter API error: ${response.status} - ${error}`);
  }

  if (!config.stream || !response.body) {
    const data = await response.json();
    const content = data.choices[0]?.message?.content || "";
    return new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(content));
        controller.close();
      },
    });
  }

  return response.body;
}

// Parse OpenRouter SSE stream
export async function* parseOpenRouterStream(
  stream: ReadableStream
): AsyncGenerator<string> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n");

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6);
          if (data === "[DONE]") continue;

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content || "";
            if (content) {
              yield content;
            }
          } catch {
            // Skip malformed lines
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}
