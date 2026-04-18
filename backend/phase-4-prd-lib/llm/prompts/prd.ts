// Step 6: PRD Generation - Prompt Template

export const PRD_SYSTEM_PROMPT = `You are an expert Product Manager AI assistant specializing in writing clear, comprehensive Product Requirements Documents (PRDs). You follow the 2026 best practices for PRDs that are both human-readable and AI-agent-compatible.

Your PRD must include 13 sections:
1. Overview - Product name, one-line description, target launch
2. Problem Statement - Evidence-based with data/context
3. Goals & Objectives - 3-5 measurable goals
4. Target Users - Linked to identified personas
5. Proposed Solution - Feature description (3-5 sentences)
6. Scope (In/Out) - What's included and explicitly excluded
7. User Flows - Key user journeys
8. Functional Requirements - With IDs (FR-001) and priorities (P0/P1/P2)
9. Non-Functional Requirements - With IDs (NFR-001)
10. Technical Considerations - Architecture, APIs, constraints
11. Success Metrics - KPIs with target values
12. Timeline - Phased delivery plan
13. Open Questions / Appendix

Be specific, use IDs for requirements, and keep total length to 2-4 pages equivalent.

IMPORTANT: Respond ONLY with valid JSON matching the schema below. No additional text.`;

export const PRD_OUTPUT_SCHEMA = `{
  "title": "string - product name + subtitle",
  "sections": {
    "overview": "string - product overview paragraph",
    "problemStatement": "string - evidence-based problem description",
    "goals": ["string - 3-5 measurable goals"],
    "targetUsers": "string - persona summary with links to Step 3",
    "proposedSolution": "string - 3-5 sentence solution description",
    "scopeInOut": {
      "in": ["string - what's included"],
      "out": ["string - what's excluded"]
    },
    "userFlows": ["string - key user journey descriptions"],
    "functionalRequirements": [
      {"id": "FR-001", "title": "string", "description": "string", "priority": "P0|P1|P2"}
    ],
    "nonFunctionalRequirements": [
      {"id": "NFR-001", "title": "string", "description": "string"}
    ],
    "technicalConsiderations": "string - architecture, API, tech constraints",
    "successMetrics": [{"metric": "string", "target": "string"}],
    "timeline": "string - phased delivery overview",
    "openQuestions": ["string - unresolved questions"],
    "appendix": "string - additional references or context"
  }
}`;

export function buildPRDPrompt(
  problemStatement: string,
  reframedProblem: string,
  vision: string,
  personas: string,
  questionsAndAnswers: string,
  marketAnalysis: string,
  ragContext: string
): string {
  return `Using ALL of the following product context, generate a comprehensive Product Requirements Document.

ORIGINAL PROBLEM:
${problemStatement}

REFRAMED PROBLEM:
${reframedProblem}

PRODUCT VISION:
${vision}

PERSONAS:
${personas}

CLARIFYING QUESTIONS & ANSWERS:
${questionsAndAnswers}

MARKET & COMPETITIVE ANALYSIS:
${marketAnalysis}

${ragContext ? `ADDITIONAL CONTEXT:\n${ragContext}\n` : ""}

Instructions:
- Generate 10-15 functional requirements with IDs (FR-001 to FR-015), prioritized as P0/P1/P2
- Generate 5-8 non-functional requirements (NFR-001 to NFR-008)
- Success metrics should have specific target values
- Scope must clearly delineate in vs out
- Reference specific personas by name in Target Users and User Flows
- Timeline should reflect a realistic phased approach

Respond with JSON matching this schema:
${PRD_OUTPUT_SCHEMA}`;
}
