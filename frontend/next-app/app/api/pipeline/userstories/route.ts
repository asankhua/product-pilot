// Step 7: Generate User Stories with RICE Scoring
// SSE streaming endpoint following User Stories Template and RICE Scoring - Using real LLM
import { NextRequest } from "next/server";
import { routeLLMRequest, streamLLMResponse } from "@/lib/llm/llm-client";

const STORIES_SYSTEM_PROMPT = `You are an expert Product Manager and Scrum Master AI assistant. Generate user stories with RICE scoring from a PRD.

For each story:
- Use format: "As a [persona], I want [feature], so that [benefit]"
- Include acceptance criteria in Given-When-Then format
- Assign story points (1, 2, 3, 5, 8, 13)
- Classify priority: P0 (Critical), P1 (High), P2 (Medium/Low)
- Calculate RICE score: Reach × Impact × Confidence / Effort
- Group stories into logical epics

Respond with valid JSON matching the user stories template structure.`;

// User Story Interface
interface UserStory {
  id: string;
  title: string;
  description: string; // As a [user], I want [goal], so that [benefit]
  acceptanceCriteria: string[]; // Given-When-Then format
  storyPoints: number; // 1, 2, 3, 5, 8, 13
  priority: "P0" | "P1" | "P2" | "P3";
  feature: string; // Which core feature this story belongs to
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

// Output Interface
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

// Generate RICE score for a story
function calculateRICE(story: UserStory): RICEScore {
  // Map priority to reach
  const baseReach: Record<string, number> = {
    P0: 10000,
    P1: 5000,
    P2: 2000,
    P3: 500,
  };

  const reach = Math.round(baseReach[story.priority] || 2000);

  // Estimate impact based on story points
  let impact = 2; // Default medium
  if (story.storyPoints >= 8) impact = 3;
  else if (story.storyPoints <= 2) impact = 1;

  // Check description for keywords
  const descLower = story.description.toLowerCase();
  const highImpactKeywords = ["critical", "essential", "must", "required", "core", "fundamental"];
  const lowImpactKeywords = ["nice to have", "optional", "enhancement", "improvement"];
  if (highImpactKeywords.some((k) => descLower.includes(k))) impact = 3;
  if (lowImpactKeywords.some((k) => descLower.includes(k))) impact = 1;

  // Estimate confidence based on acceptance criteria
  let confidence = 70;
  if (story.acceptanceCriteria.length >= 3) confidence += 15;
  else if (story.acceptanceCriteria.length >= 2) confidence += 10;
  else if (story.acceptanceCriteria.length === 1) confidence += 5;
  if (story.description.length > 200) confidence += 5;
  else if (story.description.length > 100) confidence += 2;
  confidence = Math.min(confidence, 95);

  // Effort is story points
  const effort = story.storyPoints;

  // Calculate RICE score
  const riceScore = (reach * impact * confidence) / effort;
  const riceScoreNormalized = Math.min(Math.round((riceScore / 10000) * 100), 100);

  // Confidence factors
  const confidenceFactors: string[] = [];
  if (story.acceptanceCriteria.length >= 3) confidenceFactors.push("Detailed acceptance criteria");
  if (story.description.length > 150) confidenceFactors.push("Comprehensive description");
  if (story.storyPoints <= 5) confidenceFactors.push("Small, well-defined scope");
  if (confidenceFactors.length === 0) confidenceFactors.push("Standard confidence level");

  // Determine priority based on normalized score
  let finalPriority: "P0" | "P1" | "P2" | "P3" = story.priority;
  if (riceScoreNormalized >= 70) finalPriority = "P0";
  else if (riceScoreNormalized >= 40) finalPriority = "P1";
  else if (riceScoreNormalized >= 20) finalPriority = "P2";
  else finalPriority = "P3";

  // Priority reason
  const reasons: Record<string, string> = {
    P0: "High RICE score indicates significant impact with reasonable effort",
    P1: "Moderate RICE score suggests good value but may need validation",
    P2: "Lower RICE score indicates limited impact or high effort required",
    P3: "Low RICE score suggests minimal impact or high uncertainty",
  };

  return {
    storyId: story.id,
    storyTitle: story.title,
    description: story.description,
    reach,
    reachType: "ESTIMATE",
    impact,
    impactType: "QUALITATIVE",
    confidence,
    confidenceFactors,
    effort,
    effortType: "STORY_POINTS",
    riceScore,
    riceScoreNormalized,
    priority: finalPriority,
    priorityReason: reasons[finalPriority],
  };
}

// Generate recommendations based on RICE scores
function generateRecommendations(scores: RICEScore[]): string[] {
  const recommendations: string[] = [];
  const highPriority = scores.filter((s) => s.priority === "P0");
  const lowConfidence = scores.filter((s) => s.confidence < 70);
  const highEffort = scores.filter((s) => s.effort >= 8);
  const avgScore = scores.reduce((sum, s) => sum + s.riceScoreNormalized, 0) / scores.length;

  if (highPriority.length > 0) {
    recommendations.push(`Prioritize ${highPriority.length} high-RICE stories for immediate development`);
  }
  if (lowConfidence.length > 0) {
    recommendations.push(`Conduct spike stories for ${lowConfidence.length} features with low confidence to improve estimates`);
  }
  if (highEffort.length > 0) {
    recommendations.push(`Consider breaking down ${highEffort.length} complex stories into smaller ones`);
  }
  if (avgScore < 30) {
    recommendations.push("Overall RICE scores are low - consider revisiting feature selection and priorities");
  }
  if (recommendations.length === 0) {
    recommendations.push("All stories have reasonable RICE scores - proceed with current prioritization");
  }

  return recommendations;
}

function generateUserStories(projectContext: any): UserStoriesOutput {
  const personas = projectContext?.personas || [];
  const persona1Name = personas[0]?.overview?.name || "Primary User";
  const persona2Name = personas[1]?.overview?.name || "Secondary User";
  const persona1Role = personas[0]?.overview?.role || "User";
  const persona2Role = personas[1]?.overview?.role || "Stakeholder";

  const stories: UserStory[] = [
    // P0 Stories - Must Have
    {
      id: "US-001",
      title: "User Registration",
      description: `As a new ${persona1Role.toLowerCase()}, I want to create an account with my email, so that I can access the platform's core features`,
      acceptanceCriteria: [
        "Given I am on the registration page\nWhen I enter valid email and password\nThen my account is created and I am redirected to onboarding",
        "Given I enter an existing email\nWhen I submit the form\nThen I see an error message 'Email already registered'",
        "Given I enter invalid password (less than 8 characters)\nWhen I submit the form\nThen I see validation error for password strength",
      ],
      storyPoints: 3,
      priority: "P0",
      feature: "Authentication",
    },
    {
      id: "US-002",
      title: "User Login",
      description: `As a registered ${persona1Role.toLowerCase()}, I want to log in with my credentials, so that I can access my account`,
      acceptanceCriteria: [
        "Given I am on the login page\nWhen I enter valid email and password\nThen I am authenticated and redirected to dashboard",
        "Given I enter invalid credentials\nWhen I submit the form\nThen I see an error message 'Invalid email or password'",
        "Given I click 'Forgot Password'\nWhen I enter my email\nThen I receive a password reset link via email",
      ],
      storyPoints: 2,
      priority: "P0",
      feature: "Authentication",
    },
    {
      id: "US-003",
      title: "Zero-Commission Transaction",
      description: `As a ${persona1Role.toLowerCase()}, I want to complete transactions without platform fees, so that I maximize my earnings`,
      acceptanceCriteria: [
        "Given I am ready to complete a transaction\nWhen I initiate the payment\nThen the system processes it without adding commission fees",
        "Given the transaction is complete\nWhen I view the receipt\nThen I see a breakdown showing zero platform fees",
        "Given a transaction fails\nWhen the error occurs\nThen I receive a clear notification and my funds remain secure",
      ],
      storyPoints: 5,
      priority: "P0",
      feature: "Zero-Commission Platform",
    },
    {
      id: "US-004",
      title: "AI Marketing Assistant - Basic Content Generation",
      description: `As a ${persona1Role.toLowerCase()}, I want the AI to generate marketing content for my listings, so that I can attract more customers`,
      acceptanceCriteria: [
        "Given I have created a listing\nWhen I click 'Generate Marketing Content'\nThen the AI creates compelling title and description",
        "Given the AI generates content\nWhen I review it\nThen I can edit or regenerate before publishing",
        "Given I approve the generated content\nWhen I click 'Use This'\nThen it is applied to my listing immediately",
      ],
      storyPoints: 5,
      priority: "P0",
      feature: "AI Marketing Assistant",
    },

    // P1 Stories - Should Have
    {
      id: "US-005",
      title: "Password Reset",
      description: `As a ${persona1Role.toLowerCase()}, I want to reset my password, so that I can regain access if I forget it`,
      acceptanceCriteria: [
        "Given I request a password reset\nWhen I click the link in my email\nThen I am taken to a secure password reset page",
        "Given I am on the password reset page\nWhen I enter a new valid password\nThen my password is updated and I receive confirmation",
      ],
      storyPoints: 3,
      priority: "P1",
      feature: "Authentication",
    },
    {
      id: "US-006",
      title: "User Profile Management",
      description: `As a ${persona1Role.toLowerCase()}, I want to update my profile information, so that my account details are current`,
      acceptanceCriteria: [
        "Given I am on my profile page\nWhen I update my name and save\nThen the changes are persisted and I see a success message",
        "Given I upload a profile photo\nWhen the image exceeds 5MB\nThen I see an error message 'Image must be less than 5MB'",
      ],
      storyPoints: 2,
      priority: "P1",
      feature: "User Management",
    },
    {
      id: "US-007",
      title: "Analytics Dashboard - Basic Metrics",
      description: `As a ${persona2Role.toLowerCase()}, I want to view basic performance metrics, so that I can track my progress`,
      acceptanceCriteria: [
        "Given I am on the dashboard\nWhen the page loads\nThen I see key metrics like views, clicks, and conversions",
        "Given I want to filter data\nWhen I select a date range\nThen the metrics update to show that period",
        "Given I view the dashboard\nWhen data is loading\nThen I see a loading state and then the updated metrics",
      ],
      storyPoints: 5,
      priority: "P1",
      feature: "Analytics Dashboard",
    },
    {
      id: "US-008",
      title: "Mobile Responsive Design",
      description: `As a ${persona1Role.toLowerCase()}, I want to access the platform on my mobile device, so that I can manage my business on the go`,
      acceptanceCriteria: [
        "Given I access the platform on mobile\nWhen the page loads\nThen all features are accessible and usable",
        "Given I am on a small screen\nWhen I navigate\nThen the layout adapts appropriately without horizontal scrolling",
        "Given I use touch gestures\nWhen I swipe or tap\nThen interactions work smoothly",
      ],
      storyPoints: 5,
      priority: "P1",
      feature: "Mobile Experience",
    },

    // P2 Stories - Could Have
    {
      id: "US-009",
      title: "Social Login Integration",
      description: `As a ${persona1Role.toLowerCase()}, I want to sign up with my Google account, so that I can access the platform faster`,
      acceptanceCriteria: [
        "Given I click 'Sign in with Google'\nWhen I authenticate with valid Google credentials\nThen my account is created/linked and I am logged in",
        "Given I have an existing email account\nWhen I sign in with the same email via Google\nThen the accounts are linked automatically",
      ],
      storyPoints: 5,
      priority: "P2",
      feature: "Authentication",
    },
    {
      id: "US-010",
      title: "Email Notifications",
      description: `As a ${persona1Role.toLowerCase()}, I want to receive email notifications for important updates, so that I stay informed`,
      acceptanceCriteria: [
        "Given I have notifications enabled\nWhen a critical update occurs\nThen I receive an email notification within 5 minutes",
        "Given I click unsubscribe in the email\nWhen I confirm the action\nThen I stop receiving that type of notification",
      ],
      storyPoints: 3,
      priority: "P2",
      feature: "Notifications",
    },
    {
      id: "US-011",
      title: "Advanced AI Marketing - Campaign Optimization",
      description: `As a ${persona1Role.toLowerCase()}, I want the AI to optimize my marketing campaigns automatically, so that I get better results`,
      acceptanceCriteria: [
        "Given I have active campaigns\nWhen the AI analyzes performance\nThen it suggests optimizations for underperforming ads",
        "Given I approve AI recommendations\nWhen I click 'Apply Suggestions'\nThen the changes are implemented automatically",
        "Given the AI makes optimizations\nWhen results improve\nThen I see a comparison showing before and after metrics",
      ],
      storyPoints: 8,
      priority: "P2",
      feature: "AI Marketing Assistant",
    },
    {
      id: "US-012",
      title: "Integration with Third-Party Tools",
      description: `As a ${persona2Role.toLowerCase()}, I want to integrate with tools like Slack and Zapier, so that I can streamline my workflow`,
      acceptanceCriteria: [
        "Given I am in settings\nWhen I navigate to Integrations\nThen I see available third-party integrations",
        "Given I select an integration\nWhen I authenticate\nThen the connection is established and data begins syncing",
        "Given an integration is active\nWhen events occur\nThen data flows between systems as expected",
      ],
      storyPoints: 8,
      priority: "P2",
      feature: "Integrations",
    },
  ];

  // Calculate RICE scores for all stories
  const riceScores = stories.map((story) => calculateRICE(story));

  // Sort by RICE score (descending)
  riceScores.sort((a, b) => b.riceScore - a.riceScore);

  // Calculate summary
  const p0Count = stories.filter((s) => s.priority === "P0").length;
  const p1Count = stories.filter((s) => s.priority === "P1").length;
  const p2Count = stories.filter((s) => s.priority === "P2").length;
  const p3Count = stories.filter((s) => s.priority === "P3").length;
  const totalStoryPoints = stories.reduce((sum, s) => sum + s.storyPoints, 0);
  const averageRICEScore = riceScores.reduce((sum, s) => sum + s.riceScore, 0) / riceScores.length;

  return {
    stories,
    riceScores,
    summary: {
      totalStories: stories.length,
      totalStoryPoints,
      p0Count,
      p1Count,
      p2Count,
      p3Count,
      averageRICEScore: Math.round(averageRICEScore),
    },
    definitionOfReady: [
      "Story has clear title and description",
      "Acceptance criteria defined in Given-When-Then format",
      "Story points estimated by the team",
      "Dependencies identified and resolved",
      "UX/UI designs attached (if applicable)",
      "Technical approach discussed with developers",
    ],
    definitionOfDone: [
      "Code implemented and follows coding standards",
      "Unit tests written with >80% coverage",
      "Acceptance criteria verified and passing",
      "Code reviewed and approved by peer",
      "QA testing completed on staging",
      "Documentation updated (if applicable)",
      "No critical bugs or blockers",
    ],
    recommendations: generateRecommendations(riceScores),
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { projectId, prdData, personas } = body;

    console.log("User Stories API called:", { projectId, personasCount: personas?.length });

    const projectContext = {
      projectId,
      prdData,
      personas,
    };

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Send step start event
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ event: "step_start", stepNumber: 7, stepName: "generate_user_stories" })}\n\n`
            )
          );

          // Generate user stories using LLM
          const messages = [
            { role: "system", content: STORIES_SYSTEM_PROMPT },
            { role: "user", content: `Generate user stories with RICE scoring based on this project context:\n\n${JSON.stringify(projectContext, null, 2)}` }
          ];

          const response = await routeLLMRequest(7, messages, {
            temperature: 0.7,
            maxTokens: 8192,
            stream: true
          });

          let fullContent = "";

          // Stream LLM response
          for await (const chunk of streamLLMResponse(7, response)) {
            fullContent += chunk;
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ event: "stream", content: chunk })}\n\n`
              )
            );
          }

          // Parse output - handle both arrays [...] and objects {...}
          let storiesData;
          try {
            console.log("User Stories LLM response:", fullContent);
            // Try array pattern first (for epic/story structure), then object pattern
            const arrayMatch = fullContent.match(/\[[\s\S]*\]/);
            const objectMatch = fullContent.match(/\{[\s\S]*\}/);
            
            if (arrayMatch) {
              storiesData = JSON.parse(arrayMatch[0]);
              console.log("Parsed as array:", storiesData);
            } else if (objectMatch) {
              storiesData = JSON.parse(objectMatch[0]);
              console.log("Parsed as object:", storiesData);
            } else {
              throw new Error("No JSON found");
            }
          } catch (error) {
            console.error("Failed to parse user stories JSON:", error);
            storiesData = { stories: [], _rawResponse: fullContent };
          }

          // Send step complete event
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ event: "step_complete", stepNumber: 7, output: storiesData })}\n\n`
            )
          );

          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("User Stories API error:", error);
    return Response.json({ error: "Failed to generate user stories" }, { status: 500 });
  }
}
