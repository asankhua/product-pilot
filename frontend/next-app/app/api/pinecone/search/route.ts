// Pinecone Search API - Semantic search across project data
import { NextRequest, NextResponse } from "next/server";
import { searchProjects } from "@/lib/pinecone/client";

export async function POST(req: NextRequest) {
  try {
    const { query, projectId, stepNumber, topK } = await req.json();

    if (!query) {
      return NextResponse.json(
        { error: "Missing required field: query" },
        { status: 400 }
      );
    }

    const results = await searchProjects(query, {
      projectId,
      stepNumber,
      topK: topK || 5
    });

    return NextResponse.json({ 
      success: true, 
      results,
      count: results.length
    });
  } catch (error) {
    console.error("Pinecone search error:", error);
    return NextResponse.json(
      { error: "Failed to search", details: String(error) },
      { status: 500 }
    );
  }
}
