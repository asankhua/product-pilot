// Dashboard page - Product Pilot
// Based on WIREFRAMES.md Screen 2

"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, ArrowRight, FileText, Download, Sparkles, Code, Smartphone, Store, Zap, MessageSquare, Clock, CheckCircle, TrendingUp, Loader2 } from "lucide-react";
import { Sidebar } from "@/components/sidebar";

interface Project {
  id: string;
  name: string;
  problemStatement?: string;
  template?: string;
  currentStep?: number;
  completedSteps?: number[];
  createdAt?: string;
  updatedAt?: string;
  savedSessions?: { stepNumber: number; savedAt: string }[];
}

const quickTemplates = [
  { name: "SaaS Product", icon: Code, color: "bg-indigo-100 text-indigo-600" },
  { name: "Mobile App", icon: Smartphone, color: "bg-emerald-100 text-emerald-600" },
  { name: "Marketplace", icon: Store, color: "bg-amber-100 text-amber-600" },
];

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch real projects from API
  useEffect(() => {
    async function loadProjects() {
      try {
        const response = await fetch("/api/projects/list");
        const data = await response.json();
        if (data.success && data.projects) {
          setProjects(data.projects);
          
          // Generate activities from actual saved sessions
          const recentActivities: any[] = [];
          data.projects.forEach((p: Project) => {
            if (p.savedSessions && p.savedSessions.length > 0) {
              // Get the most recent saved session
              const sorted = [...p.savedSessions].sort((a, b) => 
                new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
              );
              const latest = sorted[0];
              recentActivities.push({
                icon: CheckCircle,
                text: `Step ${latest.stepNumber} saved for "${p.name}"`,
                time: new Date(latest.savedAt).toLocaleDateString(),
                color: "text-emerald-600"
              });
            }
          });
          setActivities(recentActivities.slice(0, 5));
        }
      } catch (error) {
        console.error("Failed to load projects:", error);
      } finally {
        setLoading(false);
      }
    }
    loadProjects();
  }, []);

  // Calculate real stats
  const totalProjects = projects.length;
  const completed = projects.filter(p => p.completedSteps?.includes(9)).length;
  const inProgress = projects.filter(p => (p.completedSteps?.length || 0) > 0 && !p.completedSteps?.includes(9)).length;
  const drafts = totalProjects - inProgress - completed;

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      
      <main className="flex-1 p-8 overflow-auto relative">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
              <p className="text-slate-600 mt-1">Welcome back! Ready to build something amazing?</p>
            </div>
            <Link href="/project/new">
              <Button className="gap-2 bg-indigo-500 hover:bg-indigo-600">
                <Plus className="w-4 h-4" />
                New Project
              </Button>
            </Link>
            {loading && <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />}
          </div>

          {/* Welcome Banner */}
          <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 border-0 mb-8 shadow-lg">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="text-white">
                <h2 className="text-xl font-semibold mb-1">AI Pipeline Ready</h2>
                <p className="text-indigo-100">Start a new project and get your PRD, stories, and roadmap in minutes</p>
              </div>
              <Link href="/project/new">
                <Button className="gap-2 bg-white text-indigo-600 hover:bg-indigo-50">
                  <Zap className="w-4 h-4" />
                  Start Now
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Stats Bar */}
          <Card className="bg-white border-slate-200 mb-8 shadow-sm">
            <CardContent className="p-4 flex gap-8">
              <div>
                <span className="text-slate-500 text-sm">Total</span>
                <p className="text-2xl font-semibold text-slate-900">{totalProjects}</p>
              </div>
              <div>
                <span className="text-slate-500 text-sm">In Progress</span>
                <p className="text-2xl font-semibold text-amber-600">{inProgress}</p>
              </div>
              <div>
                <span className="text-slate-500 text-sm">Completed</span>
                <p className="text-2xl font-semibold text-emerald-600">{completed}</p>
              </div>
              <div>
                <span className="text-slate-500 text-sm">Drafts</span>
                <p className="text-2xl font-semibold text-slate-900">{drafts}</p>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                <span className="text-sm text-slate-600">2 completed this week</span>
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            {/* Quick Templates */}
            <div className="lg:col-span-2">
              <h2 className="text-lg font-semibold mb-4 text-slate-900">Quick Start Templates</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {quickTemplates.map((template) => (
                  <Link key={template.name} href="/project/new">
                    <Card className="bg-white border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer">
                      <CardContent className="p-4 flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg ${template.color} flex items-center justify-center`}>
                          <template.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-medium text-slate-900">{template.name}</h3>
                          <p className="text-xs text-slate-500">Start with AI</p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h2 className="text-lg font-semibold mb-4 text-slate-900">Quick Actions</h2>
              <div className="space-y-2">
                <Link href="/templates">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <FileText className="w-4 h-4" />
                    Browse All Templates
                  </Button>
                </Link>
                <Link href="/chat">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Ask AI Assistant
                  </Button>
                </Link>
                <Link href="/projects">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Clock className="w-4 h-4" />
                    View All Projects
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Recent Activity */}
            <div>
              <h2 className="text-lg font-semibold mb-4 text-slate-900">Recent Activity</h2>
              <Card className="bg-white border-slate-200 shadow-sm">
                <CardContent className="p-4 space-y-4">
                  {activities.map((activity, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <activity.icon className={`w-5 h-5 ${activity.color} flex-shrink-0 mt-0.5`} />
                      <div>
                        <p className="text-sm text-slate-700">{activity.text}</p>
                        <p className="text-xs text-slate-400">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Recent Projects */}
            <div className="lg:col-span-2">
              <h2 className="text-lg font-semibold mb-4 text-slate-900">Recent Projects</h2>
              {projects.length === 0 && !loading ? (
                <Card className="bg-white border-slate-200 shadow-sm">
                  <CardContent className="p-8 text-center">
                    <p className="text-slate-500">No projects yet. Create your first project!</p>
                    <Link href="/project/new" className="mt-4 inline-block">
                      <Button className="gap-2 bg-indigo-500 hover:bg-indigo-600">
                        <Plus className="w-4 h-4" />
                        New Project
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {projects.slice(0, 5).map((project) => {
                    const completedSteps = project.completedSteps?.length || 0;
                    const isCompleted = project.completedSteps?.includes(9);
                    const currentStep = Math.max(...(project.completedSteps || [0]), 0);
                    
                    return (
                      <Card key={project.id} className="bg-white border-slate-200 shadow-sm">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-lg text-slate-900">{project.name}</h3>
                                {isCompleted && (
                                  <Badge className="bg-emerald-100 text-emerald-700">Completed</Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-slate-500">
                                <span>{completedSteps} steps completed</span>
                                <span>·</span>
                                <span>Step {currentStep} of 9</span>
                                <span>·</span>
                                <span>Created {new Date(project.createdAt || Date.now()).toLocaleDateString()}</span>
                              </div>
                              {/* Progress dots */}
                              <div className="flex gap-1 mt-3">
                                {Array.from({ length: 9 }).map((_, i) => (
                                  <div
                                    key={i}
                                    className={`w-2 h-2 rounded-full ${
                                      i < completedSteps
                                        ? isCompleted
                                          ? "bg-emerald-500"
                                          : "bg-indigo-500"
                                        : "bg-slate-300"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Link href={`/project/${project.id}`}>
                                <Button size="sm" className="gap-2 bg-indigo-500 hover:bg-indigo-600">
                                  {isCompleted ? "View" : "Continue"}
                                  <ArrowRight className="w-4 h-4" />
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
