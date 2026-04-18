// Step 2: Write Product Vision - Prompt Template

export const VISION_SYSTEM_PROMPT = `You are an expert Product Manager AI assistant specializing in product strategy and vision. Your task is to craft a compelling product vision based on a reframed problem statement.

You must create:
1. A clear, inspiring vision statement (1-2 sentences)
2. A concise mission statement focused on the "how"
3. A value proposition that articulates differentiation
4. The target outcome (what success looks like)
5. A north star metric that captures core value delivery
6. 3-5 guiding principles for product decisions
7. A 30-second elevator pitch

Be ambitious yet grounded. The vision should be aspirational but achievable within 2-3 years.

IMPORTANT: Respond ONLY with valid JSON matching the schema below. No additional text.`;

export const VISION_OUTPUT_SCHEMA = `{
  "visionStatement": "string - aspirational 1-2 sentence vision",
  "missionStatement": "string - how we achieve the vision, 1 sentence",
  "valueProposition": "string - unique differentiation, 1-2 sentences",
  "targetOutcome": "string - what success looks like in 2-3 years",
  "northStarMetric": "string - single metric capturing core value delivery",
  "principles": ["string - 3-5 guiding principles for product decisions"],
  "elevatorPitch": "string - 30-second pitch (2-3 sentences max)"
}`;

export function buildVisionPrompt(
  problemStatement: string,
  reframedProblem: string,
  keyInsights: string[]
): string {
  return `Based on the following problem analysis, craft a compelling product vision.

ORIGINAL PROBLEM:
${problemStatement}

REFRAMED PROBLEM:
${reframedProblem}

KEY INSIGHTS:
${keyInsights.map((insight, i) => `${i + 1}. ${insight}`).join("\n")}

Respond with JSON matching this schema:
${VISION_OUTPUT_SCHEMA}

Guidelines:
- Vision should inspire but be achievable in 2-3 years
- North star metric should be measurable and directly tied to user value
- Elevator pitch should be understandable by anyone, not just industry insiders
- Principles should help resolve trade-off decisions during development`;
}

export const VISION_FEW_SHOT_EXAMPLE = {
  input: {
    reframedProblem: "How might we enable small business owners to maintain an effective multi-platform social media presence in under 30 minutes per day?",
    keyInsights: [
      "Time is the primary constraint — 2-3 hours daily on social media",
      "Multi-platform management creates cognitive overload",
      "Engagement is where most time is lost"
    ]
  },
  output: {
    visionStatement: "Every small business owner can build a thriving online community without sacrificing the time they need to run their business.",
    missionStatement: "We simplify multi-platform social media management through intelligent automation and AI-powered content assistance, giving business owners their time back.",
    valueProposition: "The only social media tool designed specifically for time-starved small business owners — AI handles the routine so you can focus on the conversations that matter.",
    targetOutcome: "1 million small businesses saving an average of 10 hours per week on social media management while growing their audience 2x faster.",
    northStarMetric: "Weekly Active Business Accounts (businesses that posted to 2+ platforms in the last 7 days)",
    principles: [
      "Time is the most valuable currency — every feature must save more time than it takes to learn",
      "Good enough today beats perfect next week — speed of execution matters",
      "Authenticity over automation — never make a business sound like a robot",
      "Simple defaults, powerful options — work out of the box, customize when needed"
    ],
    elevatorPitch: "We're building an AI social media co-pilot for small businesses. You tell it your brand voice and goals, and it handles scheduling, content suggestions, and engagement prioritization across all your platforms — turning 3 hours of daily social media work into 30 focused minutes."
  }
};
