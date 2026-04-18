// Step 8: Generate Roadmap from User Stories
// SSE streaming endpoint following Roadmap Template - Using real LLM
import { NextRequest } from "next/server";
import { routeLLMRequest, streamLLMResponse } from "@/lib/llm/llm-client";

const ROADMAP_SYSTEM_PROMPT = `You are an expert Product Manager AI assistant. Generate a product roadmap from user stories.

RESPONSE FORMAT - Valid JSON matching this exact structure:
{
  "title": "Product Name - Roadmap",
  "description": "Strategic roadmap description",
  "timeframe": {
    "startDate": "2024-01-15",
    "endDate": "2024-04-15",
    "totalWeeks": 12
  },
  "phases": [
    {
      "name": "Phase 1: Foundation",
      "startDate": "2024-01-15",
      "endDate": "2024-02-15",
      "duration": 4,
      "objectives": ["Objective 1", "Objective 2"],
      "userStories": [
        {
          "title": "Story Title",
          "description": "As a user...",
          "priority": "P0",
          "storyPoints": 5
        }
      ],
      "milestones": ["Milestone 1", "Milestone 2"],
      "deliverables": ["Deliverable 1"]
    }
  ],
  "summary": {
    "totalStories": 10,
    "totalStoryPoints": 45,
    "phases": 3,
    "keyMilestones": ["Milestone 1", "Milestone 2"]
  },
  "recommendations": ["Recommendation 1", "Recommendation 2"]
}

INSTRUCTIONS:
- Group user stories into 2-4 phases based on priority (P0 in early phases)
- Calculate realistic timeframes based on story points
- Include specific dates in YYYY-MM-DD format
- Add meaningful milestones and deliverables for each phase
- Provide strategic recommendations at the end`;

// Note: Template structure defined in /backend/template/roadmap template/roadmap-template.ts
// This API generates data matching that structure via LLM

// Phase Interface - Matching roadmap-template.ts structure
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

// Output Interface - Matching roadmap-template.ts Roadmap interface
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

