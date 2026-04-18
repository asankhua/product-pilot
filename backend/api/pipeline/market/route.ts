// Step 5: Market & Competitive Analysis API
// SSE streaming endpoint with web search integration
// Uses Serper API for Google search, then LLM analysis

import { NextRequest } from "next/server";
import { streamLLMResponse } from "../../../phase-1-core-lib/llm/llm-router";
import { 
  MARKET_SYSTEM_PROMPT, 
  buildMarketAnalysisPrompt,
  buildSearchQueriesPrompt 
} from "../../../phase-3-market-lib/llm/prompts/market-analysis";
import { searchMultiple } from "../../../phase-3-market-lib/external/serper-client";

export async function POST(req: NextRequest) {
  try {
    const { projectId, problemStatement, vision, personas, ragContext } = await req.json();

    if (!problemStatement || !vision) {
      return new Response(
        JSON.stringify({ error: "Problem statement and vision are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Create SSE stream
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Send start event
          controller.enqueue(
            new TextEncoder().encode(
              `data: ${JSON.stringify({ event: "step_start", stepNumber: 5, stepName: "market_analysis" })}\n\n`
            )
          );

          // Step 5a: Generate search queries
          controller.enqueue(
            new TextEncoder().encode(
              `data: ${JSON.stringify({ event: "stream", content: "Generating search queries...\n" })}\n\n`
            )
          );

          const searchQueriesMessages = [
            { role: "system", content: "You are a search query generator. Respond with JSON only." },
            { role: "user", content: buildSearchQueriesPrompt(problemStatement, JSON.stringify(personas || [])) }
          ];

          let queriesContent = "";
          for await (const chunk of streamLLMResponse(5, searchQueriesMessages, { 
            temperature: 0.3, 
            maxTokens: 512 
          })) {
            queriesContent += chunk;
          }

          let searchQueries: string[] = [];
          try {
            const parsed = JSON.parse(queriesContent);
            searchQueries = Array.isArray(parsed) ? parsed : [];
          } catch {
            // Fallback queries
            searchQueries = [
              `${problemStatement.slice(0, 50)} competitors`,
              `${problemStatement.slice(0, 50)} market size`,
              `${problemStatement.slice(0, 50)} industry trends 2026`
            ];
          }

          controller.enqueue(
            new TextEncoder().encode(
              `data: ${JSON.stringify({ event: "stream", content: `Searching: ${searchQueries.join(", ")}\n` })}\n\n`
            )
          );

          // Step 5b: Execute web searches
          let searchResults = "";
          try {
            searchResults = await searchMultiple(searchQueries.slice(0, 4));
            controller.enqueue(
              new TextEncoder().encode(
                `data: ${JSON.stringify({ event: "stream", content: "Analyzing search results...\n" })}\n\n`
              )
            );
          } catch (error) {
            controller.enqueue(
              new TextEncoder().encode(
                `data: ${JSON.stringify({ event: "stream", content: `Search error: ${error instanceof Error ? error.message : "Search unavailable"}\nProceeding with available context...\n` })}\n\n`
              )
            );
          }

          // Step 5c: Analyze with LLM
          const messages = [
            { role: "system", content: MARKET_SYSTEM_PROMPT },
            { role: "user", content: buildMarketAnalysisPrompt(
              problemStatement,
              vision,
              JSON.stringify(personas || []),
              searchResults,
              ragContext || ""
            ) }
          ];

          let fullContent = "";

          for await (const chunk of streamLLMResponse(5, messages, { 
            temperature: 0.3, 
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
            output = {
              marketOverview: {
                marketSize: "Analysis in progress - see raw output",
                growthRate: "N/A",
                trends: ["Parsing error - manual review needed"],
                opportunities: []
              },
              competitors: [],
              competitiveAdvantage: "See raw analysis",
              positioningStrategy: "See raw analysis",
              sources: [],
              rawAnalysis: fullContent.slice(0, 2000)
            };
          }

          // Send complete event with full output
          controller.enqueue(
            new TextEncoder().encode(
              `data: ${JSON.stringify({ 
                event: "step_complete", 
                stepNumber: 5, 
                output 
              })}\n\n`
            )
          );

          // Send pipeline complete for Phase 3
          controller.enqueue(
            new TextEncoder().encode(
              `data: ${JSON.stringify({ 
                event: "pipeline_complete", 
                projectId, 
                completedSteps: 5 
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
        error: "Failed to process market analysis request",
        details: error instanceof Error ? error.message : "Unknown error"
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
