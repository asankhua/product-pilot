// Step 3: Persona Profiles API
// SSE streaming endpoint
// Uses problem statement, reframed problem, and vision as input
// Returns detailed persona profiles

import { NextRequest } from "next/server";
import { streamLLMResponse } from "../../../phase-1-core-lib/llm/llm-router";
import { PERSONAS_SYSTEM_PROMPT, buildPersonasPrompt } from "../../../phase-2-personas-lib/llm/prompts/personas";

export async function POST(req: NextRequest) {
  try {
    const { projectId, problemStatement, reframedProblem, vision, ragContext } = await req.json();

    if (!problemStatement || !reframedProblem || !vision) {
      return new Response(
        JSON.stringify({ error: "Problem statement, reframed problem, and vision are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Build messages for LLM
    const messages = [
      { role: "system", content: PERSONAS_SYSTEM_PROMPT },
      { role: "user", content: buildPersonasPrompt(problemStatement, reframedProblem, vision, ragContext || "") }
    ];

    // Create SSE stream
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Send start event
          controller.enqueue(
            new TextEncoder().encode(
              `data: ${JSON.stringify({ event: "step_start", stepNumber: 3, stepName: "personas" })}\n\n`
            )
          );

          let fullContent = "";

          // Stream LLM response
          for await (const chunk of streamLLMResponse(3, messages, { 
            temperature: 0.7, 
            maxTokens: 4096 
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
              personas: [{
                name: "Primary User",
                role: "Main Persona",
                bio: fullContent.slice(0, 200),
                demographics: { ageRange: "N/A", location: "N/A", education: "N/A", incomeLevel: "N/A" },
                painPoints: ["Parsing error - manual review needed"],
                frustrations: [],
                goals: [],
                motivations: [],
                behaviors: [],
                interests: [],
                techSavviness: "medium",
                quote: "Please review the generated content"
              }]
            };
          }

          // Send complete event with full output
          controller.enqueue(
            new TextEncoder().encode(
              `data: ${JSON.stringify({ 
                event: "step_complete", 
                stepNumber: 3, 
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
        error: "Failed to process personas request",
        details: error instanceof Error ? error.message : "Unknown error"
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
