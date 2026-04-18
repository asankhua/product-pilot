// Text embedding generation and chunking for RAG
// Uses OpenAI text-embedding-3-small via OpenRouter
// Chunking: 512 tokens max, 50 overlap, paragraph-aware

import { PINECONE_CONFIG } from "@/shared/config/constants";
import { env } from "@/shared/config/env";

export interface EmbeddingResult {
  id: string;
  values: number[];
  metadata: {
    text: string;
    chunkIndex: number;
    totalChunks: number;
    sourceType: string;
    sourceId: string;
    [key: string]: string | number;
  };
}

/**
 * Chunk text with paragraph-aware splitting
 * Strategy:
 *   - Max chunk size: 512 tokens (approx 2000 chars for English)
 *   - Overlap: 50 tokens (approx 200 chars)
 *   - Split by paragraph boundaries first
 *   - Then by sentence boundaries if paragraphs too long
 *   - Preserve context with overlap between chunks
 */
export function chunkText(
  text: string,
  maxChunkSize: number = PINECONE_CONFIG.chunkSize * 4, // ~512 tokens ≈ 2000 chars
  overlapSize: number = PINECONE_CONFIG.chunkOverlap * 4 // ~50 tokens ≈ 200 chars
): string[] {
  if (!text || text.trim().length === 0) {
    return [];
  }

  const chunks: string[] = [];
  
  // Split by paragraph boundaries first
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  
  let currentChunk = "";
  
  for (const paragraph of paragraphs) {
    // If paragraph fits in current chunk, add it
    if (currentChunk.length + paragraph.length + 1 <= maxChunkSize) {
      currentChunk += (currentChunk ? "\n\n" : "") + paragraph;
    } else {
      // Current chunk is full, save it
      if (currentChunk) {
        chunks.push(currentChunk.trim());
      }
      
      // If paragraph itself is too long, split by sentences
      if (paragraph.length > maxChunkSize) {
        const sentences = paragraph.match(/[^.!?]+[.!?]+/g) || [paragraph];
        currentChunk = "";
        
        for (const sentence of sentences) {
          if (currentChunk.length + sentence.length <= maxChunkSize) {
            currentChunk += sentence;
          } else {
            if (currentChunk) {
              chunks.push(currentChunk.trim());
            }
            currentChunk = sentence;
          }
        }
      } else {
        // Paragraph fits, start new chunk with overlap from previous
        currentChunk = paragraph;
      }
    }
  }
  
  // Don't forget the last chunk
  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }
  
  // Add overlap between chunks for context preservation
  if (chunks.length > 1 && overlapSize > 0) {
    const overlappedChunks: string[] = [];
    
    for (let i = 0; i < chunks.length; i++) {
      let chunk = chunks[i];
      
      // Add overlap from previous chunk
      if (i > 0) {
        const prevChunk = chunks[i - 1];
        const overlap = prevChunk.slice(-overlapSize);
        chunk = overlap + " " + chunk;
      }
      
      overlappedChunks.push(chunk);
    }
    
    return overlappedChunks;
  }
  
  return chunks;
}

/**
 * Generate embeddings for text chunks using OpenAI via OpenRouter
 */
export async function generateEmbeddings(
  texts: string[],
  metadata: Array<Record<string, string | number>>
): Promise<EmbeddingResult[]> {
  if (texts.length === 0) {
    return [];
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/embeddings", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": env.NEXT_PUBLIC_APP_URL,
        "X-Title": "Product Pilot",
      },
      body: JSON.stringify({
        model: "openai/text-embedding-3-small",
        input: texts,
      }),
    });

    if (!response.ok) {
      throw new Error(`Embedding API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    return data.data.map((item: any, index: number) => ({
      id: metadata[index]?.id as string || `emb_${Date.now()}_${index}`,
      values: item.embedding,
      metadata: {
        text: texts[index],
        ...metadata[index],
      },
    }));
  } catch (error) {
    console.error("Failed to generate embeddings:", error);
    throw error;
  }
}

/**
 * Generate embedding for a single query text
 */
export async function generateQueryEmbedding(text: string): Promise<number[]> {
  const results = await generateEmbeddings([text], [{ id: "query" }]);
  return results[0].values;
}

/**
 * Calculate cosine similarity between two vectors
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}
