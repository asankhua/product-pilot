// Serper Search API - Google Search proxy
import { NextRequest, NextResponse } from "next/server";
import { search } from "@/lib/serper/client";

export async function POST(req: NextRequest) {
  try {
    const { query, type, num, tbs } = await req.json();

    if (!query) {
      return NextResponse.json(
        { error: "Missing required field: query" },
        { status: 400 }
      );
    }

    const results = await search(query, { type, num, tbs });

    return NextResponse.json({
      success: true,
      results
    });
  } catch (error) {
    console.error("Serper search error:", error);
    return NextResponse.json(
      { error: "Failed to search", details: String(error) },
      { status: 500 }
    );
  }
}
