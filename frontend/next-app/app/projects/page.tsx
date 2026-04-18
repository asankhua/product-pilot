"use client";

// Projects page - Product Pilot
// Loads projects from Neon database (created via /project/new)
// Shows empty state if no projects exist

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter, FolderOpen, Trash2, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

interface Project {
  id: string;
  name: string;
  problemStatement: string;
  template: string | null;
  createdAt: string;
  currentStep?: number;
  phase1Data?: {
    reframe: {
      reframedProblem: {
        customerProblem: string;
        businessImpact: string[];
        targetAudience: string[];
        successCriteria: string[];
      };
    } | null;
    vision: { visionStatement: string } | null;
  };
  phase2Data?: {
    personas: { personas: any[] } | null;
    questions: { questions: any[] } | null;
  };
  phase3Data?: {
    marketAnalysis: any | null;
  };
  savedSessions?: any[];
  projectContext?: ProjectContext;
  lastUpdated?: string;
}

// Consolidated project context for RAG and cross-step reference
interface ProjectContext {
  // Step 1: Problem Definition
  originalProblem: string;
  reframedProblem: {
    customerProblem: string;
    businessImpact: string[];
    targetAudience: string[];
    successCriteria: string[];
  } | null;
  // Step 2: Vision
  visionStatement: string | null;
  missionStatement: string | null;
  valueProposition: string | null;
  // Step 3: Personas
  personas: any[] | null;
  // Step 4: Questions
  questions: any[] | null;
  // Step 5: Market Analysis
  marketAnalysis: any | null;
  // Metadata
  lastUpdated: string;
  totalStepsCompleted: number;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Completed":
      return "bg-emerald-100 text-emerald-700";
    case "In Progress":
      return "bg-amber-100 text-amber-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
};

const getProjectStatus = (step?: number) => {
  if (!step || step === 1) return "Draft";
  if (step >= 9) return "Completed";
  return "In Progress";
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return date.toLocaleDateString();
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Load projects from API on mount
  useEffect(() => {
    async function loadProjects() {
      try {
        const response = await fetch("/api/projects/list");
        const data = await response.json();
        if (data.success) {
          setProjects(data.projects);
        }
      } catch (error) {
        console.error("Failed to load projects:", error);
      }
    }
    loadProjects();
  }, []);

  // Delete project handler
  const handleDelete = async (projectId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      try {
        const response = await fetch(`/api/projects/${projectId}`, { method: "DELETE" });
        if (response.ok) {
          const updatedProjects = projects.filter((p) => p.id !== projectId);
          setProjects(updatedProjects);
        }
      } catch (error) {
        console.error("Failed to delete project:", error);
      }
    }
  };

  // Filter projects based on search
  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.problemStatement.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const hasProjects = projects.length > 0;

  return (
    <div className="min-h-screen flex">
      <Sidebar />

      <main className="flex-1 p-8 overflow-auto relative">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Projects</h1>
              <p className="text-slate-600 mt-1">
                {hasProjects
                  ? `Manage and view all your product definitions (${projects.length} total)`
                  : "Create your first product definition to get started"}
              </p>
            </div>
            <Link href="/project/new">
              <Button className="gap-2 bg-indigo-500 hover:bg-indigo-600">
                <Plus className="w-4 h-4" />
                New Project
              </Button>
            </Link>
          </div>

          {hasProjects ? (
            <>
              {/* Filters */}
              <div className="flex gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Search projects..."
                    className="pl-10 bg-white border-slate-300"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline" className="gap-2">
                  <Filter className="w-4 h-4" />
                  Filter
                </Button>
              </div>

              {/* Projects Grid */}
              <div className="grid md:grid-cols-2 gap-4">
                {filteredProjects.map((project) => {
                  // Calculate progress from saved data and savedSessions
                  // currentStep represents the last completed step (0 = nothing, 1 = step 1 done, etc.)
                  const hasReframe = project.phase1Data?.reframe !== null;
                  const hasVision = project.phase1Data?.vision !== null;

                  // Determine actual completed step from phase data
                  let completedStep = 0;
                  if (hasVision) completedStep = 2;
                  else if (hasReframe) completedStep = 1;

                  // Check savedSessions for Steps 6-9 completion
                  const savedSessions = project.savedSessions || [];
                  if (savedSessions.some(s => s.stepNumber === 9 && "okr1" in s.data)) {
                    completedStep = 9;
                  } else if (savedSessions.some(s => s.stepNumber === 8 && "phases" in s.data)) {
                    completedStep = 8;
                  } else if (savedSessions.some(s => s.stepNumber === 7 && "stories" in s.data)) {
                    completedStep = 7;
                  } else if (savedSessions.some(s => s.stepNumber === 6 && "appendix" in s.data)) {
                    completedStep = 6;
                  }

                  // Use saved currentStep if it's higher (from future phases)
                  if (project.currentStep && project.currentStep > completedStep) {
                    completedStep = project.currentStep;
                  }

                  // If no progress yet, show step 1 as pending (0% complete)
                  const actualStep = completedStep || 0;

                  const status = getProjectStatus(actualStep);
                  // Calculate progress: completed steps / total steps (9)
                  const progress = Math.round((actualStep / 9) * 100);

                  return (
                    <Card
                      key={project.id}
                      className="bg-white border-slate-200 hover:border-indigo-300 transition-colors group"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                              <FolderOpen className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-slate-900">{project.name}</h3>
                              <p className="text-sm text-slate-500">
                                {project.lastUpdated
                                  ? `Updated ${formatDate(project.lastUpdated)}`
                                  : `Created ${formatDate(project.createdAt)}`}
                              </p>
                            </div>
                          </div>
                          {/* Delete Button */}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            onClick={(e) => handleDelete(project.id, e)}
                            title="Delete project"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        {/* Problem Statement Preview */}
                        <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                          {project.problemStatement}
                        </p>

                        {/* Progress */}
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-slate-600">Progress</span>
                            <span className="text-slate-900">
                              {progress}% • Step {actualStep}/9
                            </span>
                          </div>
                          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-indigo-500 rounded-full transition-all"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>

                        {/* Status */}
                        <div className="flex items-center justify-between mb-4">
                          <Badge className={getStatusColor(status)}>{status}</Badge>
                          {project.template && (
                            <span className="text-xs text-slate-500">
                              From: {project.template}
                            </span>
                          )}
                        </div>

                        {/* Action */}
                        <div className="pt-4 border-t border-slate-200">
                          <Link href={`/project/${project.id}`}>
                            <Button variant="outline" className="w-full gap-2 group-hover:border-indigo-300">
                              Open Project
                              <ArrowRight className="w-4 h-4" />
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {filteredProjects.length === 0 && searchQuery && (
                <div className="text-center py-12">
                  <p className="text-slate-500">No projects match your search.</p>
                  <Button variant="ghost" onClick={() => setSearchQuery("")} className="mt-2">
                    Clear search
                  </Button>
                </div>
              )}
            </>
          ) : (
            /* Empty State */
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-indigo-600" />
              </div>
              <h2 className="text-xl font-semibold text-slate-900 mb-2">No projects yet</h2>
              <p className="text-slate-600 mb-6 max-w-md mx-auto">
                Create your first product definition to start building your AI-powered product roadmap.
              </p>
              <Link href="/project/new">
                <Button className="gap-2 bg-indigo-500 hover:bg-indigo-600">
                  <Plus className="w-4 h-4" />
                  Create First Project
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

