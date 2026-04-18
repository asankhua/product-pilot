// Step 3: Identify & Profile Personas API
// SSE streaming endpoint - Using real LLM
import { NextRequest } from "next/server";
import { routeLLMRequest, streamLLMResponse } from "@/lib/llm/llm-client";

const PERSONAS_SYSTEM_PROMPT = `You are an expert Product Manager AI assistant. Your task is to create detailed user personas based on the problem statement, reframed problem, and product vision.

Use the following context from previous steps:
- Original Problem: {{problemStatement}}
- Reframed Problem: {{reframedProblem}}
- Vision Statement: {{vision}}
- Target Audience: {{targetAudience}}
- Business Impact: {{businessImpact}}

Create 2-3 distinct user personas following the Product School template structure:

For each persona include:
1. Overview: name, role, age, generation, location, representative quote
2. Demographics: personal (gender, education, occupation, income, family status, living situation) and professional (industry, company size, experience, technical skill 1-5, tools used)
3. Psychographics: personality traits, values, fears, motivations, hobbies, favorite brands, influencers
4. Usage Profile: patterns (frequency, session duration, devices, context, time of day), goals (1-5), pain points (1-5 with title/description), needs
5. Journey Context: current behavior, day in the life, trigger events, decision making
6. Product Fit: why they need the product, how they'll use it, success metrics, objections
7. Metadata: is primary persona, related personas, segment
8. Validation: data sources, validated assumptions, open questions

Generate personas that specifically address the problem statement and align with the product vision. Make them realistic and grounded in the target audience from previous steps.

Respond with valid JSON matching the template structure.`;

// Persona Template Structure (Product School based)
interface PersonaTemplate {
  overview: {
    name: string;
    role: string;
    age: number;
    generation: string;
    location: string;
    quote: string;
  };
  demographics: {
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
  };
  psychographics: {
    personalityTraits: string;
    values: string;
    fears: string;
    motivations: string;
    hobbies: string;
    favoriteBrands: string[];
    influencers: string[];
  };
  usageProfile: {
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
  };
  journeyContext: {
    currentBehavior: string;
    dayInTheLife: string;
    triggerEvents: string;
    decisionMaking: string;
  };
  productFit: {
    whyNeedProduct: string;
    howTheyllUseIt: string;
    successMetrics: string;
    objections: string;
  };
  metadata: {
    isPrimaryPersona: boolean;
    relatedPersonas: string[];
    personaSegment: string;
  };
  validation: {
    dataSources: string;
    validatedAssumptions: string;
    openQuestions: string;
  };
}

