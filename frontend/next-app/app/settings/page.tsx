// Settings page - Product Pilot

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Download, 
  FileJson, 
  FileText, 
  Palette, 
  Sparkles,
  ExternalLink,
  ChevronRight,
  Loader2
} from "lucide-react";
import { toast } from "sonner";

interface Project {
  id: string;
  name: string;
  createdAt?: string;
  completedSteps?: number[];
}

export default function SettingsPage() {
  const [userName, setUserName] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [compactView, setCompactView] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [lastBackup, setLastBackup] = useState<string>('Never');

  // Load user preferences and projects
  useEffect(() => {
    // Load from localStorage
    const savedName = localStorage.getItem('userName') || '';
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    const savedCompact = localStorage.getItem('compactView') === 'true';
    const savedLastBackup = localStorage.getItem('lastBackup') || 'Never';
    
    setUserName(savedName);
    setDarkMode(savedDarkMode);
    setCompactView(savedCompact);
    setLastBackup(savedLastBackup);

    // Load projects
    async function loadProjects() {
      try {
        const response = await fetch("/api/projects/list");
        const data = await response.json();
        if (data.success) {
          setProjects(data.projects || []);
        }
      } catch (error) {
        console.error("Failed to load projects:", error);
      } finally {
        setLoading(false);
      }
    }
    loadProjects();
  }, []);

  // Save user preferences
  const savePreferences = () => {
    localStorage.setItem('userName', userName);
    localStorage.setItem('darkMode', String(darkMode));
    localStorage.setItem('compactView', String(compactView));
    toast.success("Settings saved successfully");
  };

  // Export all projects as JSON
  const exportAllProjects = async () => {
    setExporting(true);
    try {
      const exportData = {
        exportedAt: new Date().toISOString(),
        totalProjects: projects.length,
        projects: projects
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `product-pilot-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Save backup date
      const backupDate = new Date().toISOString().split('T')[0];
      localStorage.setItem('lastBackup', backupDate);
      setLastBackup(backupDate);

      toast.success("All projects exported successfully");
    } catch (error) {
      toast.error("Failed to export projects");
    } finally {
      setExporting(false);
    }
  };

  // Calculate stats
  const totalProjects = projects.length;
  const completedProjects = projects.filter(p => p.completedSteps?.includes(9)).length;
  const inProgress = totalProjects - completedProjects;

  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar />

      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
            <p className="text-slate-600 mt-1">
              Manage your preferences and data
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Profile Card */}
              <Card className="bg-white border-slate-200">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                      <User className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div>
                      <CardTitle className="text-slate-900 text-lg">Profile</CardTitle>
                      <CardDescription className="text-slate-500 text-sm">
                        Your display preferences
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="userName" className="text-slate-700 text-sm">Display Name</Label>
                    <Input
                      id="userName"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Enter your name"
                      className="bg-white border-slate-200"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Appearance Card */}
              <Card className="bg-white border-slate-200">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                      <Palette className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <CardTitle className="text-slate-900 text-lg">Appearance</CardTitle>
                      <CardDescription className="text-slate-500 text-sm">
                        Customize your view
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-slate-900 text-sm">Compact View</p>
                      <p className="text-xs text-slate-500">Show more content with less spacing</p>
                    </div>
                    <Switch
                      checked={compactView}
                      onCheckedChange={setCompactView}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Data & Export Card */}
              <Card className="bg-white border-slate-200">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <Download className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <CardTitle className="text-slate-900 text-lg">Data Export</CardTitle>
                      <CardDescription className="text-slate-500 text-sm">
                        Backup your projects
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileJson className="w-5 h-5 text-slate-400" />
                      <div>
                        <p className="font-medium text-slate-900 text-sm">JSON Export</p>
                        <p className="text-xs text-slate-500">{totalProjects} projects</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={exportAllProjects}
                      disabled={exporting || totalProjects === 0}
                    >
                      {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Export"}
                    </Button>
                  </div>
                  
                  <div className="text-xs text-slate-400">
                    Last backup: {lastBackup}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Stats Card */}
              <Card className="bg-white border-slate-200">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                      <CardTitle className="text-slate-900 text-lg">Your Progress</CardTitle>
                      <CardDescription className="text-slate-500 text-sm">
                        Project overview
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-indigo-50 rounded-lg">
                      <p className="text-2xl font-bold text-indigo-600">{totalProjects}</p>
                      <p className="text-sm text-slate-600">Total Projects</p>
                    </div>
                    <div className="p-4 bg-emerald-50 rounded-lg">
                      <p className="text-2xl font-bold text-emerald-600">{completedProjects}</p>
                      <p className="text-sm text-slate-600">Completed</p>
                    </div>
                    <div className="p-4 bg-amber-50 rounded-lg">
                      <p className="text-2xl font-bold text-amber-600">{inProgress}</p>
                      <p className="text-sm text-slate-600">In Progress</p>
                    </div>
                    <Link href="/projects" className="p-4 bg-slate-50 rounded-lg flex items-center justify-between hover:bg-slate-100 transition-colors">
                      <div>
                        <p className="text-sm font-medium text-slate-700">View All</p>
                        <p className="text-xs text-slate-500">Projects</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Links Card */}
              <Card className="bg-white border-slate-200">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                      <ExternalLink className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-slate-900 text-lg">Quick Links</CardTitle>
                      <CardDescription className="text-slate-500 text-sm">
                        Navigate to key pages
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href="/dashboard">
                    <Button variant="outline" className="w-full justify-between">
                      <span className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        Dashboard
                      </span>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link href="/projects">
                    <Button variant="outline" className="w-full justify-between">
                      <span className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        All Projects
                      </span>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link href="/templates">
                    <Button variant="outline" className="w-full justify-between">
                      <span className="flex items-center gap-2">
                        <Palette className="w-4 h-4" />
                        Templates
                      </span>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* About Card */}
              <Card className="bg-gradient-to-br from-indigo-500 to-violet-600 border-0 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Sparkles className="w-6 h-6" />
                    <h3 className="font-semibold text-lg">Product Pilot</h3>
                  </div>
                  <p className="text-indigo-100 text-sm mb-4">
                    AI-powered product management platform. From idea to PRD in minutes.
                  </p>
                  <Badge variant="secondary" className="bg-white/20 text-white border-0">
                    v1.0.0
                  </Badge>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-8 flex justify-end">
            <Button 
              onClick={savePreferences}
              className="gap-2 bg-indigo-500 hover:bg-indigo-600"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
