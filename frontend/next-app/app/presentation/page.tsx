// Presentation Generator Page
// Uses Python Microservice for professional PPT generation

"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Presentation, 
  Sparkles, 
  FileText,
  Loader2,
  Download,
  LayoutTemplate,
  Server,
  CheckCircle,
  XCircle,
  RefreshCw,
  ChevronDown
} from "lucide-react";
import { toast } from "sonner";

// PPT Service API Configuration - Using external Hugging Face microservice
const PPT_SERVICE_URL = process.env.NEXT_PUBLIC_PPT_SERVICE_URL || 'https://ashishsankhua-ppt-microservice.hf.space';

interface PPTTemplate {
  id: string;
  name: string;
  description: string;
}

interface Project {
  id: string;
  name: string;
  description?: string;
  template?: string;
  createdAt: string;
  updatedAt: string;
  currentStep?: number;
  phase1Data?: any;
  phase2Data?: any;
  phase3Data?: any;
  savedSessions?: SavedSession[];
}

interface SavedSession {
  id: string;
  stepNumber: number;
  stepName: string;
  data: any;
  savedAt: string;
}

interface ProjectStep {
  stepId: number;
  stepName: string;
  data: any;
}

const STEPS = [
  { id: 1, name: "Problem Reframe", description: "Reframed problem statement and root causes", color: "3B82F6" },
  { id: 2, name: "Product Vision", description: "Vision statement and value proposition", color: "22C55E" },
  { id: 3, name: "User Personas", description: "Target user profiles and personas", color: "8B5CF6" },
  { id: 4, name: "Clarifying Questions", description: "Key questions and answers", color: "F97316" },
  { id: 5, name: "Market Analysis", description: "Competitors and market overview", color: "0EA5E9" },
  { id: 6, name: "PRD", description: "Product Requirements Document", color: "C026D3" },
  { id: 7, name: "User Stories", description: "User stories with acceptance criteria", color: "16A34A" },
  { id: 8, name: "Roadmap", description: "Product roadmap and milestones", color: "F59E0B" },
  { id: 9, name: "OKRs", description: "Objectives and Key Results", color: "3B82F6" },
];

const TEMPLATES: PPTTemplate[] = [
  { id: "professional", name: "Professional Blue", description: "Clean corporate style with blue gradients" },
  { id: "minimal", name: "Minimal White", description: "Minimalist design with plenty of white space" },
  { id: "dark", name: "Dark Modern", description: "Dark theme with vibrant accents" },
  { id: "startup", name: "Startup Pitch", description: "Bold, colorful design for investor pitches" },
];

