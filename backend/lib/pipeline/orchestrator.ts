// Pipeline Orchestrator - Step sequencing engine
//
// Responsibilities:
//   - Execute steps sequentially (1 → 9)
//   - Load context from previous steps (PostgreSQL + Pinecone RAG)
//   - Route LLM calls via llm-router
//   - Stream responses to client via SSE
//   - Store outputs in PostgreSQL + embed in Pinecone
//   - Handle errors with retry/fallback
//   - Support pause, resume, and step re-generation
//
// Each step implements the PipelineStep interface from types.ts

import type { PipelineStep, PipelineContext, StepOutput } from "./types";

export class PipelineOrchestrator {
  private steps: Map<number, PipelineStep> = new Map();

  registerStep(step: PipelineStep): void {
    this.steps.set(step.stepNumber, step);
  }

  async executeStep(
    stepNumber: number,
    context: PipelineContext
  ): Promise<StepOutput> {
    // TODO: Load context, build prompt, call LLM, validate, store
    throw new Error("Not implemented");
  }

  async executePipeline(
    projectId: string,
    startFromStep: number = 1,
    stopAfterStep: number = 9
  ): AsyncGenerator<{ event: string; data: unknown }> {
    // TODO: Execute steps sequentially, yield SSE events
    throw new Error("Not implemented");
  }

  async regenerateStep(
    projectId: string,
    stepNumber: number,
    userOverrides?: Record<string, string>
  ): Promise<StepOutput> {
    // TODO: Re-execute a single step with optional user context
    throw new Error("Not implemented");
  }
}

export const orchestrator = new PipelineOrchestrator();
