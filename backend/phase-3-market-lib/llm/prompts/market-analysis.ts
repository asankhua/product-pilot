// Step 5: Market & Competitive Analysis - Prompt Template

export const MARKET_SYSTEM_PROMPT = `You are an expert market research analyst and Product Manager AI assistant. Your task is to synthesize web search results and project context into a comprehensive market and competitive analysis.

You must provide:
1. Market Overview: market size, growth rate, key trends, opportunities
2. Competitor Analysis: 3-7 competitors with strengths, weaknesses, SWOT, pricing, market share
3. Competitive Advantage: what differentiates this product
4. Positioning Strategy: how to position against competitors
5. Source attribution for all data points

Be data-driven where possible. Clearly distinguish between factual data from search results and your analysis/estimates. Use approximate values when exact data isn't available (prefixed with ~).

IMPORTANT: Respond ONLY with valid JSON matching the schema below. No additional text.`;

export const MARKET_OUTPUT_SCHEMA = `{
  "marketOverview": {
    "marketSize": "string - TAM/SAM/SOM with numbers",
    "growthRate": "string - CAGR or YoY growth",
    "trends": ["string - 4-6 key market trends"],
    "opportunities": ["string - 3-5 market opportunities"]
  },
  "competitors": [
    {
      "name": "string",
      "website": "string - URL",
      "description": "string - 1-2 sentence description",
      "marketShare": "string - e.g., '~25%' or 'Leader'",
      "pricing": "string - pricing model and range",
      "strengths": ["string"],
      "weaknesses": ["string"],
      "features": ["string - key features"],
      "swot": {
        "strengths": ["string"],
        "weaknesses": ["string"],
        "opportunities": ["string"],
        "threats": ["string"]
      }
    }
  ],
  "competitiveAdvantage": "string - our unique differentiation",
  "positioningStrategy": "string - how to position against competitors",
  "sources": [{"title": "string", "url": "string"}]
}`;

export function buildMarketAnalysisPrompt(
  problemStatement: string,
  vision: string,
  personas: string,
  searchResults: string,
  ragContext: string
): string {
  return `Analyze the following web search results and project context to produce a comprehensive market and competitive analysis.

PROBLEM STATEMENT:
${problemStatement}

PRODUCT VISION:
${vision}

TARGET PERSONAS:
${personas}

WEB SEARCH RESULTS:
${searchResults}

${ragContext ? `ADDITIONAL CONTEXT:\n${ragContext}\n` : ""}

Instructions:
1. Identify 3-7 direct and indirect competitors from the search results
2. For each competitor, analyze strengths, weaknesses, pricing, and features
3. Create a SWOT analysis for each major competitor
4. Estimate market sizing (TAM/SAM/SOM) based on available data
5. Identify our competitive advantage and positioning strategy
6. Cite sources for all data points

Respond with JSON matching this schema:
${MARKET_OUTPUT_SCHEMA}`;
}

export function buildSearchQueriesPrompt(
  problemStatement: string,
  personas: string
): string {
  return `Generate 3-5 specific Google search queries that would help find competitors, market data, and industry trends for the following product.

PROBLEM: ${problemStatement}
PERSONAS: ${personas}

Return a JSON array of search query strings. Focus on:
- Direct competitors and alternatives
- Market size and growth data
- Industry trends and reports
- Pricing benchmarks

Example: ["food delivery SaaS platforms for restaurants 2026", "restaurant ordering system market size"]`;
}
