// Serper API client - Google Search results
//
// API: https://google.serper.dev/search
// Returns: organic results, knowledge graph, related searches
// Rate limit: 2,500 queries/month (free tier)

export interface SerperSearchParams {
  q: string;
  num?: number;
  gl?: string;
  hl?: string;
}

export interface SerperResult {
  organic: Array<{
    title: string;
    link: string;
    snippet: string;
    position: number;
  }>;
  knowledgeGraph?: {
    title: string;
    description: string;
  };
}

export async function searchGoogle(params: SerperSearchParams): Promise<SerperResult> {
  const apiKey = process.env.SERPER_API_KEY;
  
  if (!apiKey) {
    throw new Error("SERPER_API_KEY not configured");
  }

  const response = await fetch("https://google.serper.dev/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": apiKey,
    },
    body: JSON.stringify({
      q: params.q,
      num: params.num || 10,
      gl: params.gl || "us",
      hl: params.hl || "en",
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Serper API error: ${response.status} - ${error}`);
  }

  return await response.json();
}

// Search multiple queries in parallel
export async function searchMultiple(queries: string[]): Promise<string> {
  const results = await Promise.all(
    queries.map(async (q) => {
      try {
        const result = await searchGoogle({ q, num: 5 });
        const organic = result.organic || [];
        return `Query: ${q}\n${organic.map(r => `- ${r.title}: ${r.snippet} (${r.link})`).join("\n")}`;
      } catch (error) {
        return `Query: ${q}\nError: ${error instanceof Error ? error.message : "Search failed"}`;
      }
    })
  );
  
  return results.join("\n\n");
}
