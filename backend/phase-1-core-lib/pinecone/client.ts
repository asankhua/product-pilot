// Pinecone client initialization
//
// Index: product-pilot
// Metric: cosine
// Dimensions: 1536 (text-embedding-3-small) or 768 (Pinecone Inference)
// Cloud: AWS us-east-1
// Type: Serverless
//
// Namespace strategy: project_{projectId} for data isolation

import { Pinecone } from "@pinecone-database/pinecone";

let pineconeClient: Pinecone | null = null;

export function getPineconeClient(): Pinecone {
  if (!pineconeClient) {
    pineconeClient = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    });
  }
  return pineconeClient;
}

export function getIndex() {
  const client = getPineconeClient();
  return client.index(process.env.PINECONE_INDEX || "product-pilot");
}

export function getNamespace(projectId: string) {
  return getIndex().namespace(`project_${projectId}`);
}
