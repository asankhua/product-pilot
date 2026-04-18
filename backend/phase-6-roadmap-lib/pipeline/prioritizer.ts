// Prioritizer - RICE scoring engine for Step 8
//
// RICE = (Reach × Impact × Confidence) / Effort
//
// Reach: estimated users affected per quarter (number)
// Impact: 0.25 (minimal), 0.5 (low), 1 (medium), 2 (high), 3 (massive)
// Confidence: 100%, 80%, 50%
// Effort: person-weeks (number)
//
// Input: User stories (Step 7) + market context (Step 5)
// Output: Scored and sorted backlog with sprint assignments

import type { PipelineContext, StepOutput } from "../../../phase-1-core/lib/pipeline/types";

export interface RICEScore {
  reach: number;
  impact: number;
  confidence: number;
  effort: number;
  score: number;
}

export function calculateRICE(reach: number, impact: number, confidence: number, effort: number): number {
  return (reach * impact * confidence) / effort;
}

export async function prioritizeBacklog(context: PipelineContext): Promise<StepOutput> {
  // TODO: Score stories, sort by RICE, assign to sprints
  throw new Error("Not implemented");
}
