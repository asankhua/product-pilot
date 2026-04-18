// Chat API - RAG-powered chat with Pinecone context
import { NextRequest, NextResponse } from "next/server";
import { searchProjects } from "@/lib/pinecone/client";
import { routeLLMRequest } from "@/lib/llm/llm-client";

const CHAT_SYSTEM_PROMPT = `You are a helpful Product Management AI assistant for a SPECIFIC project. You have access to this project's data from a product development pipeline.

CRITICAL: You must answer based ONLY on the provided project context. Do NOT use general knowledge, best practices, or generic advice unless explicitly asked.

Your task is to answer the user's question by referencing SPECIFIC data from the provided project context.

Guidelines:
- Answer based ONLY on the provided context - never use generic examples or general statements
- Quote actual values, metrics, names, and data points from the context
- Reference specific steps (e.g., "According to Step 3 data...")
- Use exact project names, persona names, feature names, etc. from the context
- If the context doesn't contain the information, state exactly what data is missing
- Be specific - use numbers, dates, names from the context
- Do NOT provide generic product management advice unless asked
- Do NOT use "typically", "usually", "in general" - only use what's in the context
- Use bullet points or numbered lists when appropriate

Context format includes:
- Step 1: Problem Statement (reframed problem, pain points, problem title)
- Step 2: Vision (vision statement, mission, value proposition, product name)
- Step 3: Personas (specific persona names, roles, characteristics)
- Step 4: Questions & Assumptions (specific questions, priorities)
- Step 5: Market Analysis (specific TAM numbers, competitor names)
- Step 6: PRD (specific feature names, requirements)
- Step 7: User Stories (specific story titles, RICE scores)
- Step 8: Roadmap (specific phase names, timeline)
- Step 9: OKRs (specific objectives, key results, metrics)

Example of GOOD response:
"According to Step 3, the project has 2 personas: 'Alex Chen' (Product Manager) and 'Sarah Kim' (End User). The vision statement from Step 2 is 'To empower small businesses...'"
  
Example of BAD response:
"Typically, product managers should create personas. You might want to consider..."

Respond in a helpful, professional tone, but always be specific to THIS project.`;

