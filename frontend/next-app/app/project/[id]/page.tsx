// Main pipeline view for a project
// Shows step progress bar + currently active step output
// Streams LLM responses via SSE
// Based on WIREFRAMES.md Screen 4
// PHASE 1 IMPLEMENTED: Steps 1-2 (Reframe Problem + Write Vision)

"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "@/components/sidebar";
import {
  Download,
  Loader2,
  Sparkles,
  Play,
  ChevronRight,
  RefreshCw,
  Edit3,
  Save,
  Eye,
  Trash2,
  FileText,
  FileJson,
  FileCode,
  FileType,
} from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const pipelineSteps = [
  { id: 1, name: "Reframe", label: "1. Problem", description: "Reframe Problem Statement" },
  { id: 2, name: "Vision", label: "2. Vision", description: "Write Product Vision" },
  { id: 3, name: "Persona", label: "3. Personas", description: "Identify & Profile Personas" },
  { id: 4, name: "Question", label: "4. Q&A", description: "Clarifying Questions" },
  { id: 5, name: "Market", label: "5. Market", description: "Market & Competitive Analysis" },
  { id: 6, name: "PRD", label: "6. PRD", description: "Generate PRD" },
  { id: 7, name: "Stories", label: "7. Stories", description: "User Stories" },
  { id: 8, name: "Roadmap", label: "8. Roadmap", description: "Backlog & Roadmap" },
  { id: 9, name: "OKRs", label: "9. OKRs", description: "OKRs & Success Metrics" },
];

interface ProjectPipelinePageProps {
  params: Promise<{ id: string }>;
}

// Types for Phase 1 outputs
// Problem Statement Template Structure (ProductPlan based)
interface ProblemStatement {
  description: string;
  affectedUsers: string;
  painPoints: string;
}

interface ProblemContext {
  rootCauses: string;
  whenItOccurs: string;
  howItManifests: string;
  currentWorkarounds: string;
  existingSolutionFailures: string;
}

interface ProblemScope {
  inScope: string;
  outOfScope: string;
  boundaries: string;
}

interface ProblemMeasurability {
  currentMetric: string;
  targetMetric: string;
  timeframe: string;
  successCriteria: string;
}

interface ProblemImpact {
  businessImpact: string;
  userImpact: string;
  consequences: string;
  benefits: string;
}

interface ProblemValidation {
  supportingData: string;
  userResearch: string;
  marketEvidence: string;
  stakeholderInput: string;
}

interface ProblemConciseFormat {
  targetUser: string;
  whoStatement: string;
  theProblem: string;
  isAProblem: string;
  thatCauses: string;
  unlikeCurrent: string;
  ourSolution: string;
}

interface ReframeOutput {
  problemTitle: string;
  oneLineSummary: string;
  problem: ProblemStatement;
  context: ProblemContext;
  scope: ProblemScope;
  measurability: ProblemMeasurability;
  impact: ProblemImpact;
  validation: ProblemValidation;
  conciseFormat: ProblemConciseFormat;
  nextSteps: string[];
}

interface VisionOutput {
  visionStatement: string;
  missionStatement: string;
  valueProposition: string;
  targetOutcome: string;
  northStarMetric: string;
  principles: string[];
  elevatorPitch: string;
}

// Types for Phase 2 outputs - Product School Persona Template
interface PersonaOverview {
  name: string;
  role: string;
  age: number;
  generation: string;
  location: string;
  quote: string;
}

interface PersonaDemographics {
  personal: {
    gender: string;
    education: string;
    occupation: string;
    incomeLevel: string;
    familyStatus: string;
    livingSituation: string;
  };
  professional: {
    industry: string;
    companySize: string;
    yearsExperience: string;
    technicalSkill: number;
    toolsUsed: string[];
  };
}

interface PersonaPsychographics {
  personalityTraits: string;
  values: string;
  fears: string;
  motivations: string;
  hobbies: string;
  favoriteBrands: string[];
  influencers: string[];
}

interface PersonaUsageProfile {
  patterns: {
    frequency: string;
    sessionDuration: string;
    primaryDevices: string[];
    context: string;
    timeOfDay: string;
  };
  goals: string[];
  painPoints: { title: string; description: string }[];
  needs: string[];
}

interface PersonaJourneyContext {
  currentBehavior: string;
  dayInTheLife: string;
  triggerEvents: string;
  decisionMaking: string;
}

interface PersonaProductFit {
  whyNeedProduct: string;
  howTheyllUseIt: string;
  successMetrics: string;
  objections: string;
}

interface Persona {
  overview: PersonaOverview;
  demographics: PersonaDemographics;
  psychographics?: PersonaPsychographics;
  usageProfile?: PersonaUsageProfile;
  journeyContext?: PersonaJourneyContext;
  productFit?: PersonaProductFit;
}

interface PersonasOutput {
  personas: Persona[];
}

interface Question {
  question: string;
  category: "user_needs" | "technical" | "business" | "scope" | "constraints";
  priority: number;
  aiSuggestedAnswer: string;
  relatedPersona: string | null;
}

interface QuestionsOutput {
  questions: Question[];
}

// Types for Phase 3 outputs - Following ChatPRD Competitive Analysis Template
interface Competitor {
  name: string;
  companyBackground: {
    companyOverview: string;
    productServiceOverview: string;
    leadershipStructure: string;
    financialHealth: string;
    recentDevelopments: string;
  };
  competitorAnalysis: {
    swotAnalysis: {
      strengths: string[];
      weaknesses: string[];
      opportunities: string[];
      threats: string[];
    };
    productComparison: string;
    customerReviews: string;
    innovationTechnology: string;
    marketShareGrowth: string;
  };
  marketPositioning: {
    marketPerception: string;
    marketingPricingStrategy: string;
    customerAcquisition: string;
    geographicDemographic: string;
    brandPartnerships: string;
  };
}

interface MarketAnalysisOutput {
  marketOverview: {
    industrySize: string;
    growthRate: string;
    keyTrends: string[];
    marketMaturity: string;
  };
  competitors: Competitor[];
  competitiveLandscape: {
    marketLeaders: string[];
    emergingPlayers: string[];
    nicheCompetitors: string[];
  };
  ourPositioning: {
    competitiveAdvantage: string;
    marketGap: string;
    differentiationStrategy: string;
  };
}

// Saved session for each step
interface SavedSession {
  id: string;
  stepNumber: number;
  stepName: string;
  data: ReframeOutput | VisionOutput | PersonasOutput | QuestionsOutput | MarketAnalysisOutput | PRDOutput | UserStoriesOutput | RoadmapOutput | OKROutput;
  savedAt: string;
  name?: string;
}

// Types for Phase 4 outputs (PRD)
interface FunctionalRequirement {
  id: string;
  title: string;
  description: string;
  priority: "P0" | "P1" | "P2";
}

interface NonFunctionalRequirement {
  id: string;
  title: string;
  description: string;
}

interface SuccessMetric {
  metric: string;
  target: string;
}

// PRD Output following ChatPRD Template Structure
interface PRDOutput {
  metadata: {
    productName: string;
    authorName: string;
    date: string;
    status: string;
    version: string;
  };
  background: {
    problemStatement: string[];
    marketOpportunity: string[];
    userPersonas: {
      persona1: {
        name: string;
        characteristics: string;
        needs: string;
        challenges: string;
      };
      persona2: {
        name: string;
        characteristics: string;
        needs: string;
        challenges: string;
      };
    };
    visionStatement: string;
    productOrigin: string;
  };
  objectives: {
    smartGoals: {
      specific: string;
      measurable: string;
      achievable: string;
      relevant: string;
      timebound: string;
    };
    kpis: string[];
    qualitativeObjectives: string[];
    strategicAlignment: string;
    riskMitigation: {
      risks: string[];
      strategies: string[];
      contingencies: string[];
    };
  };
  features: {
    coreFeatures: {
      feature1: { name: string; description: string; benefit: string; specs: string };
      feature2: { name: string; description: string; benefit: string; specs: string };
      feature3: { name: string; description: string; benefit: string; specs: string };
    };
    userBenefits: {
      user1: { target: string; benefit: string };
      user2: { target: string; benefit: string };
    };
    technicalSpecifications: string;
    prioritization: {
      p0: { feature: string; rationale: string };
      p1: { feature: string; rationale: string };
      p2: { feature: string; rationale: string };
      p3: { feature: string; rationale: string };
    };
    futureEnhancements: string[];
  };
  userExperience: {
    uiDesign: {
      principles: string;
      visualStyle: string;
      wireframes: string;
    };
    userJourney: {
      onboarding: string;
      coreFlow: string;
      engagement: string;
    };
    usabilityTesting: string[];
    accessibility: string;
    feedbackLoops: string;
  };
  milestones: {
    phases: { activity: string; duration: string; status: string }[];
    criticalPath: string;
    reviewPoints: string[];
    launchPlan: {
      marketing: string;
      training: string;
      support: string;
    };
    postLaunchEvaluation: string;
  };
  technicalRequirements: {
    techStack: {
      frontend: string;
      backend: string;
      database: string;
      cloud: string;
      cicd: string;
    };
    systemArchitecture: string;
    security: string[];
    performance: {
      responseTime: string;
      uptime: string;
      scalability: string;
    };
    integrations: string[];
  };
  successMetrics: {
    primary: string;
    secondary: string;
    reportingCadence: string;
  };
  appendix: {
    glossary: string;
    references: string;
    changeLog: {
      date: string;
      version: string;
      description: string;
      author: string;
    };
  };
}

// User Story Interface
interface UserStory {
  id: string;
  title: string;
  description: string;
  acceptanceCriteria: string[];
  storyPoints: number;
  priority: "P0" | "P1" | "P2" | "P3";
  feature: string;
}

// RICE Score Interface
interface RICEScore {
  storyId: string;
  storyTitle: string;
  description: string;
  reach: number;
  reachType: "EXACT" | "ESTIMATE" | "RANGE";
  impact: number;
  impactType: "QUALITATIVE" | "QUANTITATIVE";
  confidence: number;
  confidenceFactors: string[];
  effort: number;
  effortType: "PERSON_MONTHS" | "STORY_POINTS" | "HOURS";
  riceScore: number;
  riceScoreNormalized: number;
  priority: "P0" | "P1" | "P2" | "P3";
  priorityReason: string;
}

// User Stories Output Interface
interface UserStoriesOutput {
  stories: UserStory[];
  riceScores: RICEScore[];
  summary: {
    totalStories: number;
    totalStoryPoints: number;
    p0Count: number;
    p1Count: number;
    p2Count: number;
    p3Count: number;
    averageRICEScore: number;
  };
  definitionOfReady: string[];
  definitionOfDone: string[];
  recommendations: string[];
}

// Roadmap Output Interface - Matching roadmap-template.ts
interface RoadmapPhase {
  name: string;
  startDate: string;
  endDate: string;
  duration: number; // in weeks
  objectives: string[];
  userStories: {
    title: string;
    description: string;
    priority: string;
    storyPoints: number;
  }[];
  milestones: string[];
  deliverables: string[];
}

interface RoadmapOutput {
  title: string;
  description: string;
  timeframe: {
    startDate: string;
    endDate: string;
    totalWeeks: number;
  };
  phases: RoadmapPhase[];
  summary: {
    totalStories: number;
    totalStoryPoints: number;
    phases: number;
    keyMilestones: string[];
  };
  recommendations: string[];
}

// OKR Output Interface - Matching okr-metrics-template.ts
interface Metric {
  name: string;
  definition: string;
  current: string;
  target: string;
  frequency: "daily" | "weekly" | "monthly" | "quarterly";
}

interface KeyResult {
  description: string;
  current: string;
  target: string;
  status: "on-track" | "at-risk" | "behind";
}

interface OKRSet {
  objective: string;
  keyResults: KeyResult[];
  alignment: string;
  initiatives: string[];
}

interface OKROutput {
  // Metadata
  productName: string;
  quarter: string;
  teamName: string;
  productLead: string;
  lastUpdated: string;

  // North Star Metric
  northStarDefinition: string;
  northStarCurrent: string;
  northStarTarget: string;
  northStarRationale: string;

  // OKRs (3 sets)
  okr1: OKRSet;
  okr2: OKRSet;
  okr3: OKRSet;

  // Metrics by Category
  acquisitionMetrics: Metric[];
  engagementMetrics: Metric[];
  retentionMetrics: Metric[];
  revenueMetrics: Metric[];
  qualityMetrics: Metric[];

  // AARRR Framework
  acquisition: {
    channel: string;
    volume: string;
    cost: string;
  };
  activation: {
    event: string;
    rate: string;
    timeToFirstValue: string;
  };
  retention: {
    cohort: string;
    day7: string;
    day30: string;
  };
  revenue: {
    arpu: string;
    ltv: string;
    mrrArr: string;
  };
  referral: {
    nps: string;
    rate: string;
    viralCoefficient: string;
  };

  // Leading vs Lagging Indicators
  leadingIndicators: {
    indicator: string;
    why: string;
  }[];
  laggingIndicators: {
    indicator: string;
    what: string;
  }[];

  // Review Schedule
  reviewSchedule: {
    weekly: string;
    monthly: string;
    quarterly: string;
  };

  // Metric Ownership
  metricOwners?: {
    metric: string;
    owner: string;
    cadence: string;
    tool: string;
  }[];

  // Risks
  risks: {
    description: string;
    impact: string;
    mitigation: string;
  }[];

  // Recommendations
  recommendations: string[];
}

// Stored Phase 1, 2, 3 data for subsequent phases
interface Phase1Data {
  reframe: ReframeOutput | null;
  vision: VisionOutput | null;
}

interface Phase2Data {
  personas: PersonasOutput | null;
  questions: QuestionsOutput | null;
}

interface Phase3Data {
  marketAnalysis: MarketAnalysisOutput | null;
}

// Consolidated project context for RAG and cross-step reference
interface ProjectContext {
  projectId: string;
  projectName: string;
  // Step 1: Problem Statement (ProductPlan Template)
  problemTitle: string | null;
  oneLineSummary: string | null;
  problem: ProblemStatement | null;
  context: ProblemContext | null;
  scope: ProblemScope | null;
  measurability: ProblemMeasurability | null;
  impact: ProblemImpact | null;
  validation: ProblemValidation | null;
  conciseFormat: ProblemConciseFormat | null;
  nextSteps: string[] | null;
  // Step 2: Vision
  visionStatement: string | null;
  missionStatement: string | null;
  valueProposition: string | null;
  targetOutcome: string | null;
  northStarMetric: string | null;
  principles: string[];
  elevatorPitch: string | null;
  // Step 3: Personas
  personas: Persona[] | null;
  // Step 4: Questions
  questions: Question[] | null;
  // Step 5: Market Analysis
  marketAnalysis: MarketAnalysisOutput | null;
  // Metadata
  lastUpdated: string;
  totalStepsCompleted: number;
  completedSteps: number[];
}

