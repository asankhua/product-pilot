// Step 1: Reframe Problem Statement - Prompt Template

export const REFRAME_SYSTEM_PROMPT = `You are an expert Product Manager AI assistant specializing in problem analysis and reframing. Your task is to take a raw problem statement and transform it into a well-structured, actionable problem definition.

You must:
1. Deeply understand the original problem
2. Reframe it using the "How Might We" (HMW) framework
3. Identify key insights that reveal the core issue
4. Define clear scope boundaries (in-scope and out-of-scope)
5. List assumptions and constraints

Be specific, data-driven where possible, and focus on the user's actual pain — not just the surface-level description.

IMPORTANT: Respond ONLY with valid JSON matching the schema below. No additional text.`;

export const REFRAME_OUTPUT_SCHEMA = `{
  "originalProblem": "string - the original problem statement as provided",
  "reframedProblem": "string - reframed as a 'How Might We' question, 2-3 sentences max",
  "keyInsights": ["string - 3-5 key insights derived from the problem analysis"],
  "scope": {
    "inScope": ["string - what this problem includes"],
    "outOfScope": ["string - what is explicitly excluded"]
  },
  "assumptions": ["string - assumptions being made"],
  "constraints": ["string - known constraints or limitations"]
}`;

export function buildReframePrompt(problemStatement: string): string {
  return `Analyze and reframe the following problem statement.

PROBLEM STATEMENT:
${problemStatement}

Respond with JSON matching this schema:
${REFRAME_OUTPUT_SCHEMA}

Think step by step:
1. What is the core user pain?
2. Who is affected most?
3. What is the root cause vs. the symptom?
4. What would success look like?
5. What should be explicitly excluded to keep focus?`;
}

// Few-shot example for improved output quality
export const REFRAME_FEW_SHOT_EXAMPLE = {
  input: "Small business owners struggle to manage their social media presence across multiple platforms, spending too much time on posting and engagement.",
  output: {
    originalProblem: "Small business owners struggle to manage their social media presence across multiple platforms, spending too much time on posting and engagement.",
    reframedProblem: "How might we enable small business owners to maintain an effective multi-platform social media presence in under 30 minutes per day, so they can focus on running their core business while still growing their online audience?",
    keyInsights: [
      "Time is the primary constraint — owners typically spend 2-3 hours daily on social media",
      "Multi-platform management creates cognitive overload and context switching",
      "Engagement (not just posting) is where most time is lost",
      "ROI measurement is unclear, leading to frustration about time investment"
    ],
    scope: {
      inScope: [
        "Multi-platform post scheduling and management",
        "Content suggestion and generation",
        "Basic engagement monitoring and alerts",
        "Performance analytics dashboard"
      ],
      outOfScope: [
        "Full social media agency services",
        "Paid advertising management",
        "E-commerce integration",
        "Influencer marketplace"
      ]
    },
    assumptions: [
      "Business owners have existing social media accounts",
      "They are willing to use a software tool (not outsource entirely)",
      "They value time savings over comprehensive analytics"
    ],
    constraints: [
      "Must work within platform API rate limits",
      "Budget-sensitive audience (SMBs) requires affordable pricing",
      "Content quality must not feel 'automated' to followers"
    ]
  }
};
