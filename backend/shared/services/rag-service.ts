// RAG (Retrieval-Augmented Generation) Service
// Handles indexing, querying, and deleting project artifacts for chatbot

import { Pinecone } from "@pinecone-database/pinecone";
import { env } from "@/shared/config/env";
import { PINECONE_CONFIG, PIPELINE_STEPS } from "@/shared/config/constants";
import { chunkText, generateEmbeddings, generateQueryEmbedding } from "./embedding-service";

// Types
export interface RagIndexStatus {
  projectId: string;
  status: "indexing" | "ready" | "failed" | "deleted";
  vectorCount: number;
  indexedAt: Date;
  lastQueriedAt?: Date;
  errorMessage?: string;
}

export interface IndexProjectArtifactsParams {
  projectId: string;
  artifacts: {
    type: string; // problem_statement, persona, prd, market_analysis, user_stories, roadmap, okrs, etc.
    title: string;
    content: string;
    stepNumber?: number;
    metadata?: Record<string, string | number>;
  }[];
}

export interface RagQueryResult {
  text: string;
  score: number;
  sourceType: string;
  sourceTitle: string;
  stepNumber?: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  sources?: RagQueryResult[];
}

// Initialize Pinecone client
let pineconeClient: Pinecone | null = null;

function getPineconeClient(): Pinecone {
  if (!pineconeClient) {
    pineconeClient = new Pinecone({
      apiKey: env.PINECONE_API_KEY,
    });
  }
  return pineconeClient;
}

function getIndex() {
  return getPineconeClient().index(env.PINECONE_INDEX);
}

function getNamespace(projectId: string) {
  return getIndex().namespace(`project_${projectId}`);
}

/**
 * Index all project artifacts for RAG
 * Creates vector embeddings for each artifact with appropriate metadata
 */
