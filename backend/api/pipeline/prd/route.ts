// Step 6: PRD Generation API
// SSE streaming endpoint
// Uses all previous step outputs to generate comprehensive PRD

import { NextRequest } from "next/server";
import { streamLLMResponse } from "../../../phase-1-core-lib/llm/llm-router";
import { PRD_SYSTEM_PROMPT, buildPRDPrompt } from "../../../phase-4-prd-lib/llm/prompts/prd";

export async function POST(req: NextRequest) {
  try {
    const { 
      projectId, 
      problemStatement, 
      reframedProblem, 
      vision, 
      personas, 
      questionsAndAnswers,
      marketAnalysis,
      ragContext 
    } = await req.json();

    if (!problemStatement || !vision || !personas) {
      return new Response(
        JSON.stringify({ error: "Problem statement, vision, and personas are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Build messages for LLM
    const messages = [
      { role: "system", content: PRD_SYSTEM_PROMPT },
      { role: "user", content: buildPRDPrompt(
        problemStatement,
        reframedProblem || "N/A",
        vision,
        JSON.stringify(personas),
        JSON.stringify(questionsAndAnswers || []),
        JSON.stringify(marketAnalysis || {}),
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
              `data: ${JSON.stringify({ event: "step_start", stepNumber: 6, stepName: "prd_generation" })}\n\n`
            )
          );

          let fullContent = "";

          // Stream LLM response
          for await (const chunk of streamLLMResponse(6, messages, { 
            temperature: 0.4, 
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
            // If parsing fails, wrap the raw content in a basic structure
            output = {
              title: "Product Requirements Document",
              sections: {
                overview: fullContent.slice(0, 500),
                problemStatement: "See raw content",
                goals: ["Goal parsing failed - manual review needed"],
                targetUsers: "See raw content",
                proposedSolution: "See raw content",
                scopeInOut: { in: [], out: [] },
                userFlows: [],
                functionalRequirements: [
                  { id: "FR-001", title: "Parse Error", description: "Please review raw output", priority: "P0" }
                ],
                nonFunctionalRequirements: [],
                technicalConsiderations: "See raw content",
                successMetrics: [],
                timeline: "See raw content",
                openQuestions: [],
                appendix: fullContent.slice(0, 2000)
              }
            };
          }

          // Send complete event with full output
          controller.enqueue(
            new TextEncoder().encode(
              `data: ${JSON.stringify({ 
                event: "step_complete", 
                stepNumber: 6, 
                output 
              })}\n\n`
            )
          );

          // Send pipeline complete for Phase 4
          controller.enqueue(
            new TextEncoder().encode(
              `data: ${JSON.stringify({ 
                event: "pipeline_complete", 
                projectId, 
                completedSteps: 6 
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
        error: "Failed to process PRD generation request",
        details: error instanceof Error ? error.message : "Unknown error"
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