export async function POST(req: NextRequest) {
  try {
    const { message, projectId, projectContext } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "Missing required field: message" },
        { status: 400 }
      );
    }

    if (!projectId) {
      return NextResponse.json(
        { error: "Missing required field: projectId" },
        { status: 400 }
      );
    }

    // Search Pinecone for relevant context from this project
    let pineconeResults: any[] = [];
    try {
      pineconeResults = await searchProjects(message, {
        projectId,
        topK: 5
      });
    } catch (searchError) {
      console.error("Pinecone search error (non-critical):", searchError);
      // Continue without Pinecone results - we'll use projectContext instead
    }

    // Build context from Pinecone results
    let pineconeContext = "";
    if (pineconeResults.length > 0) {
      pineconeContext = "\n\n=== Relevant Project Data from Vector Search ===\n\n";
      pineconeResults.forEach((result, i) => {
        pineconeContext += `[${i + 1}] ${result.metadata?.stepName || 'Unknown Step'}:\n`;
        pineconeContext += `${result.metadata?.content || result.content || 'No content'}\n\n`;
      });
    }

    // Build context from provided project data
    let projectDataContext = "";
    if (projectContext) {
      projectDataContext = "\n\n=== Full Project Data ===\n\n";
      
      if (projectContext.phase1Data?.reframe) {
        const reframe = projectContext.phase1Data.reframe;
        projectDataContext += `## Step 1: Problem Statement\n`;
        projectDataContext += `Title: ${reframe.problemTitle || 'N/A'}\n`;
        projectDataContext += `Summary: ${reframe.oneLineSummary || 'N/A'}\n`;
        if (reframe.problem?.description) {
          projectDataContext += `Description: ${reframe.problem.description}\n`;
        }
        if (reframe.problem?.painPoints) {
          projectDataContext += `Pain Points: ${reframe.problem.painPoints}\n`;
        }
        projectDataContext += `\n`;
      }

      if (projectContext.phase1Data?.vision) {
        const vision = projectContext.phase1Data.vision;
        projectDataContext += `## Step 2: Vision\n`;
        projectDataContext += `Vision: ${vision.visionStatement || 'N/A'}\n`;
        projectDataContext += `Mission: ${vision.missionStatement || 'N/A'}\n`;
        projectDataContext += `Value Proposition: ${vision.valueProposition || 'N/A'}\n\n`;
      }

      if (projectContext.phase2Data?.personas?.personas?.length) {
        projectDataContext += `## Step 3: Personas (${projectContext.phase2Data.personas.personas.length})\n`;
        projectContext.phase2Data.personas.personas.forEach((p: any, i: number) => {
          projectDataContext += `${i + 1}. ${p.overview?.name || p.name || 'Unknown'} - ${p.overview?.role || p.role || 'Unknown role'}\n`;
        });
        projectDataContext += `\n`;
      }

      if (projectContext.phase2Data?.questions?.questions?.length) {
        const questions = projectContext.phase2Data.questions.questions;
        const critical = questions.filter((q: any) => q.priority === 'Critical');
        projectDataContext += `## Step 4: Questions (${questions.length} total, ${critical.length} critical)\n`;
        critical.slice(0, 3).forEach((q: any, i: number) => {
          projectDataContext += `${i + 1}. ${q.question}\n`;
        });
        projectDataContext += `\n`;
      }

      if (projectContext.phase3Data?.marketAnalysis) {
        const market = projectContext.phase3Data.marketAnalysis;
        projectDataContext += `## Step 5: Market Analysis\n`;
        if (market.marketOverview?.marketSize?.totalAddressableMarket) {
          projectDataContext += `TAM: ${market.marketOverview.marketSize.totalAddressableMarket}\n`;
        }
        projectDataContext += `\n`;
      }

      if (projectContext.savedSessions?.length) {
        projectDataContext += `## Steps 6-9: Pipeline Outputs\n`;
        
        const prdSession = projectContext.savedSessions.find((s: any) => s.stepNumber === 6 && s.data?.metadata);
        if (prdSession) {
          const prd = prdSession.data;
          projectDataContext += `Step 6 (PRD): ${prd.metadata?.productName || 'PRD completed'}\n`;
        }

        const storiesSession = projectContext.savedSessions.find((s: any) => s.stepNumber === 7 && (Array.isArray(s.data) || s.data?.stories));
        if (storiesSession) {
          const stories = Array.isArray(storiesSession.data) ? storiesSession.data : storiesSession.data.stories;
          projectDataContext += `Step 7 (User Stories): ${stories?.length || 0} stories\n`;
        }

        const roadmapSession = projectContext.savedSessions.find((s: any) => s.stepNumber === 8 && s.data?.phases);
        if (roadmapSession) {
          projectDataContext += `Step 8 (Roadmap): ${roadmapSession.data.phases?.length || 0} phases\n`;
        }

        const okrSession = projectContext.savedSessions.find((s: any) => s.stepNumber === 9 && (s.data?.okr1 || s.data?.northStarDefinition));
        if (okrSession) {
          const okrs = okrSession.data;
          projectDataContext += `Step 9 (OKRs): ${okrs.northStarDefinition || 'OKRs completed'}\n`;
        }
        projectDataContext += `\n`;
      }
    }

    // Combine all context
    const fullContext = pineconeContext + projectDataContext;

    // Build messages array for LLM
    const messages = [
      { role: "system", content: CHAT_SYSTEM_PROMPT },
      { role: "user", content: `Context:\n${fullContext}\n\nQuestion: ${message}` }
    ];

    // Call LLM (using step 0 for chat, which defaults to groq)
    const llmResponse = await routeLLMRequest(0, messages, {
      temperature: 0.7,
      maxTokens: 2000,
      stream: false
    });

    // Parse LLM response
    const responseData = await llmResponse.json();
    const response = responseData.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response."

    // Extract sources for citation
    const sources: string[] = [];
    if (pineconeResults.length > 0) {
      pineconeResults.forEach(result => {
        if (result.metadata?.stepName && !sources.includes(result.metadata.stepName)) {
          sources.push(result.metadata.stepName);
        }
      });
    }

    return NextResponse.json({
      success: true,
      response: response,
      sources: sources.length > 0 ? sources : undefined,
      contextUsed: {
        pineconeResults: pineconeResults.length,
        hasProjectContext: !!projectContext
      }
    });

  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to process chat message", details: String(error) },
      { status: 500 }
    );
  }
}
