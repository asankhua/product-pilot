// API route for listing projects
import { NextResponse } from "next/server";
import { listProjects } from "@/lib/db/neon-client";

export async function GET() {
  try {
    const projects = await listProjects();
    return NextResponse.json({ success: true, projects });
  } catch (error) {
    console.error("List projects error:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}
