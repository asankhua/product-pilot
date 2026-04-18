// Token counting utility for prompt budget management
//
// Approximate token counting for prompt budget estimation
// Uses the ~4 chars per token heuristic for English text
// For precise counting, use tiktoken library

const AVG_CHARS_PER_TOKEN = 4;

export function estimateTokenCount(text: string): number {
  return Math.ceil(text.length / AVG_CHARS_PER_TOKEN);
}

export function estimateTokensForMessages(
  messages: Array<{ role: string; content: string }>
): number {
  let total = 0;
  for (const msg of messages) {
    total += 4; // per-message overhead
    total += estimateTokenCount(msg.role);
    total += estimateTokenCount(msg.content);
  }
  total += 2; // priming tokens
  return total;
}

export function truncateToTokenLimit(text: string, maxTokens: number): string {
  const maxChars = maxTokens * AVG_CHARS_PER_TOKEN;
  if (text.length <= maxChars) return text;
  return text.slice(0, maxChars) + "\n\n[...truncated to fit token limit]";
}

export function isWithinTokenBudget(
  messages: Array<{ role: string; content: string }>,
  maxTokens: number
): boolean {
  return estimateTokensForMessages(messages) <= maxTokens;
}
