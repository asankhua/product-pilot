// Step 8: Prioritization & Roadmap - Prompt Template

export const PRIORITIZATION_SYSTEM_PROMPT = `You are an expert Product Manager AI assistant specializing in backlog prioritization and roadmap planning. Your task is to score user stories using the RICE framework and organize them into a phased roadmap.

RICE Framework:
- Reach: How many users will this impact per quarter? (number)
- Impact: How much will it impact each user? (0.25=minimal, 0.5=low, 1=medium, 2=high, 3=massive)
- Confidence: How confident are we in the estimates? (100%, 80%, 50%)
- Effort: How many person-weeks to implement? (number)
- Score = (Reach × Impact × Confidence) / Effort

Roadmap Phases:
- Phase 1 (MVP): Critical + highest RICE stories, 4-6 weeks
- Phase 2 (Growth): High priority enhancements, 4-6 weeks
- Phase 3 (Scale): Advanced features and optimizations, 6-8 weeks

Consider dependencies between stories when assigning sprints.

IMPORTANT: Respond ONLY with valid JSON matching the schema below. No additional text.`;

export const PRIORITIZATION_OUTPUT_SCHEMA = `{
  "prioritizationFramework": "RICE",
  "backlog": [
    {
      "storyTitle": "string - matching story title from Step 7",
      "epicName": "string - parent epic name",
      "riceScore": {
        "reach": 0,
        "impact": 0,
        "confidence": 0,
        "effort": 0,
        "score": 0.0
      },
      "priority": "P0 | P1 | P2 | P3",
      "sprint": "string - e.g., 'Sprint 1' or 'Phase 2 Sprint 3'",
      "dependencies": ["string - story titles this depends on"]
    }
  ],
  "roadmap": {
    "phases": [
      {
        "name": "string - e.g., 'Phase 1: MVP'",
        "duration": "string - e.g., '6 weeks'",
        "goals": ["string - phase goals"],
        "stories": ["string - story titles assigned to this phase"],
        "milestones": ["string - key milestones"]
      }
    ],
    "timeline": "string - overall timeline summary"
  }
}`;

export function buildPrioritizationPrompt(
  userStories: string,
  marketAnalysis: string,
  prd: string,
  ragContext: string
): string {
  return `Score the following user stories using RICE and organize them into a phased roadmap.

USER STORIES:
${userStories}

MARKET CONTEXT:
${marketAnalysis}

PRD TIMELINE & GOALS:
${prd}

${ragContext ? `ADDITIONAL CONTEXT:\n${ragContext}\n` : ""}

Instructions:
1. Score EVERY story with RICE (calculate the score as Reach × Impact × Confidence / Effort)
2. Sort backlog by RICE score descending
3. Assign priorities: P0 (must-have MVP), P1 (important), P2 (nice-to-have), P3 (future)
4. Group into 3 roadmap phases with realistic timelines
5. Identify dependencies between stories
6. Each phase should have clear goals and milestones
7. Consider market urgency from competitive analysis when scoring Impact

Respond with JSON matching this schema:
${PRIORITIZATION_OUTPUT_SCHEMA}`;
}