// Generate roadmap from user stories - Matching roadmap-template.ts structure
function generateRoadmap(userStories: any[], prdTitle: string = "Product"): RoadmapOutput {
  // Sort stories by RICE priority (P0 first, then P1, P2, P3)
  const sortedStories = [...userStories].sort((a, b) => {
    const priorityOrder = { P0: 0, P1: 1, P2: 2, P3: 3 };
    return (priorityOrder[a.priority as keyof typeof priorityOrder] || 2) - 
           (priorityOrder[b.priority as keyof typeof priorityOrder] || 2);
  });

  // Calculate total story points
  const totalStoryPoints = sortedStories.reduce((sum, s) => sum + (s.storyPoints || 3), 0);
  
  // Configuration
  const totalWeeks = 12; // Default 12 weeks
  const startDate = new Date();
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + (totalWeeks * 7));
  
  // Group user stories by priority
  const p0Stories = sortedStories.filter(s => s.priority === "P0");
  const p1Stories = sortedStories.filter(s => s.priority === "P1");
  const p2Stories = sortedStories.filter(s => s.priority === "P2");
  
  // Calculate phase durations based on priority (matching template logic)
  const p0Duration = Math.ceil(p0Stories.length * 0.5) || 4; // 0.5 weeks per P0 story
  const p1Duration = Math.ceil(p1Stories.length * 0.75) || 6; // 0.75 weeks per P1 story
  const p2Duration = Math.ceil(p2Stories.length * 0.5) || 4; // 0.5 weeks per P2 story
  
  const totalCalculatedWeeks = p0Duration + p1Duration + p2Duration;
  const scaleFactor = totalWeeks / Math.max(totalCalculatedWeeks, 1);
  
  // Generate phases
  const phases: RoadmapPhase[] = [];
  let currentDate = new Date(startDate);
  
  // Phase 1: Foundation (P0 stories)
  if (p0Stories.length > 0) {
    const phaseDuration = Math.round(p0Duration * scaleFactor) || 4;
    const phaseEndDate = new Date(currentDate);
    phaseEndDate.setDate(phaseEndDate.getDate() + (phaseDuration * 7));
    
    phases.push({
      name: 'Phase 1: Foundation',
      startDate: currentDate.toISOString().split('T')[0],
      endDate: phaseEndDate.toISOString().split('T')[0],
      duration: phaseDuration,
      objectives: [
        'Establish core infrastructure',
        'Implement critical features',
        'Ensure system stability'
      ],
      userStories: p0Stories.map(s => ({
        title: s.title,
        description: s.description,
        priority: s.priority,
        storyPoints: s.storyPoints || 3
      })),
      milestones: [
        'Core architecture complete',
        'First stable release',
        'Performance benchmarks met'
      ],
      deliverables: [
        'Functional MVP',
        'API documentation',
        'Security audit passed'
      ]
    });
    
    currentDate = new Date(phaseEndDate);
  }
  
  // Phase 2: Enhancement (P1 stories)
  if (p1Stories.length > 0) {
    const phaseDuration = Math.round(p1Duration * scaleFactor) || 6;
    const phaseEndDate = new Date(currentDate);
    phaseEndDate.setDate(phaseEndDate.getDate() + (phaseDuration * 7));
    
    phases.push({
      name: 'Phase 2: Enhancement',
      startDate: currentDate.toISOString().split('T')[0],
      endDate: phaseEndDate.toISOString().split('T')[0],
      duration: phaseDuration,
      objectives: [
        'Expand feature set',
        'Improve user experience',
        'Add integrations'
      ],
      userStories: p1Stories.map(s => ({
        title: s.title,
        description: s.description,
        priority: s.priority,
        storyPoints: s.storyPoints || 3
      })),
      milestones: [
        'Feature parity with competitors',
        'User onboarding flow complete',
        'Analytics dashboard live'
      ],
      deliverables: [
        'Enhanced feature set',
        'User guides and tutorials',
        'Integration documentation'
      ]
    });
    
    currentDate = new Date(phaseEndDate);
  }
  
  // Phase 3: Optimization (P2 stories)
  if (p2Stories.length > 0) {
    const phaseDuration = Math.round(p2Duration * scaleFactor) || 4;
    const phaseEndDate = new Date(currentDate);
    phaseEndDate.setDate(phaseEndDate.getDate() + (phaseDuration * 7));
    
    phases.push({
      name: 'Phase 3: Optimization',
      startDate: currentDate.toISOString().split('T')[0],
      endDate: phaseEndDate.toISOString().split('T')[0],
      duration: phaseDuration,
      objectives: [
        'Optimize performance',
        'Add polish and refinement',
        'Prepare for scaling'
      ],
      userStories: p2Stories.map(s => ({
        title: s.title,
        description: s.description,
        priority: s.priority,
        storyPoints: s.storyPoints || 3
      })),
      milestones: [
        'Performance targets met',
        'Code coverage above 80%',
        'Load testing passed'
      ],
      deliverables: [
        'Performance optimization report',
        'Scaling guide',
        'Maintenance documentation'
      ]
    });
  }
  
  // Calculate summary
  const keyMilestones = phases.flatMap(p => p.milestones);

  return {
    title: `${prdTitle} - Roadmap`,
    description: `Strategic roadmap for ${prdTitle} development`,
    timeframe: {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      totalWeeks
    },
    phases,
    summary: {
      totalStories: userStories.length,
      totalStoryPoints,
      phases: phases.length,
      keyMilestones
    },
    recommendations: [
      "Consider parallel development tracks for independent features",
      "Maintain 20% buffer for unexpected complexity",
      "Review and adjust roadmap after each phase completion",
      "Prioritize user feedback over pre-planned P3 features",
      "Plan for maintenance and bug fixing sprints between phases"
    ]
  };
}

// Real LLM Stream generator
async function* generateStream(userStories: any[], prdTitle: string = "Product"): AsyncGenerator<string> {
  const messages = [
    { role: "system", content: ROADMAP_SYSTEM_PROMPT },
    { role: "user", content: `Generate a product roadmap from these user stories for "${prdTitle}":\n\n${JSON.stringify(userStories, null, 2)}` }
  ];

  const response = await routeLLMRequest(8, messages, {
    temperature: 0.7,
    maxTokens: 4096,
    stream: true
  });

  let fullContent = "";
  for await (const chunk of streamLLMResponse(8, response)) {
    fullContent += chunk;
    yield `data: ${JSON.stringify({ event: "stream", content: chunk })}\n\n`;
  }

  // Parse and send complete event
  let roadmap;
  try {
    const jsonMatch = fullContent.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      roadmap = JSON.parse(jsonMatch[0]);
    } else {
      throw new Error("No JSON found");
    }
  } catch {
    roadmap = { phases: [], _rawResponse: fullContent };
  }

  yield `data: ${JSON.stringify({ event: "step_complete", stepNumber: 8, output: roadmap })}\n\n`;
  yield `data: [DONE]\n\n`;
}

// POST handler
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userStories, prdTitle } = body;

    if (!userStories || !Array.isArray(userStories) || userStories.length === 0) {
      return new Response(
        `data: ${JSON.stringify({ event: "error", message: "User stories are required" })}\n\n`,
        { status: 400, headers: { "Content-Type": "text/plain" } }
      );
    }

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const generator = generateStream(userStories, prdTitle || "Product");
          for await (const chunk of generator) {
            controller.enqueue(new TextEncoder().encode(chunk));
          }
          controller.close();
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : "Unknown error";
          controller.enqueue(new TextEncoder().encode(
            `data: ${JSON.stringify({ event: "error", message: errorMessage })}\n\n`
          ));
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
