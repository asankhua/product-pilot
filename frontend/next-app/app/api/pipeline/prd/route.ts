// Step 6: Generate PRD API
// SSE streaming endpoint following ChatPRD Template - Using real LLM
import { NextRequest } from "next/server";
import { routeLLMRequest, streamLLMResponse } from "@/lib/llm/llm-client";

const PRD_SYSTEM_PROMPT = `You are an expert Product Manager AI assistant. Generate a comprehensive Product Requirements Document (PRD).

RESPONSE FORMAT - Valid JSON with this exact structure:
{
  "metadata": {
    "productName": "Product Name",
    "authorName": "Author",
    "date": "2024-01-15",
    "status": "Draft",
    "version": "1.0"
  },
  "background": {
    "problemStatement": ["Problem 1", "Problem 2", "Problem 3"],
    "marketOpportunity": ["Opportunity 1", "Opportunity 2"],
    "userPersonas": {
      "persona1": { "name": "Name", "characteristics": "...", "needs": "...", "challenges": "..." },
      "persona2": { "name": "Name", "characteristics": "...", "needs": "...", "challenges": "..." }
    },
    "visionStatement": "Vision...",
    "productOrigin": "Origin story..."
  },
  "objectives": {
    "smartGoals": { "specific": "...", "measurable": "...", "achievable": "...", "relevant": "...", "timebound": "..." },
    "kpis": ["KPI 1", "KPI 2", "KPI 3"],
    "qualitativeObjectives": ["Objective 1", "Objective 2"],
    "strategicAlignment": "How it aligns...",
    "riskMitigation": { "risks": ["Risk 1"], "strategies": ["Strategy 1"], "contingencies": ["Plan 1"] }
  },
  "features": {
    "coreFeatures": {
      "feature1": { "name": "Feature", "description": "...", "benefit": "...", "specs": "..." },
      "feature2": { "name": "Feature", "description": "...", "benefit": "...", "specs": "..." },
      "feature3": { "name": "Feature", "description": "...", "benefit": "...", "specs": "..." }
    },
    "userBenefits": { "user1": { "target": "...", "benefit": "..." }, "user2": { "target": "...", "benefit": "..." } },
    "technicalSpecifications": "Technical details...",
    "prioritization": {
      "p0": { "feature": "Critical feature", "rationale": "Why P0" },
      "p1": { "feature": "High priority", "rationale": "Why P1" },
      "p2": { "feature": "Medium priority", "rationale": "Why P2" },
      "p3": { "feature": "Low priority", "rationale": "Why P3" }
    },
    "futureEnhancements": ["Enhancement 1", "Enhancement 2"]
  },
  "userExperience": {
    "uiDesign": { "principles": "...", "visualStyle": "...", "wireframes": "..." },
    "userJourney": { "onboarding": "...", "coreFlow": "...", "engagement": "..." },
    "usabilityTesting": ["Test 1", "Test 2"],
    "accessibility": "Requirements...",
    "feedbackLoops": "Feedback mechanism..."
  },
  "milestones": {
    "phases": [
      { "activity": "Phase 1", "duration": "2 weeks", "status": "Planned" },
      { "activity": "Phase 2", "duration": "3 weeks", "status": "Planned" }
    ],
    "criticalPath": "Critical activities...",
    "reviewPoints": ["Review 1", "Review 2"],
    "launchPlan": { "marketing": "...", "training": "...", "support": "..." },
    "postLaunchEvaluation": "Evaluation plan..."
  },
  "technicalRequirements": {
    "techStack": { "frontend": "...", "backend": "...", "database": "...", "cloud": "...", "cicd": "..." },
    "systemArchitecture": "Architecture description...",
    "security": ["Security 1", "Security 2"],
    "performance": { "responseTime": "< 2s", "uptime": "99.9%", "scalability": "..." },
    "integrations": ["Integration 1", "Integration 2"]
  },
  "successMetrics": {
    "primary": "Primary metric...",
    "secondary": "Secondary metrics...",
    "reportingCadence": "Weekly/Monthly"
  },
  "appendix": {
    "glossary": "Terms...",
    "references": "References...",
    "changeLog": { "date": "2024-01-15", "version": "1.0", "description": "Initial", "author": "Name" }
  }
}

INSTRUCTIONS:
- Generate realistic, detailed content for each section
- Include 2-3 items for each array field
- Prioritization must include P0, P1, P2, P3 with clear rationale
- Milestones should have 3-5 phases with realistic durations
- Tech stack should be specific technologies

// Template reference: /backend/template/chatprd-template/chatprd-template.ts`

