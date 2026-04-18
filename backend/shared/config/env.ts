// Environment variable validation using Zod
// Validates all required env vars at build/startup time
// Throws descriptive errors for missing or invalid values

import { z } from "zod";

const envSchema = z.object({
  // LLM APIs
  GROQ_API_KEY: z.string().min(1, "GROQ_API_KEY is required"),
  OPENROUTER_API_KEY: z.string().min(1, "OPENROUTER_API_KEY is required"),

  // Pinecone
  PINECONE_API_KEY: z.string().min(1, "PINECONE_API_KEY is required"),
  PINECONE_INDEX: z.string().default("product-pilot"),
  PINECONE_ENVIRONMENT: z.string().default("us-east-1"),

  // Database
  DATABASE_URL: z.string().url("DATABASE_URL must be a valid PostgreSQL URL"),

  // External APIs
  SERPER_API_KEY: z.string().optional(),
  FIRECRAWL_API_KEY: z.string().optional(),

  // App Config
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  LLM_DEFAULT_TEMPERATURE: z.coerce.number().min(0).max(2).default(0.7),
  LLM_DEFAULT_MAX_TOKENS: z.coerce.number().min(256).max(8192).default(2048),
  LLM_MAX_RETRIES: z.coerce.number().min(1).max(10).default(3),
  PIPELINE_STREAM_ENABLED: z.coerce.boolean().default(true),
  PIPELINE_RAG_TOP_K: z.coerce.number().min(1).max(50).default(10),
  PIPELINE_EMBEDDING_CHUNK_SIZE: z.coerce.number().default(512),
  PIPELINE_EMBEDDING_CHUNK_OVERLAP: z.coerce.number().default(50),
  RATE_LIMIT_REQUESTS_PER_MINUTE: z.coerce.number().default(10),
  RATE_LIMIT_PIPELINE_CONCURRENT: z.coerce.number().default(2),
});

export type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    const errorMessage = Object.entries(errors)
      .map(([key, msgs]) => `  ${key}: ${msgs?.join(", ")}`)
      .join("\n");
    throw new Error(`Environment validation failed:\n${errorMessage}`);
  }

  return parsed.data;
}

export const env = validateEnv();
