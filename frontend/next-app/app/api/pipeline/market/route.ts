// Step 5: Market & Competitive Analysis API
// SSE streaming endpoint following ChatPRD Competitive Analysis Template - Using real LLM + Serper for competitor research
import { NextRequest } from "next/server";
import { routeLLMRequest, streamLLMResponse } from "@/lib/llm/llm-client";
import { searchCompetitors, getMarketSize } from "@/lib/serper/client";

const MARKET_SYSTEM_PROMPT = `You are an expert Product Manager and Market Research AI assistant. Generate comprehensive market and competitive analysis based on the project context.

Include:
1. Market Overview: industry size, growth rate, key trends, market maturity
2. Competitors: 3-5 detailed competitor profiles with company background, SWOT analysis, and market positioning
3. Competitive Landscape: market leaders, emerging players, niche competitors
4. Our Positioning: competitive advantage, market gap, differentiation strategy

Respond with valid JSON matching the ChatPRD Competitive Analysis template structure.`;

// Interface for Competitor following the template structure
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

function generateMarketAnalysis(projectContext: any): MarketAnalysisOutput {
  const personas = projectContext?.personas || [];
  const problemTitle = projectContext?.problemTitle || "Market";
  const persona1 = personas[0]?.overview?.name || "Primary User";
  const persona2 = personas[1]?.overview?.name || "Secondary User";

  return {
    marketOverview: {
      industrySize: "$50+ billion global market with 15% YoY growth in the target segment",
      growthRate: "Expected to reach $75 billion by 2028, driven by digital transformation",
      keyTrends: [
        "Shift toward direct-to-consumer models reducing aggregator dependency",
        "Rise of mobile-first solutions for non-tech-savvy users",
        "Increasing demand for transparent pricing and lower commissions",
        "Growing preference for localized and vernacular solutions",
        "Integration of AI-powered marketing tools for small businesses"
      ],
      marketMaturity: "Growth phase with significant disruption opportunity from new entrants offering zero-commission models"
    },
    competitors: [
      {
        name: "Competitor A - Market Leader",
        companyBackground: {
          companyOverview: "Established player with 10+ years in market. Publicly traded with strong brand recognition. 50,000+ customers globally.",
          productServiceOverview: "Comprehensive platform with extensive features. High commission rates (25-30%). Focus on enterprise customers.",
          leadershipStructure: "Experienced executive team with tech background. Recent CTO hire from major tech company.",
          financialHealth: "Profitable with $2B+ annual revenue. Strong cash position for acquisitions and expansion.",
          recentDevelopments: "Launched AI features in Q3 2024. Acquired smaller competitor for $500M. Expanding into tier-2 cities."
        },
        competitorAnalysis: {
          swotAnalysis: {
            strengths: [
              "Strong brand recognition and market presence",
              "Extensive feature set and integrations",
              "Large existing customer base",
              "Robust infrastructure and scalability"
            ],
            weaknesses: [
              "High commission rates alienating small businesses",
              "Complex pricing structure",
              "Slow to adapt to tier-2/3 markets",
              "Limited support for vernacular languages"
            ],
            opportunities: [
              "Expand into emerging markets",
              "Develop SMB-focused offerings",
              "Partner with local service providers"
            ],
            threats: [
              "New entrants with lower pricing",
              "Regulatory scrutiny on commission rates",
              "Changing customer preferences toward direct models"
            ]
          },
          productComparison: "Feature-rich but expensive. Better for large enterprises. Our solution targets underserved SMB segment.",
          customerReviews: "Mixed reviews - praised for features but criticized for high costs and poor SMB support.",
          innovationTechnology: "Strong R&D investment in AI/ML. Limited innovation in pricing models or SMB tools.",
          marketShareGrowth: "45% market share but growth slowing. Losing ground to challengers in SMB segment."
        },
        marketPositioning: {
          marketPerception: "Premium brand for large enterprises. Seen as expensive and complex for small businesses.",
          marketingPricingStrategy: "High-touch sales with enterprise pricing. Volume discounts for large customers.",
          customerAcquisition: "Heavy sales team focus. Digital marketing for self-serve. Partner channel for distribution.",
          geographicDemographic: "Strong in tier-1 cities and metros. Weak penetration in tier-2/3 markets.",
          brandPartnerships: "Strategic partnerships with major payment providers. Co-marketing with enterprise software vendors."
        }
      },
      {
        name: "Competitor B - Emerging Challenger",
        companyBackground: {
          companyOverview: "VC-funded startup founded 3 years ago. 5,000+ customers. Rapid growth phase with Series B funding.",
          productServiceOverview: "Simplified offering focused on core use cases. Lower pricing (15-20% commission). Mobile-first approach.",
          leadershipStructure: "Young founding team from tech unicorns. Aggressive growth mindset.",
          financialHealth: "Burning cash for growth. $50M raised. 2+ years runway at current burn rate.",
          recentDevelopments: "Raised Series B at $300M valuation. Expanded to 3 new cities. Launched freemium tier."
        },
        competitorAnalysis: {
          swotAnalysis: {
            strengths: [
              "Lower pricing than established players",
              "Modern, user-friendly interface",
              "Fast feature development cycles",
              "Strong social media presence"
            ],
            weaknesses: [
              "Limited brand recognition",
              "Smaller feature set compared to leaders",
              "Resource constraints for support",
              "Unproven long-term viability"
            ],
            opportunities: [
              "Capture price-sensitive SMB segment",
              "Expand geographic footprint",
              "Build ecosystem of integrations"
            ],
            threats: [
              "Cash burn rate sustainability",
              "Response from established players",
              "Market consolidation through M&A"
            ]
          },
          productComparison: "Simpler and cheaper but fewer features. Good for small businesses starting out.",
          customerReviews: "Positive for ease of use and pricing. Negative for limited features and occasional downtime.",
          innovationTechnology: "Modern tech stack. Fast iterations. Limited AI capabilities compared to larger players.",
          marketShareGrowth: "8% market share growing rapidly. Capturing price-sensitive segment."
        },
        marketPositioning: {
          marketPerception: "Affordable alternative for startups. Not yet seen as enterprise-ready.",
          marketingPricingStrategy: "Transparent, flat-rate pricing. Freemium model for acquisition.",
          customerAcquisition: "Digital-first marketing. Influencer partnerships. Referral programs.",
          geographicDemographic: "Strong in tech hubs and startup ecosystems. Limited presence in traditional markets.",
          brandPartnerships: "Integration partnerships with popular tools. Limited brand sponsorships."
        }
      },
      {
        name: "Competitor C - Niche Player",
        companyBackground: {
          companyOverview: "Bootstrapped company focused on specific vertical. 1,000+ loyal customers. Profitable from year 2.",
          productServiceOverview: "Specialized solution for specific industry segment. Custom features for niche needs.",
          leadershipStructure: "Founder-led with industry expertise. Small but experienced team.",
          financialHealth: "Profitable and sustainable. No outside funding. Conservative growth approach.",
          recentDevelopments: "Added new vertical. Improved mobile app. Expanded support hours."
        },
        competitorAnalysis: {
          swotAnalysis: {
            strengths: [
              "Deep domain expertise",
              "Loyal customer base in niche",
              "Profitable business model",
              "Personalized customer service"
            ],
            weaknesses: [
              "Limited to specific vertical",
              "Slow growth outside core market",
              "Limited resources for expansion",
              "Aging technology stack"
            ],
            opportunities: [
              "Expand to adjacent verticals",
              "Develop partner ecosystem",
              "White-label solution for larger players"
            ],
            threats: [
              "Generalist platforms adding niche features",
              "Talent acquisition challenges",
              "Technology obsolescence"
            ]
          },
          productComparison: "Best for specific use case but not generalizable. Deep features for target segment.",
          customerReviews: "Excellent reviews within niche. Praised for support and understanding of industry needs.",
          innovationTechnology: "Conservative approach. Stable but not cutting-edge. Focus on reliability.",
          marketShareGrowth: "2% overall market share but 30% share in target vertical. Stable, slow growth."
        },
        marketPositioning: {
          marketPerception: "Trusted expert in specific domain. Not considered for general use cases.",
          marketingPricingStrategy: "Premium pricing justified by specialization. No discounts.",
          customerAcquisition: "Word-of-mouth and industry events. Referrals from satisfied customers.",
          geographicDemographic: "Concentrated in specific geographic regions matching their vertical.",
          brandPartnerships: "Industry association partnerships. Speaking engagements and thought leadership."
        }
      }
    ],
    competitiveLandscape: {
      marketLeaders: ["Competitor A - Market Leader"],
      emergingPlayers: ["Competitor B - Emerging Challenger"],
      nicheCompetitors: ["Competitor C - Niche Player"]
    },
    ourPositioning: {
      competitiveAdvantage: "Zero-commission model with AI-powered marketing tools specifically designed for non-tech-savvy users in underserved markets",
      marketGap: "SMBs in tier-2/3 cities need affordable, simple solutions that existing platforms ignore due to lower revenue per customer",
      differentiationStrategy: "Focus on ease of use, transparent pricing, and vernacular support while competitors focus on feature richness or low prices alone"
    }
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { projectId, problemTitle, problem, vision, personas, questions } = body;

    console.log("Market Analysis API called:", { projectId, problemTitle, vision, personasCount: personas?.length });

    const projectContext = {
      projectId,
      problemTitle,
      problemDescription: problem?.description,
      vision,
      personas,
      questions
    };

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Send step start event
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ event: "step_start", stepNumber: 5, stepName: "market_analysis" })}\n\n`
            )
          );

          // Fetch real-time competitor data from Serper
          let serperData = null;
          try {
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ event: "stream", content: "\\n🔍 Researching competitors via Google Search...\\n" })}
\n`
              )
            );
            
            const industry = problem?.industry || problem?.description?.substring(0, 100) || "technology";
            serperData = await searchCompetitors(problemTitle || "Product", industry);
            
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ event: "stream", content: `\\n✅ Found ${serperData.directCompetitors.length} competitors and ${serperData.marketInsights.recentNews.length} recent news items\\n` })}
\n`
              )
            );
          } catch (error) {
            console.error("Serper API error (non-critical):", error);
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ event: "stream", content: "\\n⚠️ Could not fetch real-time data, using LLM knowledge only\\n" })}
\n`
              )
            );
          }

          // Generate market analysis using LLM with Serper data
          const messages = [
            { role: "system", content: MARKET_SYSTEM_PROMPT },
            { 
              role: "user", 
              content: `Generate market and competitive analysis based on this project context and real-time research data:\n\nProject Context:\n${JSON.stringify(projectContext, null, 2)}\n\n${serperData ? `Real-Time Competitor Research (via Google Search):\\n${JSON.stringify(serperData, null, 2)}` : ""}` 
            }
          ];

          const response = await routeLLMRequest(5, messages, {
            temperature: 0.7,
            maxTokens: 4096,
            stream: true
          });

          let fullContent = "";

          // Stream LLM response
          for await (const chunk of streamLLMResponse(5, response)) {
            fullContent += chunk;
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ event: "stream", content: chunk })}\n\n`
              )
            );
          }

          // Parse output
          let marketData;
          try {
            const jsonMatch = fullContent.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              marketData = JSON.parse(jsonMatch[0]);
            } else {
              throw new Error("No JSON found");
            }
          } catch {
            marketData = { marketOverview: {}, competitors: [], _rawResponse: fullContent };
          }

          // Send step complete event
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ event: "step_complete", stepNumber: 5, output: marketData })}\n\n`
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
    console.error("Market Analysis API error:", error);
    return Response.json({ error: "Failed to generate market analysis" }, { status: 500 });
  }
}
