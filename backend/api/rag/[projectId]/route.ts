// RAG Indexing API
// POST: Index all project artifacts for RAG
// DELETE: Delete RAG index for project

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/phase-1-core/lib/db";
import { 
  indexProjectArtifacts, 
  deleteProjectRAG, 
  getRAGStatus 
} from "@/shared/services/rag-service";
import { reindexProject } from "@/shared/services/rag-service";

// POST - Index project artifacts
export async function POST(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const { projectId } = params;
    const body = await request.json();
    const { force = false } = body;

    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        personas: true,
        competitors: true,
        prd: true,
        userStories: true,
        roadmap: true,
        okrs: true,
        ragIndex: true,
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // If already indexed and not forcing, return current status
    if (project.ragIndex?.status === "READY" && !force) {
      return NextResponse.json({
        success: true,
        message: "Project already indexed",
        status: project.ragIndex,
      });
    }

    // Update status to indexing
    await prisma.ragIndex.upsert({
      where: { projectId },
      create: {
        projectId,
        status: "INDEXING",
      },
      update: {
        status: "INDEXING",
        indexedAt: null,
        errorMessage: null,
      },
    });

    // Collect all artifacts
    const artifacts: Array<{
      type: string;
      title: string;
      content: string;
      stepNumber?: number;
    }> = [];

    // Problem Statement (Step 1)
    if (project.problemStatement) {
      artifacts.push({
        type: "problem_statement",
        title: "Problem Statement",
        content: project.problemStatement,
        stepNumber: 1,
      });
    }

    // Personas (Step 3)
    for (const persona of project.personas) {
      const content = `
Name: ${persona.name}
Role: ${persona.role}
Bio: ${persona.bio}
Pain Points: ${persona.painPoints.join(", ")}
Goals: ${persona.goals.join(", ")}
Motivations: ${persona.motivations.join(", ")}
Behaviors: ${persona.behaviors.join(", ")}
Frustrations: ${persona.frustrations.join(", ")}
Interests: ${persona.interests.join(", ")}
${persona.demographics ? `Demographics: ${JSON.stringify(persona.demographics)}` : ""}
`.trim();

      artifacts.push({
        type: "persona",
        title: `Persona: ${persona.name}`,
        content,
        stepNumber: 3,
      });
    }

    // Market Analysis (Step 5)
    for (const competitor of project.competitors) {
      const content = `
Competitor: ${competitor.name}
Website: ${competitor.website || "N/A"}
Strengths: ${competitor.strengths.join(", ")}
Weaknesses: ${competitor.weaknesses.join(", ")}
Market Share: ${competitor.marketShare || "N/A"}
Pricing: ${competitor.pricing || "N/A"}
Features: ${competitor.features.join(", ")}
${competitor.swot ? `SWOT: ${JSON.stringify(competitor.swot)}` : ""}
`.trim();

      artifacts.push({
        type: "market_analysis",
        title: `Competitor: ${competitor.name}`,
        content,
        stepNumber: 5,
      });
    }

    // PRD (Step 6)
    if (project.prd) {
      artifacts.push({
        type: "prd",
        title: project.prd.title || "Product Requirements Document",
        content: project.prd.content,
        stepNumber: 6,
      });
    }

    // User Stories (Step 7)
    for (const story of project.userStories) {
      const content = `
Story: ${story.title}
As a: ${story.asA}
I want: ${story.iWant}
So that: ${story.soThat}
Acceptance Criteria: ${JSON.stringify(story.acceptanceCriteria)}
Story Points: ${story.storyPoints}
Priority: ${story.priority}
Sprint: ${story.sprint || "Backlog"}
Status: ${story.status}
RICE Score: ${story.riceScore || "N/A"}
`.trim();

      artifacts.push({
        type: "user_stories",
        title: `User Story: ${story.title}`,
        content,
        stepNumber: 7,
      });
    }

    // Roadmap (Step 8)
    if (project.roadmap) {
      artifacts.push({
        type: "roadmap",
        title: project.roadmap.title || "Product Roadmap",
        content: `
${project.roadmap.description || ""}

Phases: ${JSON.stringify(project.roadmap.phases, null, 2)}
`.trim(),
        stepNumber: 8,
      });
    }

    // OKRs (Step 9)
    for (const okr of project.okrs) {
      const content = `
Objective: ${okr.objective}
Key Results: ${JSON.stringify(okr.keyResults, null, 2)}
Metrics: ${JSON.stringify(okr.metrics, null, 2)}
Quarter: ${okr.quarter || "N/A"}
Status: ${okr.status}
`.trim();

      artifacts.push({
        type: "okrs",
        title: `OKR: ${okr.objective}`,
        content,
        stepNumber: 9,
      });
    }

    // Index artifacts
    let result;
    if (force && project.ragIndex) {
      // Re-index (delete then index)
      result = await reindexProject({ projectId, artifacts });
    } else {
      result = await indexProjectArtifacts({ projectId, artifacts });
    }

    // Update database with result
    const updatedRagIndex = await prisma.ragIndex.upsert({
      where: { projectId },
      create: {
        projectId,
        status: result.status.toUpperCase() as any,
        vectorCount: result.vectorCount,
        indexedAt: result.status === "ready" ? new Date() : null,
        errorMessage: result.errorMessage,
        indexedArtifacts: {
          problemStatement: !!project.problemStatement,
          personas: project.personas.map(p => p.id),
          competitors: project.competitors.map(c => c.id),
          prd: !!project.prd,
          userStories: project.userStories.map(s => s.id),
          roadmap: !!project.roadmap,
          okrs: project.okrs.map(o => o.id),
        },
      },
      update: {
        status: result.status.toUpperCase() as any,
        vectorCount: result.vectorCount,
        indexedAt: result.status === "ready" ? new Date() : null,
        errorMessage: result.errorMessage,
        indexedArtifacts: {
          problemStatement: !!project.problemStatement,
          personas: project.personas.map(p => p.id),
          competitors: project.competitors.map(c => c.id),
          prd: !!project.prd,
          userStories: project.userStories.map(s => s.id),
          roadmap: !!project.roadmap,
          okrs: project.okrs.map(o => o.id),
        },
        deletedAt: null,
      },
    });

    return NextResponse.json({
      success: result.status === "ready",
      message: result.status === "ready" 
        ? `Successfully indexed ${result.vectorCount} vectors` 
        : result.errorMessage,
      status: updatedRagIndex,
    });

  } catch (error) {
    console.error("RAG indexing error:", error);
    
    // Update status to failed
    await prisma.ragIndex.upsert({
      where: { projectId: params.projectId },
      create: {
        projectId: params.projectId,
        status: "FAILED",
        errorMessage: error instanceof Error ? error.message : "Unknown error",
      },
      update: {
        status: "FAILED",
        errorMessage: error instanceof Error ? error.message : "Unknown error",
      },
    });

    return NextResponse.json(
      { 
        error: "Failed to index project",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete RAG index
export async function DELETE(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const { projectId } = params;

    // Check if project exists
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

    // Delete from Pinecone
    await deleteProjectRAG(projectId);

    // Update database
    await prisma.ragIndex.upsert({
      where: { projectId },
      create: {
        projectId,
        status: "DELETED",
        vectorCount: 0,
        deletedAt: new Date(),
      },
      update: {
        status: "DELETED",
        vectorCount: 0,
        deletedAt: new Date(),
      },
    });

    // Also delete chat messages for this project
    await prisma.chatMessage.deleteMany({
      where: { projectId },
    });

    return NextResponse.json({
      success: true,
      message: "RAG index and chat history deleted successfully",
    });

  } catch (error) {
    console.error("RAG deletion error:", error);
    return NextResponse.json(
      { 
        error: "Failed to delete RAG index",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