export async function indexProjectArtifacts(
  params: IndexProjectArtifactsParams
): Promise<RagIndexStatus> {
  const { projectId, artifacts } = params;
  
  try {
    const namespace = getNamespace(projectId);
    const allEmbeddings: Array<{
      id: string;
      values: number[];
      metadata: Record<string, string | number>;
    }> = [];
    
    // Process each artifact
    for (const artifact of artifacts) {
      if (!artifact.content || artifact.content.trim().length === 0) {
        continue;
      }
      
      // Chunk the content
      const chunks = chunkText(
        artifact.content,
        PINECONE_CONFIG.chunkSize * 4, // ~2048 chars
        PINECONE_CONFIG.chunkOverlap * 4 // ~200 chars overlap
      );
      
      if (chunks.length === 0) {
        continue;
      }
      
      // Prepare metadata for each chunk
      const chunkMetadata = chunks.map((chunk, index) => ({
        id: `${projectId}_${artifact.type}_${index}`,
        text: chunk,
        chunkIndex: index,
        totalChunks: chunks.length,
        sourceType: artifact.type,
        sourceTitle: artifact.title,
        stepNumber: artifact.stepNumber || 0,
        projectId,
        indexedAt: new Date().toISOString(),
        ...artifact.metadata,
      }));
      
      // Generate embeddings
      const embeddings = await generateEmbeddings(chunks, chunkMetadata);
      
      allEmbeddings.push(...embeddings);
    }
    
    // Batch upsert to Pinecone (max 100 per batch)
    const batchSize = 100;
    for (let i = 0; i < allEmbeddings.length; i += batchSize) {
      const batch = allEmbeddings.slice(i, i + batchSize);
      await namespace.upsert(batch.map(e => ({
        id: e.id,
        values: e.values,
        metadata: e.metadata,
      })));
    }
    
    return {
      projectId,
      status: "ready",
      vectorCount: allEmbeddings.length,
      indexedAt: new Date(),
    };
    
  } catch (error) {
    console.error(`Failed to index project ${projectId}:`, error);
    
    return {
      projectId,
      status: "failed",
      vectorCount: 0,
      indexedAt: new Date(),
      errorMessage: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Query the RAG system for relevant context
 */
export async function queryRAG(
  projectId: string,
  query: string,
  options?: {
    topK?: number;
    filterByStep?: number; // Only retrieve from steps <= this
    sourceTypes?: string[]; // Filter by specific artifact types
  }
): Promise<RagQueryResult[]> {
  try {
    const namespace = getNamespace(projectId);
    
    // Generate query embedding
    const queryEmbedding = await generateQueryEmbedding(query);
    
    // Build metadata filter
    const filter: Record<string, any> = {};
    
    if (options?.filterByStep !== undefined) {
      filter.stepNumber = { $lte: options.filterByStep };
    }
    
    if (options?.sourceTypes && options.sourceTypes.length > 0) {
      filter.sourceType = { $in: options.sourceTypes };
    }
    
    // Query Pinecone
    const results = await namespace.query({
      vector: queryEmbedding,
      topK: options?.topK || PINECONE_CONFIG.defaultTopK,
      includeMetadata: true,
      filter: Object.keys(filter).length > 0 ? filter : undefined,
    });
    
    // Map results
    return results.matches?.map(match => ({
      text: (match.metadata?.text as string) || "",
      score: match.score || 0,
      sourceType: (match.metadata?.sourceType as string) || "unknown",
      sourceTitle: (match.metadata?.sourceTitle as string) || "",
      stepNumber: match.metadata?.stepNumber as number | undefined,
    })) || [];
    
  } catch (error) {
    console.error(`Failed to query RAG for project ${projectId}:`, error);
    throw error;
  }
}

/**
 * Delete all RAG data for a project
 */
export async function deleteProjectRAG(projectId: string): Promise<void> {
  try {
    const namespace = getNamespace(projectId);
    
    // Delete all vectors in the namespace
    await namespace.deleteAll();
    
    console.log(`Deleted RAG index for project ${projectId}`);
    
  } catch (error) {
    console.error(`Failed to delete RAG for project ${projectId}:`, error);
    throw error;
  }
}

/**
 * Get RAG index status for a project
 */
export async function getRAGStatus(projectId: string): Promise<RagIndexStatus> {
  try {
    const namespace = getNamespace(projectId);
    
    // Get index stats
    const stats = await namespace.describeIndexStats();
    const vectorCount = stats.totalRecordCount || 0;
    
    return {
      projectId,
      status: vectorCount > 0 ? "ready" : "deleted",
      vectorCount,
      indexedAt: new Date(), // Pinecone doesn't return this, we'd track in DB
    };
    
  } catch (error) {
    // If index doesn't exist or other error
    return {
      projectId,
      status: "deleted",
      vectorCount: 0,
      indexedAt: new Date(),
    };
  }
}

/**
 * Re-index a project (delete existing and re-create)
 */
export async function reindexProject(
  params: IndexProjectArtifactsParams
): Promise<RagIndexStatus> {
  // First delete existing
  await deleteProjectRAG(params.projectId);
  
  // Then re-index
  return indexProjectArtifacts(params);
}

/**
 * Format RAG results into context for LLM
 */
export function formatRAGContext(results: RagQueryResult[]): string {
  if (results.length === 0) {
    return "";
  }
  
  const formatted = results.map((result, index) => {
    const stepLabel = result.stepNumber 
      ? PIPELINE_STEPS.find(s => s.number === result.stepNumber)?.label || `Step ${result.stepNumber}`
      : "";
    
    return `[Source ${index + 1}]${stepLabel ? ` (${stepLabel})` : ""}: ${result.sourceTitle}\n${result.text}`;
  });
  
  return `## Relevant Project Information:\n\n${formatted.join("\n\n---\n\n")}`;
}

/**
 * Generate chat response using RAG context
 */
export async function generateRAGResponse(
  projectId: string,
  messageHistory: ChatMessage[],
  userQuery: string,
  llmCall: (prompt: string, systemPrompt: string) => Promise<string>
): Promise<{ response: string; sources: RagQueryResult[] }> {
  // Query RAG for relevant context
  const ragResults = await queryRAG(projectId, userQuery, {
    topK: PINECONE_CONFIG.defaultTopK,
  });
  
  // Format context
  const context = formatRAGContext(ragResults);
  
  // Build system prompt with RAG context
  const systemPrompt = `You are an AI assistant for the Product Pilot platform. You help users understand their product documentation and answer questions about their project.

${context}

Instructions:
- Answer based ONLY on the provided project information above
- If the answer isn't in the provided context, say "I don't have information about that in the project documentation"
- Be concise and helpful
- Cite sources when providing specific facts`;

  // Build conversation history
  const conversationHistory = messageHistory
    .slice(-6) // Last 6 messages for context
    .map(msg => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`)
    .join("\n\n");

  const fullPrompt = conversationHistory 
    ? `${conversationHistory}\n\nUser: ${userQuery}` 
    : `User: ${userQuery}`;

  // Call LLM
  const response = await llmCall(fullPrompt, systemPrompt);
  
  return {
    response: response.trim(),
    sources: ragResults,
  };
}
