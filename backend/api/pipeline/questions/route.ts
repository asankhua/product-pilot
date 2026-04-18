// Step 4: Clarifying Questions API
// SSE streaming endpoint
// Uses problem statement, vision, and personas as input
// Returns clarifying questions with AI-suggested answers

import { NextRequest } from "next/server";
import { streamLLMResponse } from "../../../phase-1-core-lib/llm/llm-router";
import { QUESTIONS_SYSTEM_PROMPT, buildQuestionsPrompt } from "../../../phase-2-personas-lib/llm/prompts/questions";

export async function POST(req: NextRequest) {
  try {
    const { projectId, problemStatement, reframedProblem, vision, personas, ragContext } = await req.json();

    if (!problemStatement || !vision || !personas) {
      return new Response(
        JSON.stringify({ error: "Problem statement, vision, and personas are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Build messages for LLM
    const messages = [
      { role: "system", content: QUESTIONS_SYSTEM_PROMPT },
      { role: "user", content: buildQuestionsPrompt(
        problemStatement, 
        reframedProblem || "N/A", 
        vision, 
        JSON.stringify(personas), 
        ragContext || ""
      ) }
    ];

    // Create SSE stream
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Send start event
          controller.enqueue(
            new TextEncoder().encode(
              `data: ${JSON.stringify({ event: "step_start", stepNumber: 4, stepName: "questions" })}\n\n`
            )
          );

          let fullContent = "";

          // Stream LLM response
          for await (const chunk of streamLLMResponse(4, messages, { 
            temperature: 0.5, 
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
              questions: [{
                question: "Failed to parse generated questions. Please review raw content.",
                category: "technical",
                priority: 1,
                aiSuggestedAnswer: fullContent.slice(0, 500),
                relatedPersona: null
              }]
            };
          }

          // Send complete event with full output
          controller.enqueue(
            new TextEncoder().encode(
              `data: ${JSON.stringify({ 
                event: "step_complete", 
                stepNumber: 4, 
                output 
              })}\n\n`
            )
          );

          // Send pipeline complete for Phase 2
          controller.enqueue(
            new TextEncoder().encode(
              `data: ${JSON.stringify({ 
                event: "pipeline_complete", 
                projectId, 
                completedSteps: 4 
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
        error: "Failed to process questions request",
        details: error instanceof Error ? error.message : "Unknown error"
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
