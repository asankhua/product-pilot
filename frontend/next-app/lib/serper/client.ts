// Serper API Client - Google Search for Market Intelligence
// Provides real-time competitive research data

const SERPER_API_BASE = 'https://google.serper.dev';

export interface SerperSearchResult {
  searchParameters: {
    q: string;
    type: string;
    engine: string;
  };
  organic?: Array<{
    title: string;
    link: string;
    snippet: string;
    position: number;
    sitelinks?: Array<{ title: string; link: string }>;
  }>;
  knowledgeGraph?: {
    title: string;
    type?: string;
    description?: string;
    website?: string;
    founded?: string;
    headquarters?: string;
    ceo?: string;
    revenue?: string;
    employees?: string;
  };
  relatedSearches?: Array<{ query: string }>;
  news?: Array<{
    title: string;
    link: string;
    snippet: string;
    date: string;
    source: string;
  }>;
}

// Perform Google Search via Serper
export async function search(query: string, options: {
  type?: 'search' | 'news' | 'images' | 'places';
  num?: number;
  page?: number;
  tbs?: string; // Time-based search (e.g., "qdr:h" for past hour, "qdr:d" for past day)
} = {}): Promise<SerperSearchResult> {
  const response = await fetch(`${SERPER_API_BASE}/${options.type || 'search'}`, {
    method: 'POST',
    headers: {
      'X-API-KEY': process.env.SERPER_API_KEY!,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      q: query,
      num: options.num || 10,
      page: options.page || 1,
      ...(options.tbs && { tbs: options.tbs })
    })
  });

  if (!response.ok) {
    throw new Error(`Serper API error: ${response.status} - ${await response.text()}`);
  }

  return response.json();
}

// Competitive Intelligence - Search for competitors
export async function searchCompetitors(productName: string, industry: string): Promise<{
  directCompetitors: Array<{
    name: string;
    website: string;
    description: string;
    founded?: string;
    headquarters?: string;
    revenue?: string;
    employees?: string;
    ceo?: string;
  }>;
  marketInsights: {
    industryTrends: string[];
    keyPlayers: string[];
    recentNews: Array<{
      title: string;
      source: string;
      date: string;
      snippet: string;
    }>;
  };
}> {
  // Search for direct competitors
  const competitorSearch = await search(`${productName} alternatives competitors ${industry}`, {
    num: 10
  });

  // Search for industry news (last 30 days)
  const newsSearch = await search(`${industry} market news ${productName}`, {
    type: 'news',
    num: 10,
    tbs: 'qdr:m' // Past month
  });

  // Search for market size/trends
  const marketSearch = await search(`${industry} market size growth trends 2024`, {
    num: 10
  });

  const directCompetitors: Array<{
    name: string;
    website: string;
    description: string;
    founded?: string;
    headquarters?: string;
    revenue?: string;
    employees?: string;
    ceo?: string;
  }> = [];

  // Extract competitor data from organic results
  if (competitorSearch.organic) {
    competitorSearch.organic.forEach((result, index) => {
      if (index < 8) { // Top 8 competitors
        const domain = new URL(result.link).hostname.replace('www.', '');
        const name = domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1);
        
        directCompetitors.push({
          name,
          website: result.link,
          description: result.snippet,
        });
      }
    });
  }

  // Extract knowledge graph data if available
  if (competitorSearch.knowledgeGraph) {
    const kg = competitorSearch.knowledgeGraph;
    if (kg.title && directCompetitors.length > 0) {
      directCompetitors[0] = {
        ...directCompetitors[0],
        founded: kg.founded,
        headquarters: kg.headquarters,
        revenue: kg.revenue,
        employees: kg.employees,
        ceo: kg.ceo
      };
    }
  }

  // Extract industry trends from related searches
  const industryTrends: string[] = [];
  if (marketSearch.relatedSearches) {
    marketSearch.relatedSearches.forEach((rs) => {
      if (rs.query.includes('trend') || rs.query.includes('market') || rs.query.includes('growth')) {
        industryTrends.push(rs.query);
      }
    });
  }

  // Extract news
  const recentNews: Array<{ title: string; source: string; date: string; snippet: string }> = [];
  if (newsSearch.news) {
    newsSearch.news.forEach((article) => {
      recentNews.push({
        title: article.title,
        source: article.source,
        date: article.date,
        snippet: article.snippet
      });
    });
  }

  return {
    directCompetitors,
    marketInsights: {
      industryTrends: industryTrends.slice(0, 5),
      keyPlayers: directCompetitors.slice(0, 5).map(c => c.name),
      recentNews: recentNews.slice(0, 5)
    }
  };
}

// Search for company details
export async function getCompanyDetails(companyName: string): Promise<{
  name: string;
  website?: string;
  description?: string;
  founded?: string;
  headquarters?: string;
  revenue?: string;
  employees?: string;
  ceo?: string;
  news?: Array<{ title: string; source: string; date: string; snippet: string }>;
}> {
  const searchResult = await search(companyName, { num: 5 });
  const newsResult = await search(companyName, { type: 'news', num: 5, tbs: 'qdr:m' });

  const result: {
    name: string;
    website?: string;
    description?: string;
    founded?: string;
    headquarters?: string;
    revenue?: string;
    employees?: string;
    ceo?: string;
    news?: Array<{ title: string; source: string; date: string; snippet: string }>;
  } = {
    name: companyName
  };

  if (searchResult.knowledgeGraph) {
    const kg = searchResult.knowledgeGraph;
    result.description = kg.description;
    result.website = kg.website;
    result.founded = kg.founded;
    result.headquarters = kg.headquarters;
    result.revenue = kg.revenue;
    result.employees = kg.employees;
    result.ceo = kg.ceo;
  }

  if (searchResult.organic && searchResult.organic[0]) {
    if (!result.website) result.website = searchResult.organic[0].link;
    if (!result.description) result.description = searchResult.organic[0].snippet;
  }

  if (newsResult.news) {
    result.news = newsResult.news.map(n => ({
      title: n.title,
      source: n.source,
      date: n.date,
      snippet: n.snippet
    }));
  }

  return result;
}

// Market size research
export async function getMarketSize(industry: string): Promise<{
  marketSize?: string;
  growthRate?: string;
  sources: string[];
  insights: string[];
}> {
  const searchResult = await search(`${industry} market size growth rate TAM SAM SOM 2024`, {
    num: 10
  });

  const insights: string[] = [];
  const sources: string[] = [];

  if (searchResult.organic) {
    searchResult.organic.forEach((result) => {
      sources.push(result.link);
      if (result.snippet.includes('$') || result.snippet.includes('billion') || result.snippet.includes('trillion')) {
        insights.push(result.snippet);
      }
    });
  }

  return {
    insights: insights.slice(0, 3),
    sources: sources.slice(0, 5)
  };
}

export { SERPER_API_BASE };
