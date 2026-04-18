// API route to fetch and parse PRLog RSS feed for Product News
import { NextRequest, NextResponse } from "next/server";
import { parseStringPromise } from "xml2js";

interface NewsItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  guid: string;
}

export async function GET(req: NextRequest) {
  try {
    const RSS_URL = "https://www.sciencedaily.com/rss/top/technology.xml";
    
    // Fetch RSS feed
    const response = await fetch(RSS_URL, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; ProductPilot/1.0)"
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch RSS: ${response.status} ${response.statusText}`);
    }

    const xmlData = await response.text();
    
    // Parse XML to JSON
    const result = await parseStringPromise(xmlData, {
      explicitArray: false,
      mergeAttrs: true
    });

    // Extract items from RSS feed
    const items = result.rss?.channel?.item || [];
    const newsItems: NewsItem[] = Array.isArray(items) ? items : [items];
    
    // Format news items
    const formattedNews = newsItems.map((item: any) => ({
      title: item.title || "No title",
      link: item.link || "",
      description: item.description ? item.description.replace(/<[^>]*>/g, "").substring(0, 300) + "..." : "No description",
      pubDate: item.pubDate ? new Date(item.pubDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      }) : "Unknown date",
      guid: item.guid || item.link || ""
    }));

    return NextResponse.json({
      success: true,
      count: formattedNews.length,
      news: formattedNews
    });

  } catch (error) {
    console.error("Product News API error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to fetch news",
        news: []
      },
      { status: 500 }
    );
  }
}
