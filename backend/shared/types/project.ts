// Project and pipeline step types

export type ProjectStatus = "DRAFT" | "IN_PROGRESS" | "COMPLETED" | "ARCHIVED";
export type StepStatus = "PENDING" | "RUNNING" | "COMPLETED" | "ERROR" | "SKIPPED";

export interface Project {
  id: string;
  userId: string;
  name: string;
  problemStatement: string;
  status: ProjectStatus;
  currentStep: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PipelineStepRecord {
  id: string;
  projectId: string;
  stepNumber: number;
  stepName: string;
  status: StepStatus;
  inputData: Record<string, unknown> | null;
  outputData: Record<string, unknown> | null;
  rawOutput: string | null;
  tokenUsage: TokenUsage | null;
  model: string | null;
  startedAt: Date | null;
  completedAt: Date | null;
  errorMessage: string | null;
  createdAt: Date;
}

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export interface ProjectWithSteps extends Project {
  pipelineSteps: PipelineStepRecord[];
}

export interface CreateProjectInput {
  name: string;
  problemStatement: string;
}

export interface ProjectListItem {
  id: string;
  name: string;
  status: ProjectStatus;
  currentStep: number;
  updatedAt: Date;
}
