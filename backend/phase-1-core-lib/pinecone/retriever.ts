// RAG context retriever from Pinecone
//
// Retrieval flow:
//   1. Build query from problem statement + current step goal
//   2. Generate query embedding
//   3. Query Pinecone namespace (project-scoped)
//   4. Filter by stepNumber < currentStep (only use prior context)
//   5. Return top-K text chunks as additional LLM context
//
// Default K=10, configurable per step

export interface RetrievalResult {
  text: string;
  stepNumber: number;
  stepName: string;
  contentType: string;
  score: number;
}

export async function retrieveContext(
  projectId: string,
  query: string,
  currentStepNumber: number,
  topK: number = 10
): Promise<RetrievalResult[]> {
  // TODO: Query Pinecone with metadata filtering
  throw new Error("Not implemented");
}

export function formatRAGContext(results: RetrievalResult[]): string {
  // TODO: Format retrieved chunks into a context string for the LLM prompt
  throw new Error("Not implemented");
}
