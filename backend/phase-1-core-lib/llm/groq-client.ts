// Groq API client wrapper
// Provides streaming chat completion via Groq's LPU inference
// OpenAI-compatible API at https://api.groq.com/openai/v1/chat/completions
//
// Models:
//   - llama-3.3-70b-versatile (complex tasks: PRD, market analysis, personas)
//   - llama-3.1-8b-instant (light tasks: reframing, formatting)
//
// Key config:
//   - Streaming enabled by default
//   - Temperature varies by step (0.3 - 0.7)
//   - Max tokens varies by step (1024 - 4096)
//   - Supports JSON mode via response_format: { type: "json_object" }

export interface GroqConfig {
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
  stream: boolean;
}

export async function createGroqCompletion(
  config: GroqConfig,
  messages: Array<{ role: string; content: string }>
): Promise<ReadableStream> {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      messages,
      temperature: config.temperature,
      max_tokens: config.maxTokens,
      stream: config.stream,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Groq API error: ${response.status} - ${error}`);
  }

  if (!config.stream || !response.body) {
    const data = await response.json();
    const content = data.choices[0]?.message?.content || "";
    // Create a readable stream from the content
    return new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(content));
        controller.close();
      },
    });
  }

  // Return the streaming response body
  return response.body;
}

// Parse SSE stream into JSON content
export async function* parseGroqStream(
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
