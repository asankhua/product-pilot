// Step 4: Clarifying Questions API
// SSE streaming endpoint - Using real LLM
import { NextRequest } from "next/server";
import { routeLLMRequest, streamLLMResponse } from "@/lib/llm/llm-client";

const QUESTIONS_SYSTEM_PROMPT = `You are an expert Product Manager AI assistant. Generate clarifying questions based on the project context.

Create 8-12 questions across these categories:
- user_needs: Understanding user requirements
- technical: Technical feasibility and constraints
- business: Business model and market considerations
- scope: Project scope clarification
- constraints: Limitations and boundaries

For each question provide:
- The question itself
- Category (user_needs, technical, business, scope, constraints)
- Priority (1-5, where 5 is highest)
- AI-suggested answer based on context
- Related persona (if applicable)

Respond with valid JSON in this format:
{
  "questions": [
    {
      "question": "string",
      "category": "user_needs|technical|business|scope|constraints",
      "priority": 5,
      "aiSuggestedAnswer": "string",
      "relatedPersona": "string or null"
    }
  ]
}`;

interface QuestionTemplate {
  question: string;
  category: "user_needs" | "technical" | "business" | "scope" | "constraints";
  priority: number;
  aiSuggestedAnswer: string;
  relatedPersona: string | null;
}

function generateQuestionsFromContext(projectContext: any): { questions: QuestionTemplate[] } {
  const personas = projectContext?.personas || [];
  
  const persona1 = personas[0]?.overview?.name || "Primary User";
  const persona2 = personas[1]?.overview?.name || "Secondary User";
  const persona1Role = personas[0]?.overview?.role || "User";

  return {
    questions: [
      {
        question: `How does ${persona1} currently solve this problem without our solution?`,
        category: "user_needs",
        priority: 5,
        aiSuggestedAnswer: "Based on the problem statement, users currently use workarounds or alternative solutions that are inefficient. They likely cobble together multiple tools or manual processes.",
        relatedPersona: persona1
      },
      {
        question: `What would make ${persona1} switch from their current solution to ours?`,
        category: "user_needs",
        priority: 5,
        aiSuggestedAnswer: "A compelling value proposition that clearly demonstrates time or cost savings with minimal switching effort. The solution needs to be significantly better (10x) than current alternatives.",
        relatedPersona: persona1
      },
      {
        question: `What technical integrations would be required for ${persona1Role}s to adopt this solution?`,
        category: "technical",
        priority: 4,
        aiSuggestedAnswer: "Key integrations would include existing tools in their workflow, SSO or identity management, and potentially CRM or ERP systems depending on the use case.",
        relatedPersona: persona1
      },
      {
        question: `What is the maximum acceptable learning curve for ${persona1}?`,
        category: "user_needs",
        priority: 4,
        aiSuggestedAnswer: "Given the persona's technical skill level and tool usage patterns, the solution should be learnable within 15-30 minutes with intuitive UX patterns.",
        relatedPersona: persona1
      },
      {
        question: "What is the ideal pricing model for this solution?",
        category: "business",
        priority: 5,
        aiSuggestedAnswer: "A tiered SaaS model with a free tier for individual users, team plans for small groups, and enterprise pricing for larger organizations. Pricing should align with value delivered.",
        relatedPersona: null
      },
      {
        question: "What compliance or regulatory requirements must we consider?",
        category: "constraints",
        priority: 3,
        aiSuggestedAnswer: "Depending on the industry and data handling, potential requirements include GDPR or privacy compliance, SOC2 for enterprise customers, and industry-specific regulations like HIPAA or PCI.",
        relatedPersona: null
      },
      {
        question: "What features are absolutely essential for MVP versus nice-to-have?",
        category: "scope",
        priority: 5,
        aiSuggestedAnswer: "MVP should focus on core value delivery addressing the main problem statement. Nice-to-haves include advanced analytics, integrations, and customization options that can be added post-launch.",
        relatedPersona: null
      },
      {
        question: `How does ${persona2} influence the purchasing decision?`,
        category: "business",
        priority: 4,
        aiSuggestedAnswer: "This persona likely acts as an influencer, budget holder, or end user in the decision process. They care about ROI, efficiency, or compliance and need to see clear evidence of value before approving.",
        relatedPersona: persona2
      },
      {
        question: `What are the main objections ${persona2} would raise?`,
        category: "business",
        priority: 4,
        aiSuggestedAnswer: "Common objections include cost versus benefit analysis, integration complexity, security concerns, change management effort, and uncertainty about adoption rates within their team.",
        relatedPersona: persona2
      },
      {
        question: "What performance or scalability requirements should we plan for?",
        category: "technical",
        priority: 3,
        aiSuggestedAnswer: "Initial target should support reasonable concurrent users with acceptable response time. Architecture should allow horizontal scaling to handle 10x growth without major rewrites.",
        relatedPersona: null
      },
      {
        question: "What alternative solutions are users most likely to compare us against?",
        category: "business",
        priority: 4,
        aiSuggestedAnswer: "Direct competitors include similar tools in the market, indirect alternatives include manual processes or spreadsheets, and the status quo of doing nothing is often the biggest competitor.",
        relatedPersona: null
      },
      {
        question: "What is the timeline for implementation and go-live?",
        category: "constraints",
        priority: 3,
        aiSuggestedAnswer: "MVP development typically takes 8-12 weeks. Beta testing adds 4 weeks. Public launch around month 4-5. This assumes a focused team and clear requirements from the start.",
        relatedPersona: null
      }
    ]
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { projectId, problemTitle, problem, vision, personas } = body;

    console.log("Questions API called:", { projectId, problemTitle, vision, personasCount: personas?.length });

    const projectContext = {
      projectId,
      problemTitle,
      problemDescription: problem?.description,
      vision,
      personas
    };

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Send step start event
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ event: "step_start", stepNumber: 4, stepName: "clarifying_questions" })}\n\n`
            )
          );

          // Generate questions using LLM
          const messages = [
            { role: "system", content: QUESTIONS_SYSTEM_PROMPT },
            { role: "user", content: `Generate clarifying questions based on this project context:\n\n${JSON.stringify(projectContext, null, 2)}` }
          ];

          const response = await routeLLMRequest(4, messages, {
            temperature: 0.7,
            maxTokens: 2048,
            stream: true
          });

          let fullContent = "";

          // Stream LLM response
          for await (const chunk of streamLLMResponse(4, response)) {
            fullContent += chunk;
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ event: "stream", content: chunk })}\n\n`
              )
            );
          }

          // Parse output
          let questionsData;
          try {
            const jsonMatch = fullContent.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              questionsData = JSON.parse(jsonMatch[0]);
            } else {
              throw new Error("No JSON found");
            }
          } catch {
            questionsData = { questions: [], _rawResponse: fullContent };
          }

          // Send step complete event
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ event: "step_complete", stepNumber: 4, output: questionsData })}\n\n`
            )
          );

          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Questions API error:", error);
    return Response.json({ error: "Failed to generate questions" }, { status: 500 });
  }
}
