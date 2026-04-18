// Pipeline type definitions
// Core interfaces for the step execution engine

export interface PipelineStep {
  stepNumber: number;
  name: string;
  execute(context: PipelineContext): Promise<StepOutput>;
  getPrompt(context: PipelineContext): string;
  validate(output: StepOutput): boolean;
}

export interface PipelineContext {
  projectId: string;
  problemStatement: string;
  previousSteps: Map<number, StepOutput>;
  ragContext: string[];
  userOverrides?: Record<string, string>;
}

export interface StepOutput {
  stepNumber: number;
  stepName: string;
  data: Record<string, unknown>;
  rawText: string;
  tokenUsage: TokenUsage;
  model: string;
  timestamp: Date;
}

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export type StepStatus = "PENDING" | "RUNNING" | "COMPLETED" | "ERROR" | "SKIPPED";

export interface PipelineState {
  projectId: string;
  currentStep: number;
  steps: Array<{
    stepNumber: number;
    stepName: string;
    status: StepStatus;
    output?: StepOutput;
    error?: string;
  }>;
}

export const STEP_NAMES: Record<number, string> = {
  1: "reframe_problem",
  2: "write_vision",
  3: "persona_profiles",
  4: "clarifying_questions",
  5: "market_analysis",
  6: "generate_prd",
  7: "user_stories",
  8: "backlog_roadmap",
  9: "okrs_metrics",
};
