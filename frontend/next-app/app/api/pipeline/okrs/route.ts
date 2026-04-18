// Step 9: Generate OKRs and Success Metrics
// SSE streaming endpoint for OKR generation - Using real LLM
import { NextRequest } from "next/server";
import { routeLLMRequest, streamLLMResponse } from "@/lib/llm/llm-client";

const OKR_SYSTEM_PROMPT = `You are an expert Product Manager AI assistant. Generate OKRs and Success Metrics.

RESPONSE FORMAT - Valid JSON with this exact structure:
{
  "productName": "Product Name",
  "quarter": "Q1 2024",
  "teamName": "Product Team",
  "productLead": "Product Lead Name",
  "lastUpdated": "2024-01-15",
  
  "northStarDefinition": "The single metric that captures core value",
  "northStarCurrent": "Current value",
  "northStarTarget": "Target value",
  "northStarRationale": "Why this metric matters",
  
  "okr1": {
    "objective": "Objective statement",
    "keyResults": [
      {"description": "KR description", "current": "current", "target": "target", "status": "on-track"}
    ],
    "alignment": "Strategic alignment",
    "initiatives": ["Initiative 1", "Initiative 2"]
  },
  "okr2": { "objective": "...", "keyResults": [], "alignment": "...", "initiatives": [] },
  "okr3": { "objective": "...", "keyResults": [], "alignment": "...", "initiatives": [] },
  
  "acquisitionMetrics": [
    {"name": "Metric Name", "definition": "What it measures", "current": "value", "target": "value", "frequency": "weekly"}
  ],
  "engagementMetrics": [],
  "retentionMetrics": [],
  "revenueMetrics": [],
  "qualityMetrics": [],
  
  "acquisition": {"channel": "Primary channel", "volume": "Volume metric", "cost": "Cost metric"},
  "activation": {"event": "Activation event", "rate": "Rate", "timeToFirstValue": "Time"},
  "retention": {"cohort": "Cohort", "day7": "7-day retention", "day30": "30-day retention"},
  "revenue": {"arpu": "ARPU", "ltv": "LTV", "mrrArr": "MRR/ARR"},
  "referral": {"nps": "NPS", "rate": "Referral rate", "viralCoefficient": "Viral K"},
  
  "leadingIndicators": [{"indicator": "Leading indicator", "why": "Why it predicts success"}],
  "laggingIndicators": [{"indicator": "Lagging indicator", "what": "What it measures"}],
  
  "metricOwners": [{"metric": "Metric name", "owner": "Owner name", "cadence": "Review cadence", "tool": "Tracking tool"}],
  
  "risks": [{"description": "Risk description", "impact": "High/Medium/Low", "mitigation": "Mitigation strategy"}],
  
  "reviewSchedule": {"weekly": "Day", "monthly": "Date", "quarterly": "Date"},
  
  "recommendations": ["Recommendation 1", "Recommendation 2"]
}

INSTRUCTIONS:
- Create 3 meaningful OKR sets aligned with the product vision
- Include 3-5 key results per OKR with realistic current/target values
- Define 3 metrics per category with definitions
- Set realistic AARRR values based on user stories and PRD
- Include 2-3 leading and lagging indicators
- Define metric ownership with review cadence
- Identify 2-3 risks with mitigation strategies`;

// Note: Template reference: /backend/template/okr-metrics-template/okr-metrics-template.ts`

// Metric Interface
interface Metric {
  name: string;
  definition: string;
  current: string;
  target: string;
  frequency: "daily" | "weekly" | "monthly" | "quarterly";
}

// Key Result Interface
interface KeyResult {
  description: string;
  current: string;
  target: string;
  status: "on-track" | "at-risk" | "behind";
}

// OKR Set Interface
interface OKRSet {
  objective: string;
  keyResults: KeyResult[];
  alignment: string;
  initiatives: string[];
}