// PRD Interface following ChatPRD Template Structure
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
      persona1: { name: string; characteristics: string; needs: string; challenges: string };
      persona2: { name: string; characteristics: string; needs: string; challenges: string };
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

function generatePRD(projectContext: any): PRDOutput {
  const problemTitle = projectContext?.problemTitle || "Product";
  const vision = projectContext?.vision || "Revolutionary product that transforms the industry";
  const personas = projectContext?.personas || [];
  const persona1 = personas[0]?.overview?.name || "Primary User";
  const persona2 = personas[1]?.overview?.name || "Secondary User";
  const persona1Role = personas[0]?.overview?.role || "User";
  const persona2Role = personas[1]?.overview?.role || "Stakeholder";

  const today = new Date().toISOString().split("T")[0];

  return {
    metadata: {
      productName: problemTitle,
      authorName: "Product Pilot AI",
      date: today,
      status: "Draft",
      version: "1.0.0"
    },
    background: {
      problemStatement: [
        `Users like ${persona1} struggle with inefficient workflows and lack of integrated tools`,
        `Current solutions are too complex and expensive for ${persona1Role}s in the target market`,
        `There is a significant gap between user needs and existing product offerings`,
        `Data silos prevent seamless collaboration across teams and stakeholders`
      ],
      marketOpportunity: [
        `Growing demand for user-friendly solutions targeting ${persona1}s and ${persona2}s`,
        `Untapped market in tier-2/3 cities with limited access to premium tools`,
        `Increasing adoption of AI-powered solutions creates differentiation opportunity`,
        `Regulatory changes favor transparent, low-commission business models`
      ],
      userPersonas: {
        persona1: {
          name: persona1,
          characteristics: `${persona1Role} with moderate technical skills, values efficiency and simplicity`,
          needs: `Streamlined workflow, affordable pricing, reliable support, mobile access`,
          challenges: `Complex existing tools, high costs, limited customization, poor UX`
        },
        persona2: {
          name: persona2,
          characteristics: `${persona2Role} focused on ROI and team productivity`,
          needs: `Analytics dashboard, team management, compliance features, integrations`,
          challenges: `Budget constraints, adoption resistance, integration complexity`
        }
      },
      visionStatement: vision,
      productOrigin: `This product was conceived to address the fundamental disconnect between what ${persona1}s need and what existing solutions provide. Through extensive user research and market analysis, we identified an opportunity to create a solution that prioritizes user experience, affordability, and transparency.`
    },
    objectives: {
      smartGoals: {
        specific: "Launch MVP with core features within 4 months targeting 1000 beta users",
        measurable: "Achieve 80% user satisfaction, 60% monthly retention, $50K MRR by month 6",
        achievable: "Leverage existing tech stack and team expertise with focused scope",
        relevant: "Aligns with company strategy to capture the underserved SMB market",
        timebound: "MVP launch in 4 months, product-market fit validation in 6 months"
      },
      kpis: [
        "Monthly Recurring Revenue (MRR) and Annual Recurring Revenue (ARR)",
        "Customer Acquisition Cost (CAC) and Customer Lifetime Value (LTV)",
        "Monthly Active Users (MAU) and Daily Active Users (DAU)",
        "User Satisfaction Score (CSAT) and Net Promoter Score (NPS)",
        "Feature adoption rates and user engagement metrics"
      ],
      qualitativeObjectives: [
        "Establish brand recognition as the user-friendly alternative in the market",
        "Build a loyal community of advocates and power users",
        "Create industry thought leadership through content and events",
        "Develop strategic partnerships with complementary tools and services"
      ],
      strategicAlignment: "This product supports the company's 3-year growth strategy by expanding into the underserved SMB segment, diversifying revenue streams, and building a foundation for future enterprise offerings.",
      riskMitigation: {
        risks: [
          "Competitor response with similar low-cost offering",
          "User adoption slower than projected",
          "Technical scalability challenges with rapid growth",
          "Regulatory changes affecting pricing model"
        ],
        strategies: [
          "Focus on unique value proposition and superior UX",
          "Invest in onboarding and customer success programs",
          "Build scalable architecture from day one",
          "Maintain compliance and legal review processes"
        ],
        contingencies: [
          "Pivot to adjacent market segments if needed",
          "Adjust pricing and packaging based on feedback",
          "Secure additional funding for scaling infrastructure",
          "Develop enterprise tier for revenue diversification"
        ]
      }
    },
    features: {
      coreFeatures: {
        feature1: {
          name: "Zero-Commission Platform",
          description: "Direct connection platform that eliminates intermediary fees and commissions",
          benefit: `Saves ${persona1}s 25-30% in fees while maintaining service quality`,
          specs: "Built-in payment processing, escrow service, dispute resolution"
        },
        feature2: {
          name: "AI-Powered Marketing Assistant",
          description: "Automated marketing tools that generate content, optimize campaigns, and track performance",
          benefit: `Enables ${persona1}s to run professional marketing without expertise`,
          specs: "GPT-powered content generation, campaign templates, analytics dashboard"
        },
        feature3: {
          name: "Mobile-First Experience",
          description: "Fully responsive mobile app with offline capabilities and push notifications",
          benefit: `Allows ${persona1}s to manage their business on the go`,
          specs: "React Native app, offline sync, real-time notifications"
        }
      },
      userBenefits: {
        user1: {
          target: persona1,
          benefit: "Reduces operational costs by 30% and saves 10+ hours per week through automation"
        },
        user2: {
          target: persona2,
          benefit: "Provides visibility into team performance and ROI with actionable insights"
        }
      },
      technicalSpecifications: "Modern tech stack with React frontend, Node.js backend, PostgreSQL database, AWS cloud infrastructure. RESTful APIs with GraphQL support. Microservices architecture for scalability.",
      prioritization: {
        p0: {
          feature: "Core platform with zero-commission transactions",
          rationale: "Critical differentiator and core value proposition"
        },
        p1: {
          feature: "AI marketing assistant basic features",
          rationale: "Key competitive advantage for user acquisition"
        },
        p2: {
          feature: "Mobile app with offline support",
          rationale: "Important for user engagement and retention"
        },
        p3: {
          feature: "Advanced analytics and reporting",
          rationale: "Valuable but can be added post-launch"
        }
      },
      futureEnhancements: [
        "Advanced AI features including predictive analytics",
        "Integration marketplace with 50+ third-party tools",
        "Enterprise tier with advanced admin controls",
        "International expansion with localization",
        "API for developers to build custom integrations"
      ]
    },
    userExperience: {
      uiDesign: {
        principles: "Simplicity, consistency, accessibility, and mobile-first design",
        visualStyle: "Clean, modern interface with intuitive navigation and clear CTAs",
        wireframes: "Key screens: Dashboard, Profile, Transactions, Analytics, Settings"
      },
      userJourney: {
        onboarding: "5-minute guided setup with progressive disclosure and contextual tips",
        coreFlow: "Dashboard → Create/Edit → Preview → Publish → Track Performance",
        engagement: "Regular notifications, weekly reports, gamification elements, community features"
      },
      usabilityTesting: [
        "Conduct usability tests with 20+ target users before launch",
        "A/B test critical flows including onboarding and checkout",
        "Monitor user behavior analytics and heatmaps",
        "Collect feedback through in-app surveys and NPS"
      ],
      accessibility: "WCAG 2.1 AA compliance with screen reader support, keyboard navigation, color contrast, and text scaling options.",
      feedbackLoops: "In-app feedback widget, monthly user interviews, community forum, feature request voting system."
    },
    milestones: {
      phases: [
        { activity: "Design & Prototyping", duration: "Weeks 1-4", status: "Planned" },
        { activity: "Core Development", duration: "Weeks 5-12", status: "Planned" },
        { activity: "Testing & QA", duration: "Weeks 13-14", status: "Planned" },
        { activity: "Beta Launch", duration: "Week 15", status: "Planned" },
        { activity: "Public Launch", duration: "Week 16", status: "Planned" }
      ],
      criticalPath: "Payment processing integration → Core platform features → Security audit → Beta launch",
      reviewPoints: [
        "Week 4: Design review and user testing",
        "Week 8: Mid-development milestone check",
        "Week 12: Feature complete review",
        "Week 14: Go/no-go for beta launch"
      ],
      launchPlan: {
        marketing: "Product Hunt launch, social media campaign, influencer partnerships, PR outreach",
        training: "Customer success team training, help center documentation, video tutorials",
        support: "Expanded support team, live chat, community forum, knowledge base"
      },
      postLaunchEvaluation: "30-day, 60-day, and 90-day reviews to assess metrics, gather feedback, and plan iterations."
    },
    technicalRequirements: {
      techStack: {
        frontend: "React.js with TypeScript, Tailwind CSS, React Query",
        backend: "Node.js with Express, TypeScript, RESTful APIs",
        database: "PostgreSQL with Redis for caching",
        cloud: "AWS (EC2, RDS, S3, CloudFront)",
        cicd: "GitHub Actions, Docker, Kubernetes"
      },
      systemArchitecture: "Microservices architecture with API Gateway, separate services for auth, payments, notifications, and analytics. Event-driven with message queues.",
      security: [
        "End-to-end encryption for sensitive data",
        "SOC 2 Type II compliance",
        "GDPR and privacy compliance",
        "Regular security audits and penetration testing",
        "Multi-factor authentication (MFA)"
      ],
      performance: {
        responseTime: "< 200ms for API responses, < 2s for page loads",
        uptime: "99.9% availability SLA",
        scalability: "Support 10,000 concurrent users, auto-scaling enabled"
      },
      integrations: [
        "Stripe for payment processing",
        "SendGrid for email notifications",
        "Twilio for SMS alerts",
        "AWS S3 for file storage",
        "Google Analytics for tracking"
      ]
    },
    successMetrics: {
      primary: "Monthly Recurring Revenue (MRR) growth and Customer Acquisition Cost (CAC) efficiency",
      secondary: "User engagement metrics, feature adoption rates, customer satisfaction scores",
      reportingCadence: "Weekly team reviews, monthly executive reports, quarterly board presentations"
    },
    appendix: {
      glossary: "Key terms: MAU (Monthly Active Users), CAC (Customer Acquisition Cost), LTV (Lifetime Value), MRR (Monthly Recurring Revenue), NPS (Net Promoter Score)",
      references: "Industry reports, competitor analysis, user research studies, technical documentation",
      changeLog: {
        date: today,
        version: "1.0.0",
        description: "Initial PRD draft created based on market analysis and user research",
        author: "Product Pilot AI"
      }
    }
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { projectId, problemTitle, problem, vision, personas, questions, marketAnalysis } = body;

    console.log("PRD API called:", { projectId, problemTitle, vision, personasCount: personas?.length });

    const projectContext = {
      projectId,
      problemTitle,
      problemDescription: problem?.description,
      vision,
      personas,
      questions,
      marketAnalysis
    };

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Send step start event
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ event: "step_start", stepNumber: 6, stepName: "generate_prd" })}\n\n`
            )
          );

          // Generate PRD using LLM
          const messages = [
            { role: "system", content: PRD_SYSTEM_PROMPT },
            { role: "user", content: `Generate a comprehensive PRD based on this project context:\n\n${JSON.stringify(projectContext, null, 2)}` }
          ];

          const response = await routeLLMRequest(6, messages, {
            temperature: 0.7,
            maxTokens: 8192,
            stream: true
          });

          let fullContent = "";

          // Stream LLM response
          for await (const chunk of streamLLMResponse(6, response)) {
            fullContent += chunk;
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ event: "stream", content: chunk })}\n\n`
              )
            );
          }

          // Parse output
          let prdData;
          try {
            const jsonMatch = fullContent.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              prdData = JSON.parse(jsonMatch[0]);
            } else {
              throw new Error("No JSON found");
            }
          } catch {
            prdData = { metadata: {}, _rawResponse: fullContent };
          }

          // Send step complete event
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ event: "step_complete", stepNumber: 6, output: prdData })}\n\n`
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
    console.error("PRD API error:", error);
    return Response.json({ error: "Failed to generate PRD" }, { status: 500 });
  }
}
