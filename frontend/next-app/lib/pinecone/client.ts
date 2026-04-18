// Pinecone Vector Database Client
// For semantic search and RAG across project data

import { Pinecone } from '@pinecone-database/pinecone';

// Initialize Pinecone client
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

const INDEX_NAME = process.env.PINECONE_INDEX || 'product-pilot';

// Get or create index
export async function getIndex() {
  try {
    const index = pinecone.Index(INDEX_NAME);
    return index;
  } catch (error) {
    console.error('Failed to get Pinecone index:', error);
    throw error;
  }
}

// Initialize index (check if it exists, create if not)
export async function initPineconeIndex() {
  try {
    const indexes = await pinecone.listIndexes();
    const indexExists = indexes.indexes?.some(idx => idx.name === INDEX_NAME);
    
    if (!indexExists) {
      console.log(`Creating Pinecone index: ${INDEX_NAME}`);
      await pinecone.createIndex({
        name: INDEX_NAME,
        dimension: 1536, // OpenAI embedding dimension
        metric: 'cosine',
        spec: {
          serverless: {
            cloud: 'aws',
            region: 'us-east-1'
          }
        }
      });
      // Wait for index to be ready
      await new Promise(resolve => setTimeout(resolve, 60000));
    }
    
    return pinecone.Index(INDEX_NAME);
  } catch (error) {
    console.error('Failed to initialize Pinecone index:', error);
    throw error;
  }
}

// Store project embedding
export async function storeProjectEmbedding(
  projectId: string, 
  content: string, 
  metadata: {
    projectName: string;
    stepNumber: number;
    stepName: string;
    contentType: string;
  }
) {
  try {
    const index = await getIndex();
    
    // Generate embedding using OpenAI (we'll need to add this)
    const embedding = await generateEmbedding(content);
    
    await index.upsert({
      records: [{
        id: `${projectId}-${metadata.stepNumber}-${Date.now()}`,
        values: embedding,
        metadata: {
          projectId,
          ...metadata,
          content: content.substring(0, 1000), // Store truncated content
          timestamp: new Date().toISOString()
        }
      }]
    });
    
    console.log(`Stored embedding for project ${projectId}, step ${metadata.stepNumber}`);
  } catch (error) {
    console.error('Failed to store project embedding:', error);
    throw error;
  }
}

// Search similar projects/content
export async function searchProjects(
  query: string, 
  options: {
    projectId?: string;
    stepNumber?: number;
    topK?: number;
  } = {}
) {
  try {
    const index = await getIndex();
    const embedding = await generateEmbedding(query);
    
    const filter: any = {};
    if (options.projectId) {
      filter.projectId = { $eq: options.projectId };
    }
    if (options.stepNumber) {
      filter.stepNumber = { $eq: options.stepNumber };
    }
    
    const results = await index.query({
      vector: embedding,
      topK: options.topK || 5,
      filter: Object.keys(filter).length > 0 ? filter : undefined,
      includeMetadata: true
    });
    
    return results.matches || [];
  } catch (error) {
    console.error('Failed to search projects:', error);
    throw error;
  }
}

// Delete project embeddings
export async function deleteProjectEmbeddings(projectId: string) {
  try {
    const index = await getIndex();
    
    // Query to find all embeddings for this project
    const results = await index.query({
      vector: new Array(1536).fill(0),
      topK: 1000,
      filter: { projectId: { $eq: projectId } },
      includeMetadata: true
    });
    
    if (results.matches && results.matches.length > 0) {
      const ids = results.matches.map(match => match.id);
      await index.deleteMany(ids);
      console.log(`Deleted ${ids.length} embeddings for project ${projectId}`);
    }
  } catch (error) {
    console.error('Failed to delete project embeddings:', error);
    throw error;
  }
}

// Generate embedding using OpenRouter (OpenAI compatible)
async function generateEmbedding(text: string): Promise<number[]> {
  try {
    // Use OpenRouter's embedding model
    const response = await fetch('https://openrouter.ai/api/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': 'Product Pilot'
      },
      body: JSON.stringify({
        model: 'openai/text-embedding-3-small',
        input: text.substring(0, 8000) // Limit input size
      })
    });
    
    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.data[0].embedding;
  } catch (error) {
    console.error('Failed to generate embedding:', error);
    // Return zero vector as fallback
    return new Array(1536).fill(0);
  }
}

export { pinecone };
