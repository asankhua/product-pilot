// PRD types (Step 6)

export interface FunctionalRequirement {
  id: string;
  title: string;
  description: string;
  priority: "P0" | "P1" | "P2";
}

export interface NonFunctionalRequirement {
  id: string;
  title: string;
  description: string;
}

export interface PRDSections {
  overview: string;
  problemStatement: string;
  goals: string[];
  targetUsers: string;
  proposedSolution: string;
  scopeInOut: {
    in: string[];
    out: string[];
  };
  userFlows: string[];
  functionalRequirements: FunctionalRequirement[];
  nonFunctionalRequirements: NonFunctionalRequirement[];
  technicalConsiderations: string;
  successMetrics: Array<{ metric: string; target: string }>;
  timeline: string;
  openQuestions: string[];
  appendix: string;
}

// Step 6 output
export interface PRDOutput {
  title: string;
  sections: PRDSections;
}

export interface PRDRecord {
  id: string;
  projectId: string;
  title: string;
  content: string;
  sections: PRDSections;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}
