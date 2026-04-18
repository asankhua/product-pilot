// Chat API with RAG
// POST: Send a chat message and get AI response with project context

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/phase-1-core/lib/db";
import { generateRAGResponse } from "@/shared/services/rag-service";
import { queryLLM } from "@/phase-1-core/lib/llm/router";

// POST - Send chat message
export async function POST(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const { projectId } = params;
    const body = await request.json();
    const { message, history = [] } = body;

    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Check if project exists and is indexed
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { ragIndex: true },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    if (project.ragIndex?.status !== "READY") {
      return NextResponse.json(
        { 
          error: "Project not indexed",
          message: "Please index the project before using the chatbot"
        },
        { status: 400 }
      );
    }

    // Get recent chat history from database
    const recentMessages = await prisma.chatMessage.findMany({
      where: { projectId },
      orderBy: { createdAt: "asc" },
      take: 20, // Last 20 messages
    });

    // Format history for RAG service
    const formattedHistory = recentMessages.map(msg => ({
      id: msg.id,
      role: msg.role.toLowerCase() as "user" | "assistant" | "system",
      content: msg.content,
      timestamp: msg.createdAt,
      sources: msg.sources as any,
    }));

    // Generate response with RAG
    const { response, sources } = await generateRAGResponse(
      projectId,
      formattedHistory,
      message,
      async (prompt, systemPrompt) => {
        // Use the LLM router to generate response
        const result = await queryLLM({
          prompt,
          systemPrompt,
          temperature: 0.7,
          maxTokens: 2048,
        });
        return result.text;
      }
    );

    // Save user message to database
    const userMessage = await prisma.chatMessage.create({
      data: {
        projectId,
        role: "USER",
        content: message,
      },
    });

    // Save assistant response to database
    const assistantMessage = await prisma.chatMessage.create({
      data: {
        projectId,
        role: "ASSISTANT",
        content: response,
        sources: sources as any,
      },
    });

    // Update last queried timestamp
    await prisma.ragIndex.update({
      where: { projectId },
      data: { lastQueriedAt: new Date() },
    });

    return NextResponse.json({
      success: true,
      message: {
        id: assistantMessage.id,
        role: "assistant",
        content: response,
        sources: sources.map(s => ({
          text: s.text.substring(0, 200) + "...", // Truncate for UI
          sourceType: s.sourceType,
          sourceTitle: s.sourceTitle,
          score: s.score,
        })),
        createdAt: assistantMessage.createdAt,
      },
    });

  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { 
        error: "Failed to generate response",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

// GET - Get chat history
export async function GET(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const { projectId } = params;

    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // Get chat history
    const messages = await prisma.chatMessage.findMany({
      where: { projectId },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({
      messages: messages.map(msg => ({
        id: msg.id,
        role: msg.role.toLowerCase(),
        content: msg.content,
        sources: msg.sources,
        createdAt: msg.createdAt,
      })),
    });

  } catch (error) {
    console.error("Chat history error:", error);
    return NextResponse.json(
      { 
        error: "Failed to get chat history",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
