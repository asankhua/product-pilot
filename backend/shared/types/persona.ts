// Persona types (Steps 3-4)

export interface PersonaDemographics {
  ageRange: string;
  location: string;
  education: string;
  incomeLevel: string;
}

export interface Persona {
  id?: string;
  projectId?: string;
  name: string;
  role: string;
  bio: string;
  demographics: PersonaDemographics;
  painPoints: string[];
  frustrations: string[];
  goals: string[];
  motivations: string[];
  behaviors: string[];
  interests: string[];
  techSavviness: "low" | "medium" | "high";
  quote: string;
}

// Step 3 output
export interface PersonaProfilesOutput {
  personas: Persona[];
}

export type QuestionCategory = "user_needs" | "technical" | "business" | "scope" | "constraints";

export interface ClarifyingQuestion {
  id?: string;
  projectId?: string;
  question: string;
  category: QuestionCategory;
  priority: number;
  aiSuggestedAnswer: string;
  userAnswer?: string;
  isAnswered: boolean;
  relatedPersona?: string;
}

// Step 4 output
export interface ClarifyingQuestionsOutput {
  questions: ClarifyingQuestion[];
}

export interface QAChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface QAFollowUpRequest {
  projectId: string;
  questionId?: string;
  userMessage: string;
  conversationHistory?: QAChatMessage[];
}

export interface QAFollowUpResponse {
  answer: string;
  questionId?: string;
  relatedQuestions: string[];
}