// Output Interface - Matching okr-metrics-template.ts
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
  metricOwners: {
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

// Generate OKRs from PRD and user stories - Matching okr-metrics-template
function generateOKRs(prd: any, userStories: any[]): OKROutput {
  const productName = prd?.title || "Product";
  const today = new Date().toISOString().split('T')[0];
  
  // Count stories by priority
  const p0Count = userStories.filter(s => s.priority === "P0").length;
  const p1Count = userStories.filter(s => s.priority === "P1").length;
  const totalStories = userStories.length;
  
  // OKR 1: Product-Market Fit
  const okr1: OKRSet = {
    objective: "Achieve Product-Market Fit",
    keyResults: [
      { description: "Acquire first 100 active users", current: "0", target: "100", status: "on-track" },
      { description: "Achieve 40% week-2 retention rate", current: "0%", target: "40%", status: "on-track" },
      { description: "Reach NPS score of 30+", current: "N/A", target: ">30", status: "on-track" }
    ],
    alignment: "Core company goal to validate product value",
    initiatives: [
      "Launch MVP with all P0 features",
      "Implement user feedback collection",
      "Conduct 20 customer interviews"
    ]
  };

  // OKR 2: Value Delivery
  const okr2: OKRSet = {
    objective: "Deliver Core Value Proposition",
    keyResults: [
      { description: `Complete all ${p0Count} P0 features`, current: "0", target: `${p0Count}`, status: "on-track" },
      { description: "Achieve 85% task completion rate", current: "0%", target: "85%", status: "on-track" },
      { description: "Reduce time-to-value to under 5 minutes", current: "N/A", target: "<5 min", status: "on-track" }
    ],
    alignment: "Support product-market fit through excellent UX",
    initiatives: [
      "Implement onboarding flow optimization",
      "Add in-app guidance and tooltips",
      "Create help documentation"
    ]
  };

  // OKR 3: Growth Engine
  const okr3: OKRSet = {
    objective: "Build Sustainable Growth Engine",
    keyResults: [
      { description: "Achieve 20% month-over-month growth", current: "0%", target: "20%", status: "at-risk" },
      { description: "Reach viral coefficient of 0.5", current: "0", target: "0.5", status: "at-risk" },
      { description: "Achieve CAC payback under 12 months", current: "N/A", target: "<12 mo", status: "on-track" }
    ],
    alignment: "Enable scalable customer acquisition",
    initiatives: [
      "Launch referral program",
      "Optimize conversion funnel",
      "Implement viral growth features"
    ]
  };

  // Metrics by Category
  const acquisitionMetrics: Metric[] = [
    { name: "New Signups", definition: "Total new user registrations per month", current: "0", target: "200/month", frequency: "monthly" },
    { name: "CAC", definition: "Customer Acquisition Cost", current: "N/A", target: "< ₹500", frequency: "monthly" },
    { name: "Organic Traffic", definition: "Visitors from non-paid channels", current: "0%", target: "60%", frequency: "weekly" }
  ];

  const engagementMetrics: Metric[] = [
    { name: "DAU/MAU", definition: "Daily/Monthly Active Users ratio", current: "0%", target: "20%+", frequency: "daily" },
    { name: "Session Duration", definition: "Average time spent per session", current: "N/A", target: ">3 min", frequency: "weekly" },
    { name: "Feature Adoption", definition: "Percentage using new features", current: "0%", target: "30%", frequency: "weekly" }
  ];

  const retentionMetrics: Metric[] = [
    { name: "Week-2 Retention", definition: "Percentage of users returning in week 2", current: "0%", target: "40%", frequency: "weekly" },
    { name: "Monthly Churn", definition: "Percentage of users leaving per month", current: "0%", target: "<10%", frequency: "monthly" },
    { name: "NPS", definition: "Net Promoter Score", current: "N/A", target: ">40", frequency: "quarterly" }
  ];

  const revenueMetrics: Metric[] = [
    { name: "MRR", definition: "Monthly Recurring Revenue", current: "₹0", target: "₹2L by Q2", frequency: "monthly" },
    { name: "ARPU", definition: "Average Revenue Per User", current: "₹0", target: "₹1,000", frequency: "monthly" },
    { name: "Free-to-Paid Conversion", definition: "Percentage converting to paid", current: "0%", target: "15%", frequency: "monthly" }
  ];

  const qualityMetrics: Metric[] = [
    { name: "Bug Count", definition: "Number of reported bugs", current: "0", target: "<5", frequency: "weekly" },
    { name: "Uptime", definition: "System availability percentage", current: "N/A", target: ">99.9%", frequency: "daily" },
    { name: "Load Time", definition: "Average page load time", current: "N/A", target: "<2 sec", frequency: "daily" }
  ];

  // AARRR Framework
  const aarrr = {
    acquisition: { channel: "Product-led growth", volume: "200 signups/month", cost: "₹200 CAC" },
    activation: { event: "First successful workflow completion", rate: "60%", timeToFirstValue: "<5 minutes" },
    retention: { cohort: "Week 1", day7: "40%", day30: "25%" },
    revenue: { arpu: "₹1,000", ltv: "₹12,000", mrrArr: "₹2L / ₹24L" },
    referral: { nps: ">40", rate: "15%", viralCoefficient: "0.5" }
  };

  // Leading vs Lagging Indicators
  const leadingIndicators = [
    { indicator: "Feature adoption rate", why: "Predicts engagement and retention" },
    { indicator: "Onboarding completion", why: "Predicts activation and long-term usage" },
    { indicator: "User feedback sentiment", why: "Early signal of product-market fit" }
  ];

  const laggingIndicators = [
    { indicator: "Monthly revenue", what: "Business outcome of all efforts" },
    { indicator: "Customer churn rate", what: "Overall product satisfaction" },
    { indicator: "Market share", what: "Competitive position" }
  ];

  // Risks
  const risks = [
    { description: "Market saturation", impact: "High", mitigation: "Focus on underserved niches" },
    { description: "Technical debt", impact: "Medium", mitigation: "Allocate 20% capacity to refactoring" },
    { description: "Competitor response", impact: "Medium", mitigation: "Build moat through network effects" }
  ];

  // Metric Ownership
  const metricOwners = [
    { metric: "NPS", owner: "Customer Success Lead", cadence: "Monthly", tool: "SurveyMonkey" },
    { metric: "MRR", owner: "Finance Lead", cadence: "Weekly", tool: "Stripe Dashboard" },
    { metric: "Week-2 Retention", owner: "Product Lead", cadence: "Weekly", tool: "Mixpanel" }
  ];

  return {
    // Metadata
    productName,
    quarter: "Q1 2026",
    teamName: "Product Team",
    productLead: "Product Lead",
    lastUpdated: today,

    // North Star
    northStarDefinition: `Number of users achieving their goal with ${productName}`,
    northStarCurrent: "0",
    northStarTarget: "10,000",
    northStarRationale: `Captures the core value of ${productName} - users successfully completing their primary workflow`,

    // OKRs
    okr1,
    okr2,
    okr3,

    // Metrics
    acquisitionMetrics,
    engagementMetrics,
    retentionMetrics,
    revenueMetrics,
    qualityMetrics,

    // Metric Owners
    metricOwners,

    // AARRR
    acquisition: aarrr.acquisition,
    activation: aarrr.activation,
    retention: aarrr.retention,
    revenue: aarrr.revenue,
    referral: aarrr.referral,

    // Indicators
    leadingIndicators,
    laggingIndicators,

    // Review Schedule
    reviewSchedule: {
      weekly: "Monday 10am",
      monthly: "First Friday of month",
      quarterly: "First week of quarter"
    },

    // Risks
    risks,

    // Recommendations
    recommendations: [
      "Review OKRs weekly and update confidence levels",
      "Focus on leading indicators (activation, retention) rather than lagging (revenue)",
      "Set up automated dashboards for real-time metric tracking",
      "Celebrate KR achievements to maintain team motivation",
      "Be willing to adjust KRs if market feedback suggests different priorities",
      "Align team incentives with OKR achievement, not just output delivery"
    ]
  };
}

// Real LLM Stream generator
async function* generateStream(prd: any, userStories: any[]): AsyncGenerator<string> {
  const messages = [
    { role: "system", content: OKR_SYSTEM_PROMPT },
    { role: "user", content: `Generate OKRs and success metrics based on this PRD and user stories:\n\nPRD: ${JSON.stringify(prd, null, 2)}\n\nUser Stories: ${JSON.stringify(userStories, null, 2)}` }
  ];

  const response = await routeLLMRequest(9, messages, {
    temperature: 0.7,
    maxTokens: 4096,
    stream: true
  });

  let fullContent = "";
  for await (const chunk of streamLLMResponse(9, response)) {
    fullContent += chunk;
    yield `data: ${JSON.stringify({ event: "stream", content: chunk })}\n\n`;
  }

  // Parse and send complete event
  let okrs;
  try {
    const jsonMatch = fullContent.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      okrs = JSON.parse(jsonMatch[0]);
    } else {
      throw new Error("No JSON found");
    }
  } catch {
    okrs = { okr1: {}, okr2: {}, okr3: {}, _rawResponse: fullContent };
  }

  yield `data: ${JSON.stringify({ event: "step_complete", stepNumber: 9, output: okrs })}\n\n`;
  yield `data: [DONE]\n\n`;
}

// POST handler
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prdData, userStories } = body;

    if (!userStories || !Array.isArray(userStories) || userStories.length === 0) {
      return new Response(
        `data: ${JSON.stringify({ event: "error", message: "User stories are required" })}\n\n`,
        { status: 400, headers: { "Content-Type": "text/plain" } }
      );
    }

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const generator = generateStream(prdData || {}, userStories);
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
