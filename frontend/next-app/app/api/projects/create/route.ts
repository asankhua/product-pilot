// API route for creating projects
import { NextRequest, NextResponse } from "next/server";
import { createProject, initDatabase } from "@/lib/db/neon-client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { projectId, projectName, problemStatement, template } = body;
    
    // Initialize database
    await initDatabase();
    
    // Create project
    const project = await createProject({
      id: projectId,
      name: projectName,
      problemStatement,
      description: problemStatement.substring(0, 200),
      template: template || null,
    });
    
    return NextResponse.json({ success: true, project });
  } catch (error: any) {
    console.error("Create project error:", error);
    console.error("Error message:", error?.message);
    console.error("Error stack:", error?.stack);
    return NextResponse.json(
      { error: "Failed to create project", details: error?.message },
      { status: 500 }
    );
  }
}
