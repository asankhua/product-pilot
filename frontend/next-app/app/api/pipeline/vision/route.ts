// Step 2: Write Product Vision API
// SSE streaming endpoint - Using real LLM
import { NextRequest } from "next/server";
import { routeLLMRequest, streamLLMResponse } from "@/lib/llm/llm-client";

const VISION_SYSTEM_PROMPT = `You are an expert Product Manager AI assistant. Your task is to create a compelling product vision based on the reframed problem.

Create:
1. Vision statement (inspiring, aspirational)
2. Mission statement (what we do)
3. Value proposition (why users should care)
4. Target outcome (measurable goal)
5. North star metric (key success indicator)
6. Guiding principles (3-5 principles)
7. Elevator pitch (30-second summary)

Respond with valid JSON.`;

// Real LLM streaming response
async function* llmStreamResponse(reframedProblem: any): AsyncGenerator<string> {
  const problemContext = typeof reframedProblem === 'string' 
    ? reframedProblem 
    : JSON.stringify(reframedProblem, null, 2);

  const messages = [
    { role: "system", content: VISION_SYSTEM_PROMPT },
    { role: "user", content: `Based on this problem statement, create a compelling product vision:\n\n${problemContext}` }
  ];

  const response = await routeLLMRequest(2, messages, {
    temperature: 0.7,
    maxTokens: 2048,
    stream: true
  });

  yield* streamLLMResponse(2, response);
}

export async function POST(req: NextRequest) {
  try {
    const { projectId, reframedProblem } = await req.json();

    // Create SSE stream
    const stream = new ReadableStream({
      async start(controller) {
        try {
          controller.enqueue(
            new TextEncoder().encode(
              `data: ${JSON.stringify({ event: "step_start", stepNumber: 2, stepName: "write_vision" })}\n\n`
            )
          );

          let fullContent = "";

          for await (const chunk of llmStreamResponse(reframedProblem)) {
            fullContent += chunk;
            controller.enqueue(
              new TextEncoder().encode(
                `data: ${JSON.stringify({ event: "stream", content: chunk })}\n\n`
              )
            );
          }

          // Parse the final JSON output
          let output;
          try {
            const jsonMatch = fullContent.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              output = JSON.parse(jsonMatch[0]);
            } else {
              throw new Error("No JSON found in response");
            }
          } catch {
            // Fallback: wrap the text response
            output = {
              visionStatement: fullContent.substring(0, 200) || "Transforming how users solve this problem",
              missionStatement: "To deliver exceptional value through innovative solutions",
              valueProposition: "Better, faster, simpler",
              targetOutcome: "Significant user improvement",
              northStarMetric: "User satisfaction",
              principles: ["User first", "Simplicity", "Innovation"],
              elevatorPitch: "We make solving this problem effortless.",
              _rawResponse: fullContent
            };
          }

          controller.enqueue(
            new TextEncoder().encode(
              `data: ${JSON.stringify({ 
                event: "step_complete", 
                stepNumber: 2, 
                output 
              })}\n\n`
            )
          );

          controller.close();
        } catch (error) {
          controller.enqueue(
            new TextEncoder().encode(
              `data: ${JSON.stringify({ 
                event: "error", 
                message: error instanceof Error ? error.message : "Unknown error" 
              })}\n\n`
            )
          );
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        error: "Failed to process vision request",
        details: error instanceof Error ? error.message : "Unknown error"
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
