// Market & Competitive Analysis types (Step 5)

export interface SWOT {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface Competitor {
  id?: string;
  projectId?: string;
  name: string;
  website: string;
  description: string;
  marketShare: string;
  pricing: string;
  strengths: string[];
  weaknesses: string[];
  features: string[];
  swot: SWOT;
  sourceUrl?: string;
}

export interface MarketOverview {
  marketSize: string;
  growthRate: string;
  trends: string[];
  opportunities: string[];
}

// Step 5 output
export interface MarketAnalysisOutput {
  marketOverview: MarketOverview;
  competitors: Competitor[];
  competitiveAdvantage: string;
  positioningStrategy: string;
  sources: Array<{ title: string; url: string }>;
}

export interface SearchQuery {
  query: string;
  results: Array<{
    title: string;
    url: string;
    snippet: string;
  }>;
}
