// Pipeline orchestrator types

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
  tokenUsage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model: string;
  timestamp: Date;
}

export interface PipelineExecuteRequest {
  projectId: string;
  startFromStep?: number;
  stopAfterStep?: number;
}

export interface PipelineRegenerateRequest {
  projectId: string;
  stepNumber: number;
  userOverrides?: Record<string, string>;
}

// SSE event types for pipeline streaming
export type PipelineSSEEvent =
  | { event: "step_start"; data: { stepNumber: number; stepName: string } }
  | { event: "stream"; data: { content: string } }
  | { event: "step_complete"; data: { stepNumber: number; output: StepOutput } }
  | { event: "step_error"; data: { stepNumber: number; error: string } }
  | { event: "pipeline_complete"; data: { projectId: string; completedSteps: number } };

// Step 1 output
export interface ReframedProblem {
  originalProblem: string;
  reframedProblem: string;
  keyInsights: string[];
  scope: {
    inScope: string[];
    outOfScope: string[];
  };
  assumptions: string[];
  constraints: string[];
}

// Step 2 output
export interface ProductVision {
  visionStatement: string;
  missionStatement: string;
  valueProposition: string;
  targetOutcome: string;
  northStarMetric: string;
  principles: string[];
  elevatorPitch: string;
}
