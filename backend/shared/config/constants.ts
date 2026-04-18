// Application constants and configuration

export const APP_NAME = "Product Pilot";
export const APP_DESCRIPTION = "AI-Powered Product Manager Productivity Platform";

// Pipeline step definitions
export const PIPELINE_STEPS = [
  { number: 1, name: "reframe_problem", label: "Reframe Problem", description: "Analyze and restructure the problem statement" },
  { number: 2, name: "write_vision", label: "Write Vision", description: "Generate product vision, mission, and value proposition" },
  { number: 3, name: "persona_profiles", label: "Persona Profiles", description: "Identify and profile user personas" },
  { number: 4, name: "clarifying_questions", label: "Clarifying Questions", description: "Generate and answer clarifying questions" },
  { number: 5, name: "market_analysis", label: "Market Analysis", description: "Competitive and market landscape analysis" },
  { number: 6, name: "generate_prd", label: "Generate PRD", description: "Create Product Requirements Document" },
  { number: 7, name: "user_stories", label: "User Stories", description: "Write user stories with acceptance criteria" },
  { number: 8, name: "backlog_roadmap", label: "Backlog & Roadmap", description: "Prioritize backlog and build roadmap" },
  { number: 9, name: "okrs_metrics", label: "OKRs & Metrics", description: "Define OKRs and success metrics" },
] as const;

export const TOTAL_STEPS = 9;

// LLM model configuration per step
export const STEP_MODEL_CONFIG: Record<number, {
  primaryModel: string;
  fallbackModel: string;
  maxTokens: number;
  temperature: number;
}> = {
  1: { primaryModel: "llama-3.1-8b-instant", fallbackModel: "openrouter/auto", maxTokens: 1024, temperature: 0.7 },
  2: { primaryModel: "llama-3.1-8b-instant", fallbackModel: "openrouter/auto", maxTokens: 1024, temperature: 0.7 },
  3: { primaryModel: "llama-3.3-70b-versatile", fallbackModel: "anthropic/claude-3.5-sonnet", maxTokens: 4096, temperature: 0.7 },
  4: { primaryModel: "llama-3.3-70b-versatile", fallbackModel: "openai/gpt-4o", maxTokens: 2048, temperature: 0.5 },
  5: { primaryModel: "llama-3.3-70b-versatile", fallbackModel: "anthropic/claude-3.5-sonnet", maxTokens: 4096, temperature: 0.3 },
  6: { primaryModel: "llama-3.3-70b-versatile", fallbackModel: "anthropic/claude-3.5-sonnet", maxTokens: 4096, temperature: 0.4 },
  7: { primaryModel: "llama-3.3-70b-versatile", fallbackModel: "openai/gpt-4o", maxTokens: 4096, temperature: 0.4 },
  8: { primaryModel: "llama-3.3-70b-versatile", fallbackModel: "anthropic/claude-3.5-sonnet", maxTokens: 4096, temperature: 0.3 },
  9: { primaryModel: "llama-3.1-8b-instant", fallbackModel: "openrouter/auto", maxTokens: 2048, temperature: 0.4 },
};

// Pinecone configuration
export const PINECONE_CONFIG = {
  indexName: "product-pilot",
  metric: "cosine" as const,
  dimensions: 1536,
  embeddingModel: "text-embedding-3-small",
  chunkSize: 512,
  chunkOverlap: 50,
  defaultTopK: 10,
};

// Groq API configuration
export const GROQ_CONFIG = {
  baseUrl: "https://api.groq.com/openai/v1",
  maxRetries: 3,
  retryBaseDelayMs: 1000,
  rateLimitRequestsPerMinute: 30,
};

// OpenRouter API configuration
export const OPENROUTER_CONFIG = {
  baseUrl: "https://openrouter.ai/api/v1",
  appName: "Product Pilot",
  fallbackChain: [
    "anthropic/claude-3.5-sonnet",
    "openai/gpt-4o",
    "google/gemini-2.0-flash",
  ],
};

// Story point values (Fibonacci)
export const STORY_POINTS = [1, 2, 3, 5, 8, 13] as const;

// RICE impact values
export const RICE_IMPACT_VALUES = {
  minimal: 0.25,
  low: 0.5,
  medium: 1,
  high: 2,
  massive: 3,
} as const;

// Export formats
export const EXPORT_FORMATS = ["pdf", "markdown", "docx", "confluence"] as const;

// Question categories
export const QUESTION_CATEGORIES = [
  "user_needs",
  "technical",
  "business",
  "scope",
  "constraints",
] as const;

// AARRR metric categories
export const METRIC_CATEGORIES = [
  "acquisition",
  "activation",
  "retention",
  "revenue",
  "referral",
] as const;
