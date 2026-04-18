// Step 7: User Stories + Acceptance Criteria - Prompt Template
import { buildTemplateGuidance } from "../../../shared/services/template-service";

export const STORIES_SYSTEM_PROMPT = `You are an expert Product Manager and Scrum Master AI assistant. Your task is to generate user stories with detailed acceptance criteria from a PRD. Follow the User Stories Template structure with Gherkin-style Given-When-Then format.

For each story:
- Use the format: "As a [persona], I want [feature], so that [benefit]"
- Write acceptance criteria in Given-When-Then (GWT) format: "Given [context]\nWhen [action]\nThen [result]"
- Assign story points using Fibonacci scale (1, 2, 3, 5, 8, 13)
- Classify priority as P0 (Critical), P1 (High), P2 (Medium/Low)
- Group stories into logical epics

Story point guidelines:
- 1 point: trivial change, < 2 hours
- 2 points: simple feature, half day
- 3 points: moderate feature, 1-2 days
- 5 points: complex feature, 3-5 days
- 8 points: very complex, 1-2 weeks
- 13 points: epic-level, consider splitting

Each story should have 2-4 acceptance criteria covering happy path and key edge cases.

IMPORTANT: Respond ONLY with valid JSON matching the schema below. No additional text.`;

export const STORIES_OUTPUT_SCHEMA = `{
  "epics": [
    {
      "name": "string - epic name",
      "description": "string - epic description",
      "stories": [
        {
          "title": "string - concise story title",
          "asA": "string - persona name/role",
          "iWant": "string - desired feature/action",
          "soThat": "string - benefit/value",
          "acceptanceCriteria": [
            {
              "given": "string - precondition",
              "when": "string - action",
              "then": "string - expected outcome"
            }
          ],
          "storyPoints": 3,
          "priority": "CRITICAL | HIGH | MEDIUM | LOW",
          "notes": "string - optional implementation notes"
        }
      ]
    }
  ]
}`;

export function buildUserStoriesPrompt(
  prd: string,
  personas: string,
  ragContext: string
): string {
  return `Based on the PRD and personas below, generate user stories grouped by epics.

PRD:
${prd}

PERSONAS:
${personas}

${ragContext ? `ADDITIONAL CONTEXT:\n${ragContext}\n` : ""}

Instructions:
- Create 5-8 epics covering major feature areas from the PRD
- Generate 3-5 stories per epic (15-30 stories total)
- Use specific persona names from the personas list in "asA" field
- Each story needs 2-4 acceptance criteria in Given-When-Then format
- Cover both happy path and key error/edge cases in acceptance criteria
- Story points should reflect relative complexity (use template guidelines)
- P0 = Must Have (MVP), P1 = Should Have, P2 = Could Have

${buildTemplateGuidance("user-stories")}

Respond with JSON matching this schema:
${STORIES_OUTPUT_SCHEMA}`;
}
 