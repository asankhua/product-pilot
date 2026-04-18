// Dashboard Projects API
// Returns recent projects for the dashboard

import { NextRequest, NextResponse } from "next/server";
import { listProjects, Project } from "@/lib/db/neon-client";

export async function GET(req: NextRequest) {
  try {
    const projects: Project[] = await listProjects();
    
    // Sort by last updated and take recent 5
    const recentProjects = projects
      .sort((a: Project, b: Project) => {
        const dateA = new Date(a.lastUpdated || a.updatedAt);
        const dateB = new Date(b.lastUpdated || b.updatedAt);
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, 5)
      .map((project: Project) => ({
        id: project.id,
        name: project.name,
        currentStep: project.currentStep || 1,
        completedSteps: project.completedSteps?.length || 0,
        updatedAt: project.lastUpdated || project.updatedAt
      }));

    return NextResponse.json({
      success: true,
      projects: recentProjects
    });
  } catch (error) {
    console.error("Dashboard projects error:", error);
    return NextResponse.json(
      { error: "Failed to fetch recent projects" },
      { status: 500 }
    );
  }
}
