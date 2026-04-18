// Step 1: Reframe Problem Statement API
// SSE streaming endpoint - Using real LLM
import { NextRequest } from "next/server";
import { routeLLMRequest, streamLLMResponse } from "@/lib/llm/llm-client";

const REFRAME_SYSTEM_PROMPT = `You are an expert Product Manager AI assistant. Your task is to analyze and reframe problem statements using the ProductPlan problem statement template structure.

TEMPLATE STRUCTURE (from problem-statement-template.md):

# Problem Title
## One-Line Summary

## Problem Statement Framework
### 1. The Problem
- Problem Description
- Who is affected
- Current pain points

### 2. Context
- Root Causes
- When it occurs
- How it manifests
- Current workarounds (if any)
- Why existing solutions fail

### 3. Scope
- In Scope
- Out of Scope
- Boundaries & Constraints

### 4. Measurability
- Current State Metric
- Target State Metric
- Timeframe
- Success Criteria

### 5. Impact
- Business Impact
- User Impact
- Consequences of not solving
- Benefits of solving

## Validation & Evidence
- Supporting Data
- User Research Insights
- Market Evidence
- Stakeholder Input

## Problem Statement Draft (Concise Version)
For: [target user]
Who: [who statement]
The: [the problem]
Is a: [is a problem]
That: [that causes]
Unlike: [unlike current]
Our solution: [our solution]

Follow this structured format:

1. PROBLEM TITLE & SUMMARY
   - problemTitle: Clear, descriptive title
   - oneLineSummary: Concise one-line summary

2. PROBLEM DETAILS
   - description: Detailed problem without solution assumptions
   - affectedUsers: Who is affected by this problem
   - painPoints: Specific pain points experienced

3. CONTEXT
   - rootCauses: Underlying causes
   - whenItOccurs: When the problem occurs
   - howItManifests: How it manifests
   - currentWorkarounds: Existing workarounds
   - existingSolutionFailures: Why current solutions fail

4. SCOPE
   - inScope: What the solution will address
   - outOfScope: What the solution will NOT address
   - boundaries: Constraints and boundaries

5. MEASURABILITY
   - currentMetric: Current state quantifiable metric
   - targetMetric: Target state metric
   - timeframe: Timeline for achieving target
   - successCriteria: How to measure success

6. IMPACT
   - businessImpact: Impact on business metrics
   - userImpact: Impact on users' lives/work
   - consequences: Consequences of not solving
   - benefits: Benefits of solving

7. VALIDATION
   - supportingData: Data supporting the problem
   - userResearch: User research insights
   - marketEvidence: Market evidence
   - stakeholderInput: Stakeholder perspectives

8. CONCISE FORMAT (Mad Libs style)
   - targetUser: For [target user]
   - whoStatement: Who [statement of need]
   - theProblem: The [problem]
   - isAProblem: Is a [describe impact]
   - thatCauses: That [describe consequences]
   - unlikeCurrent: Unlike [current solutions]
   - ourSolution: Our solution [describe approach]

9. NEXT STEPS
   - 1-5 specific next steps to take

Respond with valid JSON matching the template structure.`;

// Problem Statement Template Structure (ProductPlan based)
interface ProblemStatementTemplate {
  problemTitle: string;
  oneLineSummary: string;
  problem: {
    description: string;
    affectedUsers: string;
    painPoints: string;
  };
  context: {
    rootCauses: string;
    whenItOccurs: string;
    howItManifests: string;
    currentWorkarounds: string;
    existingSolutionFailures: string;
  };
  scope: {
    inScope: string;
    outOfScope: string;
    boundaries: string;
  };
  measurability: {
    currentMetric: string;
    targetMetric: string;
    timeframe: string;
    successCriteria: string;
  };
  impact: {
    businessImpact: string;
    userImpact: string;
    consequences: string;
    benefits: string;
  };
  validation: {
    supportingData: string;
    userResearch: string;
    marketEvidence: string;
    stakeholderInput: string;
  };
  conciseFormat: {
    targetUser: string;
    whoStatement: string;
    theProblem: string;
    isAProblem: string;
    thatCauses: string;
    unlikeCurrent: string;
    ourSolution: string;
  };
  nextSteps: string[];
}

