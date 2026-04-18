// RAG Status API
// GET: Get RAG indexing status for a project

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/phase-1-core/lib/db";
import { getRAGStatus } from "@/shared/services/rag-service";

export async function GET(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const { projectId } = params;

    // Get database status
    const ragIndex = await prisma.ragIndex.findUnique({
      where: { projectId },
    });

    // Also check Pinecone directly
    const pineconeStatus = await getRAGStatus(projectId);

    return NextResponse.json({
      database: ragIndex || { status: "PENDING", vectorCount: 0 },
      pinecone: pineconeStatus,
      isReady: ragIndex?.status === "READY" && pineconeStatus.status === "ready",
    });

  } catch (error) {
    console.error("RAG status error:", error);
    return NextResponse.json(
      { 
        error: "Failed to get RAG status",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