export default function ProjectPipelinePage({ params }: ProjectPipelinePageProps) {
  const { id } = use(params);
  const projectId = id;
  const [currentStep, setCurrentStep] = useState(1);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedContent, setStreamedContent] = useState("");
  const [stepOutput, setStepOutput] = useState<ReframeOutput | VisionOutput | PersonasOutput | QuestionsOutput | MarketAnalysisOutput | PRDOutput | UserStoriesOutput | RoadmapOutput | OKROutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [projectName, setProjectName] = useState("New Project");
  const [problemStatement, setProblemStatement] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectTemplate, setProjectTemplate] = useState("");
  const [projectCreatedAt, setProjectCreatedAt] = useState("");
  const [completedStepsCount, setCompletedStepsCount] = useState(0);
  const [isLoadingProject, setIsLoadingProject] = useState(true);

  // Edit mode state for outputs
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<ReframeOutput | VisionOutput | null>(null);

  // Store Phase 1, 2, 3 data for use in subsequent phases
  const [phase1Data, setPhase1Data] = useState<Phase1Data>({ reframe: null, vision: null });
  const [phase2Data, setPhase2Data] = useState<Phase2Data>({ personas: null, questions: null });
  const [phase3Data, setPhase3Data] = useState<Phase3Data>({ marketAnalysis: null });

  // Track Step 6 (PRD) completion
  const [isPRDComplete, setIsPRDComplete] = useState(false);

  // Track Step 7 (User Stories) completion
  const [isUserStoriesComplete, setIsUserStoriesComplete] = useState(false);

  // Track Step 8 (Roadmap) completion
  const [isRoadmapComplete, setIsRoadmapComplete] = useState(false);

  // Track Step 9 (OKRs) completion
  const [isOKRsComplete, setIsOKRsComplete] = useState(false);

  // Saved results for each step
  const [savedSessions, setSavedSessions] = useState<SavedSession[]>([]);

  // Sync step completion status based on savedSessions
  // Steps are considered complete ONLY if they have saved results
  const syncCompletionStatusWithSavedSessions = (sessions: SavedSession[]) => {
    // Check all 9 steps based on saved sessions
    // Step 1: Reframe - check for problemTitle or reframedProblem
    const hasReframeSaved = sessions.some(s => s.stepNumber === 1 && ("problemTitle" in s.data || "reframedProblem" in s.data));
    
    // Step 2: Vision - check for visionStatement
    const hasVisionSaved = sessions.some(s => s.stepNumber === 2 && "visionStatement" in s.data);
    
    // Step 3: Personas - check for personas array
    const hasPersonasSaved = sessions.some(s => s.stepNumber === 3 && 'personas' in s.data && Array.isArray((s.data as any).personas));
    
    // Step 4: Questions - check for questions array
    const hasQuestionsSaved = sessions.some(s => s.stepNumber === 4 && 'questions' in s.data && Array.isArray((s.data as any).questions));
    
    // Step 5: Market Analysis - check for marketOverview or competitors
    const hasMarketAnalysisSaved = sessions.some(s => s.stepNumber === 5 && ("marketOverview" in s.data || "competitors" in s.data));
    
    // Step 6 (PRD): Check for metadata in savedSessions
    const hasPRDSaved = sessions.some(s => s.stepNumber === 6 && "metadata" in s.data);
    setIsPRDComplete(hasPRDSaved);

    // Step 7 (User Stories): Check for array structure or stories property
    const hasUserStoriesSaved = sessions.some(s => s.stepNumber === 7 && (Array.isArray(s.data) || "stories" in s.data));
    setIsUserStoriesComplete(hasUserStoriesSaved);

    // Step 8 (Roadmap): Check for phases property
    const hasRoadmapSaved = sessions.some(s => s.stepNumber === 8 && "phases" in s.data);
    setIsRoadmapComplete(hasRoadmapSaved);

    // Step 9 (OKRs): Check for okr1, northStarDefinition, or productName
    const hasOKRsSaved = sessions.some(s => s.stepNumber === 9 && ("okr1" in s.data || "northStarDefinition" in s.data || "productName" in s.data));
    setIsOKRsComplete(hasOKRsSaved);

    // Build completed steps array based ONLY on saved sessions
    // This ensures steps are marked complete ONLY if they have saved results
    const completedSteps: number[] = [];
    if (hasReframeSaved) completedSteps.push(1);
    if (hasVisionSaved) completedSteps.push(2);
    if (hasPersonasSaved) completedSteps.push(3);
    if (hasQuestionsSaved) completedSteps.push(4);
    if (hasMarketAnalysisSaved) completedSteps.push(5);
    if (hasPRDSaved) completedSteps.push(6);
    if (hasUserStoriesSaved) completedSteps.push(7);
    if (hasRoadmapSaved) completedSteps.push(8);
    if (hasOKRsSaved) completedSteps.push(9);

    return completedSteps;
  };

  // Build consolidated project context from all step data
  const buildProjectContext = (): ProjectContext => {
    const completedSteps: number[] = [];
    if (phase1Data.reframe) completedSteps.push(1);
    if (phase1Data.vision) completedSteps.push(2);
    if (phase2Data.personas) completedSteps.push(3);
    if (phase2Data.questions) completedSteps.push(4);
    if (phase3Data.marketAnalysis) completedSteps.push(5);
    if (isPRDComplete) completedSteps.push(6);
    if (isUserStoriesComplete) completedSteps.push(7);
    if (isRoadmapComplete) completedSteps.push(8);
    if (isOKRsComplete) completedSteps.push(9);

    const reframe = phase1Data.reframe;

    return {
      projectId,
      projectName,
      // Step 1: Problem Statement (ProductPlan Template)
      problemTitle: reframe?.problemTitle || null,
      oneLineSummary: reframe?.oneLineSummary || null,
      problem: reframe?.problem || null,
      context: reframe?.context || null,
      scope: reframe?.scope || null,
      measurability: reframe?.measurability || null,
      impact: reframe?.impact || null,
      validation: reframe?.validation || null,
      conciseFormat: reframe?.conciseFormat || null,
      nextSteps: reframe?.nextSteps || null,
      // Step 2: Vision
      visionStatement: phase1Data.vision?.visionStatement || null,
      missionStatement: phase1Data.vision?.missionStatement || null,
      valueProposition: phase1Data.vision?.valueProposition || null,
      targetOutcome: phase1Data.vision?.targetOutcome || null,
      northStarMetric: phase1Data.vision?.northStarMetric || null,
      principles: phase1Data.vision?.principles || [],
      elevatorPitch: phase1Data.vision?.elevatorPitch || null,
      // Step 3: Personas
      personas: phase2Data.personas?.personas || null,
      // Step 4: Questions
      questions: phase2Data.questions?.questions || null,
      // Step 5: Market Analysis
      marketAnalysis: phase3Data.marketAnalysis || null,
      // Metadata
      lastUpdated: new Date().toISOString(),
      totalStepsCompleted: completedSteps.length,
      completedSteps,
    };
  };

  // Save project progress to Neon DB
  const saveProjectProgress = async (updates: Partial<{
    currentStep: number;
    phase1Data: Phase1Data;
    phase2Data: Phase2Data;
    phase3Data: Phase3Data;
    prdOutput: PRDOutput | null;
    isPRDComplete: boolean;
    isUserStoriesComplete: boolean;
    isRoadmapComplete: boolean;
    isOKRsComplete: boolean;
    completedSteps: number[];
  }>) => {
    try {
      // Build the consolidated project context
      const projectContext = buildProjectContext();

      await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...updates,
          projectContext,
          lastUpdated: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error("Failed to save project progress:", error);
    }
  };

  // Enter edit mode for current output
  const handleEdit = () => {
    if (stepOutput) {
      // Deep copy to avoid reference issues
      const copiedData = JSON.parse(JSON.stringify(stepOutput));
      setEditData(copiedData);
      setIsEditing(true);
    }
  };

  // Cancel edit mode
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditData(null);
  };

  // Export project data in various formats
  const handleExport = async (format: 'pdf' | 'doc' | 'json' | 'markdown') => {
    try {
      // Build consolidated project data from all saved sessions
      const projectData: Record<string, any> = {
        projectName,
        projectDescription,
        projectTemplate,
        exportedAt: new Date().toISOString(),
        steps: {} as Record<number, any>,
      };

      // Add data from saved sessions
      savedSessions.forEach((session) => {
        projectData.steps[session.stepNumber] = {
          stepName: session.stepName,
          data: session.data,
          savedAt: session.savedAt,
        };
      });

      // Add phase data (Steps 1-5)
      if (phase1Data.reframe) {
        projectData.steps[1] = { stepName: "Reframe Problem", data: phase1Data.reframe };
      }
      if (phase1Data.vision) {
        projectData.steps[2] = { stepName: "Write Product Vision", data: phase1Data.vision };
      }
      if (phase2Data.personas) {
        projectData.steps[3] = { stepName: "Identify Personas", data: phase2Data.personas };
      }
      if (phase2Data.questions) {
        projectData.steps[4] = { stepName: "Clarifying Questions", data: phase2Data.questions };
      }
      if (phase3Data.marketAnalysis) {
        projectData.steps[5] = { stepName: "Market Analysis", data: phase3Data.marketAnalysis };
      }

      switch (format) {
        case 'json':
          exportAsJSON(projectData);
          break;
        case 'markdown':
          exportAsMarkdown(projectData);
          break;
        case 'pdf':
          exportAsPDF(projectData);
          break;
        case 'doc':
          exportAsDOC(projectData);
          break;
      }

      toast.success(`Exported as ${format.toUpperCase()}`, {
        description: `Project data exported successfully.`,
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Export failed', {
        description: 'Failed to export project data.',
      });
    }
  };

  // Export as JSON
  const exportAsJSON = (data: any) => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    downloadFile(blob, `${projectName || 'project'}-export.json`);
  };

  // Export as Markdown
  const exportAsMarkdown = (data: any) => {
    let md = `# ${data.projectName || 'Project Export'}\n\n`;
    md += `**Description:** ${data.projectDescription || 'N/A'}\n\n`;
    md += `**Template:** ${data.projectTemplate || 'N/A'}\n\n`;
    md += `**Exported:** ${new Date(data.exportedAt).toLocaleString()}\n\n`;
    md += `---\n\n`;

    const stepNumbers = Object.keys(data.steps).sort((a, b) => parseInt(a) - parseInt(b));
    
    stepNumbers.forEach((stepNum) => {
      const step = data.steps[parseInt(stepNum)];
      md += `## Step ${stepNum}: ${step.stepName}\n\n`;
      md += formatObjectAsMarkdown(step.data, 0);
      md += `\n---\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown' });
    downloadFile(blob, `${data.projectName || 'project'}-export.md`);
  };

  // Helper to format object as markdown
  const formatObjectAsMarkdown = (obj: any, depth: number): string => {
    if (!obj) return '';
    if (typeof obj !== 'object') return String(obj);
    
    let result = '';
    const indent = '  '.repeat(depth);
    
    if (Array.isArray(obj)) {
      obj.forEach((item, i) => {
        result += `${indent}- ${formatObjectAsMarkdown(item, depth + 1)}\n`;
      });
    } else {
      Object.entries(obj).forEach(([key, value]) => {
        const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        if (typeof value === 'object' && value !== null) {
          result += `${indent}**${formattedKey}:**\n${formatObjectAsMarkdown(value, depth + 1)}\n`;
        } else {
          result += `${indent}**${formattedKey}:** ${value}\n`;
        }
      });
    }
    
    return result;
  };

  // Export as PDF - Opens print dialog for saving as PDF
  const exportAsPDF = (data: any) => {
    // Generate styled HTML content
    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${data.projectName || 'Project Export'}</title>
        <style>
          @media print {
            body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
          }
          body { font-family: Arial, sans-serif; margin: 40px; color: #333; line-height: 1.6; }
          h1 { color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px; font-size: 28px; }
          h2 { color: #475569; margin-top: 30px; font-size: 20px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; }
          h3 { color: #64748b; font-size: 16px; margin-top: 20px; }
          .meta { background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .meta p { margin: 8px 0; }
          .section { margin: 15px 0; }
          .section-title { font-weight: bold; color: #334155; }
          ul { margin: 10px 0; padding-left: 20px; }
          li { margin: 5px 0; }
          .step-container { page-break-inside: avoid; margin-bottom: 20px; }
        </style>
      </head>
      <body>
        <h1>${data.projectName || 'Project Export'}</h1>
        <div class="meta">
          <p><strong>Description:</strong> ${data.projectDescription || 'N/A'}</p>
          <p><strong>Template:</strong> ${data.projectTemplate || 'N/A'}</p>
          <p><strong>Exported:</strong> ${new Date(data.exportedAt).toLocaleString()}</p>
        </div>
    `;

    const stepNumbers = Object.keys(data.steps).sort((a, b) => parseInt(a) - parseInt(b));
    
    stepNumbers.forEach((stepNum) => {
      const step = data.steps[parseInt(stepNum)];
      html += `<div class="step-container">`;
      html += `<h2>Step ${stepNum}: ${step.stepName}</h2>`;
      html += formatObjectAsHTML(step.data, 0);
      html += `</div>`;
    });

    html += '</body></html>';

    // Open in new window and trigger print
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      
      // Wait for content to load then print
      setTimeout(() => {
        printWindow.print();
      }, 500);
      
      toast.success('PDF Export Ready', {
        description: 'Use "Save as PDF" in the print dialog to download.',
      });
    } else {
      toast.error('Export Failed', {
        description: 'Please allow popups to export as PDF.',
      });
    }
  };

  // Helper to format object as HTML - matches UI display
  const formatObjectAsHTML = (obj: any, depth: number = 0): string => {
    if (!obj) return '';
    if (typeof obj !== 'object') {
      return `<p style="margin: 8px 0; line-height: 1.6;">${String(obj)}</p>`;
    }
    
    let result = '';
    
    if (Array.isArray(obj)) {
      // Handle personas array
      if (obj.length > 0 && obj[0]?.name && obj[0]?.role) {
        result += '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px; margin: 16px 0;">';
        obj.forEach((persona) => {
          result += formatPersonaAsHTML(persona);
        });
        result += '</div>';
      } else if (obj.length > 0 && obj[0]?.question) {
        // Handle questions array
        result += '<div style="margin: 16px 0;">';
        obj.forEach((q, idx) => {
          result += formatQuestionAsHTML(q, idx + 1);
        });
        result += '</div>';
      } else if (obj.length > 0 && obj[0]?.title && obj[0]?.acceptanceCriteria) {
        // Handle user stories array
        result += '<div style="margin: 16px 0;">';
        obj.forEach((story) => {
          result += formatUserStoryAsHTML(story);
        });
        result += '</div>';
      } else if (obj.length > 0 && obj[0]?.name && obj[0]?.description) {
        // Handle competitors/features array
        result += '<div style="margin: 16px 0;">';
        obj.forEach((item) => {
          result += formatCompetitorAsHTML(item);
        });
        result += '</div>';
      } else {
        // Generic array
        result += '<ul style="margin: 12px 0; padding-left: 20px;">';
        obj.forEach((item) => {
          result += `<li style="margin: 6px 0; line-height: 1.5;">${formatObjectAsHTML(item, depth + 1)}</li>`;
        });
        result += '</ul>';
      }
    } else {
      // Handle specific object structures
      if (obj.problemTitle || obj.reframedProblem) {
        result += formatReframeOutputAsHTML(obj);
      } else if (obj.visionStatement || obj.elevatorPitch) {
        result += formatVisionOutputAsHTML(obj);
      } else if (obj.marketOverview || obj.competitors) {
        result += formatMarketAnalysisAsHTML(obj);
      } else if (obj.metadata || obj.content) {
        result += formatPRDAsHTML(obj);
      } else if (obj.okr1 || obj.northStarDefinition) {
        result += formatOKRsAsHTML(obj);
      } else if (obj.phases) {
        result += formatRoadmapAsHTML(obj);
      } else {
        // Generic object
        Object.entries(obj).forEach(([key, value]) => {
          if (value === null || value === undefined) return;
          const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
          if (typeof value === 'object' && value !== null) {
            result += `<h3 style="color: #1e40af; font-size: 16px; margin: 16px 0 8px 0; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px;">${formattedKey}</h3>${formatObjectAsHTML(value, depth + 1)}`;
          } else {
            result += `<p style="margin: 8px 0; line-height: 1.6;"><strong style="color: #374151;">${formattedKey}:</strong> ${value}</p>`;
          }
        });
      }
    }
    
    return result;
  };

  // Specific formatters for each output type
  const formatReframeOutputAsHTML = (data: any): string => {
    return `
      <div style="background: #f8fafc; border-radius: 8px; padding: 20px; margin: 16px 0; border-left: 4px solid #3b82f6;">
        <h3 style="color: #1e40af; font-size: 18px; margin: 0 0 12px 0;">Problem Reframe</h3>
        ${data.problemTitle ? `<p style="margin: 8px 0;"><strong>Title:</strong> ${data.problemTitle}</p>` : ''}
        ${data.reframedProblem ? `<p style="margin: 8px 0;"><strong>Reframed Problem:</strong></p><p style="margin: 8px 0; line-height: 1.6;">${data.reframedProblem}</p>` : ''}
        ${data.rootCauses?.length ? `<p style="margin: 8px 0;"><strong>Root Causes:</strong></p><ul style="margin: 8px 0;">${data.rootCauses.map((c: string) => `<li>${c}</li>`).join('')}</ul>` : ''}
        ${data.userImpact ? `<p style="margin: 8px 0;"><strong>User Impact:</strong> ${data.userImpact}</p>` : ''}
        ${data.opportunitySize ? `<p style="margin: 8px 0;"><strong>Opportunity Size:</strong> ${data.opportunitySize}</p>` : ''}
      </div>
    `;
  };

  const formatVisionOutputAsHTML = (data: any): string => {
    return `
      <div style="background: #f0fdf4; border-radius: 8px; padding: 20px; margin: 16px 0; border-left: 4px solid #22c55e;">
        <h3 style="color: #166534; font-size: 18px; margin: 0 0 12px 0;">Product Vision</h3>
        ${data.visionStatement ? `<p style="margin: 8px 0;"><strong>Vision:</strong></p><p style="margin: 8px 0; font-style: italic; line-height: 1.6;">"${data.visionStatement}"</p>` : ''}
        ${data.productName ? `<p style="margin: 8px 0;"><strong>Product Name:</strong> ${data.productName}</p>` : ''}
        ${data.elevatorPitch ? `<p style="margin: 8px 0;"><strong>Elevator Pitch:</strong></p><p style="margin: 8px 0; line-height: 1.6;">${data.elevatorPitch}</p>` : ''}
        ${data.targetAudience ? `<p style="margin: 8px 0;"><strong>Target Audience:</strong> ${data.targetAudience}</p>` : ''}
        ${data.valueProposition ? `<p style="margin: 8px 0;"><strong>Value Proposition:</strong> ${data.valueProposition}</p>` : ''}
        ${data.successMetrics?.length ? `<p style="margin: 8px 0;"><strong>Success Metrics:</strong></p><ul style="margin: 8px 0;">${data.successMetrics.map((m: string) => `<li>${m}</li>`).join('')}</ul>` : ''}
      </div>
    `;
  };

  const formatPersonaAsHTML = (persona: any): string => {
    return `
      <div style="background: #faf5ff; border-radius: 8px; padding: 16px; border: 1px solid #e9d5ff;">
        <h4 style="color: #7c3aed; font-size: 16px; margin: 0 0 8px 0; border-bottom: 2px solid #ddd6fe; padding-bottom: 4px;">${persona.name || 'Persona'}</h4>
        ${persona.role ? `<p style="margin: 4px 0; font-size: 14px; color: #6b7280;"><em>${persona.role}</em></p>` : ''}
        ${persona.bio ? `<p style="margin: 8px 0; line-height: 1.5; font-size: 14px;">${persona.bio}</p>` : ''}
        ${persona.painPoints?.length ? `<p style="margin: 8px 0 4px 0; font-size: 13px; font-weight: bold; color: #dc2626;">Pain Points:</p><ul style="margin: 4px 0; padding-left: 16px; font-size: 13px;">${persona.painPoints.map((p: string) => `<li>${p}</li>`).join('')}</ul>` : ''}
        ${persona.goals?.length ? `<p style="margin: 8px 0 4px 0; font-size: 13px; font-weight: bold; color: #16a34a;">Goals:</p><ul style="margin: 4px 0; padding-left: 16px; font-size: 13px;">${persona.goals.map((g: string) => `<li>${g}</li>`).join('')}</ul>` : ''}
      </div>
    `;
  };

  const formatQuestionAsHTML = (q: any, idx: number): string => {
    return `
      <div style="background: #fff7ed; border-radius: 8px; padding: 12px 16px; margin: 8px 0; border-left: 3px solid #f97316;">
        <p style="margin: 0 0 8px 0; font-weight: 500;"><span style="color: #ea580c; font-weight: bold;">Q${idx}:</span> ${q.question}</p>
        ${q.aiAnswer ? `<p style="margin: 4px 0; font-size: 14px; color: #4b5563;"><strong>AI Answer:</strong> ${q.aiAnswer}</p>` : ''}
        ${q.userAnswer ? `<p style="margin: 4px 0; font-size: 14px; color: #059669;"><strong>User Answer:</strong> ${q.userAnswer}</p>` : ''}
        ${q.category ? `<span style="display: inline-block; background: #fed7aa; color: #9a3412; padding: 2px 8px; border-radius: 12px; font-size: 12px; margin-top: 4px;">${q.category}</span>` : ''}
      </div>
    `;
  };

  const formatCompetitorAsHTML = (comp: any): string => {
    return `
      <div style="background: #f0f9ff; border-radius: 8px; padding: 16px; margin: 8px 0; border: 1px solid #bae6fd;">
        <h4 style="color: #0369a1; font-size: 16px; margin: 0 0 8px 0;">${comp.name || 'Competitor'}</h4>
        ${comp.description ? `<p style="margin: 4px 0; font-size: 14px; line-height: 1.5;">${comp.description}</p>` : ''}
        ${comp.strengths?.length ? `<p style="margin: 8px 0 4px 0; font-size: 13px; color: #16a34a;"><strong>Strengths:</strong> ${comp.strengths.join(', ')}</p>` : ''}
        ${comp.weaknesses?.length ? `<p style="margin: 4px 0; font-size: 13px; color: #dc2626;"><strong>Weaknesses:</strong> ${comp.weaknesses.join(', ')}</p>` : ''}
        ${comp.marketShare ? `<p style="margin: 4px 0; font-size: 13px;"><strong>Market Share:</strong> ${comp.marketShare}</p>` : ''}
      </div>
    `;
  };

  const formatMarketAnalysisAsHTML = (data: any): string => {
    return `
      <div style="background: #f0f9ff; border-radius: 8px; padding: 20px; margin: 16px 0; border-left: 4px solid #0ea5e9;">
        <h3 style="color: #0369a1; font-size: 18px; margin: 0 0 12px 0;">Market Analysis</h3>
        ${data.marketOverview ? `<p style="margin: 8px 0;"><strong>Overview:</strong></p><p style="margin: 8px 0; line-height: 1.6;">${data.marketOverview}</p>` : ''}
        ${data.competitors?.length ? `<h4 style="margin: 16px 0 8px 0; color: #0284c7;">Competitors</h4>${formatObjectAsHTML(data.competitors, 0)}` : ''}
        ${data.trends?.length ? `<p style="margin: 8px 0;"><strong>Market Trends:</strong></p><ul style="margin: 8px 0;">${data.trends.map((t: string) => `<li>${t}</li>`).join('')}</ul>` : ''}
        ${data.opportunities?.length ? `<p style="margin: 8px 0;"><strong>Opportunities:</strong></p><ul style="margin: 8px 0;">${data.opportunities.map((o: string) => `<li>${o}</li>`).join('')}</ul>` : ''}
      </div>
    `;
  };

  const formatPRDAsHTML = (data: any): string => {
    return `
      <div style="background: #fdf4ff; border-radius: 8px; padding: 20px; margin: 16px 0; border-left: 4px solid #c026d3;">
        <h3 style="color: #a21caf; font-size: 18px; margin: 0 0 12px 0;">Product Requirements Document</h3>
        ${data.metadata?.title ? `<h4 style="margin: 8px 0; color: #86198f;">${data.metadata.title}</h4>` : ''}
        ${data.metadata?.version ? `<p style="margin: 4px 0; font-size: 14px; color: #6b7280;">Version: ${data.metadata.version}</p>` : ''}
        ${data.content ? `<div style="margin: 16px 0; line-height: 1.6;">${data.content.replace(/\n/g, '<br/>')}</div>` : ''}
      </div>
    `;
  };

  const formatUserStoryAsHTML = (story: any): string => {
    const riceBadge = story.riceScore ? `<span style="background: #dbeafe; color: #1e40af; padding: 2px 8px; border-radius: 12px; font-size: 12px; margin-left: 8px;">RICE: ${story.riceScore}</span>` : '';
    return `
      <div style="background: #f0fdf4; border-radius: 8px; padding: 16px; margin: 8px 0; border: 1px solid #bbf7d0;">
        <h4 style="color: #166534; font-size: 15px; margin: 0 0 8px 0;">${story.title || 'User Story'}${riceBadge}</h4>
        ${story.epicName ? `<p style="margin: 4px 0; font-size: 13px; color: #6b7280;">Epic: ${story.epicName}</p>` : ''}
        <p style="margin: 8px 0; line-height: 1.5;"><strong>As a</strong> ${story.asA || '...'}, <strong>I want</strong> ${story.iWant || '...'} <strong>so that</strong> ${story.soThat || '...'}</p>
        ${story.acceptanceCriteria?.length ? `<p style="margin: 8px 0 4px 0; font-size: 13px; font-weight: bold;">Acceptance Criteria:</p><ul style="margin: 4px 0; padding-left: 20px; font-size: 13px;">${story.acceptanceCriteria.map((ac: string) => `<li>${ac}</li>`).join('')}</ul>` : ''}
        ${story.storyPoints ? `<p style="margin: 8px 0; font-size: 13px;"><strong>Story Points:</strong> ${story.storyPoints}</p>` : ''}
      </div>
    `;
  };

  const formatRoadmapAsHTML = (data: any): string => {
    return `
      <div style="background: #fffbeb; border-radius: 8px; padding: 20px; margin: 16px 0; border-left: 4px solid #f59e0b;">
        <h3 style="color: #b45309; font-size: 18px; margin: 0 0 12px 0;">Product Roadmap</h3>
        ${data.phases?.map((phase: any) => `
          <div style="background: white; border-radius: 6px; padding: 12px; margin: 12px 0; border: 1px solid #fcd34d;">
            <h4 style="color: #d97706; margin: 0 0 8px 0;">${phase.name || 'Phase'}</h4>
            ${phase.duration ? `<p style="margin: 4px 0; font-size: 13px; color: #6b7280;">Duration: ${phase.duration}</p>` : ''}
            ${phase.milestones?.length ? `<ul style="margin: 8px 0; padding-left: 20px;">${phase.milestones.map((m: string) => `<li style="margin: 4px 0;">${m}</li>`).join('')}</ul>` : ''}
          </div>
        `).join('') || ''}
      </div>
    `;
  };

  const formatOKRsAsHTML = (data: any): string => {
    return `
      <div style="background: #eff6ff; border-radius: 8px; padding: 20px; margin: 16px 0; border-left: 4px solid #3b82f6;">
        <h3 style="color: #1e40af; font-size: 18px; margin: 0 0 12px 0;">Objectives & Key Results</h3>
        ${data.northStarDefinition ? `<div style="background: #dbeafe; padding: 12px; border-radius: 6px; margin: 12px 0;"><p style="margin: 0; font-weight: 500; color: #1e40af;">North Star: ${data.northStarDefinition}</p></div>` : ''}
        ${data.okr1 ? formatSingleOKRAsHTML(data.okr1, 1) : ''}
        ${data.okr2 ? formatSingleOKRAsHTML(data.okr2, 2) : ''}
        ${data.okr3 ? formatSingleOKRAsHTML(data.okr3, 3) : ''}
      </div>
    `;
  };

  const formatSingleOKRAsHTML = (okr: any, idx: number): string => {
    if (!okr?.objective) return '';
    return `
      <div style="background: white; border-radius: 6px; padding: 12px; margin: 12px 0; border: 1px solid #bfdbfe;">
        <h4 style="color: #1d4ed8; margin: 0 0 8px 0; font-size: 15px;">OKR ${idx}: ${okr.objective}</h4>
        ${okr.keyResults?.length ? `<ul style="margin: 8px 0; padding-left: 20px;">${okr.keyResults.map((kr: string) => `<li style="margin: 4px 0;">${kr}</li>`).join('')}</ul>` : ''}
        ${okr.metrics?.length ? `<p style="margin: 8px 0; font-size: 13px; color: #6b7280;"><strong>Metrics:</strong> ${okr.metrics.join(', ')}</p>` : ''}
      </div>
    `;
  };

  // Export as DOC - Generate Word-compatible MHTML document
  const exportAsDOC = (data: any) => {
    const stepNumbers = Object.keys(data.steps).sort((a, b) => parseInt(a) - parseInt(b));
    
    // Build content sections
    let contentSections = '';
    stepNumbers.forEach((stepNum) => {
      const step = data.steps[parseInt(stepNum)];
      contentSections += formatObjectAsWordHTML(step.data, stepNum, step.stepName);
    });

    // Create MHTML (MIME HTML) format that Word can open
    const mhtml = `MIME-Version: 1.0
Content-Type: multipart/related; boundary="----=_NextPart_000_0000_01C00000.00000000"

------=_NextPart_000_0000_01C00000.00000000
Content-Type: text/html; charset="utf-8"
Content-Transfer-Encoding: quoted-printable

<html xmlns:o=3D"urn:schemas-microsoft-com:office:office" xmlns:w=3D"urn:schemas-microsoft-com:office:word" xmlns=3D"http://www.w3.org/TR/REC-html40">
<head>
<meta charset=3D"utf-8">
<meta name=3D"ProgId" content=3D"Word.Document">
<meta name=3D"Generator" content=3D"Microsoft Word 15">
<meta name=3D"Originator" content=3D"Microsoft Word 15">
<title>${escapeHtml(data.projectName || 'Project Export')}</title>
<!--[if gte mso 9]>
<xml>
<w:WordDocument>
<w:View>Print</w:View>
<w:Zoom>100</w:Zoom>
<w:DoNotOptimizeForBrowser/>
</w:WordDocument>
</xml>
<![endif]-->
<style>
<!--
body { font-family: "Calibri", sans-serif; font-size: 11pt; line-height: 1.5; }
h1 { font-size: 18pt; color: #2E74B5; margin-bottom: 12pt; border-bottom: 1pt solid #2E74B5; padding-bottom: 6pt; }
h2 { font-size: 14pt; color: #2E74B5; margin-top: 18pt; margin-bottom: 6pt; }
h3 { font-size: 12pt; color: #1F4E79; margin-top: 12pt; margin-bottom: 6pt; }
p { margin: 6pt 0; }
.meta { background: #F2F2F2; padding: 12pt; margin: 12pt 0; border: 1pt solid #D9D9D9; }
.section { margin: 8pt 0; }
ul { margin-left: 24pt; }
li { margin: 3pt 0; }
-->
</style>
</head>
<body>
<h1>${escapeHtml(data.projectName || 'Project Export')}</h1>
<div class=3D"meta">
<p><b>Description:</b> ${escapeHtml(data.projectDescription || 'N/A')}</p>
<p><b>Template:</b> ${escapeHtml(data.projectTemplate || 'N/A')}</p>
<p><b>Exported:</b> ${new Date(data.exportedAt).toLocaleString()}</p>
</div>
${contentSections}
</body>
</html>

------=_NextPart_000_0000_01C00000.00000000--
`;

    const blob = new Blob([mhtml], { type: 'application/msword' });
    downloadFile(blob, `${data.projectName || 'project'}-export.doc`);
    
    toast.success('DOC Export Complete', {
      description: 'Word document downloaded successfully.',
    });
  };

  // Helper to escape HTML for MHTML format
  const escapeHtml = (text: string): string => {
    if (!text) return '';
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  // Helper to format object as Word-compatible HTML - matches UI display
  const formatObjectAsWordHTML = (obj: any, stepNum: string, stepName: string): string => {
    if (!obj) return '';
    
    let result = `<h2>Step ${stepNum}: ${escapeHtml(stepName)}</h2>`;
    
    // Use the same formatters as PDF but with Word-compatible escaped HTML
    const htmlContent = formatObjectAsHTML(obj, 0);
    
    // Convert the HTML to Word-compatible format (escape special chars)
    const wordCompatibleHtml = htmlContent
      .replace(/style="[^"]*"/g, (match) => {
        // Keep styles but ensure proper escaping for Word
        return match.replace(/=/g, '=3D');
      })
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/=3D/g, '=');
    
    // Unescape for Word MHTML format
    result += wordCompatibleHtml
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&');
    
    return result;
  };

  // Helper to download file
  const downloadFile = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Save edited output or current output
  const handleSaveEdit = async (dataToSave?: ReframeOutput | VisionOutput) => {
    const data = dataToSave || editData || stepOutput;
    if (!data) return;

    setStepOutput(data);

    // Update phase data based on current step
    let completedSteps: number[] = [];
    if (phase1Data.reframe) completedSteps.push(1);
    if (phase1Data.vision) completedSteps.push(2);
    if (phase2Data.personas) completedSteps.push(3);
    if (phase2Data.questions) completedSteps.push(4);
    if (phase3Data.marketAnalysis) completedSteps.push(5);
    if (isPRDComplete) completedSteps.push(6);
    if (isUserStoriesComplete) completedSteps.push(7);
    if (isRoadmapComplete) completedSteps.push(8);
    if (isOKRsComplete) completedSteps.push(9);

    // Build completed steps by adding current step
    const stepCompletedSteps = [...new Set([...completedSteps, currentStep])];

    if (currentStep === 1 && "problemTitle" in data) {
      const newPhase1Data = { ...phase1Data, reframe: data as ReframeOutput };
      setPhase1Data(newPhase1Data);
      await saveProjectProgress({ currentStep, phase1Data: newPhase1Data, completedSteps: stepCompletedSteps });
    } else if (currentStep === 2 && "visionStatement" in data) {
      const newPhase1Data = { ...phase1Data, vision: data as VisionOutput };
      setPhase1Data(newPhase1Data);
      await saveProjectProgress({ currentStep, phase1Data: newPhase1Data, completedSteps: stepCompletedSteps });
    } else if (currentStep === 3 && "personas" in data) {
      const newPhase2Data = { ...phase2Data, personas: data as PersonasOutput };
      setPhase2Data(newPhase2Data);
      await saveProjectProgress({ currentStep, phase2Data: newPhase2Data, completedSteps: stepCompletedSteps });
    } else if (currentStep === 4 && "questions" in data) {
      const newPhase2Data = { ...phase2Data, questions: data as QuestionsOutput };
      setPhase2Data(newPhase2Data);
      await saveProjectProgress({ currentStep, phase2Data: newPhase2Data, completedSteps: stepCompletedSteps });
    } else if (currentStep === 5 && "marketOverview" in data) {
      const newPhase3Data = { marketAnalysis: data as MarketAnalysisOutput };
      setPhase3Data(newPhase3Data);
      await saveProjectProgress({ currentStep, phase3Data: newPhase3Data, completedSteps: stepCompletedSteps });
    } else if (currentStep === 6 && "metadata" in data) {
      // PRD data is stored directly, save completion status
      setIsPRDComplete(true);
      await saveProjectProgress({ currentStep, isPRDComplete: true, completedSteps: stepCompletedSteps });
    } else if (currentStep === 7 && (Array.isArray(data) || "stories" in data)) {
      // User Stories data is stored directly, save completion status
      // Handle both array root structure AND object with stories property
      setIsUserStoriesComplete(true);
      await saveProjectProgress({ currentStep, isUserStoriesComplete: true, completedSteps: stepCompletedSteps });
    } else if (currentStep === 8 && "phases" in data) {
      // Roadmap data is stored directly, save completion status
      setIsRoadmapComplete(true);
      await saveProjectProgress({ currentStep, isRoadmapComplete: true, completedSteps: stepCompletedSteps });
    } else if (currentStep === 9 && ("okr1" in data || "northStarDefinition" in data || "productName" in data)) {
      // OKRs data is stored directly, save completion status
      // Check for multiple possible fields that indicate OKR data structure
      setIsOKRsComplete(true);
      await saveProjectProgress({ currentStep, isOKRsComplete: true, completedSteps: stepCompletedSteps });
    }

    // Save to saved results
    const currentStepInfo = pipelineSteps.find(s => s.id === currentStep);
    const newSession: SavedSession = {
      id: Date.now().toString(),
      stepNumber: currentStep,
      stepName: currentStepInfo?.name || `Step ${currentStep}`,
      data: JSON.parse(JSON.stringify(data)), // Deep copy
      savedAt: new Date().toISOString(),
      name: `${currentStepInfo?.description || `Step ${currentStep}`} - ${new Date().toLocaleString()}`,
    };

    const updatedSessions = [...savedSessions, newSession];
    setSavedSessions(updatedSessions);

    // Save sessions to Neon DB
    try {
      await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ savedSessions: updatedSessions }),
      });
    } catch (error) {
      console.error("Failed to save sessions:", error);
    }

    // Sync completion status based on saved sessions
    // This ensures step is marked complete since we just saved results
    const syncedCompletedSteps = syncCompletionStatusWithSavedSessions(updatedSessions);
    await saveProjectProgress({ completedSteps: syncedCompletedSteps });

    // Store embedding in Pinecone for RAG
    try {
      const content = JSON.stringify(data);
      await fetch("/api/pinecone/store", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          content,
          metadata: {
            projectName,
            stepNumber: currentStep,
            stepName: currentStepInfo?.name || `Step ${currentStep}`,
            contentType: "step-output"
          }
        })
      });
    } catch (error) {
      console.error("Failed to store embedding:", error);
      // Non-critical error, don't block the save
    }

    // Show success toast
    toast.success(`Step ${currentStep} saved successfully!`, {
      description: `${currentStepInfo?.description || `Step ${currentStep}`} has been saved to the database.`,
      duration: 3000,
    });

    // Only exit edit mode if we were editing
    if (isEditing) {
      setIsEditing(false);
      setEditData(null);
    }
  };

  // Load saved session
  const handleLoadSavedSession = (session: SavedSession) => {
    console.log("Loading saved session:", session.stepNumber, session.data);
    
    // Clear any streaming state
    setIsStreaming(false);
    setStreamedContent("");
    setError(null);
    setIsEditing(false);
    setEditData(null);

    // Set the step and output
    setCurrentStep(session.stepNumber);
    setStepOutput(session.data as ReframeOutput | VisionOutput | PersonasOutput | QuestionsOutput | MarketAnalysisOutput | PRDOutput);

    // Also update phase data if it's Step 1, 2, or 3
    // Step 1: Check for new format (problemTitle) or old format (reframedProblem)
    if (session.stepNumber === 1 && ("problemTitle" in session.data || "reframedProblem" in session.data)) {
      console.log("Loading Step 1 saved session");
      const newPhase1Data = { ...phase1Data, reframe: session.data as ReframeOutput };
      setPhase1Data(newPhase1Data);
    } else if (session.stepNumber === 2 && "visionStatement" in session.data) {
      console.log("Loading Step 2 saved session");
      const newPhase1Data = { ...phase1Data, vision: session.data as VisionOutput };
      setPhase1Data(newPhase1Data);
    } else if (session.stepNumber === 3 && "personas" in session.data) {
      console.log("Loading Step 3 saved session");
      const newPhase2Data = { ...phase2Data, personas: session.data as PersonasOutput };
      setPhase2Data(newPhase2Data);
    } else if (session.stepNumber === 4 && "questions" in session.data) {
      console.log("Loading Step 4 saved session");
      const newPhase2Data = { ...phase2Data, questions: session.data as QuestionsOutput };
      setPhase2Data(newPhase2Data);
    } else if (session.stepNumber === 5 && "marketOverview" in session.data) {
      console.log("Loading Step 5 saved session");
      const newPhase3Data = { marketAnalysis: session.data as MarketAnalysisOutput };
      setPhase3Data(newPhase3Data);
    } else if (session.stepNumber === 6 && "metadata" in session.data) {
      console.log("Loading Step 6 saved session");
      setIsPRDComplete(true);
    } else {
      console.log("Session data keys:", Object.keys(session.data));
    }

    // Scroll to top to show the output
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Delete saved session
  const handleDeleteSavedSession = async (sessionId: string) => {
    const updatedSessions = savedSessions.filter(s => s.id !== sessionId);
    setSavedSessions(updatedSessions);

    // Sync step completion status based on remaining saved sessions
    // This will mark the step as not complete since its saved results were deleted
    const syncedCompletedSteps = syncCompletionStatusWithSavedSessions(updatedSessions);
    await saveProjectProgress({ completedSteps: syncedCompletedSteps });

    // Update Neon DB
    try {
      await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ savedSessions: updatedSessions, completedSteps: syncedCompletedSteps }),
      });
    } catch (error) {
      console.error("Failed to delete saved session:", error);
    }
  };

  // Continue to next step
  const handleContinueToNext = () => {
    if (currentStep === 1 && phase1Data.reframe) {
      setCurrentStep(2);
      startStep2(phase1Data.reframe);
    }
  };

  // Fetch project data from API on mount
  useEffect(() => {
    async function loadProject() {
      try {
        const response = await fetch(`/api/projects/${projectId}`);
        const data = await response.json();
        
        if (data.success && data.project) {
          const project = data.project;
          setProjectName(project.name || "New Project");
          setProblemStatement(project.problemStatement || "");
          setProjectDescription(project.description || "");
          setProjectTemplate(project.template || "");
          setProjectCreatedAt(project.createdAt || "");
          setCompletedStepsCount(project.completedSteps?.length || 0);

          // Restore saved progress
          if (project.currentStep) {
            setCurrentStep(project.currentStep);
          }
          if (project.phase1Data) {
            setPhase1Data(project.phase1Data);
            // If we have phase 1 data, show the last completed step output
            if (project.phase1Data.vision) {
              setStepOutput(project.phase1Data.vision);
            } else if (project.phase1Data.reframe) {
              setStepOutput(project.phase1Data.reframe);
            }
          }
          if (project.phase2Data) {
            setPhase2Data(project.phase2Data);
            // If we have personas data and current step is 3, show it
            if (project.currentStep === 3 && project.phase2Data.personas) {
              setStepOutput(project.phase2Data.personas);
            }
          }
          if (project.phase3Data) {
            setPhase3Data(project.phase3Data);
          }

          // Restore saved sessions
          if (project.savedSessions) {
            setSavedSessions(project.savedSessions);
            // Sync completion status based on saved sessions
            // This ensures steps are marked complete ONLY if they have saved results
            syncCompletionStatusWithSavedSessions(project.savedSessions);
          } else {
            // No saved sessions - mark all steps as not complete
            setIsPRDComplete(false);
            setIsUserStoriesComplete(false);
            setIsRoadmapComplete(false);
            setIsOKRsComplete(false);
          }
        } else {
          setError("Project not found. Please create a new project.");
        }
      } catch (error) {
        console.error("Failed to load project:", error);
        setError("Failed to load project");
      } finally {
        setIsLoadingProject(false);
      }
    }
    loadProject();
  }, [projectId]);

  // Sync completion status whenever savedSessions changes
  // This ensures steps are marked complete ONLY if they have saved results
  useEffect(() => {
    if (savedSessions.length > 0) {
      const completedSteps = syncCompletionStatusWithSavedSessions(savedSessions);
      // Update the database with the corrected completion status
      saveProjectProgress({ completedSteps });
    }
  }, [savedSessions]);

  // Start Phase 1 Pipeline (Step 1)
  const startPhase1 = async () => {
    if (!problemStatement) {
      setError("Please enter a problem statement first");
      return;
    }

    setIsStreaming(true);
    setError(null);
    setStreamedContent("");
    setStepOutput(null);

    try {
      const response = await fetch("/api/pipeline/reframe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, problemStatement }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No response body");
      }

      let accumulatedContent = "";
      let step1Complete = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;

            try {
              const event = JSON.parse(data);

              switch (event.event) {
                case "step_start":
                  console.log(`Step ${event.stepNumber} started`);
                  break;

                case "stream":
                  accumulatedContent += event.content;
                  setStreamedContent(accumulatedContent);
                  break;

                case "step_complete":
                  if (event.stepNumber === 1) {
                    const reframeOutput = event.output as ReframeOutput;
                    setStepOutput(reframeOutput);
                    const newPhase1Data = { reframe: reframeOutput, vision: null };
                    setPhase1Data(newPhase1Data);
                    // Save progress
                    saveProjectProgress({ currentStep: 1, phase1Data: newPhase1Data });
                    step1Complete = true;
                    // Don't auto-start Step 2 - user will manually continue
                    setIsStreaming(false);
                  } else if (event.stepNumber === 2) {
                    const visionOutput = event.output as VisionOutput;
                    setStepOutput(visionOutput);
                    const newPhase1Data = { ...phase1Data, vision: visionOutput };
                    setPhase1Data(newPhase1Data);
                    setCurrentStep(2);
                    setIsStreaming(false);
                    // Save progress
                    saveProjectProgress({ currentStep: 2, phase1Data: newPhase1Data });
                  }
                  break;

                case "error":
                  setError(event.message);
                  setIsStreaming(false);
                  break;
              }
            } catch {
              // Skip malformed events
            }
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setIsStreaming(false);
    }
  };

  // Start Step 2 (Vision)
  const startStep2 = async (reframeOutput: ReframeOutput) => {
    setCurrentStep(2);
    setStreamedContent("");

    try {
      const response = await fetch("/api/pipeline/vision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          problemStatement,
          problemTitle: reframeOutput.problemTitle,
          oneLineSummary: reframeOutput.oneLineSummary,
          problem: reframeOutput.problem,
          context: reframeOutput.context,
          impact: reframeOutput.impact,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No response body");
      }

      let accumulatedContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;

            try {
              const event = JSON.parse(data);

              switch (event.event) {
                case "stream":
                  accumulatedContent += event.content;
                  setStreamedContent(accumulatedContent);
                  break;

                case "step_complete":
                  const visionOutput = event.output as VisionOutput;
                  setStepOutput(visionOutput);
                  const newPhase1Data = { ...phase1Data, vision: visionOutput };
                  setPhase1Data(newPhase1Data);
                  setIsStreaming(false);
                  // Save progress
                  saveProjectProgress({ currentStep: 2, phase1Data: newPhase1Data });
                  break;

                case "error":
                  setError(event.message);
                  setIsStreaming(false);
                  break;
              }
            } catch {
              // Skip malformed events
            }
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setIsStreaming(false);
    }
  };

  // Start Phase 2 Pipeline (Step 3 - Personas)
  const startPhase2 = async () => {
    // Check for problem data in various formats that LLM might return
    const reframe = phase1Data.reframe as any;
    const hasOldFormat = !!reframe?.reframedProblem?.customerProblem;
    const hasNewFormat = !!reframe?.problem?.description;
    const hasProblemTitle = !!reframe?.problemTitle;
    const hasProblemStatementFramework = !!reframe?.problemStatementFramework;
    const hasProblemDescription = !!reframe?.["1. The Problem"]?.problemDescription;
    const hasProblemData = hasOldFormat || hasNewFormat || hasProblemTitle || hasProblemStatementFramework || hasProblemDescription;
    
    console.log("startPhase2 called", { 
      reframe: phase1Data.reframe,
      vision: phase1Data.vision,
      hasOldFormat,
      hasNewFormat,
      hasProblemTitle,
      hasProblemStatementFramework,
      hasProblemData,
      visionStmt: phase1Data.vision?.visionStatement
    });
    
    // Validate required data exists
    if (!hasProblemData) {
      console.log("Validation failed: missing problem data (checked old format, new format, problemTitle, problemStatementFramework)");
      setError("Step 1 data (Problem Statement) is required to start Step 3");
      return;
    }
    
    // Check for vision - handle both 'visionStatement' and other possible field names
    const vision = phase1Data.vision as any;
    const hasVision = !!(vision?.visionStatement || vision?.missionStatement || vision?.valueProposition);
    if (!hasVision) {
      console.log("Validation failed: missing vision data");
      setError("Step 2 data (Vision) is required to start Step 3");
      return;
    }
    console.log("Validation passed, starting Step 3");

    setCurrentStep(3);
    setIsStreaming(true);
    setError(null);
    setStreamedContent("");
    setStepOutput(null);

    try {
      // Build full project context for API
      const projectContext = buildProjectContext();

      const response = await fetch("/api/pipeline/personas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          problemStatement,
          problemTitle: phase1Data.reframe?.problemTitle,
          oneLineSummary: phase1Data.reframe?.oneLineSummary,
          problem: phase1Data.reframe?.problem,
          context: phase1Data.reframe?.context,
          impact: phase1Data.reframe?.impact,
          vision: phase1Data.vision?.visionStatement,
          projectContext, // Full context for RAG/reference
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No response body");
      }

      let accumulatedContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;

            try {
              const event = JSON.parse(data);

              switch (event.event) {
                case "stream":
                  accumulatedContent += event.content;
                  setStreamedContent(accumulatedContent);
                  break;

                case "step_complete":
                  const personasOutput = event.output as PersonasOutput;
                  setStepOutput(personasOutput);
                  const newPhase2Data = { ...phase2Data, personas: personasOutput };
                  setPhase2Data(newPhase2Data);
                  saveProjectProgress({ currentStep: 3, phase2Data: newPhase2Data });
                  setIsStreaming(false);
                  // Don't auto-start Step 4 - user will manually continue
                  break;

                case "error":
                  setError(event.message);
                  setIsStreaming(false);
                  break;
              }
            } catch {
              // Skip malformed events
            }
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setIsStreaming(false);
    }
  };

  // Start Step 4 (Questions)
  const startStep4 = async (personasOutput: PersonasOutput) => {
    setCurrentStep(4);
    setIsStreaming(true);
    setError(null);
    setStreamedContent("");
    setStepOutput(null);

    try {
      const response = await fetch("/api/pipeline/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          problemStatement,
          problemTitle: phase1Data.reframe?.problemTitle,
          oneLineSummary: phase1Data.reframe?.oneLineSummary,
          problem: phase1Data.reframe?.problem,
          vision: phase1Data.vision?.visionStatement,
          personas: personasOutput.personas,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No response body");
      }

      let accumulatedContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;

            try {
              const event = JSON.parse(data);

              switch (event.event) {
                case "stream":
                  accumulatedContent += event.content;
                  setStreamedContent(accumulatedContent);
                  break;

                case "step_complete":
                  const questionsOutput = event.output as QuestionsOutput;
                  setStepOutput(questionsOutput);
                  setPhase2Data(prev => ({ ...prev, questions: questionsOutput }));
                  setCurrentStep(4);
                  setIsStreaming(false);
                  break;

                case "error":
                  setError(event.message);
                  setIsStreaming(false);
                  break;
              }
            } catch {
              // Skip malformed events
            }
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setIsStreaming(false);
    }
  };

  // Start Phase 3 Pipeline (Step 5 - Market Analysis)
  const startPhase3 = async () => {
    if (!phase1Data.vision || !phase2Data.personas) {
      setError("Phase 1 and 2 data are required to start Phase 3");
      return;
    }

    setCurrentStep(5);
    setIsStreaming(true);
    setError(null);
    setStreamedContent("");
    setStepOutput(null);

    try {
      const response = await fetch("/api/pipeline/market", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          problemStatement,
          vision: phase1Data.vision.visionStatement,
          personas: phase2Data.personas.personas,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No response body");
      }

      let accumulatedContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;

            try {
              const event = JSON.parse(data);

              switch (event.event) {
                case "stream":
                  accumulatedContent += event.content;
                  setStreamedContent(accumulatedContent);
                  break;

                case "step_complete":
                  const marketOutput = event.output as MarketAnalysisOutput;
                  setStepOutput(marketOutput);
                  setPhase3Data({ marketAnalysis: marketOutput });
                  setCurrentStep(5);
                  setIsStreaming(false);
                  break;

                case "error":
                  setError(event.message);
                  setIsStreaming(false);
                  break;
              }
            } catch {
              // Skip malformed events
            }
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setIsStreaming(false);
    }
  };

  // Start Phase 4 Pipeline (Step 6 - PRD Generation)
  const startPhase4 = async () => {
    if (!phase1Data.vision || !phase2Data.personas || !phase3Data.marketAnalysis) {
      setError("Phase 1, 2, and 3 data are required to start Phase 4");
      return;
    }

    setCurrentStep(6);
    setIsStreaming(true);
    setError(null);
    setStreamedContent("");
    setStepOutput(null);

    try {
      const response = await fetch("/api/pipeline/prd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          problemStatement,
          problemTitle: phase1Data.reframe?.problemTitle,
          oneLineSummary: phase1Data.reframe?.oneLineSummary,
          problem: phase1Data.reframe?.problem,
          vision: phase1Data.vision?.visionStatement,
          personas: phase2Data.personas?.personas,
          questionsAndAnswers: phase2Data.questions?.questions,
          marketAnalysis: phase3Data.marketAnalysis,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No response body");
      }

      let accumulatedContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;

            try {
              const event = JSON.parse(data);

              switch (event.event) {
                case "stream":
                  accumulatedContent += event.content;
                  setStreamedContent(accumulatedContent);
                  break;

                case "step_complete":
                  setStepOutput(event.output as PRDOutput);
                  setIsPRDComplete(true);
                  setCurrentStep(6);
                  setIsStreaming(false);
                  break;

                case "error":
                  setError(event.message);
                  setIsStreaming(false);
                  break;
              }
            } catch {
              // Skip malformed events
            }
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setIsStreaming(false);
    }
  };

  // Start Step 7 - Generate User Stories with RICE Scoring
  const startStep7 = async () => {
    // Check if PRD exists in savedSessions (use appendix which is unique to PRD)
    const prdSession = savedSessions.find(s => s.stepNumber === 6 && "appendix" in s.data);
    if (!prdSession) {
      setError("Step 6 (PRD) must be completed before generating user stories");
      return;
    }

    setCurrentStep(7);
    setIsStreaming(true);
    setError(null);
    setStreamedContent("");
    setStepOutput(null);

    try {
      const response = await fetch("/api/pipeline/userstories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          prdData: prdSession.data,
          personas: phase2Data.personas?.personas,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No response body");
      }

      let accumulatedContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;

            try {
              const event = JSON.parse(data);

              switch (event.event) {
                case "stream":
                  accumulatedContent += event.content;
                  setStreamedContent(accumulatedContent);
                  break;

                case "step_complete":
                  const userStoriesOutput = event.output as UserStoriesOutput;
                  setStepOutput(userStoriesOutput);
                  setIsUserStoriesComplete(true);
                  setCurrentStep(7);
                  setIsStreaming(false);
                  // Note: User must click "Save Results" button to save to database
                  // This allows reviewing and editing before saving
                  break;

                case "error":
                  setError(event.message);
                  setIsStreaming(false);
                  break;
              }
            } catch {
              // Skip malformed events
            }
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setIsStreaming(false);
    }
  };

  // Start Step 8 - Generate Roadmap
  const startStep8 = async () => {
    // Check if User Stories exists in savedSessions
    // Handle both array root structure AND object with stories property
    const storiesSession = savedSessions.find(s => s.stepNumber === 7 && (Array.isArray(s.data) || "stories" in s.data));
    if (!storiesSession) {
      setError("Step 7 (User Stories) must be completed before generating roadmap");
      return;
    }

    setCurrentStep(8);
    setIsStreaming(true);
    setError(null);
    setStreamedContent("");
    setStepOutput(null);

    try {
      // Extract stories from the session data - handle both array and object structures
      const sessionData = storiesSession.data as any;
      let userStories: any[] = [];
      
      if (Array.isArray(sessionData)) {
        // New epic/story structure - flatten stories from epics
        sessionData.forEach((epic: any) => {
          if (epic.stories && Array.isArray(epic.stories)) {
            epic.stories.forEach((story: any) => {
              userStories.push({
                id: story.id,
                title: story.story?.substring(0, 50) + "..." || "Story",
                description: story.story,
                priority: story.priority,
                storyPoints: story.storyPoints,
                acceptanceCriteria: story.acceptanceCriteria,
              });
            });
          }
        });
      } else if (sessionData.stories && Array.isArray(sessionData.stories)) {
        // Old flat structure
        userStories = sessionData.stories;
      }
      
      if (userStories.length === 0) {
        throw new Error("No user stories found in saved data");
      }
      
      const response = await fetch("/api/pipeline/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userStories,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No response body");
      }

      let accumulatedContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;

            try {
              const event = JSON.parse(data);

              switch (event.event) {
                case "stream":
                  accumulatedContent += event.content;
                  setStreamedContent(accumulatedContent);
                  break;

                case "step_complete":
                  setStepOutput(event.output as RoadmapOutput);
                  setIsRoadmapComplete(true);
                  setCurrentStep(8);
                  setIsStreaming(false);
                  break;

                case "error":
                  setError(event.message);
                  setIsStreaming(false);
                  break;
              }
            } catch {
              // Skip malformed events
            }
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setIsStreaming(false);
    }
  };

  // Start Step 9 - Generate OKRs
  const startStep9 = async () => {
    // Check if User Stories exists in savedSessions
    // Handle both array root structure AND object with stories property
    const storiesSession = savedSessions.find(s => s.stepNumber === 7 && (Array.isArray(s.data) || "stories" in s.data));
    const prdSession = savedSessions.find(s => s.stepNumber === 6 && "appendix" in s.data);
    
    if (!storiesSession) {
      setError("Step 7 (User Stories) must be completed before generating OKRs");
      return;
    }

    setCurrentStep(9);
    setIsStreaming(true);
    setError(null);
    setStreamedContent("");
    setStepOutput(null);

    try {
      // Extract stories from the session data - handle both array and object structures
      const sessionData = storiesSession.data as any;
      let userStories: any[] = [];
      
      if (Array.isArray(sessionData)) {
        // New epic/story structure - flatten stories from epics
        sessionData.forEach((epic: any) => {
          if (epic.stories && Array.isArray(epic.stories)) {
            epic.stories.forEach((story: any) => {
              userStories.push({
                id: story.id,
                title: story.story?.substring(0, 50) + "..." || "Story",
                description: story.story,
                priority: story.priority,
                storyPoints: story.storyPoints,
                acceptanceCriteria: story.acceptanceCriteria,
              });
            });
          }
        });
      } else if (sessionData.stories && Array.isArray(sessionData.stories)) {
        // Old flat structure
        userStories = sessionData.stories;
      }
      
      if (userStories.length === 0) {
        throw new Error("No user stories found in saved data");
      }
      
      const response = await fetch("/api/pipeline/okrs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prdData: prdSession?.data,
          userStories,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No response body");
      }

      let accumulatedContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;

            try {
              const event = JSON.parse(data);

              switch (event.event) {
                case "stream":
                  accumulatedContent += event.content;
                  setStreamedContent(accumulatedContent);
                  break;

                case "step_complete":
                  setStepOutput(event.output as OKROutput);
                  setIsOKRsComplete(true);
                  setCurrentStep(9);
                  setIsStreaming(false);
                  break;

                case "error":
                  setError(event.message);
                  setIsStreaming(false);
                  break;
              }
            } catch {
              // Skip malformed events
            }
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setIsStreaming(false);
    }
  };

  const currentStepInfo = pipelineSteps.find(s => s.id === currentStep);
  const isPhase1Complete = currentStep >= 2 && !isStreaming && phase1Data.vision !== null;
  const isPhase2Complete = currentStep >= 4 && !isStreaming;
  const isPhase3Complete = currentStep >= 5 && !isStreaming;
  const isPhase4Complete = currentStep >= 6 && !isStreaming;

  return (
    <div className="min-h-screen flex">
      <Sidebar
        currentStep={currentStep}
        projectId={projectId}
        maxCompletedStep={
          savedSessions.some(s => s.stepNumber === 9 && ("okr1" in s.data || "northStarDefinition" in s.data || "productName" in s.data)) ? 9 :
          savedSessions.some(s => s.stepNumber === 8 && "phases" in s.data) ? 8 :
          savedSessions.some(s => s.stepNumber === 7 && (Array.isArray(s.data) || "stories" in s.data)) ? 7 :
          savedSessions.some(s => s.stepNumber === 6 && "appendix" in s.data) ? 6 :
          phase3Data.marketAnalysis ? 5 :
          phase2Data.questions ? 4 :
          phase2Data.personas ? 3 :
          phase1Data.vision ? 2 :
          phase1Data.reframe ? 1 : 0
        }
        onStepClick={(stepId) => {
          // Handle step navigation
          setCurrentStep(stepId);
          setStreamedContent(""); // Clear any streaming content
          setIsStreaming(false);
          setError(null);

          if (stepId === 1) {
            // Show reframe output if available, otherwise show start UI
            if (phase1Data.reframe) {
              setStepOutput(phase1Data.reframe);
            } else {
              setStepOutput(null);
            }
          } else if (stepId === 2) {
            // Show vision output if available
            if (phase1Data.vision) {
              setStepOutput(phase1Data.vision);
            } else {
              setStepOutput(null);
            }
          } else if (stepId === 3) {
            // Show personas output if available
            if (phase2Data.personas) {
              setStepOutput(phase2Data.personas);
            } else {
              setStepOutput(null);
            }
          } else if (stepId === 4) {
            // Show questions output if available
            if (phase2Data.questions) {
              setStepOutput(phase2Data.questions);
            } else {
              setStepOutput(null);
            }
          } else if (stepId === 5) {
            // Show market analysis output if available
            if (phase3Data.marketAnalysis) {
              setStepOutput(phase3Data.marketAnalysis);
            } else {
              setStepOutput(null);
            }
          } else if (stepId === 6) {
            // Show PRD output if available
            // First check if stepOutput already has PRD data (use appendix which is unique to PRD)
            if (stepOutput && "appendix" in stepOutput) {
              // Already showing PRD - no need to reload
            } else {
              // Try to load PRD from saved sessions
              const prdSession = savedSessions.find(s => s.stepNumber === 6 && "appendix" in s.data);
              if (prdSession) {
                setStepOutput(prdSession.data as PRDOutput);
                setIsPRDComplete(true);
              } else {
                setStepOutput(null);
              }
            }
          } else if (stepId === 7) {
            // Show User Stories output if available
            // Handle both array root structure AND object with stories property
            const hasStories = stepOutput && (Array.isArray(stepOutput) || ("stories" in stepOutput));
            if (hasStories) {
              // Already showing User Stories - no need to reload
            } else {
              // Try to load User Stories from saved sessions
              const storiesSession = savedSessions.find(s => s.stepNumber === 7 && (Array.isArray(s.data) || "stories" in s.data));
              if (storiesSession) {
                setStepOutput(storiesSession.data as UserStoriesOutput);
                setIsUserStoriesComplete(true);
              } else {
                setStepOutput(null);
              }
            }
          } else if (stepId === 8) {
            // Show Roadmap output if available
            if (stepOutput && "phases" in stepOutput) {
              // Already showing Roadmap - no need to reload
            } else {
              // Try to load Roadmap from saved sessions
              const roadmapSession = savedSessions.find(s => s.stepNumber === 8 && "phases" in s.data);
              if (roadmapSession) {
                setStepOutput(roadmapSession.data as RoadmapOutput);
                setIsRoadmapComplete(true);
              } else {
                setStepOutput(null);
              }
            }
          } else if (stepId === 9) {
            // Show OKRs output if available
            const hasOKRData = (output: any) => output && ("okr1" in output || "northStarDefinition" in output || "productName" in output);
            if (hasOKRData(stepOutput)) {
              // Already showing OKRs - no need to reload
            } else {
              // Try to load OKRs from saved sessions
              const okrsSession = savedSessions.find(s => s.stepNumber === 9 && hasOKRData(s.data));
              if (okrsSession) {
                setStepOutput(okrsSession.data as OKROutput);
                setIsOKRsComplete(true);
              } else {
                setStepOutput(null);
              }
            }
          } else {
            // Future phases - show coming soon
            setStepOutput(null);
          }
        }}
      />

      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header */}
        <header className="border-b border-slate-200 px-6 py-4 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-slate-900">{projectName}</h1>
            {isStreaming && (
              <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                Running
              </Badge>
            )}
            {isPhase1Complete && (
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                ✓ Phase 1 Complete
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2" disabled={!isPhase1Complete}>
                  <Download className="w-4 h-4" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => handleExport('pdf')} className="gap-2">
                  <FileText className="w-4 h-4 text-red-500" />
                  Export as PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('doc')} className="gap-2">
                  <FileType className="w-4 h-4 text-blue-500" />
                  Export as DOC
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('json')} className="gap-2">
                  <FileJson className="w-4 h-4 text-amber-500" />
                  Export as JSON
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('markdown')} className="gap-2">
                  <FileCode className="w-4 h-4 text-slate-500" />
                  Export as Markdown
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6 relative">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Project Info Card */}
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {projectTemplate && (
                      <Badge variant="secondary" className="bg-indigo-100 text-indigo-700">
                        {projectTemplate.charAt(0).toUpperCase() + projectTemplate.slice(1)}
                      </Badge>
                    )}
                    {completedStepsCount > 0 && (
                      <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                        {completedStepsCount}/9 Steps Complete
                      </Badge>
                    )}
                    {projectCreatedAt && (
                      <span className="text-xs text-slate-500">
                        Created: {new Date(projectCreatedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                {projectDescription && (
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <p className="text-sm text-slate-600">{projectDescription}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Start Phase 1 Input - Only show when no saved output displayed */}
            {currentStep === 1 && !isStreaming && !stepOutput && (
              <Card className="bg-white border-slate-200 shadow-sm">
                <CardContent className="p-6">
                  {/* Check if we have saved progress */}
                  {phase1Data.reframe ? (
                    // Resume / Continue UI
                    <>
                      <h2 className="text-lg font-semibold text-slate-900 mb-4">
                        {phase1Data.vision ? "Phase 1 Complete" : "Phase 1 In Progress"}
                      </h2>
                      <p className="text-slate-600 mb-4">
                        {phase1Data.vision
                          ? "You have completed Phase 1. The AI has reframed your problem and created a product vision. Ready to continue to Phase 2?"
                          : "You started Phase 1 and the problem has been reframed. Continue to generate the product vision?"}
                      </p>

                      <div className="flex flex-wrap gap-3">
                        {phase1Data.vision ? (
                          // Both steps complete - show view options
                          <>
                            <Button
                              onClick={() => {
                                setStepOutput(phase1Data.reframe);
                              }}
                              variant="outline"
                              className="gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              View Step 1
                            </Button>
                            <Button
                              onClick={() => {
                                setCurrentStep(2);
                                setStepOutput(phase1Data.vision);
                              }}
                              variant="outline"
                              className="gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              View Step 2
                            </Button>
                            <Button
                              onClick={() => setCurrentStep(3)}
                              className="gap-2 bg-emerald-500 hover:bg-emerald-600"
                            >
                              <ChevronRight className="w-4 h-4" />
                              Complete Phase 1
                            </Button>
                          </>
                        ) : (
                          // Only step 1 complete - show continue to step 2
                          <>
                            <Button
                              onClick={() => {
                                setStepOutput(phase1Data.reframe);
                              }}
                              variant="outline"
                              className="gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              View Step 1 Results
                            </Button>
                            <Button
                              onClick={() => startStep2(phase1Data.reframe!)}
                              className="gap-2 bg-indigo-500 hover:bg-indigo-600"
                            >
                              <Play className="w-4 h-4" />
                              Continue to Step 2
                            </Button>
                          </>
                        )}
                        <Button
                          variant="outline"
                          onClick={startPhase1}
                          className="gap-2"
                        >
                          <RefreshCw className="w-4 h-4" />
                          Restart Phase 1
                        </Button>
                      </div>
                    </>
                  ) : (
                    // Fresh start UI
                    <>
                      <h2 className="text-lg font-semibold text-slate-900 mb-4">
                        Start Phase 1: Core Definition
                      </h2>
                      <p className="text-slate-600 mb-4">
                        Review your problem statement below. Click Start to begin the AI pipeline which will reframe it and create a product vision.
                      </p>
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-slate-900">
                              Problem Statement
                            </label>
                            <span className="text-xs text-slate-500">
                              Loaded from project
                            </span>
                          </div>
                          {problemStatement ? (
                            <div className="w-full min-h-[120px] p-4 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-sm whitespace-pre-wrap">
                              {problemStatement}
                            </div>
                          ) : (
                            <div className="w-full h-32 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-sm flex items-center">
                              {isLoadingProject ? "Loading project data..." : "No problem statement found. Please create a new project."}
                            </div>
                          )}
                        </div>
                        {error && (
                          <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                            {error}
                          </div>
                        )}
                        <Button
                          onClick={startPhase1}
                          disabled={!problemStatement.trim() || isStreaming}
                          className="gap-2 bg-indigo-500 hover:bg-indigo-600"
                        >
                          <Play className="w-4 h-4" />
                          Start Phase 1 Pipeline
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Start Step 2 - Only show when on step 2 with no output */}
            {currentStep === 2 && !isStreaming && !stepOutput && (
              <Card className="bg-white border-slate-200 shadow-sm">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-slate-900 mb-4">
                    Step 2: Write Product Vision
                  </h2>
                  <p className="text-slate-600 mb-4">
                    {phase1Data.reframe
                      ? "Continue to Step 2 to generate the product vision based on your reframed problem."
                      : "Please complete Step 1 (Reframe Problem) first before generating the vision."}
                  </p>
                  <div className="flex gap-3">
                    {phase1Data.reframe ? (
                      <Button
                        onClick={() => startStep2(phase1Data.reframe!)}
                        className="gap-2 bg-indigo-500 hover:bg-indigo-600"
                      >
                        <Play className="w-4 h-4" />
                        Start Step 2
                      </Button>
                    ) : (
                      <Button
                        onClick={() => setCurrentStep(1)}
                        variant="outline"
                        className="gap-2"
                      >
                        <ChevronRight className="w-4 h-4 rotate-180" />
                        Go to Step 1
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Start Step 3 - Only show when on step 3 with no output */}
            {currentStep === 3 && !isStreaming && !stepOutput && (
              <Card className="bg-white border-slate-200 shadow-sm">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-slate-900 mb-4">
                    Step 3: Identify & Profile Personas
                  </h2>
                  <p className="text-slate-600 mb-4">
                    {phase1Data.vision
                      ? "Generate user personas based on your product vision and reframed problem."
                      : "Please complete Step 2 (Product Vision) first before generating personas."}
                  </p>
                  {error && (
                    <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg mb-4">
                      {error}
                    </div>
                  )}
                  <div className="flex gap-3">
                    {phase1Data.vision ? (
                      <Button
                        onClick={() => {
                          setError(null);
                          startPhase2();
                        }}
                        className="gap-2 bg-indigo-500 hover:bg-indigo-600"
                      >
                        <Play className="w-4 h-4" />
                        Start Step 3
                      </Button>
                    ) : (
                      <Button
                        onClick={() => setCurrentStep(2)}
                        variant="outline"
                        className="gap-2"
                      >
                        <ChevronRight className="w-4 h-4 rotate-180" />
                        Go to Step 2
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Start Step 4 - Only show when on step 4 with no output */}
            {currentStep === 4 && !isStreaming && !stepOutput && (
              <Card className="bg-white border-slate-200 shadow-sm">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-slate-900 mb-4">
                    Step 4: Clarifying Questions
                  </h2>
                  <p className="text-slate-600 mb-4">
                    {phase2Data.personas
                      ? "Generate clarifying questions to validate assumptions and uncover insights based on your personas."
                      : "Please complete Step 3 (Personas) first before generating questions."}
                  </p>
                  {error && (
                    <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg mb-4">
                      {error}
                    </div>
                  )}
                  <div className="flex gap-3">
                    {phase2Data.personas ? (
                      <Button
                        onClick={() => {
                          setError(null);
                          startStep4(phase2Data.personas!);
                        }}
                        className="gap-2 bg-indigo-500 hover:bg-indigo-600"
                      >
                        <Play className="w-4 h-4" />
                        Start Step 4
                      </Button>
                    ) : (
                      <Button
                        onClick={() => setCurrentStep(3)}
                        variant="outline"
                        className="gap-2"
                      >
                        <ChevronRight className="w-4 h-4 rotate-180" />
                        Go to Step 3
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Start Step 5 - Only show when on step 5 with no output */}
            {currentStep === 5 && !isStreaming && !stepOutput && (
              <Card className="bg-white border-slate-200 shadow-sm">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-slate-900 mb-4">
                    Step 5: Market & Competitive Analysis
                  </h2>
                  <p className="text-slate-600 mb-4">
                    {phase2Data.questions
                      ? "Analyze competitors and market landscape based on your problem, vision, personas, and clarifying questions."
                      : "Please complete Step 4 (Clarifying Questions) first before generating market analysis."}
                  </p>
                  {error && (
                    <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg mb-4">
                      {error}
                    </div>
                  )}
                  <div className="flex gap-3">
                    {phase2Data.questions ? (
                      <Button
                        onClick={() => {
                          setError(null);
                          startPhase3();
                        }}
                        className="gap-2 bg-indigo-500 hover:bg-indigo-600"
                      >
                        <Play className="w-4 h-4" />
                        Start Step 5
                      </Button>
                    ) : (
                      <Button
                        onClick={() => setCurrentStep(4)}
                        variant="outline"
                        className="gap-2"
                      >
                        <ChevronRight className="w-4 h-4 rotate-180" />
                        Go to Step 4
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Start Step 6 - Only show when on step 6 with no output */}
            {currentStep === 6 && !isStreaming && !stepOutput && (
              <Card className="bg-white border-slate-200 shadow-sm">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-slate-900 mb-4">
                    Step 6: Generate PRD
                  </h2>
                  <p className="text-slate-600 mb-4">
                    {phase3Data.marketAnalysis
                      ? "Generate a comprehensive Product Requirements Document based on all previous steps following the ChatPRD template."
                      : "Please complete Step 5 (Market Analysis) first before generating PRD."}
                  </p>
                  {error && (
                    <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg mb-4">
                      {error}
                    </div>
                  )}
                  <div className="flex gap-3">
                    {phase3Data.marketAnalysis ? (
                      <Button
                        onClick={() => {
                          setError(null);
                          startPhase4();
                        }}
                        className="gap-2 bg-indigo-500 hover:bg-indigo-600"
                      >
                        <Play className="w-4 h-4" />
                        Start Step 6
                      </Button>
                    ) : (
                      <Button
                        onClick={() => setCurrentStep(5)}
                        variant="outline"
                        className="gap-2"
                      >
                        <ChevronRight className="w-4 h-4 rotate-180" />
                        Go to Step 5
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Start Step 7 - Only show when on step 7 with no output */}
            {currentStep === 7 && !isStreaming && !stepOutput && (
              <Card className="bg-white border-slate-200 shadow-sm">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-slate-900 mb-4">
                    Step 7: User Stories with RICE Scoring
                  </h2>
                  <p className="text-slate-600 mb-4">
                    {savedSessions.some(s => s.stepNumber === 6 && "appendix" in s.data)
                      ? "Generate user stories with acceptance criteria and RICE prioritization scoring based on the PRD."
                      : "Please complete Step 6 (Generate PRD) first before generating user stories."}
                  </p>
                  {error && (
                    <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg mb-4">
                      {error}
                    </div>
                  )}
                  <div className="flex gap-3">
                    {savedSessions.some(s => s.stepNumber === 6 && "appendix" in s.data) ? (
                      <Button
                        onClick={() => {
                          setError(null);
                          startStep7();
                        }}
                        className="gap-2 bg-indigo-500 hover:bg-indigo-600"
                      >
                        <Play className="w-4 h-4" />
                        Start Step 7
                      </Button>
                    ) : (
                      <Button
                        onClick={() => setCurrentStep(6)}
                        variant="outline"
                        className="gap-2"
                      >
                        <ChevronRight className="w-4 h-4 rotate-180" />
                        Go to Step 6
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Start Step 8 - Only show when on step 8 with no output */}
            {currentStep === 8 && !isStreaming && !stepOutput && (
              <Card className="bg-white border-slate-200 shadow-sm">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-slate-900 mb-4">
                    Step 8: Prioritized Backlog & Roadmap
                  </h2>
                  <p className="text-slate-600 mb-4">
                    {savedSessions.some(s => s.stepNumber === 7 && (Array.isArray(s.data) || "stories" in s.data))
                      ? "Generate a phased roadmap and prioritized backlog based on user stories."
                      : "Please complete Step 7 (User Stories) first before generating roadmap."}
                  </p>
                  {error && (
                    <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg mb-4">
                      {error}
                    </div>
                  )}
                  <div className="flex gap-3">
                    {savedSessions.some(s => s.stepNumber === 7 && (Array.isArray(s.data) || "stories" in s.data)) ? (
                      <Button
                        onClick={() => {
                          setError(null);
                          startStep8();
                        }}
                        className="gap-2 bg-indigo-500 hover:bg-indigo-600"
                      >
                        <Play className="w-4 h-4" />
                        Start Step 8
                      </Button>
                    ) : (
                      <Button
                        onClick={() => setCurrentStep(7)}
                        variant="outline"
                        className="gap-2"
                      >
                        <ChevronRight className="w-4 h-4 rotate-180" />
                        Go to Step 7
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Start Step 9 - Only show when on step 9 with no output */}
            {currentStep === 9 && !isStreaming && !stepOutput && (
              <Card className="bg-white border-slate-200 shadow-sm">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-slate-900 mb-4">
                    Step 9: OKRs & Success Metrics
                  </h2>
                  <p className="text-slate-600 mb-4">
                    {savedSessions.some(s => s.stepNumber === 7 && (Array.isArray(s.data) || "stories" in s.data))
                      ? "Generate Objectives, Key Results, and AARRR success metrics."
                      : "Please complete Step 7 (User Stories) first before generating OKRs."}
                  </p>
                  {error && (
                    <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg mb-4">
                      {error}
                    </div>
                  )}
                  <div className="flex gap-3">
                    {savedSessions.some(s => s.stepNumber === 7 && (Array.isArray(s.data) || "stories" in s.data)) ? (
                      <Button
                        onClick={() => {
                          setError(null);
                          startStep9();
                        }}
                        className="gap-2 bg-indigo-500 hover:bg-indigo-600"
                      >
                        <Play className="w-4 h-4" />
                        Start Step 9
                      </Button>
                    ) : (
                      <Button
                        onClick={() => setCurrentStep(7)}
                        variant="outline"
                        className="gap-2"
                      >
                        <ChevronRight className="w-4 h-4 rotate-180" />
                        Go to Step 7
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step Output Display */}
            {(isStreaming || stepOutput) && (
              <Card className="bg-white border-slate-200 shadow-sm">
                <CardContent className="p-6">
                  {/* Step Header */}
                  <div className="flex items-center gap-3 mb-4">
                    {isStreaming ? (
                      <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center animate-pulse">
                        <Loader2 className="w-4 h-4 text-white" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div>
                      <h2 className="font-semibold text-slate-900">
                        Step {currentStep}: {currentStepInfo?.description}
                      </h2>
                      <p className="text-sm text-slate-500">
                        {isStreaming ? "AI is generating content..." : "Complete"}
                      </p>
                    </div>
                  </div>

                  {/* Streaming Output */}
                  {streamedContent && (
                    <div className="bg-slate-50 rounded-lg p-6 font-mono text-sm leading-relaxed min-h-[200px] border border-slate-200 mb-4">
                      <pre className="whitespace-pre-wrap text-slate-700">
                        {streamedContent}
                      </pre>
                      {isStreaming && (
                        <span className="inline-block w-2 h-4 bg-indigo-500 ml-1 animate-pulse" />
                      )}
                    </div>
                  )}

                  {/* Structured Output Display */}
                  {stepOutput && !isStreaming && (
                    <div className="space-y-4">
                      {/* Step 1: Problem Statement Output */}
                      {/* Handle both new format (problemTitle) and old format (reframedProblem) */}
                      {("problemTitle" in stepOutput || "reframedProblem" in stepOutput) && (
                        <>
                          {/* Header - New Format */}
                          {"problemTitle" in stepOutput && (
                            <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                              <div className="flex items-center gap-2 mb-3">
                                <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center">
                                  <span className="text-white font-semibold text-sm">1</span>
                                </div>
                                <h3 className="font-semibold text-indigo-900">Step 1: Problem Statement</h3>
                              </div>
                              <h2 className="text-xl font-bold text-indigo-900 mb-2">{(stepOutput as ReframeOutput).problemTitle || "Untitled"}</h2>
                              <p className="text-indigo-700 italic">{(stepOutput as ReframeOutput).oneLineSummary}</p>
                            </div>
                          )}
                          
                          {/* Header - Old Format Fallback */}
                          {!("problemTitle" in stepOutput) && "reframedProblem" in stepOutput && (
                            <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                              <div className="flex items-center gap-2 mb-3">
                                <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center">
                                  <span className="text-white font-semibold text-sm">1</span>
                                </div>
                                <h3 className="font-semibold text-indigo-900">Step 1: Reframe Problem</h3>
                              </div>
                              <p className="text-sm text-amber-600 italic">Legacy format - Regenerate for full template</p>
                            </div>
                          )}

                          {/* Problem Details - New Format */}
                          {(stepOutput as ReframeOutput).problem && (
                            <div className="bg-white rounded-lg p-4 border border-slate-200">
                              <h4 className="font-semibold text-slate-900 mb-3">Problem Description</h4>
                              <p className="text-sm text-slate-700 mb-4">{(stepOutput as ReframeOutput).problem?.description}</p>
                              <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                  <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Affected Users</p>
                                  <p className="text-sm text-slate-700">{(stepOutput as ReframeOutput).problem?.affectedUsers}</p>
                                </div>
                                <div>
                                  <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Pain Points</p>
                                  <p className="text-sm text-slate-700">{(stepOutput as ReframeOutput).problem?.painPoints}</p>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Fallback: Display any additional fields dynamically */}
                          {(() => {
                            const output = stepOutput as any;
                            const knownFields = ['problemTitle', 'oneLineSummary', 'problem', 'context', 'scope', 'measurability', 'impact', 'validation', 'conciseFormat', 'nextSteps', 'reframedProblem'];
                            const extraFields = Object.keys(output).filter(k => !knownFields.includes(k) && k !== 'problemStatementFramework');
                            
                            return extraFields.length > 0 && (
                              <div className="space-y-4">
                                {extraFields.map((field) => {
                                  const value = output[field];
                                  if (typeof value === 'object' && value !== null) {
                                    return (
                                      <div key={field} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                                        <h4 className="font-semibold text-slate-900 mb-3">{field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</h4>
                                        <div className="space-y-3">
                                          {Object.entries(value).map(([subKey, subValue]) => (
                                            <div key={subKey}>
                                              <p className="text-xs font-semibold text-slate-500 uppercase mb-1">{subKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</p>
                                              <p className="text-sm text-slate-700">
                                                {typeof subValue === 'string' ? subValue : JSON.stringify(subValue)}
                                              </p>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    );
                                  }
                                  return null;
                                })}
                              </div>
                            );
                          })()}

                          {/* Handle problemStatementFramework from LLM - Card/Tile Layout */}
                          {(stepOutput as any)?.problemStatementFramework && (
                            <div>
                              <h4 className="font-semibold text-slate-900 mb-4 text-lg">Problem Statement Framework</h4>
                              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {Object.entries((stepOutput as any).problemStatementFramework).map(([section, data], idx) => {
                                  // Assign colors based on section index
                                  const colors = [
                                    { bg: 'bg-rose-50', border: 'border-rose-200', title: 'text-rose-900', accent: 'bg-rose-500' },
                                    { bg: 'bg-amber-50', border: 'border-amber-200', title: 'text-amber-900', accent: 'bg-amber-500' },
                                    { bg: 'bg-emerald-50', border: 'border-emerald-200', title: 'text-emerald-900', accent: 'bg-emerald-500' },
                                    { bg: 'bg-blue-50', border: 'border-blue-200', title: 'text-blue-900', accent: 'bg-blue-500' },
                                    { bg: 'bg-violet-50', border: 'border-violet-200', title: 'text-violet-900', accent: 'bg-violet-500' },
                                  ];
                                  const color = colors[idx % colors.length];
                                  
                                  return (
                                    <div key={section} className={`${color.bg} rounded-xl p-4 border ${color.border} shadow-sm hover:shadow-md transition-shadow`}>
                                      <div className="flex items-center gap-2 mb-3">
                                        <div className={`w-8 h-8 rounded-lg ${color.accent} flex items-center justify-center text-white font-bold text-sm`}>
                                          {idx + 1}
                                        </div>
                                        <h5 className={`font-semibold ${color.title}`}>{section}</h5>
                                      </div>
                                      {typeof data === 'object' && data !== null ? (
                                        <div className="space-y-2">
                                          {Object.entries(data as object).map(([key, val]) => (
                                            <div key={key} className="bg-white/60 rounded-lg p-2">
                                              <p className="text-xs font-medium text-slate-500 uppercase mb-1">{key}</p>
                                              <p className="text-sm text-slate-700 leading-relaxed">{typeof val === 'string' ? val : JSON.stringify(val)}</p>
                                            </div>
                                          ))}
                                        </div>
                                      ) : (
                                        <p className="text-sm text-slate-700 bg-white/60 rounded-lg p-2">{String(data)}</p>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* Handle validation & evidence - Card/Tile Layout */}
                          {(stepOutput as any)?.['validation & evidence'] && (
                            <div>
                              <h4 className="font-semibold text-slate-900 mb-4 text-lg">Validation & Evidence</h4>
                              <div className="grid md:grid-cols-2 gap-4">
                                {Object.entries((stepOutput as any)['validation & evidence']).map(([key, val], idx) => {
                                  const icons = ['📊', '👥', '📈', '💼'];
                                  return (
                                    <div key={key} className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-200 shadow-sm hover:shadow-md transition-shadow">
                                      <div className="flex items-center gap-2 mb-3">
                                        <span className="text-xl">{icons[idx % icons.length]}</span>
                                        <h5 className="font-semibold text-emerald-900">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</h5>
                                      </div>
                                      <div className="bg-white/60 rounded-lg p-3">
                                        <p className="text-sm text-slate-700 leading-relaxed">{typeof val === 'string' ? val : JSON.stringify(val)}</p>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* Handle problemStatementDraft - Card/Tile Layout */}
                          {(stepOutput as any)?.problemStatementDraft && (
                            <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-xl p-6 border border-indigo-200 shadow-sm">
                              <h4 className="font-semibold text-indigo-900 mb-4 text-lg flex items-center gap-2">
                                <span className="text-xl">📝</span>
                                Problem Statement Draft
                              </h4>
                              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {Object.entries((stepOutput as any).problemStatementDraft).map(([key, val], idx) => {
                                  const labels: Record<string, string> = {
                                    targetUser: 'For',
                                    whoStatement: 'Who',
                                    theProblem: 'The',
                                    isAProblem: 'Is a',
                                    thatCauses: 'That',
                                    unlikeCurrent: 'Unlike',
                                    ourSolution: 'Our solution'
                                  };
                                  const colors = ['bg-rose-100', 'bg-amber-100', 'bg-emerald-100', 'bg-blue-100', 'bg-violet-100', 'bg-pink-100', 'bg-indigo-100'];
                                  return (
                                    <div key={key} className={`${colors[idx % colors.length]} rounded-lg p-3 border border-white/50`}>
                                      <p className="text-xs font-bold text-slate-600 uppercase mb-1">{labels[key] || key}</p>
                                      <p className="text-sm text-slate-800 font-medium">{typeof val === 'string' ? val : JSON.stringify(val)}</p>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* Context & Scope - New Format */}
                          {((stepOutput as ReframeOutput).context || (stepOutput as ReframeOutput).scope) && (
                            <div className="grid md:grid-cols-2 gap-4">
                              {(stepOutput as ReframeOutput).context && (
                                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                                  <h4 className="font-semibold text-slate-900 mb-3">Context</h4>
                                  <div className="space-y-2 text-sm text-slate-700">
                                    <p><span className="font-medium text-slate-900">Root Causes:</span> {(stepOutput as ReframeOutput).context?.rootCauses}</p>
                                    <p><span className="font-medium text-slate-900">When:</span> {(stepOutput as ReframeOutput).context?.whenItOccurs}</p>
                                    <p><span className="font-medium text-slate-900">Manifestation:</span> {(stepOutput as ReframeOutput).context?.howItManifests}</p>
                                  </div>
                                </div>
                              )}
                              {(stepOutput as ReframeOutput).scope && (
                                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                                  <h4 className="font-semibold text-slate-900 mb-3">Scope</h4>
                                  <div className="space-y-2 text-sm text-slate-700">
                                    <p><span className="font-medium text-emerald-700">In Scope:</span> {(stepOutput as ReframeOutput).scope?.inScope}</p>
                                    <p><span className="font-medium text-rose-700">Out of Scope:</span> {(stepOutput as ReframeOutput).scope?.outOfScope}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Impact - New Format */}
                          {(stepOutput as ReframeOutput).impact && (
                            <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                              <h4 className="font-semibold text-amber-900 mb-3">Impact</h4>
                              <div className="grid md:grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p className="font-medium text-amber-800 mb-1">Business Impact</p>
                                  <p className="text-amber-700">{(stepOutput as ReframeOutput).impact?.businessImpact}</p>
                                </div>
                                <div>
                                  <p className="font-medium text-amber-800 mb-1">User Impact</p>
                                  <p className="text-amber-700">{(stepOutput as ReframeOutput).impact?.userImpact}</p>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Concise Format (Mad Libs) - New Format */}
                          {(stepOutput as ReframeOutput).conciseFormat && (
                            <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                              <h4 className="font-semibold text-indigo-900 mb-3">Concise Problem Statement</h4>
                              <p className="text-sm text-indigo-800 leading-relaxed">
                                For <span className="font-semibold">{(stepOutput as ReframeOutput).conciseFormat?.targetUser}</span>, 
                                who <span className="font-semibold">{(stepOutput as ReframeOutput).conciseFormat?.whoStatement}</span>, 
                                the <span className="font-semibold">{(stepOutput as ReframeOutput).conciseFormat?.theProblem}</span> 
                                is a <span className="font-semibold">{(stepOutput as ReframeOutput).conciseFormat?.isAProblem}</span> 
                                that <span className="font-semibold">{(stepOutput as ReframeOutput).conciseFormat?.thatCauses}</span>. 
                                Unlike <span className="font-semibold">{(stepOutput as ReframeOutput).conciseFormat?.unlikeCurrent}</span>, 
                                our solution <span className="font-semibold">{(stepOutput as ReframeOutput).conciseFormat?.ourSolution}</span>.
                              </p>
                            </div>
                          )}

                          {/* Next Steps - New Format */}
                          {(stepOutput as ReframeOutput).nextSteps && (
                            <div className="bg-white rounded-lg p-4 border border-slate-200">
                              <h4 className="font-semibold text-slate-900 mb-3">Next Steps</h4>
                              <ul className="space-y-2">
                                {(stepOutput as ReframeOutput).nextSteps?.map((step, i) => (
                                  <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                                    <span className="text-indigo-600 font-semibold">{i + 1}.</span>
                                    <span>{step}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </>
                      )}

                      {/* Vision Output */}
                      {"visionStatement" in stepOutput && (
                        <>
                          {/* Vision Statement - Hero Card */}
                          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200 shadow-sm">
                            <h3 className="font-semibold text-indigo-900 mb-3 text-lg flex items-center gap-2">
                              <span className="text-2xl">🎯</span> Vision Statement
                            </h3>
                            <p className="text-indigo-800 text-lg leading-relaxed">{(stepOutput as any).visionStatement}</p>
                          </div>

                          {/* Mission & Value Proposition - 2 Column Grid */}
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                              <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                                <span className="text-xl">🚀</span> Mission
                              </h3>
                              <p className="text-sm text-slate-600 leading-relaxed">{(stepOutput as any).missionStatement}</p>
                            </div>
                            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                              <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                                <span className="text-xl">✨</span> Value Proposition
                              </h3>
                              <p className="text-sm text-slate-600 leading-relaxed">{(stepOutput as any).valueProposition}</p>
                            </div>
                          </div>

                          {/* Target Outcome & North Star Metric - 2 Column Grid */}
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-200 shadow-sm">
                              <h3 className="font-semibold text-emerald-900 mb-3 flex items-center gap-2">
                                <span className="text-xl">📈</span> Target Outcome
                              </h3>
                              <p className="text-emerald-800 text-sm leading-relaxed">{(stepOutput as any).targetOutcome}</p>
                            </div>
                            <div className="bg-amber-50 rounded-xl p-5 border border-amber-200 shadow-sm">
                              <h3 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
                                <span className="text-xl">⭐</span> North Star Metric
                              </h3>
                              <p className="text-amber-800 text-sm font-medium">{(stepOutput as any).northStarMetric}</p>
                            </div>
                          </div>

                          {/* Guiding Principles - Card Grid */}
                          {(stepOutput as any).guidingPrinciples && (
                            <div>
                              <h3 className="font-semibold text-slate-900 mb-4 text-lg flex items-center gap-2">
                                <span className="text-xl">🧭</span> Guiding Principles
                              </h3>
                              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {(stepOutput as any).guidingPrinciples?.map((principle: string, i: number) => {
                                  const colors = ['bg-blue-50 border-blue-200', 'bg-violet-50 border-violet-200', 'bg-pink-50 border-pink-200', 'bg-cyan-50 border-cyan-200'];
                                  return (
                                    <div key={i} className={`${colors[i % colors.length]} rounded-lg p-3 border shadow-sm`}>
                                      <div className="flex items-start gap-2">
                                        <span className="text-indigo-600 font-bold text-sm">{i + 1}.</span>
                                        <p className="text-sm text-slate-700 leading-relaxed">{principle}</p>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* Elevator Pitch - Highlighted Card */}
                          {(stepOutput as any).elevatorPitch && (
                            <div className="bg-gradient-to-r from-sky-50 to-cyan-50 rounded-xl p-5 border border-sky-200 shadow-sm">
                              <h3 className="font-semibold text-sky-900 mb-3 flex items-center gap-2">
                                <span className="text-xl">🎤</span> Elevator Pitch
                              </h3>
                              <p className="text-sky-800 text-sm leading-relaxed italic">"{(stepOutput as any).elevatorPitch}"</p>
                            </div>
                          )}
                        </>
                      )}

                      {/* Personas Output - Product School Template Structure */}
                      {(stepOutput as any)?.personas && (
                        <>
                          <h3 className="font-semibold text-slate-900 mb-4 text-lg flex items-center gap-2">
                            <span className="text-2xl">👥</span> User Personas
                            {(stepOutput as any).personas.length > 0 && (
                              <Badge variant="secondary" className="bg-indigo-100 text-indigo-700">
                                {(stepOutput as any).personas.length} personas
                              </Badge>
                            )}
                          </h3>
                          <div className="grid gap-6">
                            {(stepOutput as any).personas.map((persona: any, idx: number) => {
                              const p = persona;
                              const overview = p.overview || {};
                              const demographics = p.demographics || {};
                              const personal = demographics.personal || {};
                              const professional = demographics.professional || {};
                              const psychographics = p.psychographics || {};
                              const usageProfile = p.usageProfile || {};
                              const patterns = usageProfile.patterns || {};
                              const journeyContext = p.journeyContext || {};
                              const productFit = p.productFit || {};
                              const metadata = p.metadata || {};
                              const validation = p.validation || {};
                              
                              return (
                                <div key={idx} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                  {/* Header Card */}
                                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 border-b border-indigo-100">
                                    <div className="flex items-center gap-4 mb-3">
                                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                                        {(overview.name || "P")[0]}
                                      </div>
                                      <div className="flex-1">
                                        <div className="flex items-center gap-3">
                                          <h4 className="font-bold text-xl text-slate-900">{overview.name || `Persona ${idx + 1}`}</h4>
                                          {metadata.isPrimaryPersona && (
                                            <Badge className="bg-amber-100 text-amber-700">Primary</Badge>
                                          )}
                                        </div>
                                        <p className="text-slate-600">{overview.role} • {overview.generation} • {overview.location}</p>
                                        <p className="text-sm text-slate-500 mt-1">Age: {overview.age}</p>
                                      </div>
                                    </div>
                                    {/* Quote */}
                                    {overview.representativeQuote && (
                                      <div className="bg-white/60 rounded-lg p-4 mt-3">
                                        <p className="text-indigo-800 italic">&quot;{overview.representativeQuote}&quot;</p>
                                      </div>
                                    )}
                                  </div>

                                  <div className="p-6 space-y-6">
                                    {/* Demographics Grid */}
                                    <div className="grid md:grid-cols-2 gap-4">
                                      {/* Personal Demographics */}
                                      <div className="bg-slate-50 rounded-lg p-4">
                                        <h5 className="font-semibold text-slate-900 mb-3 text-sm flex items-center gap-2">
                                          <span>👤</span> Personal
                                        </h5>
                                        <div className="space-y-2 text-sm">
                                          <p><span className="text-slate-500">Gender:</span> <span className="text-slate-700">{personal.gender}</span></p>
                                          <p><span className="text-slate-500">Education:</span> <span className="text-slate-700">{personal.education}</span></p>
                                          <p><span className="text-slate-500">Occupation:</span> <span className="text-slate-700">{personal.occupation}</span></p>
                                          <p><span className="text-slate-500">Income:</span> <span className="text-slate-700">{personal.income}</span></p>
                                          <p><span className="text-slate-500">Family:</span> <span className="text-slate-700">{personal.familyStatus}</span></p>
                                          <p><span className="text-slate-500">Living:</span> <span className="text-slate-700">{personal.livingSituation}</span></p>
                                        </div>
                                      </div>
                                      
                                      {/* Professional Demographics */}
                                      <div className="bg-slate-50 rounded-lg p-4">
                                        <h5 className="font-semibold text-slate-900 mb-3 text-sm flex items-center gap-2">
                                          <span>💼</span> Professional
                                        </h5>
                                        <div className="space-y-2 text-sm">
                                          <p><span className="text-slate-500">Industry:</span> <span className="text-slate-700">{professional.industry}</span></p>
                                          <p><span className="text-slate-500">Company Size:</span> <span className="text-slate-700">{professional.companySize}</span></p>
                                          <p><span className="text-slate-500">Experience:</span> <span className="text-slate-700">{professional.experience} years</span></p>
                                          <p><span className="text-slate-500">Tech Skill:</span> <span className="text-slate-700">{professional.technicalSkill}/5</span></p>
                                          <p><span className="text-slate-500">Tools:</span> <span className="text-slate-700">{professional.toolsUsed?.join(", ")}</span></p>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Psychographics */}
                                    {psychographics && (
                                      <div className="bg-amber-50 rounded-lg p-4">
                                        <h5 className="font-semibold text-amber-900 mb-3 text-sm flex items-center gap-2">
                                          <span>🧠</span> Psychographics
                                        </h5>
                                        <div className="grid md:grid-cols-2 gap-3 text-sm">
                                          <p><span className="text-amber-700 font-medium">Traits:</span> <span className="text-amber-800">{Array.isArray(psychographics.personalityTraits) ? psychographics.personalityTraits.join(", ") : psychographics.personalityTraits}</span></p>
                                          <p><span className="text-amber-700 font-medium">Values:</span> <span className="text-amber-800">{Array.isArray(psychographics.values) ? psychographics.values.join(", ") : psychographics.values}</span></p>
                                          <p><span className="text-amber-700 font-medium">Motivations:</span> <span className="text-amber-800">{Array.isArray(psychographics.motivations) ? psychographics.motivations.join(", ") : psychographics.motivations}</span></p>
                                          <p><span className="text-amber-700 font-medium">Fears:</span> <span className="text-amber-800">{Array.isArray(psychographics.fears) ? psychographics.fears.join(", ") : psychographics.fears}</span></p>
                                          <p><span className="text-amber-700 font-medium">Hobbies:</span> <span className="text-amber-800">{Array.isArray(psychographics.hobbies) ? psychographics.hobbies.join(", ") : psychographics.hobbies}</span></p>
                                          <p><span className="text-amber-700 font-medium">Brands:</span> <span className="text-amber-800">{psychographics.favoriteBrands?.join(", ")}</span></p>
                                        </div>
                                      </div>
                                    )}

                                    {/* Usage Profile */}
                                    {usageProfile && (
                                      <div className="bg-emerald-50 rounded-lg p-4">
                                        <h5 className="font-semibold text-emerald-900 mb-3 text-sm flex items-center gap-2">
                                          <span>📱</span> Usage Profile
                                        </h5>
                                        <div className="grid md:grid-cols-2 gap-4">
                                          <div>
                                            <p className="text-sm font-medium text-emerald-800 mb-1">Patterns</p>
                                            <div className="space-y-1 text-sm text-emerald-700">
                                              <p>Frequency: {patterns.frequency}</p>
                                              <p>Duration: {patterns.sessionDuration} min</p>
                                              <p>Devices: {patterns.devices?.join(", ")}</p>
                                              <p>Context: {patterns.context}</p>
                                              <p>Time: {patterns.timeOfDay}</p>
                                            </div>
                                          </div>
                                          <div>
                                            <p className="text-sm font-medium text-emerald-800 mb-1">Goals</p>
                                            <ul className="space-y-1 text-sm text-emerald-700">
                                              {usageProfile.goals?.map((goal: string, i: number) => (
                                                <li key={i}>• {goal}</li>
                                              ))}
                                            </ul>
                                          </div>
                                        </div>
                                        
                                        {/* Pain Points */}
                                        {usageProfile.painPoints && usageProfile.painPoints.length > 0 && (
                                          <div className="mt-4 bg-rose-50 rounded-lg p-3">
                                            <p className="text-sm font-medium text-rose-800 mb-2">Pain Points</p>
                                            <ul className="space-y-2">
                                              {usageProfile.painPoints.map((pp: any, i: number) => (
                                                <li key={i} className="text-sm text-rose-700">
                                                  <span className="font-medium">{pp.title}:</span> {pp.description}
                                                </li>
                                              ))}
                                            </ul>
                                          </div>
                                        )}
                                        
                                        {/* Needs */}
                                        {usageProfile.needs && usageProfile.needs.length > 0 && (
                                          <div className="mt-3">
                                            <p className="text-sm font-medium text-emerald-800 mb-1">Needs</p>
                                            <p className="text-sm text-emerald-700">{usageProfile.needs.join(", ")}</p>
                                          </div>
                                        )}
                                      </div>
                                    )}

                                    {/* Journey Context */}
                                    {journeyContext && (
                                      <div className="bg-violet-50 rounded-lg p-4">
                                        <h5 className="font-semibold text-violet-900 mb-3 text-sm flex items-center gap-2">
                                          <span>🗺️</span> Journey Context
                                        </h5>
                                        <div className="space-y-2 text-sm text-violet-800">
                                          <p><span className="font-medium">Current Behavior:</span> {journeyContext.currentBehavior}</p>
                                          <p><span className="font-medium">Day in Life:</span> {journeyContext.dayInTheLife}</p>
                                          <p><span className="font-medium">Triggers:</span> {Array.isArray(journeyContext.triggerEvents) ? journeyContext.triggerEvents.join(", ") : journeyContext.triggerEvents}</p>
                                          <p><span className="font-medium">Decision Making:</span> {journeyContext.decisionMaking}</p>
                                        </div>
                                      </div>
                                    )}

                                    {/* Product Fit */}
                                    {productFit && (
                                      <div className="bg-cyan-50 rounded-lg p-4">
                                        <h5 className="font-semibold text-cyan-900 mb-3 text-sm flex items-center gap-2">
                                          <span>🎯</span> Product Fit
                                        </h5>
                                        <div className="space-y-2 text-sm text-cyan-800">
                                          <p><span className="font-medium">Why They Need It:</span> {productFit.whyTheyNeedTheProduct}</p>
                                          <p><span className="font-medium">How They'll Use It:</span> {productFit.howTheyllUseIt}</p>
                                          <p><span className="font-medium">Success Metrics:</span> {Array.isArray(productFit.successMetrics) ? productFit.successMetrics.join(", ") : productFit.successMetrics}</p>
                                          <p><span className="font-medium">Objections:</span> {Array.isArray(productFit.objections) ? productFit.objections.join(", ") : productFit.objections}</p>
                                        </div>
                                      </div>
                                    )}

                                    {/* Metadata & Validation */}
                                    <div className="grid md:grid-cols-2 gap-4">
                                      {metadata && (
                                        <div className="bg-slate-50 rounded-lg p-4">
                                          <h5 className="font-semibold text-slate-900 mb-2 text-sm">Metadata</h5>
                                          <div className="text-sm text-slate-700">
                                            <p>Segment: {metadata.segment}</p>
                                            <p>Related: {metadata.relatedPersonas?.join(", ")}</p>
                                          </div>
                                        </div>
                                      )}
                                      {validation && (
                                        <div className="bg-slate-50 rounded-lg p-4">
                                          <h5 className="font-semibold text-slate-900 mb-2 text-sm">Validation</h5>
                                          <div className="text-sm text-slate-700">
                                            <p>Data: {Array.isArray(validation.dataSources) ? validation.dataSources.join(", ") : validation.dataSources}</p>
                                            <p>Assumptions: {Array.isArray(validation.validatedAssumptions) ? validation.validatedAssumptions.join(", ") : validation.validatedAssumptions}</p>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </>
                      )}

                      {/* Questions Output */}
                      {"questions" in stepOutput && (
                        <>
                          <h3 className="font-semibold text-slate-900 mb-4">Clarifying Questions</h3>
                          <div className="space-y-3">
                            {stepOutput.questions?.map((q, idx) => (
                              <div key={idx} className="bg-white rounded-lg p-4 border border-slate-200">
                                <div className="flex items-start justify-between mb-2">
                                  <span className={`text-xs px-2 py-1 rounded-full ${
                                    q.category === 'user_needs' ? 'bg-indigo-100 text-indigo-700' :
                                    q.category === 'technical' ? 'bg-blue-100 text-blue-700' :
                                    q.category === 'business' ? 'bg-emerald-100 text-emerald-700' :
                                    q.category === 'scope' ? 'bg-amber-100 text-amber-700' :
                                    'bg-red-100 text-red-700'
                                  }`}>
                                    {q.category.replace('_', ' ')}
                                  </span>
                                  <span className="text-xs text-slate-400">Priority: {q.priority}</span>
                                </div>
                                <p className="font-medium text-slate-900 mb-2">{q.question}</p>
                                <div className="bg-slate-50 rounded p-3">
                                  <p className="text-sm text-slate-600">
                                    <span className="font-medium">AI Answer: </span>{q.aiSuggestedAnswer}
                                  </p>
                                </div>
                                {q.relatedPersona && (
                                  <p className="text-xs text-slate-500 mt-2">Related to: {q.relatedPersona}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        </>
                      )}

                      {/* Market Analysis Output - Flexible rendering for LLM response */}
                      {(stepOutput as any)?.marketOverview && (
                        <>
                          {/* Section 1: Market Overview */}
                          <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-200 mb-6">
                            <h3 className="font-semibold text-indigo-900 mb-4 text-lg flex items-center gap-2">
                              <span>📊</span> Market Overview
                            </h3>
                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                              <div className="bg-white/60 rounded-lg p-3">
                                <span className="text-xs text-indigo-600 font-medium uppercase">Industry Size</span>
                                <p className="text-sm text-indigo-800 mt-1">{(stepOutput as any).marketOverview?.industrySize}</p>
                              </div>
                              <div className="bg-white/60 rounded-lg p-3">
                                <span className="text-xs text-indigo-600 font-medium uppercase">Growth Rate</span>
                                <p className="text-sm text-indigo-800 mt-1">{(stepOutput as any).marketOverview?.growthRate}</p>
                              </div>
                            </div>
                            <div className="bg-white/60 rounded-lg p-3 mb-4">
                              <span className="text-xs text-indigo-600 font-medium uppercase block mb-1">Market Maturity</span>
                              <p className="text-sm text-indigo-800">{(stepOutput as any).marketOverview?.marketMaturity}</p>
                            </div>
                            {(stepOutput as any).marketOverview?.keyTrends && (
                              <div className="bg-white/60 rounded-lg p-3">
                                <span className="text-xs text-indigo-600 font-medium uppercase block mb-2">Key Trends</span>
                                <ul className="space-y-1">
                                  {(stepOutput as any).marketOverview.keyTrends.map((trend: string, i: number) => (
                                    <li key={i} className="text-sm text-indigo-800 flex items-start gap-2">
                                      <span className="text-indigo-500 mt-0.5">•</span>
                                      <span>{trend}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>

                          {/* Section 2: Competitor Analysis */}
                          {(stepOutput as any)?.competitors && (stepOutput as any).competitors.length > 0 && (
                            <>
                              <h3 className="font-semibold text-slate-900 mb-4 text-lg flex items-center gap-2">
                                <span>🏢</span> Competitor Analysis
                                <Badge variant="secondary" className="bg-slate-100 text-slate-700">
                                  {(stepOutput as any).competitors.length} competitors
                                </Badge>
                              </h3>
                              <div className="grid gap-6">
                                {(stepOutput as any).competitors.map((comp: any, idx: number) => (
                                  <div key={idx} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                    {/* Competitor Header */}
                                    <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-4 border-b border-slate-200">
                                      <h4 className="font-bold text-lg text-slate-900">{comp.name}</h4>
                                    </div>
                                    
                                    <div className="p-5 space-y-5">
                                      {/* Company Background */}
                                      {comp.companyBackground && (
                                        <div className="bg-slate-50 rounded-lg p-4">
                                          <h5 className="font-semibold text-slate-900 mb-2 text-sm flex items-center gap-2">
                                            <span>🏭</span> Company Background
                                          </h5>
                                          <p className="text-sm text-slate-700">{typeof comp.companyBackground === 'string' ? comp.companyBackground : JSON.stringify(comp.companyBackground)}</p>
                                        </div>
                                      )}

                                      {/* SWOT Analysis */}
                                      {(comp.SWOTAnalysis || comp.swotAnalysis) && (
                                        <div>
                                          <h5 className="font-semibold text-slate-900 mb-3 text-sm flex items-center gap-2">
                                            <span>📋</span> SWOT Analysis
                                          </h5>
                                          <div className="grid grid-cols-2 gap-3">
                                            {/* Strengths */}
                                            <div className="bg-emerald-50 rounded-lg p-3">
                                              <span className="text-xs font-semibold text-emerald-700 uppercase block mb-2">Strengths</span>
                                              <ul className="space-y-1">
                                                {(comp.SWOTAnalysis?.strengths || comp.swotAnalysis?.strengths || []).map((s: string, i: number) => (
                                                  <li key={i} className="text-xs text-emerald-800 flex items-start gap-1">
                                                    <span className="text-emerald-500">+</span>
                                                    <span>{s}</span>
                                                  </li>
                                                ))}
                                              </ul>
                                            </div>
                                            {/* Weaknesses */}
                                            <div className="bg-rose-50 rounded-lg p-3">
                                              <span className="text-xs font-semibold text-rose-700 uppercase block mb-2">Weaknesses</span>
                                              <ul className="space-y-1">
                                                {(comp.SWOTAnalysis?.weaknesses || comp.swotAnalysis?.weaknesses || []).map((w: string, i: number) => (
                                                  <li key={i} className="text-xs text-rose-800 flex items-start gap-1">
                                                    <span className="text-rose-500">-</span>
                                                    <span>{w}</span>
                                                  </li>
                                                ))}
                                              </ul>
                                            </div>
                                            {/* Opportunities */}
                                            <div className="bg-blue-50 rounded-lg p-3">
                                              <span className="text-xs font-semibold text-blue-700 uppercase block mb-2">Opportunities</span>
                                              <ul className="space-y-1">
                                                {(comp.SWOTAnalysis?.opportunities || comp.swotAnalysis?.opportunities || []).map((o: string, i: number) => (
                                                  <li key={i} className="text-xs text-blue-800 flex items-start gap-1">
                                                    <span className="text-blue-500">◆</span>
                                                    <span>{o}</span>
                                                  </li>
                                                ))}
                                              </ul>
                                            </div>
                                            {/* Threats */}
                                            <div className="bg-amber-50 rounded-lg p-3">
                                              <span className="text-xs font-semibold text-amber-700 uppercase block mb-2">Threats</span>
                                              <ul className="space-y-1">
                                                {(comp.SWOTAnalysis?.threats || comp.swotAnalysis?.threats || []).map((t: string, i: number) => (
                                                  <li key={i} className="text-xs text-amber-800 flex items-start gap-1">
                                                    <span className="text-amber-500">!</span>
                                                    <span>{t}</span>
                                                  </li>
                                                ))}
                                              </ul>
                                            </div>
                                          </div>
                                        </div>
                                      )}

                                      {/* Market Positioning */}
                                      {comp.marketPositioning && (
                                        <div className="bg-violet-50 rounded-lg p-4">
                                          <h5 className="font-semibold text-violet-900 mb-2 text-sm flex items-center gap-2">
                                            <span>🎯</span> Market Positioning
                                          </h5>
                                          <p className="text-sm text-violet-800">{typeof comp.marketPositioning === 'string' ? comp.marketPositioning : JSON.stringify(comp.marketPositioning)}</p>
                                        </div>
                                      )}

                                      {/* Dynamic Fields - Render any additional competitor fields */}
                                      {(() => {
                                        const knownFields = ['name', 'companyBackground', 'SWOTAnalysis', 'swotAnalysis', 'marketPositioning'];
                                        const otherFields = Object.keys(comp).filter(k => !knownFields.includes(k));
                                        
                                        return otherFields.length > 0 && (
                                          <div className="space-y-3">
                                            {otherFields.map((field) => {
                                              const value = comp[field];
                                              if (typeof value === 'string') {
                                                return (
                                                  <div key={field} className="bg-slate-50 rounded-lg p-3">
                                                    <p className="text-xs font-semibold text-slate-500 uppercase mb-1">{field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</p>
                                                    <p className="text-sm text-slate-700">{value}</p>
                                                  </div>
                                                );
                                              }
                                              if (Array.isArray(value)) {
                                                return (
                                                  <div key={field} className="bg-cyan-50 rounded-lg p-3">
                                                    <p className="text-xs font-semibold text-cyan-700 uppercase mb-2">{field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</p>
                                                    <ul className="space-y-1">
                                                      {value.map((item, i) => (
                                                        <li key={i} className="text-sm text-cyan-800">• {typeof item === 'string' ? item : JSON.stringify(item)}</li>
                                                      ))}
                                                    </ul>
                                                  </div>
                                                );
                                              }
                                              return null;
                                            })}
                                          </div>
                                        );
                                      })()}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </>
                          )}

                          {/* Competitive Landscape Summary */}
                          {(stepOutput as any)?.competitiveLandscape && (
                            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 mt-6">
                              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                <span>🗺️</span> Competitive Landscape
                              </h3>
                              <div className="grid md:grid-cols-3 gap-4">
                                {(stepOutput as any).competitiveLandscape?.marketLeaders && (
                                  <div className="bg-white rounded-lg p-3">
                                    <span className="text-xs font-semibold text-slate-500 uppercase block mb-2">Market Leaders</span>
                                    <ul className="space-y-1">
                                      {(stepOutput as any).competitiveLandscape.marketLeaders.map((leader: string, i: number) => (
                                        <li key={i} className="text-sm text-slate-700 flex items-center gap-2">
                                          <span className="text-amber-500">★</span>
                                          <span>{leader}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                {(stepOutput as any).competitiveLandscape?.emergingPlayers && (
                                  <div className="bg-white rounded-lg p-3">
                                    <span className="text-xs font-semibold text-slate-500 uppercase block mb-2">Emerging Players</span>
                                    <ul className="space-y-1">
                                      {(stepOutput as any).competitiveLandscape.emergingPlayers.map((player: string, i: number) => (
                                        <li key={i} className="text-sm text-slate-700 flex items-center gap-2">
                                          <span className="text-emerald-500">▲</span>
                                          <span>{player}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                {(stepOutput as any).competitiveLandscape?.nicheCompetitors && (
                                  <div className="bg-white rounded-lg p-3">
                                    <span className="text-xs font-semibold text-slate-500 uppercase block mb-2">Niche Competitors</span>
                                    <ul className="space-y-1">
                                      {(stepOutput as any).competitiveLandscape.nicheCompetitors.map((competitor: string, i: number) => (
                                        <li key={i} className="text-sm text-slate-700 flex items-center gap-2">
                                          <span className="text-violet-500">◇</span>
                                          <span>{competitor}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Section 3: Our Positioning */}
                          {(stepOutput as any)?.ourPositioning && (
                            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-200 mt-6">
                              <h3 className="font-semibold text-emerald-900 mb-4 text-lg flex items-center gap-2">
                                <span>🎯</span> Our Positioning Strategy
                              </h3>
                              <div className="grid md:grid-cols-2 gap-4">
                                {(stepOutput as any).ourPositioning?.competitiveAdvantage && (
                                  <div className="bg-white/60 rounded-lg p-4">
                                    <span className="text-xs font-semibold text-emerald-700 uppercase block mb-2">Competitive Advantage</span>
                                    <p className="text-sm text-emerald-800">{(stepOutput as any).ourPositioning.competitiveAdvantage}</p>
                                  </div>
                                )}
                                {(stepOutput as any).ourPositioning?.marketGap && (
                                  <div className="bg-white/60 rounded-lg p-4">
                                    <span className="text-xs font-semibold text-emerald-700 uppercase block mb-2">Market Gap</span>
                                    <p className="text-sm text-emerald-800">{(stepOutput as any).ourPositioning.marketGap}</p>
                                  </div>
                                )}
                                {(stepOutput as any).ourPositioning?.differentiationStrategy && (
                                  <div className="bg-white/60 rounded-lg p-4 md:col-span-2">
                                    <span className="text-xs font-semibold text-emerald-700 uppercase block mb-2">Differentiation Strategy</span>
                                    <p className="text-sm text-emerald-800">{(stepOutput as any).ourPositioning.differentiationStrategy}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </>
                      )}

                      {/* PRD Output - Structured Card Layout */}
                      {(stepOutput as any)?.metadata && (
                        <>
                          {/* PRD Header Card */}
                          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white mb-6">
                            <h3 className="text-2xl font-bold mb-2">{(stepOutput as any).metadata?.productName || "Product Requirements Document"}</h3>
                            <div className="flex flex-wrap gap-3 text-sm text-indigo-100">
                              <span className="bg-white/20 px-3 py-1 rounded-full">v{(stepOutput as any).metadata?.version || "1.0"}</span>
                              <span className="bg-white/20 px-3 py-1 rounded-full">{(stepOutput as any).metadata?.status || "Draft"}</span>
                              <span>📅 {(stepOutput as any).metadata?.date || new Date().toLocaleDateString()}</span>
                              <span>✍️ {(stepOutput as any).metadata?.authorName || "Product Team"}</span>
                            </div>
                          </div>

                          {(() => {
                            const prd = stepOutput as any;
                            return (
                              <>
                                {/* 01. Background */}
                                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden mb-4">
                                  <div className="bg-slate-50 px-5 py-3 border-b border-slate-200">
                                    <h4 className="font-bold text-slate-900 flex items-center gap-2"><span className="text-xl">📋</span> 01. Background</h4>
                                  </div>
                                  <div className="p-5 space-y-4">
                                    {/* Problem Statement */}
                                    <div>
                                      <h5 className="font-semibold text-slate-800 mb-2 text-sm">Problem Statement</h5>
                                      <ul className="space-y-1">
                                        {prd.background?.problemStatement?.map((p: string, i: number) => (
                                          <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                                            <span className="text-red-500 mt-0.5">•</span>{p}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                    {/* Market Opportunity */}
                                    <div>
                                      <h5 className="font-semibold text-slate-800 mb-2 text-sm">Market Opportunity</h5>
                                      <ul className="space-y-1">
                                        {prd.background?.marketOpportunity?.map((m: string, i: number) => (
                                          <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                                            <span className="text-emerald-500 mt-0.5">•</span>{m}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                    {/* Personas */}
                                    <div className="grid md:grid-cols-2 gap-3">
                                      {['persona1', 'persona2'].map((key, idx) => {
                                        const persona = prd.background?.userPersonas?.[key];
                                        if (!persona) return null;
                                        return (
                                          <div key={key} className="bg-indigo-50 rounded-lg p-3 border border-indigo-100">
                                            <h6 className="font-bold text-indigo-900 text-sm mb-2">👤 {persona.name || `Persona ${idx + 1}`}</h6>
                                            <p className="text-xs text-slate-600 mb-1"><span className="font-medium">Characteristics:</span> {persona.characteristics}</p>
                                            <p className="text-xs text-slate-600 mb-1"><span className="font-medium">Needs:</span> {persona.needs}</p>
                                            <p className="text-xs text-slate-600"><span className="font-medium">Challenges:</span> {persona.challenges}</p>
                                          </div>
                                        );
                                      })}
                                    </div>
                                    {/* Vision */}
                                    <div className="bg-amber-50 rounded-lg p-3 border border-amber-100">
                                      <h5 className="font-semibold text-amber-900 mb-1 text-sm">⭐ Vision Statement</h5>
                                      <p className="text-sm text-slate-700">{prd.background?.visionStatement}</p>
                                    </div>
                                  </div>
                                </div>

                                {/* 02. Objectives */}
                                <div className="bg-emerald-50 rounded-xl border border-emerald-200 overflow-hidden mb-4">
                                  <div className="bg-emerald-100/50 px-5 py-3 border-b border-emerald-200">
                                    <h4 className="font-bold text-emerald-900 flex items-center gap-2"><span className="text-xl">🎯</span> 02. Objectives</h4>
                                  </div>
                                  <div className="p-5 space-y-4">
                                    {/* SMART Goals */}
                                    <div className="bg-white rounded-lg p-3 border border-emerald-100">
                                      <h5 className="font-semibold text-emerald-800 mb-2 text-sm">SMART Goals</h5>
                                      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                                        {['specific', 'measurable', 'achievable', 'relevant', 'timebound'].map((goal) => (
                                          <div key={goal} className="bg-emerald-50/50 rounded p-2 text-center">
                                            <p className="text-[10px] font-bold text-emerald-700 uppercase">{goal}</p>
                                            <p className="text-xs text-slate-600 mt-1 line-clamp-3">{prd.objectives?.smartGoals?.[goal] || '-'}</p>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                    {/* KPIs */}
                                    <div className="grid md:grid-cols-2 gap-3">
                                      <div>
                                        <h5 className="font-semibold text-slate-800 mb-2 text-sm">Key Performance Indicators</h5>
                                        <ul className="space-y-1">
                                          {prd.objectives?.kpis?.map((kpi: string, i: number) => (
                                            <li key={i} className="text-sm text-slate-600 flex items-center gap-2">
                                              <span className="text-emerald-500">📊</span>{kpi}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                      <div>
                                        <h5 className="font-semibold text-slate-800 mb-2 text-sm">Qualitative Objectives</h5>
                                        <ul className="space-y-1">
                                          {prd.objectives?.qualitativeObjectives?.map((obj: string, i: number) => (
                                            <li key={i} className="text-sm text-slate-600 flex items-center gap-2">
                                              <span className="text-blue-500">🎯</span>{obj}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* 03. Features */}
                                <div className="bg-blue-50 rounded-xl border border-blue-200 overflow-hidden mb-4">
                                  <div className="bg-blue-100/50 px-5 py-3 border-b border-blue-200">
                                    <h4 className="font-bold text-blue-900 flex items-center gap-2"><span className="text-xl">⚙️</span> 03. Features</h4>
                                  </div>
                                  <div className="p-5 space-y-4">
                                    {/* Core Features */}
                                    <div className="grid md:grid-cols-3 gap-3">
                                      {['feature1', 'feature2', 'feature3'].map((key, idx) => {
                                        const feature = prd.features?.coreFeatures?.[key];
                                        if (!feature) return null;
                                        return (
                                          <div key={key} className="bg-white rounded-lg p-3 border border-blue-100">
                                            <h6 className="font-bold text-blue-900 text-sm mb-2">{feature.name || `Feature ${idx + 1}`}</h6>
                                            <p className="text-xs text-slate-600 mb-2">{feature.description}</p>
                                            <p className="text-xs text-blue-600"><span className="font-medium">Benefit:</span> {feature.benefit}</p>
                                          </div>
                                        );
                                      })}
                                    </div>
                                    {/* Prioritization */}
                                    <div>
                                      <h5 className="font-semibold text-slate-800 mb-2 text-sm">Feature Prioritization (RICE)</h5>
                                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                        {[
                                          { key: 'p0', label: 'P0 - Critical', color: 'red' },
                                          { key: 'p1', label: 'P1 - High', color: 'amber' },
                                          { key: 'p2', label: 'P2 - Medium', color: 'blue' },
                                          { key: 'p3', label: 'P3 - Low', color: 'slate' }
                                        ].map(({ key, label, color }) => {
                                          const item = prd.features?.prioritization?.[key];
                                          if (!item) return null;
                                          return (
                                            <div key={key} className={`bg-${color}-50 rounded-lg p-2 border border-${color}-100`}>
                                              <p className={`text-[10px] font-bold text-${color}-700 mb-1`}>{label}</p>
                                              <p className="text-xs text-slate-700 font-medium line-clamp-2">{item.feature}</p>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* 04. User Experience */}
                                <div className="bg-purple-50 rounded-xl border border-purple-200 overflow-hidden mb-4">
                                  <div className="bg-purple-100/50 px-5 py-3 border-b border-purple-200">
                                    <h4 className="font-bold text-purple-900 flex items-center gap-2"><span className="text-xl">🎨</span> 04. User Experience</h4>
                                  </div>
                                  <div className="p-5 space-y-4">
                                    {/* UI Design */}
                                    <div className="grid md:grid-cols-3 gap-3">
                                      {['principles', 'visualStyle', 'wireframes'].map((key) => (
                                        <div key={key} className="bg-white rounded-lg p-3 border border-purple-100">
                                          <h6 className="font-bold text-purple-900 text-xs mb-1 uppercase">{key}</h6>
                                          <p className="text-xs text-slate-600">{prd.userExperience?.uiDesign?.[key] || '-'}</p>
                                        </div>
                                      ))}
                                    </div>
                                    {/* User Journey */}
                                    <div className="bg-white rounded-lg p-3 border border-purple-100">
                                      <h5 className="font-semibold text-purple-800 mb-2 text-sm">User Journey</h5>
                                      <div className="flex flex-wrap gap-2">
                                        {['onboarding', 'coreFlow', 'engagement'].map((key) => (
                                          <span key={key} className="bg-purple-50 px-3 py-1 rounded-full text-xs text-purple-700">
                                            <span className="font-medium">{key}:</span> {prd.userExperience?.userJourney?.[key]}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* 05. Milestones */}
                                <div className="bg-amber-50 rounded-xl border border-amber-200 overflow-hidden mb-4">
                                  <div className="bg-amber-100/50 px-5 py-3 border-b border-amber-200">
                                    <h4 className="font-bold text-amber-900 flex items-center gap-2"><span className="text-xl">📅</span> 05. Milestones</h4>
                                  </div>
                                  <div className="p-5">
                                    <div className="space-y-2">
                                      {prd.milestones?.phases?.map((phase: any, i: number) => (
                                        <div key={i} className="bg-white rounded-lg p-3 border border-amber-100 flex items-center justify-between">
                                          <div className="flex items-center gap-3">
                                            <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-bold">{i + 1}</span>
                                            <span className="text-sm font-medium text-slate-700">{phase.activity}</span>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <span className="text-xs text-slate-500">{phase.duration}</span>
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                                              phase.status === 'Complete' ? 'bg-emerald-100 text-emerald-700' :
                                              phase.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                                              'bg-slate-100 text-slate-600'
                                            }`}>{phase.status}</span>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>

                                {/* 06. Technical Requirements */}
                                <div className="bg-cyan-50 rounded-xl border border-cyan-200 overflow-hidden mb-4">
                                  <div className="bg-cyan-100/50 px-5 py-3 border-b border-cyan-200">
                                    <h4 className="font-bold text-cyan-900 flex items-center gap-2"><span className="text-xl">🔧</span> 06. Technical Requirements</h4>
                                  </div>
                                  <div className="p-5 space-y-4">
                                    {/* Tech Stack */}
                                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                                      {['frontend', 'backend', 'database', 'cloud', 'cicd'].map((tech) => (
                                        <div key={tech} className="bg-white rounded-lg p-2 border border-cyan-100 text-center">
                                          <p className="text-[10px] font-bold text-cyan-700 uppercase mb-1">{tech}</p>
                                          <p className="text-xs text-slate-700">{prd.technicalRequirements?.techStack?.[tech] || '-'}</p>
                                        </div>
                                      ))}
                                    </div>
                                    {/* Performance */}
                                    <div className="bg-white rounded-lg p-3 border border-cyan-100">
                                      <h5 className="font-semibold text-cyan-800 mb-2 text-sm">Performance Requirements</h5>
                                      <div className="flex flex-wrap gap-2">
                                        {['responseTime', 'uptime', 'scalability'].map((key) => (
                                          <span key={key} className="bg-cyan-50 px-3 py-1 rounded-full text-xs text-cyan-700">
                                            <span className="font-medium">{key}:</span> {prd.technicalRequirements?.performance?.[key]}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* 07. Success Metrics & 08. Appendix */}
                                <div className="grid md:grid-cols-2 gap-4">
                                  <div className="bg-rose-50 rounded-xl border border-rose-200 overflow-hidden">
                                    <div className="bg-rose-100/50 px-5 py-3 border-b border-rose-200">
                                      <h4 className="font-bold text-rose-900 flex items-center gap-2"><span className="text-xl">📊</span> 07. Success Metrics</h4>
                                    </div>
                                    <div className="p-5 space-y-2">
                                      <div className="bg-white rounded-lg p-3 border border-rose-100">
                                        <p className="text-xs text-slate-500 mb-1">Primary Metric</p>
                                        <p className="text-sm font-medium text-slate-700">{prd.successMetrics?.primary}</p>
                                      </div>
                                      <div className="bg-white rounded-lg p-3 border border-rose-100">
                                        <p className="text-xs text-slate-500 mb-1">Secondary Metrics</p>
                                        <p className="text-sm text-slate-700">{prd.successMetrics?.secondary}</p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
                                    <div className="bg-slate-100/50 px-5 py-3 border-b border-slate-200">
                                      <h4 className="font-bold text-slate-900 flex items-center gap-2"><span className="text-xl">📎</span> 08. Appendix</h4>
                                    </div>
                                    <div className="p-5 space-y-2">
                                      <div className="bg-white rounded-lg p-3 border border-slate-200">
                                        <p className="text-xs text-slate-500 mb-1">Glossary</p>
                                        <p className="text-sm text-slate-700">{prd.appendix?.glossary}</p>
                                      </div>
                                      <div className="bg-white rounded-lg p-3 border border-slate-200">
                                        <p className="text-xs text-slate-500 mb-1">References</p>
                                        <p className="text-sm text-slate-700">{prd.appendix?.references}</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </>
                            );
                          })()}
                        </>
                      )}

                      {/* User Stories Output - Flexible Renderer */}
                      {(() => {
                        const output = stepOutput as any;
                        console.log("User Stories UI rendering - stepOutput:", output);
                        // Handle multiple possible structures:
                        // 1. Array of epics (each with "epic" and "stories" properties)
                        // 2. Direct array of stories
                        // 3. Object with stories property
                        let storiesData: any[] = [];
                        let epicData: any[] = [];
                        let summaryData: any = null;
                        let riceScoresData: any[] = [];
                        let definitionOfReadyData: string[] = [];
                        let definitionOfDoneData: string[] = [];
                        
                        if (Array.isArray(output)) {
                          // Check if it's an array of epics or direct array of stories
                          if (output.length > 0 && output[0].epic && output[0].stories) {
                            // Array of epics - extract stories from each epic
                            epicData = output;
                            output.forEach((epic: any) => {
                              if (epic.stories && Array.isArray(epic.stories)) {
                                storiesData = [...storiesData, ...epic.stories];
                              }
                            });
                            console.log("User Stories - parsed as array of epics, total stories:", storiesData.length);
                          } else {
                            // Direct array - treat as stories
                            storiesData = output;
                            console.log("User Stories - parsed as direct array, length:", storiesData.length);
                          }
                        } else if (output.stories && Array.isArray(output.stories)) {
                          // Object with stories property
                          storiesData = output.stories;
                          summaryData = output.summary;
                          riceScoresData = output.riceScores || [];
                          definitionOfReadyData = output.definitionOfReady || [];
                          definitionOfDoneData = output.definitionOfDone || [];
                          console.log("User Stories - parsed as object with stories property, stories length:", storiesData.length);
                        } else {
                          console.log("User Stories - no valid stories data found, output structure:", Object.keys(output || {}));
                        }
                        
                        if (!storiesData || storiesData.length === 0) {
                          console.log("User Stories - returning null due to no stories data");
                          return null;
                        }
                        
                        // Calculate stats
                        let totalStories = storiesData.length;
                        let totalPoints = 0;
                        let p0Count = 0;
                        let p1Count = 0;
                        let p2Count = 0;
                        let p3Count = 0;
                        let riceScores: number[] = [];
                        
                        storiesData.forEach((story: any) => {
                          totalPoints += story.storyPoints || 0;
                          const priority = story.priority;
                          if (priority === 'P0') p0Count++;
                          else if (priority === 'P1') p1Count++;
                          else if (priority === 'P2') p2Count++;
                          else if (priority === 'P3') p3Count++;
                          
                          // Handle RICE object with score field
                          if (story.RICE?.score) riceScores.push(story.RICE.score);
                          else if (story.RICE?.riceScore) riceScores.push(story.RICE.riceScore);
                          else if (story.riceScore) riceScores.push(story.riceScore);
                        });
                        
                        // Also count from riceScoresData if available
                        if (riceScoresData.length > 0) {
                          riceScoresData.forEach((rs: any) => {
                            if (rs.riceScore) riceScores.push(rs.riceScore);
                            else if (rs.score) riceScores.push(rs.score);
                          });
                        }
                        
                        const avgRICE = riceScores.length > 0 
                          ? (riceScores.reduce((a, b) => a + b, 0) / riceScores.length).toFixed(3)
                          : '-';
                        
                        // Use summary data if available, otherwise use calculated values
                        const displaySummary = summaryData || {
                          totalStories,
                          totalStoryPoints: totalPoints,
                          p0Count,
                          p1Count,
                          p2Count,
                          p3Count,
                          averageRICEScore: parseFloat(avgRICE) || 0
                        };
                        
                        // Group stories by epic (if epicData exists) or by feature
                        const storiesByEpic = epicData.length > 0 
                          ? epicData.reduce((acc: any, epic: any) => {
                              acc[epic.epic || 'Uncategorized'] = epic.stories;
                              return acc;
                            }, {})
                          : storiesData.reduce((acc: any, story: any) => {
                              const feature = story.feature || story.featureName || 'Uncategorized';
                              if (!acc[feature]) acc[feature] = [];
                              acc[feature].push(story);
                              return acc;
                            }, {});
                        
                        // Create a map of riceScores by storyId for easy lookup
                        const riceScoresMap = new Map();
                        riceScoresData.forEach((rs: any) => {
                          riceScoresMap.set(rs.storyId, rs);
                        });
                        
                        return (
                          <>
                            {/* Summary Stats */}
                            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-5 border border-indigo-200 mb-6">
                              <h3 className="font-bold text-lg text-indigo-900 mb-4">📚 User Stories Summary</h3>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                                <div className="bg-white rounded-lg p-3 shadow-sm">
                                  <span className="text-xs text-slate-500 block">Total Stories</span>
                                  <span className="font-bold text-indigo-700 text-lg">{displaySummary.totalStories}</span>
                                </div>
                                <div className="bg-white rounded-lg p-3 shadow-sm">
                                  <span className="text-xs text-slate-500 block">Story Points</span>
                                  <span className="font-bold text-indigo-700 text-lg">{displaySummary.totalStoryPoints}</span>
                                </div>
                                <div className="bg-white rounded-lg p-3 shadow-sm">
                                  <span className="text-xs text-slate-500 block">Avg RICE Score</span>
                                  <span className="font-bold text-indigo-700 text-lg">{displaySummary.averageRICEScore?.toFixed(3) || avgRICE}</span>
                                </div>
                                <div className="bg-white rounded-lg p-3 shadow-sm">
                                  <span className="text-xs text-slate-500 block">P0 (Critical)</span>
                                  <span className="font-bold text-red-600 text-lg">{displaySummary.p0Count}</span>
                                </div>
                                <div className="bg-white rounded-lg p-3 shadow-sm">
                                  <span className="text-xs text-slate-500 block">P1 (High)</span>
                                  <span className="font-bold text-amber-600 text-lg">{displaySummary.p1Count}</span>
                                </div>
                                <div className="bg-white rounded-lg p-3 shadow-sm">
                                  <span className="text-xs text-slate-500 block">P2/P3 (Med/Low)</span>
                                  <span className="font-bold text-blue-600 text-lg">{displaySummary.p2Count + displaySummary.p3Count}</span>
                                </div>
                              </div>
                            </div>

                            {/* Epic & Stories Detail - Grouped by Epic */}
                            <div className="space-y-6">
                              {Object.entries(storiesByEpic).map(([epicName, stories]: [string, any], epicIdx: number) => (
                                <div key={epicIdx} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                                  {/* Epic Header */}
                                  <div className="bg-slate-100 px-5 py-3 border-b border-slate-200">
                                    <h4 className="font-bold text-slate-800 flex items-center gap-2">
                                      <span className="text-lg">📦</span>
                                      {epicName}
                                    </h4>
                                  </div>
                                  
                                  {/* Stories in this Epic */}
                                  <div className="p-4 space-y-4">
                                    {stories.map((story: any, storyIdx: number) => {
                                      const riceScore = riceScoresMap.get(story.id) || story.RICE;
                                      return (
                                        <div key={storyIdx} className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                                          {/* Story ID & Persona */}
                                          <div className="flex items-center gap-2 mb-2">
                                            <span className="text-xs font-bold text-slate-400">#{story.id}</span>
                                            {story.persona && (
                                              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                                                👤 {story.persona}
                                              </span>
                                            )}
                                          </div>
                                          
                                          {/* Story Description */}
                                          <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1">
                                              <p className="text-sm text-slate-700 leading-relaxed">{story.description}</p>
                                            </div>
                                            <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                                              <span className={`px-2 py-1 rounded text-xs font-bold ${
                                                story.priority === 'P0' ? 'bg-red-100 text-red-700' :
                                                story.priority === 'P1' ? 'bg-amber-100 text-amber-700' :
                                                story.priority === 'P2' ? 'bg-blue-100 text-blue-700' :
                                                story.priority === 'P3' ? 'bg-slate-100 text-slate-600' :
                                                'bg-slate-100 text-slate-600'
                                              }`}>
                                                {story.priority || 'P?'}
                                              </span>
                                              <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-bold">
                                                {story.storyPoints || 0} pts
                                              </span>
                                            </div>
                                          </div>
                                          
                                          {/* RICE Score Badges */}
                                          {riceScore && (
                                            <div className="flex flex-wrap gap-2 mb-3">
                                              <span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded text-xs font-medium border border-emerald-100">
                                                RICE: {riceScore.score?.toFixed(3) || riceScore.riceScore?.toFixed(3) || riceScore.riceScoreNormalized || '-'}
                                              </span>
                                              <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs border border-blue-100">
                                                Reach: {riceScore.reach ?? '-'}
                                              </span>
                                              <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs border border-purple-100">
                                                Impact: {riceScore.impact ?? '-'}
                                              </span>
                                              <span className="px-2 py-1 bg-amber-50 text-amber-700 rounded text-xs border border-amber-100">
                                                Conf: {riceScore.confidence ? `${Math.round(riceScore.confidence * 100)}%` : '-'}
                                              </span>
                                              <span className="px-2 py-1 bg-rose-50 text-rose-700 rounded text-xs border border-rose-100">
                                                Effort: {riceScore.effort ?? '-'}
                                              </span>
                                            </div>
                                          )}
                                          
                                          {/* Acceptance Criteria - Handle both string array and object array */}
                                          {story.acceptanceCriteria && Array.isArray(story.acceptanceCriteria) && story.acceptanceCriteria.length > 0 && (
                                            <div className="bg-white rounded p-3 border border-slate-200">
                                              <p className="text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">Acceptance Criteria</p>
                                              <ul className="space-y-2">
                                                {story.acceptanceCriteria.map((criteria: any, i: number) => (
                                                  <li key={i} className="text-xs text-slate-600">
                                                    {typeof criteria === 'string' ? (
                                                      <span className="flex items-start gap-2">
                                                        <span className="text-emerald-500 mt-0.5">✓</span>
                                                        <span className="leading-relaxed">{criteria}</span>
                                                      </span>
                                                    ) : (
                                                      <div className="bg-slate-50 rounded p-2">
                                                        <span className="text-emerald-500 mr-1">✓</span>
                                                        <span className="font-medium">Given</span> {criteria.given},{' '}
                                                        <span className="font-medium">When</span> {criteria.when},{' '}
                                                        <span className="font-medium">Then</span> {criteria.then}
                                                      </div>
                                                    )}
                                                  </li>
                                                ))}
                                              </ul>
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Definition of Ready */}
                            {(definitionOfReadyData.length > 0 || (output.definitionOfReady && Array.isArray(output.definitionOfReady))) && (
                              <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-200 mt-6">
                                <h4 className="font-bold text-emerald-900 mb-3 flex items-center gap-2">
                                  <span>📋</span> Definition of Ready
                                </h4>
                                <ul className="space-y-2 text-sm text-emerald-800">
                                  {(definitionOfReadyData.length > 0 ? definitionOfReadyData : output.definitionOfReady).map((item: string, i: number) => (
                                    <li key={i} className="flex items-start gap-2">
                                      <span className="text-emerald-600 mt-0.5">•</span>
                                      <span>{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Definition of Done */}
                            {(definitionOfDoneData.length > 0 || (output.definitionOfDone && Array.isArray(output.definitionOfDone))) && (
                              <div className="bg-blue-50 rounded-xl p-5 border border-blue-200 mt-4">
                                <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                                  <span>✅</span> Definition of Done
                                </h4>
                                <ul className="space-y-2 text-sm text-blue-800">
                                  {(definitionOfDoneData.length > 0 ? definitionOfDoneData : output.definitionOfDone).map((item: string, i: number) => (
                                    <li key={i} className="flex items-start gap-2">
                                      <span className="text-blue-600 mt-0.5">•</span>
                                      <span>{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Recommendations */}
                            {(output.recommendations && Array.isArray(output.recommendations) && output.recommendations.length > 0) && (
                              <div className="bg-amber-50 rounded-xl p-5 border border-amber-200 mt-4">
                                <h4 className="font-bold text-amber-900 mb-3 flex items-center gap-2">
                                  <span>💡</span> Recommendations
                                </h4>
                                <ul className="space-y-2 text-sm text-amber-800">
                                  {output.recommendations.map((rec: string, i: number) => (
                                    <li key={i} className="flex items-start gap-2">
                                      <span className="text-amber-600 mt-0.5">→</span>
                                      <span>{rec}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </>
                        );
                      })()}

                      {/* Roadmap Output */}
                      {"phases" in stepOutput && (
                        <>
                          {/* Roadmap Title & Description */}
                          <div className="mb-4">
                            <h3 className="text-xl font-bold text-slate-900">{(stepOutput as RoadmapOutput).title}</h3>
                            <p className="text-sm text-slate-600 mt-1">{(stepOutput as RoadmapOutput).description}</p>
                          </div>

                          {/* Roadmap Summary Header */}
                          <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200 mb-4">
                            <h4 className="font-semibold text-indigo-900 mb-3">Roadmap Overview</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                              <div className="bg-white rounded p-2">
                                <span className="text-xs text-slate-500 block">Total Phases</span>
                                <span className="font-semibold text-indigo-700">{(stepOutput as RoadmapOutput).summary?.phases || 0}</span>
                              </div>
                              <div className="bg-white rounded p-2">
                                <span className="text-xs text-slate-500 block">Total Weeks</span>
                                <span className="font-semibold text-indigo-700">{(stepOutput as RoadmapOutput).timeframe?.totalWeeks || 0}</span>
                              </div>
                              <div className="bg-white rounded p-2">
                                <span className="text-xs text-slate-500 block">Total Stories</span>
                                <span className="font-semibold text-indigo-700">{(stepOutput as RoadmapOutput).summary?.totalStories || 0}</span>
                              </div>
                              <div className="bg-white rounded p-2">
                                <span className="text-xs text-slate-500 block">Story Points</span>
                                <span className="font-semibold text-indigo-700">{(stepOutput as RoadmapOutput).summary?.totalStoryPoints || 0}</span>
                              </div>
                            </div>
                            <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600">
                              <div><span className="font-medium">Start:</span> {(stepOutput as RoadmapOutput).timeframe?.startDate}</div>
                              <div><span className="font-medium">End:</span> {(stepOutput as RoadmapOutput).timeframe?.endDate}</div>
                            </div>
                          </div>

                          {/* Key Milestones */}
                          {(stepOutput as RoadmapOutput).summary?.keyMilestones && (stepOutput as RoadmapOutput).summary!.keyMilestones.length > 0 && (
                            <div className="bg-amber-50 rounded-lg p-4 border border-amber-200 mb-4">
                              <h4 className="font-semibold text-amber-900 mb-2">Key Milestones ({(stepOutput as RoadmapOutput).summary!.keyMilestones.length})</h4>
                              <ul className="list-disc list-inside text-sm text-amber-800">
                                {(stepOutput as RoadmapOutput).summary?.keyMilestones?.map((milestone: string, i: number) => (
                                  <li key={i}>{milestone}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Phases Timeline */}
                          <h4 className="font-semibold text-slate-900 mb-3">Phases</h4>
                          <div className="space-y-4">
                            {(stepOutput as RoadmapOutput).phases?.map((phase: RoadmapPhase, idx: number) => (
                              <div key={idx} className="bg-white rounded-lg p-4 border border-slate-200">
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <h5 className="font-semibold text-slate-900">{phase.name}</h5>
                                    <p className="text-xs text-slate-500">{phase.startDate} to {phase.endDate} ({phase.duration} weeks)</p>
                                  </div>
                                  <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-medium">
                                    {phase.userStories?.length || 0} stories
                                  </span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                                  <div className="bg-slate-50 rounded p-3">
                                    <p className="text-xs font-medium text-slate-700 mb-2">Objectives</p>
                                    <ul className="space-y-1">
                                      {phase.objectives?.map((obj: string, i: number) => (
                                        <li key={i} className="text-xs text-slate-600">• {obj}</li>
                                      ))}
                                    </ul>
                                  </div>
                                  <div className="bg-slate-50 rounded p-3">
                                    <p className="text-xs font-medium text-slate-700 mb-2">Milestones</p>
                                    <ul className="space-y-1">
                                      {phase.milestones?.map((m: string, i: number) => (
                                        <li key={i} className="text-xs text-slate-600">• {m}</li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                                {/* User Stories in Phase */}
                                {phase.userStories && phase.userStories.length > 0 && (
                                  <div className="mt-3 bg-blue-50 rounded p-3">
                                    <p className="text-xs font-medium text-blue-700 mb-2">User Stories</p>
                                    <ul className="space-y-1">
                                      {phase.userStories?.map((story: any, i: number) => (
                                        <li key={i} className="text-xs text-blue-800">
                                          <span className="font-medium">{story.title}</span> ({story.storyPoints} pts - {story.priority})
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                                {/* Deliverables */}
                                {phase.deliverables && phase.deliverables.length > 0 && (
                                  <div className="mt-3 bg-emerald-50 rounded p-3">
                                    <p className="text-xs font-medium text-emerald-700 mb-2">Deliverables</p>
                                    <ul className="space-y-1">
                                      {phase.deliverables?.map((d: string, i: number) => (
                                        <li key={i} className="text-xs text-emerald-800">• {d}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>

                          {/* Recommendations */}
                          {(stepOutput as RoadmapOutput).recommendations && (stepOutput as RoadmapOutput).recommendations!.length > 0 && (
                            <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200 mt-4">
                              <h4 className="font-semibold text-emerald-900 mb-2">Recommendations</h4>
                              <ul className="list-disc list-inside text-sm text-emerald-800">
                                {(stepOutput as RoadmapOutput).recommendations?.map((rec: string, i: number) => (
                                  <li key={i}>{rec}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </>
                      )}

                      {/* OKRs Output - Redesigned Card Layout */}
                      {("okr1" in stepOutput || "northStarDefinition" in stepOutput || "productName" in stepOutput) && (
                        <>
                          {/* Header Card */}
                          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-5 text-white mb-6">
                            <h3 className="text-2xl font-bold">{(stepOutput as OKROutput).productName || "Product"} OKRs</h3>
                            <p className="text-indigo-100 mt-1">{(stepOutput as OKROutput).quarter || "Q1 2024"} • {(stepOutput as OKROutput).teamName || "Product Team"} • Lead: {(stepOutput as OKROutput).productLead || "TBD"}</p>
                          </div>

                          {/* North Star Card */}
                          <div className="bg-amber-50 rounded-xl p-5 border-2 border-amber-200 mb-6">
                            <div className="flex items-center gap-2 mb-3">
                              <span className="text-2xl">⭐</span>
                              <h4 className="font-bold text-amber-900">North Star Metric</h4>
                            </div>
                            <p className="font-semibold text-slate-900 text-lg">{(stepOutput as OKROutput).northStarDefinition || "Define your North Star Metric"}</p>
                            <div className="flex items-center gap-4 mt-3 text-sm">
                              <span className="bg-white px-3 py-1 rounded-full text-slate-600">Current: <strong>{(stepOutput as OKROutput).northStarCurrent || "-"}</strong></span>
                              <span className="text-amber-600">→</span>
                              <span className="bg-amber-100 px-3 py-1 rounded-full text-amber-700">Target: <strong>{(stepOutput as OKROutput).northStarTarget || "-"}</strong></span>
                            </div>
                            <p className="text-xs text-amber-700 mt-3 bg-white/50 p-2 rounded">{(stepOutput as OKROutput).northStarRationale || "Captures core product value"}</p>
                          </div>

                          {/* OKR Cards Grid */}
                          <h4 className="font-bold text-slate-900 mb-4 text-lg">🎯 Objectives & Key Results</h4>
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                            {[(stepOutput as OKROutput).okr1, (stepOutput as OKROutput).okr2, (stepOutput as OKROutput).okr3].filter(Boolean).map((okr, idx) => (
                              <div key={idx} className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-2 mb-3">
                                  <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">{idx + 1}</span>
                                  <h5 className="font-bold text-slate-900 text-sm leading-tight">{okr?.objective || "Objective TBD"}</h5>
                                </div>
                                <p className="text-xs text-slate-500 mb-3">🎯 {okr?.alignment || "TBD"}</p>
                                
                                {/* Key Results */}
                                <div className="space-y-2 mb-3">
                                  {okr?.keyResults?.slice(0, 3).map((kr, i) => (
                                    <div key={i} className="bg-slate-50 rounded-lg p-2">
                                      <p className="text-xs text-slate-700 mb-1">{kr?.description || "Key Result TBD"}</p>
                                      <div className="flex items-center justify-between">
                                        <span className="text-xs text-slate-500">{kr?.current || "-"} → {kr?.target || "-"}</span>
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                                          kr?.status === 'on-track' ? 'bg-emerald-100 text-emerald-700' :
                                          kr?.status === 'at-risk' ? 'bg-amber-100 text-amber-700' :
                                          'bg-rose-100 text-rose-700'
                                        }`}>
                                          {kr?.status || "on-track"}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                
                                {/* Initiatives */}
                                {okr?.initiatives && okr.initiatives.length > 0 && (
                                  <div className="bg-indigo-50 rounded-lg p-2">
                                    <p className="text-[10px] font-semibold text-indigo-700 mb-1 uppercase">Initiatives</p>
                                    <ul className="text-xs text-indigo-800 space-y-0.5">
                                      {okr.initiatives.slice(0, 3).map((init, i) => (
                                        <li key={i} className="flex items-start gap-1">
                                          <span className="text-indigo-400">•</span>{init}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>

                          {/* Success Metrics Cards */}
                          <h4 className="font-bold text-slate-900 mb-4 text-lg">📊 Success Metrics</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
                            {/* Acquisition */}
                            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                              <div className="flex items-center gap-2 mb-3">
                                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                                <h5 className="font-bold text-blue-900 text-sm">Acquisition</h5>
                              </div>
                              <div className="space-y-2">
                                {(stepOutput as OKROutput).acquisitionMetrics?.slice(0, 2).map((m: Metric, i: number) => (
                                  <div key={i} className="bg-white rounded-lg p-2 text-xs">
                                    <p className="font-semibold text-blue-800">{m.name}</p>
                                    <p className="text-blue-600">{m.current} → {m.target}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            {/* Engagement */}
                            <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                              <div className="flex items-center gap-2 mb-3">
                                <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                                <h5 className="font-bold text-purple-900 text-sm">Engagement</h5>
                              </div>
                              <div className="space-y-2">
                                {(stepOutput as OKROutput).engagementMetrics?.slice(0, 2).map((m: Metric, i: number) => (
                                  <div key={i} className="bg-white rounded-lg p-2 text-xs">
                                    <p className="font-semibold text-purple-800">{m.name}</p>
                                    <p className="text-purple-600">{m.current} → {m.target}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            {/* Retention */}
                            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                              <div className="flex items-center gap-2 mb-3">
                                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                                <h5 className="font-bold text-emerald-900 text-sm">Retention</h5>
                              </div>
                              <div className="space-y-2">
                                {(stepOutput as OKROutput).retentionMetrics?.slice(0, 2).map((m: Metric, i: number) => (
                                  <div key={i} className="bg-white rounded-lg p-2 text-xs">
                                    <p className="font-semibold text-emerald-800">{m.name}</p>
                                    <p className="text-emerald-600">{m.current} → {m.target}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            {/* Revenue */}
                            <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                              <div className="flex items-center gap-2 mb-3">
                                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                                <h5 className="font-bold text-amber-900 text-sm">Revenue</h5>
                              </div>
                              <div className="space-y-2">
                                {(stepOutput as OKROutput).revenueMetrics?.slice(0, 2).map((m: Metric, i: number) => (
                                  <div key={i} className="bg-white rounded-lg p-2 text-xs">
                                    <p className="font-semibold text-amber-800">{m.name}</p>
                                    <p className="text-amber-600">{m.current} → {m.target}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            {/* Quality */}
                            <div className="bg-rose-50 rounded-xl p-4 border border-rose-100">
                              <div className="flex items-center gap-2 mb-3">
                                <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                                <h5 className="font-bold text-rose-900 text-sm">Quality</h5>
                              </div>
                              <div className="space-y-2">
                                {(stepOutput as OKROutput).qualityMetrics?.slice(0, 2).map((m: Metric, i: number) => (
                                  <div key={i} className="bg-white rounded-lg p-2 text-xs">
                                    <p className="font-semibold text-rose-800">{m.name}</p>
                                    <p className="text-rose-600">{m.current} → {m.target}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* AARRR Cards */}
                          <h4 className="font-bold text-slate-900 mb-4 text-lg">🏴‍☠️ AARRR Framework</h4>
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                            {/* Acquisition */}
                            <div className="bg-blue-50 rounded-xl p-3 border border-blue-100 text-center">
                              <span className="text-2xl mb-1 block">🎯</span>
                              <h5 className="font-bold text-blue-900 text-xs mb-2">Acquisition</h5>
                              <p className="text-[10px] text-blue-700">{(stepOutput as OKROutput).acquisition?.channel || '-'}</p>
                              <p className="text-[10px] text-blue-700">{(stepOutput as OKROutput).acquisition?.volume || '-'}</p>
                              <p className="text-[10px] text-blue-700">{(stepOutput as OKROutput).acquisition?.cost || '-'}</p>
                            </div>
                            {/* Activation */}
                            <div className="bg-purple-50 rounded-xl p-3 border border-purple-100 text-center">
                              <span className="text-2xl mb-1 block">⚡</span>
                              <h5 className="font-bold text-purple-900 text-xs mb-2">Activation</h5>
                              <p className="text-[10px] text-purple-700">{(stepOutput as OKROutput).activation?.event || '-'}</p>
                              <p className="text-[10px] text-purple-700">{(stepOutput as OKROutput).activation?.rate || '-'}</p>
                              <p className="text-[10px] text-purple-700">{(stepOutput as OKROutput).activation?.timeToFirstValue || '-'}</p>
                            </div>
                            {/* Retention */}
                            <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100 text-center">
                              <span className="text-2xl mb-1 block">🔄</span>
                              <h5 className="font-bold text-emerald-900 text-xs mb-2">Retention</h5>
                              <p className="text-[10px] text-emerald-700">{(stepOutput as OKROutput).retention?.cohort || '-'}</p>
                              <p className="text-[10px] text-emerald-700">{(stepOutput as OKROutput).retention?.day7 || '-'}</p>
                              <p className="text-[10px] text-emerald-700">{(stepOutput as OKROutput).retention?.day30 || '-'}</p>
                            </div>
                            {/* Revenue */}
                            <div className="bg-amber-50 rounded-xl p-3 border border-amber-100 text-center">
                              <span className="text-2xl mb-1 block">💰</span>
                              <h5 className="font-bold text-amber-900 text-xs mb-2">Revenue</h5>
                              <p className="text-[10px] text-amber-700">{(stepOutput as OKROutput).revenue?.arpu || '-'}</p>
                              <p className="text-[10px] text-amber-700">{(stepOutput as OKROutput).revenue?.ltv || '-'}</p>
                              <p className="text-[10px] text-amber-700">{(stepOutput as OKROutput).revenue?.mrrArr || '-'}</p>
                            </div>
                            {/* Referral */}
                            <div className="bg-indigo-50 rounded-xl p-3 border border-indigo-100 text-center">
                              <span className="text-2xl mb-1 block">📢</span>
                              <h5 className="font-bold text-indigo-900 text-xs mb-2">Referral</h5>
                              <p className="text-[10px] text-indigo-700">{(stepOutput as OKROutput).referral?.nps || '-'}</p>
                              <p className="text-[10px] text-indigo-700">{(stepOutput as OKROutput).referral?.rate || '-'}</p>
                              <p className="text-[10px] text-indigo-700">{(stepOutput as OKROutput).referral?.viralCoefficient || '-'}</p>
                            </div>
                          </div>

                          {/* Indicators Cards */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-4 border border-cyan-100">
                              <h5 className="font-bold text-cyan-900 mb-3 flex items-center gap-2">
                                <span>📈</span> Leading Indicators
                              </h5>
                              <ul className="space-y-2">
                                {(stepOutput as OKROutput).leadingIndicators?.slice(0, 3).map((l: any, i: number) => (
                                  <li key={i} className="text-xs text-slate-700 bg-white/60 rounded-lg p-2">
                                    <span className="font-semibold text-cyan-700">{l.indicator}</span>
                                    <p className="text-slate-500 mt-0.5">{l.why}</p>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl p-4 border border-slate-200">
                              <h5 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                                <span>📊</span> Lagging Indicators
                              </h5>
                              <ul className="space-y-2">
                                {(stepOutput as OKROutput).laggingIndicators?.slice(0, 3).map((l: any, i: number) => (
                                  <li key={i} className="text-xs text-slate-700 bg-white rounded-lg p-2">
                                    <span className="font-semibold text-slate-800">{l.indicator}</span>
                                    <p className="text-slate-500 mt-0.5">{l.what}</p>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          {/* Metric Ownership Table */}
                          {(stepOutput as OKROutput).metricOwners && (stepOutput as OKROutput).metricOwners!.length > 0 && (
                            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden mb-6">
                              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                                <h4 className="font-bold text-slate-900">👥 Metric Ownership</h4>
                              </div>
                              <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                  <thead className="bg-slate-50/50">
                                    <tr>
                                      <th className="text-left px-4 py-2 font-medium text-slate-700">Metric</th>
                                      <th className="text-left px-4 py-2 font-medium text-slate-700">Owner</th>
                                      <th className="text-left px-4 py-2 font-medium text-slate-700">Cadence</th>
                                      <th className="text-left px-4 py-2 font-medium text-slate-700">Tool</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100">
                                    {(stepOutput as OKROutput).metricOwners?.map((owner: any, i: number) => (
                                      <tr key={i} className="hover:bg-slate-50">
                                        <td className="px-4 py-2 text-slate-700 font-medium">{owner.metric}</td>
                                        <td className="px-4 py-2 text-slate-600">{owner.owner}</td>
                                        <td className="px-4 py-2 text-slate-600"><span className="bg-slate-100 px-2 py-0.5 rounded text-xs">{owner.cadence}</span></td>
                                        <td className="px-4 py-2 text-slate-600">{owner.tool}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}

                          {/* Review Schedule */}
                          <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 mt-4">
                            <h5 className="font-semibold text-slate-800 mb-2">Review Schedule</h5>
                            <div className="flex flex-wrap gap-4 text-xs text-slate-600">
                              <span><span className="font-medium">Weekly:</span> {(stepOutput as OKROutput).reviewSchedule?.weekly}</span>
                              <span><span className="font-medium">Monthly:</span> {(stepOutput as OKROutput).reviewSchedule?.monthly}</span>
                              <span><span className="font-medium">Quarterly:</span> {(stepOutput as OKROutput).reviewSchedule?.quarterly}</span>
                            </div>
                          </div>

                          {/* Risks */}
                          {(stepOutput as OKROutput).risks && (stepOutput as OKROutput).risks!.length > 0 && (
                            <div className="bg-rose-50 rounded-lg p-4 border border-rose-200 mt-4">
                              <h4 className="font-semibold text-rose-900 mb-2">Risks & Mitigation</h4>
                              <div className="space-y-2">
                                {(stepOutput as OKROutput).risks?.map((risk: any, i: number) => (
                                  <div key={i} className="text-sm">
                                    <p className="font-medium text-rose-800">{risk.description} <span className="text-xs">(Impact: {risk.impact})</span></p>
                                    <p className="text-xs text-rose-600">Mitigation: {risk.mitigation}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Recommendations */}
                          {(stepOutput as OKROutput).recommendations && (stepOutput as OKROutput).recommendations!.length > 0 && (
                            <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200 mt-4">
                              <h4 className="font-semibold text-emerald-900 mb-2">Recommendations</h4>
                              <ul className="list-disc list-inside text-sm text-emerald-800">
                                {(stepOutput as OKROutput).recommendations?.map((rec: string, i: number) => (
                                  <li key={i}>{rec}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}

                  {/* Edit Form */}
                  {isEditing && editData && (
                    <div className="space-y-4 mt-4 border-t border-slate-200 pt-4">
                      <div className="flex items-center gap-2 mb-4">
                        <Edit3 className="w-4 h-4 text-indigo-600" />
                        <span className="font-semibold text-slate-900">Edit Results</span>
                      </div>

                      {/* Edit Problem Statement Output */}
                      {editData && "problemTitle" in editData && (
                        <div className="space-y-4">
                          {(() => {
                            const reframeEditData = editData as ReframeOutput;
                            return (
                              <>
                                {/* Title & Summary */}
                                <div>
                                  <label className="block text-sm font-medium text-slate-700 mb-1">Problem Title</label>
                                  <input
                                    className="w-full p-3 border border-slate-300 rounded-lg text-sm"
                                    value={reframeEditData.problemTitle || ""}
                                    onChange={(e) => setEditData({ ...reframeEditData, problemTitle: e.target.value })}
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-slate-700 mb-1">One-Line Summary</label>
                                  <textarea
                                    className="w-full p-3 border border-slate-300 rounded-lg text-sm"
                                    rows={2}
                                    value={reframeEditData.oneLineSummary || ""}
                                    onChange={(e) => setEditData({ ...reframeEditData, oneLineSummary: e.target.value })}
                                  />
                                </div>

                                {/* Problem Details */}
                                <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                                  <h4 className="font-semibold text-indigo-900 mb-3">Problem Details</h4>
                                  <div className="space-y-3">
                                    <div>
                                      <label className="block text-xs font-semibold text-indigo-700 uppercase mb-1">Description</label>
                                      <textarea
                                        className="w-full p-3 border border-slate-300 rounded-lg text-sm"
                                        rows={4}
                                        value={reframeEditData.problem?.description || ""}
                                        onChange={(e) => setEditData({
                                          ...reframeEditData,
                                          problem: { ...reframeEditData.problem, description: e.target.value }
                                        })}
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs font-semibold text-indigo-700 uppercase mb-1">Affected Users</label>
                                      <textarea
                                        className="w-full p-3 border border-slate-300 rounded-lg text-sm"
                                        rows={2}
                                        value={reframeEditData.problem?.affectedUsers || ""}
                                        onChange={(e) => setEditData({
                                          ...reframeEditData,
                                          problem: { ...reframeEditData.problem, affectedUsers: e.target.value }
                                        })}
                                      />
                                    </div>
                                  </div>
                                </div>

                                {/* Context */}
                                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                                  <h4 className="font-semibold text-slate-900 mb-3">Context</h4>
                                  <div className="space-y-3">
                                    <div>
                                      <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Root Causes</label>
                                      <textarea
                                        className="w-full p-3 border border-slate-300 rounded-lg text-sm"
                                        rows={2}
                                        value={reframeEditData.context?.rootCauses || ""}
                                        onChange={(e) => setEditData({
                                          ...reframeEditData,
                                          context: { ...reframeEditData.context, rootCauses: e.target.value }
                                        })}
                                      />
                                    </div>
                                  </div>
                                </div>

                                {/* Impact */}
                                <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                                  <h4 className="font-semibold text-amber-900 mb-3">Impact</h4>
                                  <div className="space-y-3">
                                    <div>
                                      <label className="block text-xs font-semibold text-amber-700 uppercase mb-1">Business Impact</label>
                                      <textarea
                                        className="w-full p-3 border border-slate-300 rounded-lg text-sm"
                                        rows={3}
                                        value={reframeEditData.impact?.businessImpact || ""}
                                        onChange={(e) => setEditData({
                                          ...reframeEditData,
                                          impact: { ...reframeEditData.impact, businessImpact: e.target.value }
                                        })}
                                      />
                                    </div>
                                  </div>
                                </div>

                                {/* Next Steps */}
                                <div>
                                  <label className="block text-sm font-medium text-slate-700 mb-1">Next Steps (one per line)</label>
                                  <textarea
                                    className="w-full p-3 border border-slate-300 rounded-lg text-sm"
                                    rows={4}
                                    value={reframeEditData.nextSteps?.join("\n") || ""}
                                    onChange={(e) => setEditData({ ...reframeEditData, nextSteps: e.target.value.split("\n").filter(i => i.trim()) })}
                                  />
                                </div>
                              </>
                            );
                          })()}
                        </div>
                      )}

                      {/* Edit Vision Output */}
                      {"visionStatement" in editData && (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Vision Statement</label>
                            <textarea
                              className="w-full p-3 border border-slate-300 rounded-lg text-sm"
                              rows={3}
                              value={editData.visionStatement}
                              onChange={(e) => setEditData({ ...editData, visionStatement: e.target.value } as VisionOutput)}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Mission Statement</label>
                            <textarea
                              className="w-full p-3 border border-slate-300 rounded-lg text-sm"
                              rows={2}
                              value={editData.missionStatement}
                              onChange={(e) => setEditData({ ...editData, missionStatement: e.target.value } as VisionOutput)}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Value Proposition</label>
                            <textarea
                              className="w-full p-3 border border-slate-300 rounded-lg text-sm"
                              rows={2}
                              value={editData.valueProposition}
                              onChange={(e) => setEditData({ ...editData, valueProposition: e.target.value } as VisionOutput)}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">North Star Metric</label>
                            <input
                              className="w-full p-3 border border-slate-300 rounded-lg text-sm"
                              value={editData.northStarMetric}
                              onChange={(e) => setEditData({ ...editData, northStarMetric: e.target.value } as VisionOutput)}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Guiding Principles (one per line)</label>
                            <textarea
                              className="w-full p-3 border border-slate-300 rounded-lg text-sm"
                              rows={3}
                              value={editData.principles?.join("\n")}
                              onChange={(e) => setEditData({ ...editData, principles: e.target.value.split("\n").filter(i => i.trim()) } as VisionOutput)}
                            />
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm" onClick={handleCancelEdit} className="gap-2">
                          Cancel
                        </Button>
                        <Button size="sm" onClick={() => handleSaveEdit()} className="gap-2 bg-emerald-500 hover:bg-emerald-600">
                          <Sparkles className="w-4 h-4" />
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  {!isStreaming && stepOutput && !isEditing && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      <Button variant="outline" size="sm" className="gap-2" onClick={handleEdit}>
                        <Edit3 className="w-4 h-4" />
                        Edit Results
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                        onClick={() => handleSaveEdit()}
                      >
                        <Save className="w-4 h-4" />
                        Save Results
                      </Button>
                      {currentStep === 1 && (
                        <Button variant="outline" size="sm" className="gap-2" onClick={() => startPhase1()}>
                          <RefreshCw className="w-4 h-4" />
                          Regenerate Step 1
                        </Button>
                      )}
                      {currentStep === 2 && (
                        <Button variant="outline" size="sm" className="gap-2" onClick={() => phase1Data.reframe && startStep2(phase1Data.reframe)}>
                          <RefreshCw className="w-4 h-4" />
                          Regenerate Step 2
                        </Button>
                      )}
                      {currentStep === 3 && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="gap-2" 
                          onClick={() => {
                            console.log("Regenerate Step 3 clicked", { 
                              hasProblem: !!phase1Data.reframe?.problem?.description,
                              hasVision: !!phase1Data.vision?.visionStatement 
                            });
                            setError(null);
                            startPhase2();
                          }}
                        >
                          <RefreshCw className="w-4 h-4" />
                          Regenerate Step 3
                        </Button>
                      )}
                      {currentStep === 4 && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="gap-2" 
                          onClick={() => {
                            setError(null);
                            if (phase2Data.personas) {
                              startStep4(phase2Data.personas!);
                            } else {
                              setError("Step 3 data (Personas) is required to generate questions");
                            }
                          }}
                        >
                          <RefreshCw className="w-4 h-4" />
                          Regenerate Step 4
                        </Button>
                      )}
                      {currentStep === 5 && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="gap-2" 
                          onClick={() => {
                            setError(null);
                            if (phase2Data.questions) {
                              startPhase3();
                            } else {
                              setError("Step 4 data (Questions) is required to regenerate market analysis");
                            }
                          }}
                        >
                          <RefreshCw className="w-4 h-4" />
                          Regenerate Step 5
                        </Button>
                      )}
                      {/* Next Step Buttons - Only show when current step is complete */}
                      {currentStep === 1 && phase1Data.reframe && (
                        <Button
                          size="sm"
                          className="gap-2 bg-indigo-500 hover:bg-indigo-600"
                          onClick={() => {
                            setCurrentStep(2);
                            setStepOutput(null);
                            setStreamedContent("");
                          }}
                        >
                          Next Step
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      )}
                      {currentStep === 2 && phase1Data.vision && (
                        <Button
                          size="sm"
                          className="gap-2 bg-indigo-500 hover:bg-indigo-600"
                          onClick={() => {
                            setCurrentStep(3);
                            setStepOutput(null);
                            setStreamedContent("");
                          }}
                        >
                          Next Step
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      )}
                      {currentStep === 3 && phase2Data.personas && (
                        <Button
                          size="sm"
                          className="gap-2 bg-indigo-500 hover:bg-indigo-600"
                          onClick={() => {
                            setCurrentStep(4);
                            setStepOutput(null);
                            setStreamedContent("");
                          }}
                        >
                          Next Step
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      )}
                      {currentStep === 4 && phase2Data.questions && (
                        <Button
                          size="sm"
                          className="gap-2 bg-indigo-500 hover:bg-indigo-600"
                          onClick={() => {
                            setCurrentStep(5);
                            setStepOutput(null);
                            setStreamedContent("");
                          }}
                        >
                          Next Step
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      )}
                      {currentStep === 5 && phase3Data.marketAnalysis && (
                        <Button
                          size="sm"
                          className="gap-2 bg-indigo-500 hover:bg-indigo-600"
                          onClick={() => {
                            setCurrentStep(6);
                            setStepOutput(null);
                            setStreamedContent("");
                          }}
                        >
                          Next Step
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      )}
                      {currentStep === 6 && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="gap-2" 
                          onClick={() => {
                            setError(null);
                            if (phase3Data.marketAnalysis) {
                              startPhase4();
                            } else {
                              setError("Step 5 data (Market Analysis) is required to regenerate PRD");
                            }
                          }}
                        >
                          <RefreshCw className="w-4 h-4" />
                          Regenerate Step 6
                        </Button>
                      )}
                      {currentStep === 6 && isPRDComplete && (
                        <Button
                          size="sm"
                          className="gap-2 bg-indigo-500 hover:bg-indigo-600"
                          onClick={() => {
                            setCurrentStep(7);
                            setStepOutput(null);
                            setStreamedContent("");
                          }}
                        >
                          Next Step
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      )}
                      {currentStep === 7 && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="gap-2" 
                          onClick={() => {
                            setError(null);
                            if (savedSessions.some(s => s.stepNumber === 6 && "appendix" in s.data)) {
                              startStep7();
                            } else {
                              setError("Step 6 (PRD) is required to regenerate user stories");
                            }
                          }}
                        >
                          <RefreshCw className="w-4 h-4" />
                          Regenerate Step 7
                        </Button>
                      )}
                      {currentStep === 7 && savedSessions.some(s => s.stepNumber === 7 && (Array.isArray(s.data) || "stories" in s.data)) && (
                        <Button
                          size="sm"
                          className="gap-2 bg-indigo-500 hover:bg-indigo-600"
                          onClick={() => {
                            setCurrentStep(8);
                            setStepOutput(null);
                            setStreamedContent("");
                          }}
                        >
                          Next Step
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      )}
                      {currentStep === 8 && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="gap-2" 
                          onClick={() => {
                            setError(null);
                            if (savedSessions.some(s => s.stepNumber === 7 && (Array.isArray(s.data) || "stories" in s.data))) {
                              startStep8();
                            } else {
                              setError("Step 7 (User Stories) is required to regenerate roadmap");
                            }
                          }}
                        >
                          <RefreshCw className="w-4 h-4" />
                          Regenerate Step 8
                        </Button>
                      )}
                      {currentStep === 8 && savedSessions.some(s => s.stepNumber === 8 && "phases" in s.data) && (
                        <Button
                          size="sm"
                          className="gap-2 bg-indigo-500 hover:bg-indigo-600"
                          onClick={() => {
                            setCurrentStep(9);
                            setStepOutput(null);
                            setStreamedContent("");
                          }}
                        >
                          Next Step
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      )}
                      {currentStep === 9 && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="gap-2" 
                          onClick={() => {
                            setError(null);
                            if (savedSessions.some(s => s.stepNumber === 7 && (Array.isArray(s.data) || "stories" in s.data))) {
                              startStep9();
                            } else {
                              setError("Step 7 (User Stories) is required to regenerate OKRs");
                            }
                          }}
                        >
                          <RefreshCw className="w-4 h-4" />
                          Regenerate Step 9
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Saved Results Section - Only show results for current step */}
            {savedSessions.filter(s => s.stepNumber === currentStep).length > 0 && (
              <Card className="bg-white border-slate-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Save className="w-5 h-5 text-indigo-600" />
                    <h3 className="font-semibold text-slate-900">Saved Results</h3>
                    <Badge variant="secondary" className="bg-indigo-100 text-indigo-700">
                      {savedSessions.filter(s => s.stepNumber === currentStep).length}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    {savedSessions.filter(s => s.stepNumber === currentStep).map((session) => (
                      <div
                        key={session.id}
                        className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200 hover:border-indigo-300 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded">
                              Step {session.stepNumber}
                            </span>
                            <span className="font-medium text-slate-900 truncate">
                              {session.name}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">
                            Saved {new Date(session.savedAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex gap-2 ml-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleLoadSavedSession(session)}
                            title="View saved session"
                          >
                            <Eye className="w-4 h-4 text-slate-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleDeleteSavedSession(session.id)}
                            title="Delete saved session"
                          >
                            <Trash2 className="w-4 h-4 text-rose-600" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Coming Soon for Future Steps (Steps 10+) */}
            {currentStep >= 10 && !isStreaming && !stepOutput && (
              <Card className="bg-white border-slate-200 shadow-sm">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-slate-900 mb-2">
                    Step {currentStep}: {currentStepInfo?.description}
                  </h2>
                  <p className="text-slate-600 mb-4">
                    This step is coming soon. The AI pipeline will guide you through this phase once implemented.
                  </p>
                  <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                    Coming Soon
                  </Badge>
                </CardContent>
              </Card>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}