export default function PresentationPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedSteps, setSelectedSteps] = useState<number[]>([1, 2, 3, 4, 5, 7, 8, 9]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("professional");
  const [serviceStatus, setServiceStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  // Check PPT service health on mount
  useEffect(() => {
    checkServiceHealth();
    fetchProjects();
  }, []);

  const checkServiceHealth = async () => {
    try {
      const response = await fetch(`${PPT_SERVICE_URL}/health`, {
        method: 'GET',
        cache: 'no-cache',
      });
      setServiceStatus(response.ok ? 'online' : 'offline');
    } catch {
      setServiceStatus('offline');
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects/list");
      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects || []);
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      toast.error("Failed to load projects");
    }
  };

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
    populateAvailableSteps(project);
    setDropdownOpen(false);
  };

  const populateAvailableSteps = (project: Project) => {
    const availableSteps: number[] = [];
    
    if (project.phase1Data?.reframe) availableSteps.push(1);
    if (project.phase1Data?.vision) availableSteps.push(2);
    
    const personas = project.phase2Data?.personas?.personas || project.phase2Data?.personas;
    if (personas && (Array.isArray(personas) ? personas.length > 0 : false)) availableSteps.push(3);
    
    const questions = project.phase2Data?.questions?.questions || project.phase2Data?.questions;
    if (questions && (Array.isArray(questions) ? questions.length > 0 : false)) availableSteps.push(4);
    
    if (project.phase3Data?.marketAnalysis) availableSteps.push(5);
    if (project.savedSessions?.some(s => s.stepNumber === 6)) availableSteps.push(6);
    if (project.savedSessions?.some(s => s.stepNumber === 7)) availableSteps.push(7);
    if (project.savedSessions?.some(s => s.stepNumber === 8)) availableSteps.push(8);
    if (project.savedSessions?.some(s => s.stepNumber === 9)) availableSteps.push(9);
    
    setSelectedSteps(availableSteps);
  };

  const toggleStep = (stepId: number) => {
    setSelectedSteps(prev => 
      prev.includes(stepId) 
        ? prev.filter(id => id !== stepId)
        : [...prev, stepId]
    );
  };

  const isStepAvailable = (stepId: number): boolean => {
    if (!selectedProject) return false;
    switch (stepId) {
      case 1: return !!selectedProject.phase1Data?.reframe;
      case 2: return !!selectedProject.phase1Data?.vision;
      case 3: {
        const personas = selectedProject.phase2Data?.personas?.personas || selectedProject.phase2Data?.personas;
        return !!(personas && (Array.isArray(personas) ? personas.length > 0 : false));
      }
      case 4: {
        const questions = selectedProject.phase2Data?.questions?.questions || selectedProject.phase2Data?.questions;
        return !!(questions && (Array.isArray(questions) ? questions.length > 0 : false));
      }
      case 5: return !!selectedProject.phase3Data?.marketAnalysis;
      case 6: return !!selectedProject.savedSessions?.some(s => s.stepNumber === 6);
      case 7: return !!selectedProject.savedSessions?.some(s => s.stepNumber === 7);
      case 8: return !!selectedProject.savedSessions?.some(s => s.stepNumber === 8);
      case 9: return !!selectedProject.savedSessions?.some(s => s.stepNumber === 9);
      default: return false;
    }
  };

  const getStepData = (stepId: number): any => {
    if (!selectedProject) return null;
    switch (stepId) {
      case 1: return selectedProject.phase1Data?.reframe;
      case 2: return selectedProject.phase1Data?.vision;
      case 3: return selectedProject.phase2Data?.personas?.personas || selectedProject.phase2Data?.personas;
      case 4: return selectedProject.phase2Data?.questions?.questions || selectedProject.phase2Data?.questions;
      case 5: return selectedProject.phase3Data?.marketAnalysis;
      case 6: {
        const session = selectedProject.savedSessions?.find(s => s.stepNumber === 6);
        return session?.data?.metadata ? session.data : session;
      }
      case 7: {
        const session = selectedProject.savedSessions?.find(s => s.stepNumber === 7);
        return session?.data?.stories || (Array.isArray(session?.data) ? session.data : session);
      }
      case 8: {
        const session = selectedProject.savedSessions?.find(s => s.stepNumber === 8);
        return session?.data?.phases || (Array.isArray(session?.data) ? session.data : session);
      }
      case 9: {
        const session = selectedProject.savedSessions?.find(s => s.stepNumber === 9);
        return session?.data;
      }
      default: return null;
    }
  };

  const generatePPT = async () => {
    if (!selectedProject || selectedSteps.length === 0) {
      toast.error("Please select a project and at least one step");
      return;
    }

    if (serviceStatus === 'offline') {
      toast.error("PPT Service is offline. Please start the Python microservice.");
      return;
    }

    setIsGenerating(true);
    
    try {
      // Format steps for API
      const formattedSteps: ProjectStep[] = selectedSteps.map(stepId => ({
        stepId,
        stepName: STEPS.find(s => s.id === stepId)?.name || `Step ${stepId}`,
        data: getStepData(stepId)
      })).filter(step => step.data !== null);

      if (formattedSteps.length === 0) {
        toast.error("No data available for selected steps");
        setIsGenerating(false);
        return;
      }

      // Call Python microservice
      const response = await fetch(`${PPT_SERVICE_URL}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectName: selectedProject.name,
          projectDescription: selectedProject.description,
          steps: formattedSteps,
          template: selectedTemplate,
          includeCharts: true,
          includeImages: false
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to generate presentation');
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Generation failed');
      }

      // Download the file
      const downloadResponse = await fetch(`${PPT_SERVICE_URL}${result.downloadUrl}`);
      if (!downloadResponse.ok) {
        throw new Error('Failed to download presentation');
      }

      const blob = await downloadResponse.blob();
      
      // Trigger browser download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${selectedProject.name.replace(/[^a-zA-Z0-9]/g, "_")}_Presentation.pptx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success("Presentation generated successfully!", {
        description: `${formattedSteps.length} slides created with ${TEMPLATES.find(t => t.id === selectedTemplate)?.name} template`,
      });
    } catch (error) {
      console.error("Failed to generate PPT:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate presentation");
    } finally {
      setIsGenerating(false);
    }
  };

  const selectAllSteps = () => {
    const available = STEPS.filter(s => isStepAvailable(s.id)).map(s => s.id);
    setSelectedSteps(available);
  };

  const clearAllSteps = () => {
    setSelectedSteps([]);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      
      <main className="flex-1 p-8 overflow-auto">
        {/* Header */}
        <header className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                <Presentation className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Presentation Generator</h1>
                <p className="text-sm text-slate-500">Professional PowerPoint with Python microservice</p>
              </div>
            </div>
            
            {/* Service Status */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">PPT Service:</span>
              {serviceStatus === 'checking' && (
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                  <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                  Checking...
                </Badge>
              )}
              {serviceStatus === 'online' && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Online
                </Badge>
              )}
              {serviceStatus === 'offline' && (
                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                  <XCircle className="w-3 h-3 mr-1" />
                  Offline
                </Badge>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={checkServiceHealth}
                className="h-8 w-8 p-0"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Service Offline Warning */}
        {serviceStatus === 'offline' && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Server className="w-6 h-6 text-red-600 mt-0.5" />
              <div>
                <h3 className="font-bold text-red-900 mb-1">PPT Service Offline</h3>
                <p className="text-sm text-red-800 mb-2">
                  The Python microservice is not running. To generate presentations:
                </p>
                <code className="block bg-red-100 rounded p-2 text-xs text-red-900 font-mono">
                  cd ppt-service && docker-compose up --build
                </code>
                <p className="text-xs text-red-700 mt-2">
                  Or run directly: <span className="font-mono">cd ppt-service/src && python main.py</span>
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Panel - Configuration */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-500" />
                  Select Project
                </CardTitle>
                <CardDescription>Choose a project to generate presentation from</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-white border border-slate-200 rounded-lg hover:border-indigo-300 transition-colors"
                  >
                    <span className={selectedProject ? "text-slate-900" : "text-slate-400"}>
                      {selectedProject?.name || "Select a project..."}
                    </span>
                    <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-60 overflow-y-auto z-50">
                      {projects.length === 0 ? (
                        <div className="px-4 py-3 text-slate-500 text-sm">No projects found</div>
                      ) : (
                        projects.map((project) => (
                          <button
                            key={project.id}
                            onClick={() => handleProjectSelect(project)}
                            className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0"
                          >
                            <div className="font-medium text-slate-900">{project.name}</div>
                            {project.description && (
                              <div className="text-sm text-slate-500 truncate">{project.description}</div>
                            )}
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Template Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LayoutTemplate className="w-5 h-5 text-indigo-500" />
                  Select Template
                </CardTitle>
                <CardDescription>Choose a professional template style</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {TEMPLATES.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => setSelectedTemplate(template.id)}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        selectedTemplate === template.id
                          ? "border-indigo-500 bg-indigo-50"
                          : "border-slate-200 hover:border-indigo-300"
                      }`}
                    >
                      <div className="font-medium text-slate-900">{template.name}</div>
                      <div className="text-sm text-slate-500">{template.description}</div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Step Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-500" />
                  Select Steps
                </CardTitle>
                <CardDescription>Choose which pipeline steps to include</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-4">
                  <Button variant="outline" size="sm" onClick={selectAllSteps}>
                    Select All Available
                  </Button>
                  <Button variant="outline" size="sm" onClick={clearAllSteps}>
                    Clear All
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {STEPS.map((step) => {
                    const available = isStepAvailable(step.id);
                    const selected = selectedSteps.includes(step.id);
                    
                    return (
                      <div
                        key={step.id}
                        className={`flex items-center gap-3 p-3 rounded-lg border ${
                          available 
                            ? selected 
                              ? "border-indigo-300 bg-indigo-50" 
                              : "border-slate-200 hover:border-indigo-300"
                            : "border-slate-100 bg-slate-50 opacity-50"
                        }`}
                      >
                        <Checkbox
                          id={`step-${step.id}`}
                          checked={selected}
                          onCheckedChange={() => toggleStep(step.id)}
                          disabled={!available}
                        />
                        <div className="flex-1">
                          <label 
                            htmlFor={`step-${step.id}`}
                            className={`font-medium ${available ? "text-slate-900" : "text-slate-400"}`}
                          >
                            {step.id}. {step.name}
                          </label>
                          <p className={`text-sm ${available ? "text-slate-500" : "text-slate-400"}`}>
                            {available ? step.description : "No data available for this step"}
                          </p>
                        </div>
                        {available && selected && (
                          <Badge className="bg-indigo-100 text-indigo-700">Selected</Badge>
                        )}
                        {!available && (
                          <Badge variant="outline" className="text-slate-400">No Data</Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Actions */}
          <div className="space-y-6">
            {/* Generate Button */}
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Generate Presentation</CardTitle>
                <CardDescription>
                  {selectedSteps.length} steps selected
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={generatePPT}
                  disabled={isGenerating || !selectedProject || selectedSteps.length === 0 || serviceStatus === 'offline'}
                  className="w-full h-14 text-lg bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5 mr-2" />
                      Generate PPT
                    </>
                  )}
                </Button>

                {serviceStatus === 'offline' && (
                  <p className="text-sm text-red-600 text-center">
                    Start the PPT service to generate presentations
                  </p>
                )}

                {!selectedProject && (
                  <p className="text-sm text-slate-500 text-center">
                    Select a project to continue
                  </p>
                )}

                {selectedProject && selectedSteps.length === 0 && (
                  <p className="text-sm text-slate-500 text-center">
                    Select at least one step with data
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Template Preview Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Selected Template</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <p className="font-medium text-slate-900">
                    {TEMPLATES.find(t => t.id === selectedTemplate)?.name}
                  </p>
                  <p className="text-slate-500">
                    {TEMPLATES.find(t => t.id === selectedTemplate)?.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Info Card */}
            <Card className="bg-slate-50 border-slate-200">
              <CardContent className="pt-6">
                <h4 className="font-medium text-slate-900 mb-2">About PPT Generation</h4>
                <ul className="text-sm text-slate-600 space-y-1 list-disc list-inside">
                  <li>Professional templates with charts</li>
                  <li>16:9 widescreen format</li>
                  <li>Persona cards and visual layouts</li>
                  <li>TAM/SAM/SOM market charts</li>
                  <li>OKR progress visualizations</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