// Generate problem statement from input following template structure
function generateProblemStatement(problemInput: string): ProblemStatementTemplate {
  // Parse the input to extract key themes (in real implementation, this would use LLM)
  const isCheckout = problemInput.toLowerCase().includes('checkout') || problemInput.toLowerCase().includes('cart');
  const isProductivity = problemInput.toLowerCase().includes('productivity') || problemInput.toLowerCase().includes('workflow');
  const isCommunication = problemInput.toLowerCase().includes('communication') || problemInput.toLowerCase().includes('collaboration');

  // Default to checkout example if no specific theme detected
  const theme = isCheckout ? 'checkout' : isProductivity ? 'productivity' : isCommunication ? 'communication' : 'general';

  const themes: Record<string, ProblemStatementTemplate> = {
    checkout: {
      problemTitle: "High Cart Abandonment Due to Friction in Checkout Process",
      oneLineSummary: "Users abandon carts due to a confusing, multi-step checkout process with unexpected costs and lack of payment options",
      problem: {
        description: "Our e-commerce platform experiences a 65% cart abandonment rate, significantly higher than the industry average of 45%. Users start the checkout process but drop off due to friction points including unexpected shipping costs, forced account creation, lack of payment options, and a confusing multi-page flow that requires excessive form filling",
        affectedUsers: "Primary: Mobile users (78% of drop-offs) who need streamlined, touch-friendly checkout. Secondary: First-time buyers without saved payment info. Tertiary: International users facing currency and shipping confusion",
        painPoints: "Unexpected costs appearing late in the process, forced account creation before purchase, too many form fields across multiple pages, limited payment options, no guest checkout, confusing error messages, slow page loads on mobile"
      },
      context: {
        rootCauses: "Legacy checkout system built for desktop-only, lack of mobile optimization, business requirement to capture user data upfront, limited payment gateway integrations, no unified shipping cost calculator",
        whenItOccurs: "During the purchase decision phase when users have added items to cart and initiated checkout, particularly on mobile devices and during high-traffic periods",
        howItManifests: "Users drop off at shipping information page (35%), payment details page (25%), and account creation step (20%). Mobile users show 40% higher abandonment than desktop",
        currentWorkarounds: "Users abandon and return later, contact support for help completing purchases, use desktop instead of mobile, or purchase from competitors with smoother checkout",
        existingSolutionFailures: "Current one-page checkout still has too many fields, Express checkout options limited to credit cards only, Save-for-later feature rarely used, abandoned cart emails have low conversion (5%)"
      },
      scope: {
        inScope: "Streamlined guest checkout, mobile-optimized flow, transparent pricing with real-time shipping calculation, multiple payment options (credit card, PayPal, Apple Pay, Google Pay), saved preferences for registered users, progress indicators, clear error handling",
        outOfScope: "One-click purchasing for first-time users, cryptocurrency payments, voice-enabled checkout, social commerce integration, AR/VR shopping experience",
        boundaries: "Must maintain PCI DSS compliance, integrate with existing inventory system, support current payment processors, work within existing brand guidelines, 3-month implementation timeline"
      },
      measurability: {
        currentMetric: "65% cart abandonment rate, 2.5 minute average checkout time, 15% mobile conversion rate, $50K monthly revenue loss from abandoned carts",
        targetMetric: "Reduce cart abandonment to under 50%, decrease checkout time to under 90 seconds, increase mobile conversion to 22%, recover $25K monthly revenue",
        timeframe: "6 months to achieve target metrics: 20% improvement in month 1, 40% by month 3, full target by month 6",
        successCriteria: "Cart abandonment rate <50%, checkout completion time <90 seconds, mobile conversion rate >22%, checkout-related support tickets reduced by 40%, user satisfaction score >4.2/5"
      },
      impact: {
        businessImpact: "Revenue increase of $300K annually from reduced abandonment, 25% reduction in customer acquisition costs through improved conversion, decreased support costs ($10K/month savings), improved customer lifetime value through better first purchase experience",
        userImpact: "Faster, more confident purchasing experience, reduced frustration and cognitive load, transparent pricing builds trust, more payment options increase accessibility, mobile-friendly experience enables shopping anywhere",
        consequences: "Continued revenue loss of $50K/month, declining market share as competitors improve their checkout, increased customer churn to competitors with better UX, higher customer acquisition costs as abandoned users don't return, negative brand perception from frustrating purchase experience",
        benefits: "Increased revenue and conversion rates, improved customer satisfaction and loyalty, reduced support burden, competitive advantage in mobile commerce, valuable data on user preferences, positive word-of-mouth from satisfied customers"
      },
      validation: {
        supportingData: "Google Analytics shows 65% abandonment at checkout, heatmaps reveal users dropping at shipping and payment pages, A/B test of simplified form reduced abandonment by 15%, competitor analysis shows industry leaders have <50% abandonment",
        userResearch: "15 user interviews revealed frustration with forced account creation, mobile usability tests showed difficulty with form fields, survey of 200 users ranked checkout experience as top improvement priority, support ticket analysis identified checkout as #1 complaint category",
        marketEvidence: "Baymard Institute research shows average cart abandonment is 69.8%, top e-commerce sites have checkout flows under 60 seconds, mobile commerce growing 35% YoY making mobile optimization critical, Amazon's one-click patent expired enabling similar solutions",
        stakeholderInput: "Customer Success team reports checkout complaints daily, Sales team losing deals to competitors with better UX, CEO identified checkout improvement as Q3 priority, Engineering team ready to modernize legacy checkout system, Finance approved budget for payment processor upgrades"
      },
      conciseFormat: {
        targetUser: "For mobile and first-time online shoppers",
        whoStatement: "Who need a fast, transparent, and hassle-free checkout experience",
        theProblem: "The complex, multi-step checkout process with hidden costs and forced account creation",
        isAProblem: "Is a significant barrier to purchase that frustrates users and causes 65% to abandon their carts",
        thatCauses: "That results in $600K annual revenue loss and drives customers to competitors with smoother checkout experiences",
        unlikeCurrent: "Unlike our current legacy checkout and competitor solutions that prioritize data collection over user experience",
        ourSolution: "Our solution is a streamlined, mobile-first checkout flow with transparent pricing, guest checkout option, and multiple payment methods that prioritizes speed and user convenience"
      },
      nextSteps: [
        "Conduct comprehensive checkout UX audit with user testing sessions",
        "Benchmark against top 5 competitors and identify best practices",
        "Create low-fidelity wireframes of new checkout flow for stakeholder review",
        "Develop technical requirements document for payment processor integration",
        "Secure budget approval and assign cross-functional implementation team"
      ]
    },
    productivity: {
      problemTitle: "Fragmented Workflow Tools Causing Productivity Loss",
      oneLineSummary: "Teams waste hours daily switching between multiple disconnected tools for project management, communication, and documentation",
      problem: {
        description: "Knowledge workers spend 30% of their day context-switching between 8+ different applications (Slack, Jira, Notion, Email, Calendar, etc.) to complete their work. This fragmentation leads to lost information, duplicated efforts, and cognitive overload that reduces overall productivity and job satisfaction",
        affectedUsers: "Primary: Product managers, designers, and engineers who collaborate cross-functionally. Secondary: Team leads and executives who need visibility across projects. Tertiary: Remote workers who rely heavily on digital tools for all collaboration",
        painPoints: "Constant app switching disrupts flow state, information gets lost between tools, status updates require manual compilation from multiple sources, notifications scattered across platforms create anxiety, difficult to find information when needed, no single source of truth for project status"
      },
      context: {
        rootCauses: "Rapid adoption of point solutions for specific needs, lack of integration strategy, teams choosing their own tools without centralized governance, legacy systems that don't communicate with modern SaaS tools",
        whenItOccurs: "Throughout the workday during task execution, project planning, status reporting, and cross-functional collaboration. Most severe during high-pressure deadlines when efficiency is most critical",
        howItManifests: "Users check 5+ apps each morning, spend 15+ minutes finding project status, duplicate data entry across systems, miss important updates buried in notification noise, delay responses while searching for context across tools",
        currentWorkarounds: "Manual status compilation in spreadsheets, screenshots shared in Slack, bookmarking multiple tool dashboards, keeping notes in personal documents, scheduling daily sync meetings to align",
        existingSolutionFailures: "All-in-one platforms lack depth in specific areas, integrations are shallow and break frequently, custom integrations require engineering resources, switching to one vendor creates lock-in concerns"
      },
      scope: {
        inScope: "Unified workspace aggregating project data from existing tools, smart notifications across platforms, automated status reporting, centralized search across tools, workflow automation between applications",
        outOfScope: "Replacing existing specialized tools entirely, building new project management system from scratch, real-time collaborative editing, video conferencing features",
        boundaries: "Must integrate with top 20 commonly used SaaS tools, maintain data security with read-only or API access where possible, support existing workflows without requiring process changes, 4-month MVP timeline"
      },
      measurability: {
        currentMetric: "Average 8 tools checked per hour, 2.5 hours daily on status reporting and information gathering, 35% of time spent on administrative overhead, 40% increase in time-to-information over past 2 years",
        targetMetric: "Reduce tool switching by 60%, decrease status reporting time to under 30 minutes daily, cut administrative overhead to under 20%, improve information findability to under 2 minutes",
        timeframe: "4 months to MVP launch, 6 months to achieve 50% of target metrics, 12 months to full target achievement",
        successCriteria: "User satisfaction score >4.5/5, 60% reduction in tool switching, adoption rate >70% within target teams, time savings of 1.5+ hours per user per day, ROI positive within 8 months"
      },
      impact: {
        businessImpact: "$2M annual productivity savings for 100-person team, 30% faster project completion through reduced friction, improved employee retention through better work experience, reduced burnout and context-switching fatigue",
        userImpact: "Reclaimed 1.5+ hours daily for meaningful work, reduced cognitive load and decision fatigue, improved work-life balance with fewer after-hours catch-up sessions, greater sense of control and clarity over workload",
        consequences: "Continued productivity decline as tool sprawl increases, rising employee frustration and burnout, longer project timelines reducing competitive agility, increased context-switching errors and oversights, talent attrition to companies with better tooling",
        benefits: "Significant productivity gains enabling faster delivery, improved employee satisfaction and retention, better cross-functional collaboration, data-driven insights from unified analytics, scalable foundation for growth without proportional overhead increase"
      },
      validation: {
        supportingData: "Time tracking studies show 30% of day on tool management, analytics reveal users switch apps 8+ times per hour, IT spend analysis shows 40% growth in SaaS subscriptions annually, productivity surveys rank tool fragmentation as top issue",
        userResearch: "20 diary studies tracked daily tool usage patterns, interviews with 25 knowledge workers revealed pain points, observation sessions showed 15 minutes average to compile status updates, survey of 500 employees rated tool switching as #1 productivity blocker",
        marketEvidence: "Average enterprise uses 100+ SaaS applications, integration platform market growing 25% YoY, Gartner identifies tool consolidation as top CIO priority for 2024, competitors investing heavily in workspace unification",
        stakeholderInput: "Employee NPS surveys highlight tooling frustrations, Department heads requesting budget for integration solutions, IT Security concerned with data sprawl across tools, CFO seeking cost optimization through consolidation, CEO prioritizing productivity initiatives"
      },
      conciseFormat: {
        targetUser: "For knowledge workers and cross-functional teams",
        whoStatement: "Who are overwhelmed by managing information across 8+ disconnected productivity tools",
        theProblem: "The fragmentation of project data, communications, and documentation across multiple applications",
        isAProblem: "Is a critical productivity drain that consumes 30% of the workday in context-switching and information hunting",
        thatCauses: "That leads to reduced output quality, employee burnout, slower project delivery, and significant hidden costs in administrative overhead",
        unlikeCurrent: "Unlike current attempts to standardize on single platforms that sacrifice functionality or complex DIY integrations that break frequently",
        ourSolution: "Our solution is an intelligent workspace layer that unifies existing tools, automates information flow, and surfaces what matters when it matters without replacing your current stack"
      },
      nextSteps: [
        "Audit current tool stack across all teams and identify integration points",
        "Survey 100+ users to validate specific pain points and prioritize features",
        "Prototype unified dashboard with 3 key integrations for user testing",
        "Develop security and data governance framework for cross-tool access",
        "Create business case with projected ROI for leadership approval"
      ]
    },
    general: {
      problemTitle: "Inefficient Process Creating User Friction",
      oneLineSummary: "Current process creates unnecessary friction for users, resulting in decreased satisfaction and engagement",
      problem: {
        description: "The existing workflow requires users to navigate multiple disconnected steps, leading to confusion, errors, and abandonment. Users report frustration with the complexity and time required to complete basic tasks",
        affectedUsers: "Primary: End users attempting to complete core workflows. Secondary: Support staff handling user issues. Tertiary: Business stakeholders tracking completion metrics",
        painPoints: "Too many steps to complete basic tasks, confusing navigation, lack of clear progress indicators, error-prone manual steps, no way to save and resume, limited help or guidance available"
      },
      context: {
        rootCauses: "Legacy system designed for different user needs, lack of user-centered design process, accumulated technical debt creating workarounds, no unified vision across teams building different parts",
        whenItOccurs: "Every time users attempt to complete the core workflow, particularly first-time users and those on mobile devices. Peak issues during high-traffic periods",
        howItManifests: "High abandonment rates at key steps, increased support tickets, user complaints in feedback surveys, negative reviews mentioning difficulty of use, lower than expected conversion rates",
        currentWorkarounds: "Users call support for guidance, abandon and try again later, seek help from colleagues, use alternative methods outside the system, or give up entirely",
        existingSolutionFailures: "Previous redesign focused on aesthetics not usability, training materials don't address core issues, help documentation is outdated, temporary fixes created new problems"
      },
      scope: {
        inScope: "Redesign of core user workflow, improved navigation and wayfinding, clear progress indicators and feedback, streamlined step reduction, contextual help and guidance, mobile optimization",
        outOfScope: "Backend system replacement, integration with external systems not directly involved in workflow, new features beyond core workflow, complete platform rebranding",
        boundaries: "Must work with existing data models, maintain current security requirements, support existing user base without disruption, 6-month implementation timeline, limited to frontend UX improvements"
      },
      measurability: {
        currentMetric: "60% completion rate, 4.5 minute average time to complete, 25% error rate requiring restart, 3.2/5 user satisfaction score",
        targetMetric: "85% completion rate, under 2 minutes average time, under 5% error rate, 4.5/5 satisfaction score",
        timeframe: "3 months for redesign and testing, 1 month phased rollout, 2 months to achieve target metrics post-launch",
        successCriteria: "Completion rate >85%, time-to-complete <2 minutes, error rate <5%, user satisfaction >4.5/5, support tickets reduced by 40%"
      },
      impact: {
        businessImpact: "25% increase in successful completions translating to revenue growth, 40% reduction in support costs, improved brand reputation through better user experience, competitive advantage in user satisfaction",
        userImpact: "Faster, more confident task completion, reduced frustration and anxiety, ability to complete tasks independently without support, better overall product perception",
        consequences: "Continued user churn to competitors, increasing support costs, negative word-of-mouth damaging brand, missed revenue opportunities from abandoned sessions, technical debt accumulation making future fixes harder",
        benefits: "Increased revenue through higher completion rates, reduced operational costs, improved customer loyalty and lifetime value, positive reviews and referrals, foundation for future UX improvements"
      },
      validation: {
        supportingData: "Analytics show 40% drop-off at step 3 of workflow, heatmaps reveal users clicking in wrong places, A/B test of simplified flow increased completion by 20%, support ticket analysis identifies this as top issue",
        userResearch: "10 user interviews revealed confusion about next steps, usability tests showed 8-minute average completion time vs 2-minute expectation, survey of 150 users rated workflow difficulty as primary pain point, customer success team reports daily complaints",
        marketEvidence: "Industry benchmarks show 85%+ completion rates for similar workflows, competitors have streamlined their processes in past year, UX research shows each extra step reduces completion by 10%, Forrester research quantifies ROI of UX improvements",
        stakeholderInput: "Customer Success identifies workflow as #1 complaint, Sales reports lost deals due to poor UX, Engineering ready to modernize frontend, Product team has workflow redesign as Q2 priority, CEO mentioned UX improvement in recent all-hands"
      },
      conciseFormat: {
        targetUser: "For users attempting to complete core tasks",
        whoStatement: "Who need a simple, fast, and reliable way to accomplish their goals",
        theProblem: "The complex, confusing, and error-prone workflow with too many steps and unclear guidance",
        isAProblem: "Is a critical barrier to user success that causes 40% abandonment and generates constant complaints",
        thatCauses: "That results in lost revenue, increased support burden, frustrated users, and competitive disadvantage",
        unlikeCurrent: "Unlike our current legacy workflow and competitors that have already modernized their experiences",
        ourSolution: "Our solution is a streamlined, user-centered redesign that reduces steps by 50%, provides clear guidance at every point, and works seamlessly across all devices"
      },
      nextSteps: [
        "Conduct comprehensive user journey mapping with stakeholders",
        "Perform heuristic evaluation of current workflow against UX best practices",
        "Create low-fidelity prototypes of streamlined workflow for user testing",
        "Develop detailed UX requirements and technical implementation plan",
        "Build business case with projected ROI and secure executive approval"
      ]
    }
  };

  return themes[theme] || themes.general;
}

