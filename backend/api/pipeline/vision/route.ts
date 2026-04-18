// Step 2: Write Vision API
// SSE streaming endpoint
// Uses reframed problem as input, returns vision, mission, value prop
import { NextRequest } from "next/server";
import { streamLLMResponse } from "../../../phase-1-core-lib/llm/llm-router";
import { VISION_SYSTEM_PROMPT, buildVisionPrompt } from "../../../phase-1-core-lib/llm/prompts/vision";

export async function POST(req: NextRequest) {
  try {
    const { projectId, problemStatement, reframedProblem, keyInsights } = await req.json();

    if (!reframedProblem || !keyInsights) {
      return new Response(
        JSON.stringify({ error: "Reframed problem and key insights are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Build messages for LLM
    const messages = [
      { role: "system", content: VISION_SYSTEM_PROMPT },
      { role: "user", content: buildVisionPrompt(
        problemStatement || "N/A",
        reframedProblem,
        keyInsights
      ) }
    ];

    // Create SSE stream
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Send start event
          controller.enqueue(
            new TextEncoder().encode(
              `data: ${JSON.stringify({ event: "step_start", stepNumber: 2, stepName: "write_vision" })}\n\n`
            )
          );

          let fullContent = "";

          // Stream LLM response
          for await (const chunk of streamLLMResponse(2, messages, { 
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
              visionStatement: fullContent.slice(0, 300),
              missionStatement: "Mission requires manual review",
              valueProposition: "Value prop requires manual review",
              targetOutcome: "Target outcome requires manual review",
              northStarMetric: "North star metric requires manual review",
              principles: ["Principles require manual review"],
              elevatorPitch: fullContent.slice(0, 500)
            };
          }

          // Send complete event with full output
          controller.enqueue(
            new TextEncoder().encode(
              `data: ${JSON.stringify({ 
                event: "step_complete", 
                stepNumber: 2, 
                output 
              })}\n\n`
            )
          );

          // Send pipeline complete for Phase 1
          controller.enqueue(
            new TextEncoder().encode(
              `data: ${JSON.stringify({ 
                event: "pipeline_complete", 
                projectId, 
                completedSteps: 2 
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
