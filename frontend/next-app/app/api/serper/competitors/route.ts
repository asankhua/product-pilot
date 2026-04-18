// Serper Competitors API - Real-time competitive intelligence
import { NextRequest, NextResponse } from "next/server";
import { searchCompetitors, getCompanyDetails, getMarketSize } from "@/lib/serper/client";

export async function POST(req: NextRequest) {
  try {
    const { productName, industry, includeMarketSize } = await req.json();

    if (!productName || !industry) {
      return NextResponse.json(
        { error: "Missing required fields: productName, industry" },
        { status: 400 }
      );
    }

    // Fetch competitor intelligence
    const competitorData = await searchCompetitors(productName, industry);
    
    // Optionally fetch market size
    let marketSize;
    if (includeMarketSize) {
      marketSize = await getMarketSize(industry);
    }

    // Enhance competitor details
    const enhancedCompetitors = await Promise.all(
      competitorData.directCompetitors.slice(0, 5).map(async (comp) => {
        try {
          const details = await getCompanyDetails(comp.name);
          return { ...comp, ...details };
        } catch {
          return comp;
        }
      })
    );

    return NextResponse.json({
      success: true,
      data: {
        directCompetitors: enhancedCompetitors,
        marketInsights: competitorData.marketInsights,
        ...(marketSize && { marketSize })
      }
    });
  } catch (error) {
    console.error("Serper competitors error:", error);
    return NextResponse.json(
      { error: "Failed to fetch competitive intelligence", details: String(error) },
      { status: 500 }
    );
  }
}
