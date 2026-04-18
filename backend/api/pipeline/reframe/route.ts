// Step 1: Reframe Problem Statement API
// SSE streaming endpoint
// Uses problem statement as input, returns reframed problem + insights
import { NextRequest } from "next/server";
import { streamLLMResponse } from "../../../phase-1-core-lib/llm/llm-router";
import { REFRAME_SYSTEM_PROMPT, buildReframePrompt } from "../../../phase-1-core-lib/llm/prompts/reframe";

export async function POST(req: NextRequest) {
  try {
    const { projectId, problemStatement } = await req.json();

    if (!problemStatement) {
      return new Response(
        JSON.stringify({ error: "Problem statement is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Build messages for LLM
    const messages = [
      { role: "system", content: REFRAME_SYSTEM_PROMPT },
      { role: "user", content: buildReframePrompt(problemStatement) }
    ];

    // Create SSE stream
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Send start event
          controller.enqueue(
            new TextEncoder().encode(
              `data: ${JSON.stringify({ event: "step_start", stepNumber: 1, stepName: "reframe_problem" })}\n\n`
            )
          );

          let fullContent = "";

          // Stream LLM response
          for await (const chunk of streamLLMResponse(1, messages, { 
            temperature: 0.7, 
            maxTokens: 2048 
          })) {
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
            output = JSON.parse(fullContent);
          } catch {
            // If parsing fails, wrap the raw content
            output = {
              originalProblem: problemStatement,
              reframedProblem: fullContent.slice(0, 500),
              keyInsights: ["Parsing error - manual review needed"],
              scope: { inScope: [], outOfScope: [] },
              assumptions: [],
              constraints: []
            };
          }

          // Send complete event with full output
          controller.enqueue(
            new TextEncoder().encode(
              `data: ${JSON.stringify({ 
                event: "step_complete", 
                stepNumber: 1, 
                output 
              })}\n\n`
            )
          );

          // Send pipeline complete for Phase 1 Step 1
          controller.enqueue(
            new TextEncoder().encode(
              `data: ${JSON.stringify({ 
                event: "pipeline_complete", 
                projectId, 
                completedSteps: 1 
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
        error: "Failed to process reframe request",
        details: error instanceof Error ? error.message : "Unknown error"
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