// Generate personas based on project context
function generatePersonasFromContext(projectContext: any): { personas: PersonaTemplate[] } {
  // Extract context from previous steps
  const problemStatement = projectContext?.originalProblem || "Users struggle with productivity and workflow management";
  const reframedProblem = projectContext?.reframedProblem?.customerProblem || "";
  const vision = projectContext?.visionStatement || "Create a seamless productivity solution";
  const targetAudience = projectContext?.reframedProblem?.targetAudience || ["Primary: End users experiencing the core problem"];
  const businessImpact = projectContext?.reframedProblem?.businessImpact || [];

  return {
    personas: [
      {
        overview: {
          name: "Sarah Chen",
          role: "Product Manager",
          age: 32,
          generation: "Millennial",
          location: "San Francisco, CA",
          quote: "If I could save just 1 hour a day on admin tasks, I'd have time for strategic thinking."
        },
        demographics: {
          personal: {
            gender: "Female",
            education: "Bachelor's Degree in Business",
            occupation: "Product Manager",
            incomeLevel: "$90k-$120k",
            familyStatus: "Single",
            livingSituation: "Rents apartment in city"
          },
          professional: {
            industry: "Technology / SaaS",
            companySize: "Mid-size (100-500 employees)",
            yearsExperience: "5-8 years",
            technicalSkill: 4,
            toolsUsed: ["Jira", "Slack", "Figma", "Notion", "Google Analytics"]
          }
        },
        psychographics: {
          personalityTraits: "Organized, ambitious, collaborative, data-driven",
          values: "Efficiency, work-life balance, continuous learning, team success",
          fears: "Missing deadlines, letting team down, burnout from admin overload",
          motivations: "Shipping great products, team growth, personal career advancement",
          hobbies: "Yoga, reading tech blogs, weekend hiking",
          favoriteBrands: ["Notion", "Slack", "Apple", "Allbirds", "Blue Bottle Coffee"],
          influencers: ["Lenny Rachitsky", "Shreyas Doshi", "Julie Zhuo"]
        },
        usageProfile: {
          patterns: {
            frequency: "Daily, throughout workday",
            sessionDuration: "15-30 minutes per session",
            primaryDevices: ["MacBook Pro", "iPhone"],
            context: "Work environment - office and remote",
            timeOfDay: "9 AM - 6 PM with evening check-ins"
          },
          goals: [
            "Ship products on time and on scope",
            "Improve cross-functional collaboration",
            "Reduce time spent on administrative tasks by 30%",
            "Increase strategic thinking time"
          ],
          painPoints: [
            { title: "Tool Overload", description: "Switches between 8+ tools daily, causing context switching and lost focus" },
            { title: "Status Tracking", description: "Difficulty getting real-time visibility on project progress across teams" },
            { title: "Communication Gaps", description: "Important updates get lost in Slack threads and email chains" },
            { title: "Manual Reporting", description: "Spends 5+ hours weekly creating status reports manually" }
          ],
          needs: [
            "Unified workspace for all project info",
            "Automated status updates and reporting",
            "Better async communication tools",
            "Integration with existing tech stack"
          ]
        },
        journeyContext: {
          currentBehavior: "Starts day checking Slack, then Jira, then email - constantly context switching",
          dayInTheLife: "Morning standup, back-to-back meetings, brief focused work time, evening catch-up",
          triggerEvents: "New project kickoff, sprint planning, quarterly reviews, team expansion",
          decisionMaking: "Data-driven, consults team, weighs efficiency vs thoroughness"
        },
        productFit: {
          whyNeedProduct: "Consolidates her fragmented workflow into one unified platform",
          howTheyllUseIt: "Daily for project tracking, team communication, and automated reporting",
          successMetrics: "30% reduction in admin time, 50% faster status updates, improved team satisfaction",
          objections: "Concerned about migration effort and team adoption curve"
        },
        metadata: {
          isPrimaryPersona: true,
          relatedPersonas: ["Operations Lead", "Engineering Manager"],
          personaSegment: "Primary User - Product Team"
        },
        validation: {
          dataSources: "User interviews, support tickets, analytics data",
          validatedAssumptions: "Tool overload is real, reporting is pain point, integration critical",
          openQuestions: "Willingness to pay, preferred pricing model, feature prioritization"
        }
      },
      {
        overview: {
          name: "Marcus Rodriguez",
          role: "Operations Lead",
          age: 38,
          generation: "Millennial",
          location: "Austin, TX",
          quote: "I need to see the big picture without getting lost in the details."
        },
        demographics: {
          personal: {
            gender: "Male",
            education: "MBA",
            occupation: "Operations Lead",
            incomeLevel: "$100k-$140k",
            familyStatus: "Married, 2 kids",
            livingSituation: "Suburban home owner"
          },
          professional: {
            industry: "Technology / Startup",
            companySize: "Growing (50-200 employees)",
            yearsExperience: "10-12 years",
            technicalSkill: 3,
            toolsUsed: ["Excel", "Salesforce", "Tableau", "Slack", "Google Workspace"]
          }
        },
        psychographics: {
          personalityTraits: "Analytical, process-oriented, strategic, patient",
          values: "Efficiency, scalability, team empowerment, work-life balance",
          fears: "Operational chaos as company scales, missing critical issues, team burnout",
          motivations: "Building sustainable systems, enabling team success, business growth",
          hobbies: "Golf, BBQ competitions, reading business books, coaching youth sports",
          favoriteBrands: ["Salesforce", "Tableau", "Patagonia", "Tesla", "Peloton"],
          influencers: ["Ben Horowitz", "Keith Rabois", "Claire Hughes Johnson"]
        },
        usageProfile: {
          patterns: {
            frequency: "Daily, structured check-ins",
            sessionDuration: "20-45 minutes per session",
            primaryDevices: ["MacBook Pro", "iPad"],
            context: "Office and home office",
            timeOfDay: "8 AM - 5 PM with morning focus time"
          },
          goals: [
            "Improve operational efficiency by 40%",
            "Enable data-driven decision making",
            "Scale processes without adding headcount",
            "Create single source of truth for ops data"
          ],
          painPoints: [
            { title: "Siloed Data", description: "Critical information trapped in department-specific tools and spreadsheets" },
            { title: "Manual Reporting", description: "Weekly operations reports take 8+ hours to compile from multiple sources" },
            { title: "Lack of Visibility", description: "Can't get real-time view of key operational metrics" },
            { title: "Process Inconsistency", description: "Teams using different workflows creates confusion and errors" }
          ],
          needs: [
            "Centralized operations dashboard",
            "Automated data collection and reporting",
            "Standardized process templates",
            "Cross-functional visibility tools"
          ]
        },
        journeyContext: {
          currentBehavior: "Reviews morning dashboard, responds to Slack, checks key metrics throughout day",
          dayInTheLife: "Morning review, team check-ins, process improvements, strategic planning",
          triggerEvents: "Quarterly planning, funding rounds, team expansion, new tool evaluation",
          decisionMaking: "Data-first, risk-averse, seeks buy-in from stakeholders, ROI-focused"
        },
        productFit: {
          whyNeedProduct: "Provides the operational visibility and standardization needed for scaling",
          howTheyllUseIt: "Daily dashboard reviews, weekly reporting, process documentation",
          successMetrics: "40% faster reporting, 60% reduction in data requests, improved forecast accuracy",
          objections: "Concerns about implementation timeline and integration complexity"
        },
        metadata: {
          isPrimaryPersona: false,
          relatedPersonas: ["Product Manager", "CEO/Founder"],
          personaSegment: "Secondary User - Operations"
        },
        validation: {
          dataSources: "Operations teams interviews, process audits, usage analytics",
          validatedAssumptions: "Dashboard critical, reporting pain real, integration important",
          openQuestions: "Specific metrics needed, customization requirements, budget approval process"
        }
      }
    ]
  };
}

