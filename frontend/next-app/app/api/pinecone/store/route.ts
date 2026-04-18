// Pinecone Store API - Store project embeddings for RAG
import { NextRequest, NextResponse } from "next/server";
import { storeProjectEmbedding } from "@/lib/pinecone/client";

export async function POST(req: NextRequest) {
  try {
    const { projectId, content, metadata } = await req.json();

    if (!projectId || !content) {
      return NextResponse.json(
        { error: "Missing required fields: projectId, content" },
        { status: 400 }
      );
    }

    await storeProjectEmbedding(projectId, content, {
      projectName: metadata?.projectName || "Unknown",
      stepNumber: metadata?.stepNumber || 0,
      stepName: metadata?.stepName || "Unknown",
      contentType: metadata?.contentType || "step-output"
    });

    return NextResponse.json({ success: true, message: "Embedding stored" });
  } catch (error) {
    console.error("Pinecone store error:", error);
    return NextResponse.json(
      { error: "Failed to store embedding", details: String(error) },
      { status: 500 }
    );
  }
}
