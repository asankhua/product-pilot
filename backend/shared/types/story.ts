// User Story types (Steps 7-8)

export type StoryPriority = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
export type StoryStatus = "BACKLOG" | "TODO" | "IN_PROGRESS" | "DONE";

export interface AcceptanceCriterion {
  given: string;
  when: string;
  then: string;
}

export interface UserStory {
  id?: string;
  projectId?: string;
  epicName: string;
  title: string;
  asA: string;
  iWant: string;
  soThat: string;
  acceptanceCriteria: AcceptanceCriterion[];
  storyPoints: number;
  priority: StoryPriority;
  sprint?: string;
  status: StoryStatus;
  notes?: string;
}

export interface Epic {
  name: string;
  description: string;
  stories: UserStory[];
}

// Step 7 output
export interface UserStoriesOutput {
  epics: Epic[];
}

// RICE scoring for Step 8
export interface RICEScore {
  reach: number;
  impact: number;
  confidence: number;
  effort: number;
  score: number;
}

export interface PrioritizedStory {
  storyTitle: string;
  epicName: string;
  riceScore: RICEScore;
  priority: "P0" | "P1" | "P2" | "P3";
  sprint: string;
  dependencies: string[];
}

export interface RoadmapPhase {
  name: string;
  duration: string;
  goals: string[];
  stories: string[];
  milestones: string[];
}

// Step 8 output
export interface BacklogRoadmapOutput {
  prioritizationFramework: "RICE";
  backlog: PrioritizedStory[];
  roadmap: {
    phases: RoadmapPhase[];
    timeline: string;
  };
}
