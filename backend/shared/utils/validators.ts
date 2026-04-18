// Zod validation schemas for all pipeline step outputs
// Used to validate LLM responses before storing in database

import { z } from "zod";

// Step 1: Reframed Problem
export const reframedProblemSchema = z.object({
  originalProblem: z.string(),
  reframedProblem: z.string(),
  keyInsights: z.array(z.string()).min(1),
  scope: z.object({
    inScope: z.array(z.string()),
    outOfScope: z.array(z.string()),
  }),
  assumptions: z.array(z.string()),
  constraints: z.array(z.string()),
});

// Step 2: Product Vision
export const productVisionSchema = z.object({
  visionStatement: z.string(),
  missionStatement: z.string(),
  valueProposition: z.string(),
  targetOutcome: z.string(),
  northStarMetric: z.string(),
  principles: z.array(z.string()).min(1),
  elevatorPitch: z.string(),
});

// Step 3: Persona Profiles
export const personaSchema = z.object({
  name: z.string(),
  role: z.string(),
  bio: z.string(),
  demographics: z.object({
    ageRange: z.string(),
    location: z.string(),
    education: z.string(),
    incomeLevel: z.string(),
  }),
  painPoints: z.array(z.string()).min(1),
  frustrations: z.array(z.string()).min(1),
  goals: z.array(z.string()).min(1),
  motivations: z.array(z.string()).min(1),
  behaviors: z.array(z.string()).min(1),
  interests: z.array(z.string()).min(1),
  techSavviness: z.enum(["low", "medium", "high"]),
  quote: z.string(),
});

export const personaProfilesSchema = z.object({
  personas: z.array(personaSchema).min(2).max(6),
});

// Step 4: Clarifying Questions
export const clarifyingQuestionSchema = z.object({
  question: z.string(),
  category: z.enum(["user_needs", "technical", "business", "scope", "constraints"]),
  priority: z.number().min(1).max(3),
  aiSuggestedAnswer: z.string(),
  relatedPersona: z.string().nullable(),
});

export const clarifyingQuestionsSchema = z.object({
  questions: z.array(clarifyingQuestionSchema).min(5).max(20),
});

// Step 5: Market Analysis
export const competitorSchema = z.object({
  name: z.string(),
  website: z.string(),
  description: z.string(),
  marketShare: z.string(),
  pricing: z.string(),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  features: z.array(z.string()),
  swot: z.object({
    strengths: z.array(z.string()),
    weaknesses: z.array(z.string()),
    opportunities: z.array(z.string()),
    threats: z.array(z.string()),
  }),
});

export const marketAnalysisSchema = z.object({
  marketOverview: z.object({
    marketSize: z.string(),
    growthRate: z.string(),
    trends: z.array(z.string()),
    opportunities: z.array(z.string()),
  }),
  competitors: z.array(competitorSchema).min(2),
  competitiveAdvantage: z.string(),
  positioningStrategy: z.string(),
  sources: z.array(z.object({ title: z.string(), url: z.string() })),
});

// Step 6: PRD
export const prdSchema = z.object({
  title: z.string(),
  sections: z.object({
    overview: z.string(),
    problemStatement: z.string(),
    goals: z.array(z.string()),
    targetUsers: z.string(),
    proposedSolution: z.string(),
    scopeInOut: z.object({ in: z.array(z.string()), out: z.array(z.string()) }),
    userFlows: z.array(z.string()),
    functionalRequirements: z.array(z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
      priority: z.enum(["P0", "P1", "P2"]),
    })),
    nonFunctionalRequirements: z.array(z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
    })),
    technicalConsiderations: z.string(),
    successMetrics: z.array(z.object({ metric: z.string(), target: z.string() })),
    timeline: z.string(),
    openQuestions: z.array(z.string()),
    appendix: z.string(),
  }),
});

// Step 7: User Stories
export const acceptanceCriterionSchema = z.object({
  given: z.string(),
  when: z.string(),
  then: z.string(),
});

export const userStorySchema = z.object({
  title: z.string(),
  asA: z.string(),
  iWant: z.string(),
  soThat: z.string(),
  acceptanceCriteria: z.array(acceptanceCriterionSchema).min(1),
  storyPoints: z.number().min(1).max(13),
  priority: z.enum(["CRITICAL", "HIGH", "MEDIUM", "LOW"]),
  notes: z.string().optional(),
});

export const userStoriesSchema = z.object({
  epics: z.array(z.object({
    name: z.string(),
    description: z.string(),
    stories: z.array(userStorySchema).min(1),
  })).min(1),
});

// Step 8: Backlog & Roadmap
export const backlogRoadmapSchema = z.object({
  prioritizationFramework: z.literal("RICE"),
  backlog: z.array(z.object({
    storyTitle: z.string(),
    epicName: z.string(),
    riceScore: z.object({
      reach: z.number(),
      impact: z.number(),
      confidence: z.number(),
      effort: z.number(),
      score: z.number(),
    }),
    priority: z.enum(["P0", "P1", "P2", "P3"]),
    sprint: z.string(),
    dependencies: z.array(z.string()),
  })),
  roadmap: z.object({
    phases: z.array(z.object({
      name: z.string(),
      duration: z.string(),
      goals: z.array(z.string()),
      stories: z.array(z.string()),
      milestones: z.array(z.string()),
    })),
    timeline: z.string(),
  }),
});

// Step 9: OKRs & Metrics
export const okrsMetricsSchema = z.object({
  okrs: z.array(z.object({
    objective: z.string(),
    quarter: z.string(),
    keyResults: z.array(z.object({
      description: z.string(),
      targetValue: z.string(),
      unit: z.string(),
      currentValue: z.string(),
      confidence: z.enum(["high", "medium", "low"]),
    })).min(1),
  })).min(1),
  successMetrics: z.array(z.object({
    category: z.enum(["acquisition", "activation", "retention", "revenue", "referral"]),
    name: z.string(),
    formula: z.string(),
    target: z.string(),
    frequency: z.enum(["daily", "weekly", "monthly", "quarterly"]),
    dataSource: z.string(),
  })),
  northStarMetric: z.object({
    name: z.string(),
    definition: z.string(),
    target: z.string(),
    rationale: z.string(),
  }),
});

// Map step number to validator
export const STEP_VALIDATORS: Record<number, z.ZodType> = {
  1: reframedProblemSchema,
  2: productVisionSchema,
  3: personaProfilesSchema,
  4: clarifyingQuestionsSchema,
  5: marketAnalysisSchema,
  6: prdSchema,
  7: userStoriesSchema,
  8: backlogRoadmapSchema,
  9: okrsMetricsSchema,
};
