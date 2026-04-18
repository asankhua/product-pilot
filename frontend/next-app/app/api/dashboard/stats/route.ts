// Dashboard Stats API
// Returns aggregated statistics for the dashboard

import { NextRequest, NextResponse } from "next/server";
import { listProjects } from "@/lib/db/neon-client";

export async function GET(req: NextRequest) {
  try {
    const projects = await listProjects();
    
    // Calculate stats
    const totalProjects = projects.length;
    const completedProjects = projects.filter(p => 
      p.completedSteps && p.completedSteps.includes(9)
    ).length;
    
    const inProgressProjects = projects.filter(p => 
      p.currentStep && p.currentStep > 1 && (!p.completedSteps || !p.completedSteps.includes(9))
    ).length;
    
    const totalStepsCompleted = projects.reduce((acc, p) => 
      acc + (p.completedSteps?.length || 0), 0
    );

    return NextResponse.json({
      success: true,
      stats: {
        totalProjects,
        completedProjects,
        inProgressProjects,
        totalStepsCompleted,
        averageCompletion: totalProjects > 0 
          ? Math.round((totalStepsCompleted / (totalProjects * 9)) * 100) 
          : 0
      }
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}