// Real LLM streaming response
async function* llmStreamResponse(projectContext: any): AsyncGenerator<string> {
  const contextStr = JSON.stringify(projectContext, null, 2);

  const messages = [
    { role: "system", content: PERSONAS_SYSTEM_PROMPT },
    { role: "user", content: `Create detailed user personas based on this project context:\n\n${contextStr}` }
  ];

  const response = await routeLLMRequest(3, messages, {
    temperature: 0.7,
    maxTokens: 4096,
    stream: true
  });

  yield* streamLLMResponse(3, response);
}

export async function POST(req: NextRequest) {
  try {
    // Parse request body once
    const body = await req.json();
    const { projectId, problemStatement, reframedProblem, vision, projectContext } = body;

    // Create SSE stream
    const stream = new ReadableStream({
      async start(controller) {
        try {
          controller.enqueue(
            new TextEncoder().encode(
              `data: ${JSON.stringify({ event: "step_start", stepNumber: 3, stepName: "identify_personas" })}\n\n`
            )
          );

          let fullContent = "";

          // Use project context from request or default to empty object
          const context = projectContext || {};

          // Stream real LLM response
          for await (const chunk of llmStreamResponse(context)) {
            fullContent += chunk;
            controller.enqueue(
              new TextEncoder().encode(
                `data: ${JSON.stringify({ event: "stream", content: chunk })}\n\n`
              )
            );
          }

          // Parse and send complete output
          let output;
          try {
            // Try to extract JSON array first [\s\S]*, then object
            const arrayMatch = fullContent.match(/\[[\s\S]*\]/);
            const objectMatch = fullContent.match(/\{[\s\S]*\}/);
            
            if (arrayMatch) {
              // If it's an array, wrap it in personas property
              const personasArray = JSON.parse(arrayMatch[0]);
              output = { personas: personasArray };
            } else if (objectMatch) {
              // If it's an object, use it directly
              output = JSON.parse(objectMatch[0]);
            } else {
              throw new Error("No JSON found");
            }
          } catch {
            output = { personas: [], _rawResponse: fullContent };
          }
          controller.enqueue(
            new TextEncoder().encode(
              `data: ${JSON.stringify({ event: "step_complete", stepNumber: 3, output })}\n\n`
            )
          );

          controller.enqueue(
            new TextEncoder().encode(`data: [DONE]\n\n`)
          );
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
        "Connection": "keep-alive",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to generate personas" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
