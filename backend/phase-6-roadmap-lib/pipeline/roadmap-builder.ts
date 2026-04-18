// Roadmap Builder - Phase/milestone generation for Step 8
//
// Input: Prioritized backlog + PRD timeline
// Output: Phased roadmap with milestones
//
// Structure:
//   Phase 1 (MVP): Core features, 4-6 weeks
//   Phase 2 (Growth): Enhanced features, 4-6 weeks
//   Phase 3 (Scale): Advanced features, 6-8 weeks
//
// Each phase: name, duration, goals, assigned stories, milestones, dependencies

import type { PipelineContext, StepOutput } from "../../../phase-1-core/lib/pipeline/types";

export async function buildRoadmap(context: PipelineContext): Promise<StepOutput> {
  // TODO: Group prioritized stories into phases with timelines
  throw new Error("Not implemented");
}