// Real LLM streaming response
async function* llmStreamResponse(problemStatement: string): AsyncGenerator<string> {
  const messages = [
    { role: "system", content: REFRAME_SYSTEM_PROMPT },
    { role: "user", content: `Reframe this problem statement into a structured format:\n\n${problemStatement}` }
  ];

  const stream = await routeLLMRequest(1, messages, {
    temperature: 0.7,
    maxTokens: 2048,
    stream: true
  });

  yield* streamLLMResponse(1, stream);
}

export async function POST(req: NextRequest) {
  try {
    const { projectId, problemStatement } = await req.json();

    if (!problemStatement) {
      return new Response(
        JSON.stringify({ error: "Problem statement is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Create SSE stream
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Send start event
          controller.enqueue(
            new TextEncoder().encode(
              `data: ${JSON.stringify({ event: "step_start", stepNumber: 1, stepName: "reframe_problem" })}\n\n`
            )
          );

          let fullContent = "";

          // Stream real LLM response
          for await (const chunk of llmStreamResponse(problemStatement)) {
            fullContent += chunk;
            controller.enqueue(
              new TextEncoder().encode(
                `data: ${JSON.stringify({ event: "stream", content: chunk })}\n\n`
              )
            );
          }

          // Parse the final JSON output
          let output;
          try {
            // Try to extract JSON from the response
            const jsonMatch = fullContent.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              output = JSON.parse(jsonMatch[0]);
            } else {
              throw new Error("No JSON found in response");
            }
          } catch {
            // Fallback: wrap the text response
            output = {
              problemTitle: "Reframed Problem",
              oneLineSummary: problemStatement.substring(0, 100),
              problem: {
                description: problemStatement,
                affectedUsers: "To be determined",
                painPoints: "To be determined"
              },
              context: {
                rootCauses: "Analysis in progress",
                whenItOccurs: "To be determined",
                howItManifests: "To be determined",
                currentWorkarounds: "To be determined",
                existingSolutionFailures: "To be determined"
              },
              scope: { inScope: "", outOfScope: "", boundaries: "" },
              measurability: { currentMetric: "", targetMetric: "", timeframe: "", successCriteria: "" },
              impact: { businessImpact: "", userImpact: "", consequences: "", benefits: "" },
              validation: { supportingData: "", userResearch: "", marketEvidence: "", stakeholderInput: "" },
              conciseFormat: {
                targetUser: "",
                whoStatement: "",
                theProblem: "",
                isAProblem: "",
                thatCauses: "",
                unlikeCurrent: "",
                ourSolution: ""
              },
              nextSteps: ["Review the generated content"],
              _rawResponse: fullContent
            };
          }

          // Send complete event
          controller.enqueue(
            new TextEncoder().encode(
              `data: ${JSON.stringify({ 
                event: "step_complete", 
                stepNumber: 1, 
                output 
              })}\n\n`
            )
          );

          controller.enqueue(
            new TextEncoder().encode(
              `data: ${JSON.stringify({ 
                event: "pipeline_complete", 
                projectId, 
                completedSteps: 1 
              })}\n\n`
            )
          );

          controller.close();
        } catch (error) {
          controller.enqueue(
            new TextEncoder().encode(
              `data: ${JSON.stringify({ 
                event: "error", 
                message: error instanceof Error ? error.message : "Unknown error" 
              })}\n\n`
            )
          );
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        error: "Failed to process reframe request",
        details: error instanceof Error ? error.message : "Unknown error"
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
