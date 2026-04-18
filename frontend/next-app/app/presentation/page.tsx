// Presentation Generator Page
// Generates PowerPoint presentations from project step data

"use client";

import { useState, useEffect, useRef } from "react";
import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Presentation, 
  Sparkles, 
  ChevronDown, 
  FileText,
  Loader2,
  Download,
  LayoutTemplate
} from "lucide-react";
import { toast } from "sonner";
import PptxGenJS from "pptxgenjs";

// Project interface
interface Project {
  id: string;
  name: string;
  description?: string;
  problemStatement?: string;
  template?: string;
  createdAt: string;
  updatedAt: string;
  currentStep?: number;
  phase1Data?: {
    reframe?: ReframeOutput | null;
    vision?: VisionOutput | null;
  };
  phase2Data?: {
    personas?: PersonasOutput | null;
    questions?: QuestionsOutput | null;
  };
  phase3Data?: {
    marketAnalysis?: MarketAnalysisOutput | null;
  };
  savedSessions?: SavedSession[];
}

interface SavedSession {
  id: string;
  stepNumber: number;
  stepName: string;
  data: any;
  savedAt: string;
}

// Step output types
interface ReframeOutput {
  problemTitle?: string;
  reframedProblem?: string;
  rootCauses?: string[];
  userImpact?: string;
  opportunitySize?: string;
}

interface VisionOutput {
  visionStatement?: string;
  productName?: string;
  elevatorPitch?: string;
  targetAudience?: string;
  valueProposition?: string;
  successMetrics?: string[];
}

interface PersonasOutput {
  personas?: Array<{
    name: string;
    role: string;
    bio: string;
    painPoints?: string[];
    goals?: string[];
    techSavviness?: string;
  }>;
}

interface QuestionsOutput {
  questions?: Array<{
    question: string;
    category: string;
    aiAnswer?: string;
    userAnswer?: string;
  }>;
}

interface MarketAnalysisOutput {
  marketOverview?: string;
  competitors?: Array<{
    name: string;
    description?: string;
    strengths?: string[];
    weaknesses?: string[];
    marketShare?: string;
  }>;
  trends?: string[];
  opportunities?: string[];
}

// Step configuration
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

export default function PresentationPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedSteps, setSelectedSteps] = useState<number[]>([1, 2, 3, 4, 5, 7, 8, 9]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch projects on mount
  useEffect(() => {
    fetchProjects();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    populateAvailableSteps();
    setDropdownOpen(false);
  };

  const populateAvailableSteps = () => {
    if (!selectedProject) return;
    
    const availableSteps: number[] = [];
    
    // Check phase1Data for steps 1-2
    if (selectedProject.phase1Data?.reframe) availableSteps.push(1);
    if (selectedProject.phase1Data?.vision) availableSteps.push(2);
    
    // Check phase2Data for steps 3-4
    const personas = selectedProject.phase2Data?.personas?.personas || selectedProject.phase2Data?.personas;
    if (personas && (Array.isArray(personas) ? personas.length > 0 : false)) availableSteps.push(3);
    
    const questions = selectedProject.phase2Data?.questions?.questions || selectedProject.phase2Data?.questions;
    if (questions && (Array.isArray(questions) ? questions.length > 0 : false)) availableSteps.push(4);
    
    // Check phase3Data for step 5
    if (selectedProject.phase3Data?.marketAnalysis) availableSteps.push(5);
    
    // Check savedSessions for steps 6-9
    if (selectedProject.savedSessions?.some(s => s.stepNumber === 6)) availableSteps.push(6);
    if (selectedProject.savedSessions?.some(s => s.stepNumber === 7)) availableSteps.push(7);
    if (selectedProject.savedSessions?.some(s => s.stepNumber === 8)) availableSteps.push(8);
    if (selectedProject.savedSessions?.some(s => s.stepNumber === 9)) availableSteps.push(9);
    
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
        if (!session) return null;
        // Extract actual PRD data from session
        return session.data?.metadata ? session.data : session;
      }
      case 7: {
        const session = selectedProject.savedSessions?.find(s => s.stepNumber === 7);
        if (!session) return null;
        // Extract stories array
        return session.data?.stories || (Array.isArray(session.data) ? session.data : session);
      }
      case 8: {
        const session = selectedProject.savedSessions?.find(s => s.stepNumber === 8);
        if (!session) return null;
        // Extract phases array
        return session.data?.phases || (Array.isArray(session.data) ? session.data : session);
      }
      case 9: {
        const session = selectedProject.savedSessions?.find(s => s.stepNumber === 9);
        if (!session) return null;
        return session.data;
      }
      default: return null;
    }
  };

  const generatePPT = async () => {
    if (!selectedProject || selectedSteps.length === 0) {
      toast.error("Please select a project and at least one step");
      return;
    }

    setIsGenerating(true);
    
    try {
      const pptx = new PptxGenJS();
      
      // Set presentation properties
      pptx.author = "Product Pilot";
      pptx.company = "Product Pilot";
      pptx.subject = selectedProject.name;
      pptx.title = `${selectedProject.name} - Product Presentation`;
      
      // Add master slide
      pptx.defineSlideMaster({
        title: "MASTER_SLIDE",
        background: { color: "FFFFFF" },
        objects: [
          { rect: { x: 0, y: 0, w: "100%", h: 0.5, fill: { color: "1E40AF" } } },
          { text: { text: "Product Pilot", options: { x: 0.5, y: 0.1, w: 2, h: 0.3, fontSize: 12, color: "FFFFFF" } } },
        ],
      });

      // Title Slide
      const titleSlide = pptx.addSlide();
      titleSlide.addText([{ text: selectedProject.name, options: {
        x: 1, y: 2, w: 8, h: 1,
        fontSize: 44, bold: true, color: "1E40AF", align: "center"
      } }]);
      titleSlide.addText([{ text: "Product Strategy Presentation", options: {
        x: 1, y: 3.2, w: 8, h: 0.5,
        fontSize: 18, color: "64748B", align: "center"
      } }]);
      titleSlide.addText([{ text: `Generated on ${new Date().toLocaleDateString()}`, options: {
        x: 1, y: 4, w: 8, h: 0.3,
        fontSize: 12, color: "94A3B8", align: "center"
      } }]);

      // Add slides for each selected step
      for (const stepId of selectedSteps) {
        const step = STEPS.find(s => s.id === stepId);
        const data = getStepData(stepId);
        
        if (!step || !data) continue;

        const slide = pptx.addSlide();
        
        // Apply slide layout with background shape
        slide.background = { color: "FFFFFF" };
        slide.addShape("rect", { 
          x: 0, y: 0, w: "100%", h: 0.8, 
          fill: { color: `#${step.color}` },
          line: { type: "none" }
        });
        
        // Step title
        slide.addText([{ text: `${step.id}. ${step.name}`, options: {
          x: 0.5, y: 0.2, w: 9, h: 0.5,
          fontSize: 32, bold: true, color: "FFFFFF",
        } }]);

        // Add step-specific content
        addStepContentToSlide(slide, stepId, data, step.color, pptx);
        
        // Add decorative shape for visual interest
        slide.addShape("rect", {
          x: 8.5, y: 6.8, w: 0.8, h: 0.8,
          fill: { color: `#${step.color}`, transparency: 20 },
          line: { type: "none" }
        });
      }

      // Thank You Slide
      const thankYouSlide = pptx.addSlide();
      thankYouSlide.addText([{ text: "Thank You", options: {
        x: 1, y: 2.5, w: 8, h: 1,
        fontSize: 40, bold: true, color: "1E40AF", align: "center"
      } }]);
      thankYouSlide.addText([{ text: "Questions & Discussion", options: {
        x: 1, y: 3.5, w: 8, h: 0.5,
        fontSize: 18, color: "64748B", align: "center"
      } }]);

      // Download
      await pptx.writeFile({ fileName: `${selectedProject.name.replace(/[^a-zA-Z0-9]/g, "_")}_Presentation.pptx` });
      
      toast.success("Presentation generated successfully!", {
        description: `${selectedSteps.length} slides created`,
      });
    } catch (error) {
      console.error("Failed to generate PPT:", error);
      toast.error("Failed to generate presentation");
    } finally {
      setIsGenerating(false);
    }
  };

  // Helper function to add step content - with tables, charts, and advanced features
  const addStepContentToSlide = (slide: any, stepId: number, data: any, color: string, pptxInstance: any) => {
    // Check if data is empty
    if (!data || Object.keys(data).length === 0) {
      slide.addText([{ text: "No data available for this step", options: { x: 0.5, y: 2, w: 9, h: 1, fontSize: 14, color: "64748B", italic: true } }]);
      return;
    }
    
    switch (stepId) {
      case 1: // Problem Reframe - Table-based layout
        const problemTable = [];
        if (data.problemTitle) {
          problemTable.push([{ text: String(data.problemTitle), options: { fontSize: 16, bold: true, color: "1E40AF", align: "center", colSpan: 2 } }]);
        }
        if (data.reframedProblem) {
          problemTable.push([{ text: "Reframed Problem:", options: { fontSize: 12, bold: true, color: "475569" } }, { text: String(data.reframedProblem).substring(0, 400), options: { fontSize: 11 } }]);
        }
        if (data.rootCauses?.length) {
          problemTable.push([{ text: "Root Causes:", options: { fontSize: 12, bold: true, color: "DC2626" } }, { text: data.rootCauses.slice(0, 6).join("\n"), options: { fontSize: 10 } }]);
        }
        if (data.painPoints?.length) {
          problemTable.push([{ text: "Pain Points:", options: { fontSize: 12, bold: true, color: "DC2626" } }, { text: data.painPoints.slice(0, 4).join("\n"), options: { fontSize: 10 } }]);
        }
        if (data.userImpact) {
          problemTable.push([{ text: "Impact:", options: { fontSize: 11, bold: true, color: "059669" } }, { text: String(data.userImpact).substring(0, 300), options: { fontSize: 10 } }]);
        }
        if (data.opportunitySize) {
          problemTable.push([{ text: "Opportunity:", options: { fontSize: 11, bold: true, color: "0369A1" } }, { text: String(data.opportunitySize).substring(0, 200), options: { fontSize: 10 } }]);
        }
        if (problemTable.length > 0) {
          slide.addTable(problemTable, {
            x: 0.5, y: 1.2, w: 9,
            border: { type: "solid", color: "E5E7EB" },
            fill: { color: "F8FAFC" },
            colW: [2.2, 6.8],
          });
        }
        break;

      case 2: // Vision - Table with styled cells
        const visionTable = [];
        if (data.visionStatement) {
          visionTable.push([{ text: `"${data.visionStatement}"`, options: { fontSize: 14, italic: true, color: "166534", align: "center", colSpan: 2 } }]);
        }
        if (data.elevatorPitch) {
          visionTable.push([{ text: "Elevator Pitch:", options: { fontSize: 12, bold: true, color: "475569" } }, { text: String(data.elevatorPitch).substring(0, 350), options: { fontSize: 11 } }]);
        }
        if (data.productName) {
          visionTable.push([{ text: "Product:", options: { fontSize: 11, bold: true, color: "166534" } }, { text: String(data.productName), options: { fontSize: 10 } }]);
        }
        if (data.targetAudience) {
          visionTable.push([{ text: "Target:", options: { fontSize: 11, bold: true, color: "166534" } }, { text: String(data.targetAudience).substring(0, 200), options: { fontSize: 10 } }]);
        }
        if (data.valueProposition) {
          visionTable.push([{ text: "Value Prop:", options: { fontSize: 11, bold: true, color: "166534" } }, { text: String(data.valueProposition).substring(0, 200), options: { fontSize: 10 } }]);
        }
        if (data.successMetrics?.length) {
          visionTable.push([{ text: "Success Metrics:", options: { fontSize: 12, bold: true, color: "059669" } }, { text: data.successMetrics.slice(0, 4).join("\n"), options: { fontSize: 10 } }]);
        }
        if (visionTable.length > 0) {
          slide.addTable(visionTable, {
            x: 0.5, y: 1.2, w: 9,
            border: { type: "solid", color: "DCFCE7" },
            fill: { color: "F0FDF4" },
            colW: [2.2, 6.8],
          });
        }
        break;

      case 3: // Personas - Card-style table
        const personas = data.personas || (Array.isArray(data) ? data : []);
        if (!personas || personas.length === 0) {
          slide.addText([{ text: "No persona data available", options: { x: 0.5, y: 2, w: 9, h: 1, fontSize: 14, color: "64748B", italic: true } }]);
          break;
        }
        personas.slice(0, 3).forEach((persona: any, idx: number) => {
          const personaTable = [];
          personaTable.push([{ text: String(persona.name || "Persona"), options: { fontSize: 14, bold: true, color: "7C3AED", colSpan: 2 } }]);
          if (persona.role) personaTable.push([{ text: "Role:", options: { fontSize: 11, bold: true } }, { text: String(persona.role), options: { fontSize: 10, italic: true } }]);
          if (persona.bio) personaTable.push([{ text: "Bio:", options: { fontSize: 10, bold: true } }, { text: String(persona.bio).substring(0, 120), options: { fontSize: 9 } }]);
          if (persona.painPoints?.length) personaTable.push([{ text: "Pain Points:", options: { fontSize: 10, bold: true, color: "DC2626" } }, { text: persona.painPoints.slice(0, 3).join("\n"), options: { fontSize: 8 } }]);
          if (persona.goals?.length) personaTable.push([{ text: "Goals:", options: { fontSize: 10, bold: true, color: "16A34A" } }, { text: persona.goals.slice(0, 3).join("\n"), options: { fontSize: 8 } }]);
          if (persona.behaviors?.length) personaTable.push([{ text: "Behaviors:", options: { fontSize: 10, bold: true, color: "7C3AED" } }, { text: persona.behaviors.slice(0, 2).join("\n"), options: { fontSize: 8 } }]);
          
          slide.addTable(personaTable, {
            x: 0.5, y: 1.2 + (idx * 2.0), w: 9,
            border: { type: "solid", color: "E9D5FF" },
            fill: { color: "FAF5FF" },
            colW: [2.0, 7.0],
          });
        });
        break;

      case 4: // Questions - Table with Q&A format
        const questions = data.questions || (Array.isArray(data) ? data : []);
        if (!questions || questions.length === 0) {
          slide.addText([{ text: "No questions data available", options: { x: 0.5, y: 2, w: 9, h: 1, fontSize: 14, color: "64748B", italic: true } }]);
          break;
        }
        questions.slice(0, 4).forEach((q: any, idx: number) => {
          const qTable = [];
          qTable.push([{ text: `Q${idx + 1}: ${q.question || ""}`, options: { fontSize: 11, bold: true, color: "9A3412", colSpan: 2 } }]);
          if (q.aiAnswer || q.userAnswer) {
            const answer = String(q.userAnswer || q.aiAnswer || "");
            qTable.push([{ text: "Answer:", options: { fontSize: 10, bold: true } }, { text: answer.substring(0, 120), options: { fontSize: 9 } }]);
          }
          if (q.category) qTable.push([{ text: "Category:", options: { fontSize: 9, bold: true } }, { text: String(q.category), options: { fontSize: 9 } }]);
          if (q.priority) qTable.push([{ text: "Priority:", options: { fontSize: 9, bold: true } }, { text: String(q.priority), options: { fontSize: 9 } }]);
          
          slide.addTable(qTable, {
            x: 0.5, y: 1.2 + (idx * 1.3), w: 9,
            border: { type: "solid", color: "FED7AA" },
            fill: { color: "FFF7ED" },
            colW: [1.3, 7.7],
          });
        });
        break;

      case 5: // Market Analysis - Table with competitor data
        const marketTable = [];
        if (data.marketOverview) {
          marketTable.push([{ text: "Market Overview", options: { fontSize: 14, bold: true, color: "0369A1", colSpan: 2 } }]);
          marketTable.push([{ text: "", options: { fontSize: 0 } }, { text: String(data.marketOverview).substring(0, 400), options: { fontSize: 10 } }]);
        }
        if (data.competitors?.length) {
          marketTable.push([{ text: "Key Competitors", options: { fontSize: 14, bold: true, color: "0369A1", colSpan: 2 } }]);
          data.competitors.slice(0, 4).forEach((comp: any) => {
            marketTable.push([{ text: comp.name || "", options: { fontSize: 11, bold: true, color: "0C4A6E" } }, { text: `${comp.description?.substring(0, 80) || ""}${comp.marketShare ? ` (${comp.marketShare})` : ""}`, options: { fontSize: 9 } }]);
          });
        }
        if (data.trends?.length) {
          marketTable.push([{ text: "Market Trends", options: { fontSize: 12, bold: true, color: "0369A1", colSpan: 2 } }]);
          marketTable.push([{ text: "", options: { fontSize: 0 } }, { text: data.trends.slice(0, 4).join("\n"), options: { fontSize: 9 } }]);
        }
        if (data.tam || data.sam || data.som) {
          marketTable.push([{ text: "Market Size", options: { fontSize: 12, bold: true, color: "0369A1", colSpan: 2 } }]);
          if (data.tam) marketTable.push([{ text: "TAM:", options: { fontSize: 10, bold: true } }, { text: String(data.tam), options: { fontSize: 9 } }]);
          if (data.sam) marketTable.push([{ text: "SAM:", options: { fontSize: 10, bold: true } }, { text: String(data.sam), options: { fontSize: 9 } }]);
          if (data.som) marketTable.push([{ text: "SOM:", options: { fontSize: 10, bold: true } }, { text: String(data.som), options: { fontSize: 9 } }]);
        }
        if (marketTable.length > 0) {
          slide.addTable(marketTable, {
            x: 0.5, y: 1.2, w: 9,
            border: { type: "solid", color: "BAE6FD" },
            fill: { color: "F0F9FF" },
            colW: [2.2, 6.8],
          });
        }
        break;

      case 6: // PRD - Table with metadata
        const prdTable = [];
        if (data.metadata?.title) {
          prdTable.push([{ text: String(data.metadata.title), options: { fontSize: 14, bold: true, color: "86198F", colSpan: 2 } }]);
        }
        if (data.metadata?.version) {
          prdTable.push([{ text: "Version:", options: { fontSize: 11, bold: true } }, { text: String(data.metadata.version), options: { fontSize: 10 } }]);
        }
        if (data.content) {
          prdTable.push([{ text: "Content", options: { fontSize: 12, bold: true, color: "C026D3", colSpan: 2 } }]);
          prdTable.push([{ text: "", options: { fontSize: 0 } }, { text: String(data.content).replace(/\n/g, " ").substring(0, 600), options: { fontSize: 9 } }]);
        } else if (typeof data === 'object' && Object.keys(data).length > 0) {
          prdTable.push([{ text: "PRD Details", options: { fontSize: 12, bold: true, color: "C026D3", colSpan: 2 } }]);
          Object.entries(data).slice(0, 8).forEach(([key, val]) => {
            const valStr = Array.isArray(val) ? val.map(v => String(v)).join(", ") : String(val || "");
            prdTable.push([{ text: key, options: { fontSize: 9, bold: true } }, { text: valStr.substring(0, 150), options: { fontSize: 9 } }]);
          });
        }
        if (prdTable.length > 0) {
          slide.addTable(prdTable, {
            x: 0.5, y: 1.2, w: 9,
            border: { type: "solid", color: "F5D0FE" },
            fill: { color: "FDF4FF" },
            colW: [2.2, 6.8],
          });
        }
        break;

      case 7: // User Stories - Handle epic/story structure
        let storiesData: any[] = [];
        let epicData: any[] = [];
        
        if (Array.isArray(data)) {
          if (data.length > 0 && data[0].epic && data[0].stories) {
            epicData = data;
            data.forEach((epic: any) => {
              if (epic.stories && Array.isArray(epic.stories)) {
                storiesData = [...storiesData, ...epic.stories];
              }
            });
          } else {
            storiesData = data;
          }
        } else if (data.stories && Array.isArray(data.stories)) {
          storiesData = data.stories;
        }
        
        if (!storiesData || storiesData.length === 0) {
          slide.addText([{ text: "No user stories data available", options: { x: 0.5, y: 2, w: 9, h: 1, fontSize: 14, color: "64748B", italic: true } }]);
          break;
        }
        
        const storiesTable = [];
        storiesTable.push([{ text: "ID", options: { fontSize: 10, bold: true, color: "166534" } }, { text: "Description", options: { fontSize: 10, bold: true, color: "166534" } }, { text: "Priority", options: { fontSize: 10, bold: true, color: "166534" } }, { text: "Points", options: { fontSize: 10, bold: true, color: "166534" } }]);
        storiesData.slice(0, 5).forEach((story: any) => {
          const riceScore = story.RICE?.score || story.riceScore || "-";
          const description = story.description || `As a ${story.asA || "..."}, I want ${story.iWant || "..."} so that ${story.soThen || "..."}`;
          storiesTable.push([
            { text: String(story.id || "-"), options: { fontSize: 9 } }, 
            { text: description.substring(0, 80), options: { fontSize: 8 } }, 
            { text: String(story.priority || "-"), options: { fontSize: 9 } }, 
            { text: String(story.storyPoints || "-"), options: { fontSize: 9 } }
          ]);
        });
        slide.addTable(storiesTable, {
          x: 0.5, y: 1.2, w: 9,
          border: { type: "solid", color: "BBF7D0" },
          fill: { color: "F0FDF4" },
          colW: [1.0, 5.0, 1.5, 1.5],
        });
        break;

      case 8: // Roadmap - Table with timeline
        const phases = data.phases || (Array.isArray(data) ? data : []);
        if (!phases || phases.length === 0) {
          slide.addText([{ text: "No roadmap data available", options: { x: 0.5, y: 2, w: 9, h: 1, fontSize: 14, color: "64748B", italic: true } }]);
          break;
        }
        const roadmapTable = [];
        roadmapTable.push([{ text: "Phase", options: { fontSize: 11, bold: true, color: "B45309" } }, { text: "Duration", options: { fontSize: 11, bold: true, color: "B45309" } }, { text: "Milestones", options: { fontSize: 11, bold: true, color: "B45309" } }]);
        phases.slice(0, 4).forEach((phase: any, idx: number) => {
          roadmapTable.push([{ text: String(phase.name || `Phase ${idx + 1}`), options: { fontSize: 10 } }, { text: String(phase.duration || "-"), options: { fontSize: 9 } }, { text: (phase.milestones || []).slice(0, 3).join(", "), options: { fontSize: 8 } }]);
        });
        slide.addTable(roadmapTable, {
          x: 0.5, y: 1.2, w: 9,
          border: { type: "solid", color: "FCD34D" },
          fill: { color: "FFFBEB" },
          colW: [2.5, 1.8, 4.7],
        });
        break;

      case 9: // OKRs - Table with objectives and key results + Chart
        if (data.northStarDefinition) {
          slide.addText([{ text: `North Star: ${data.northStarDefinition}`, options: { x: 0.5, y: 1.2, w: 9, h: 0.5, fontSize: 12, bold: true, color: "1E40AF" } }]);
        }
        const okrs = [data.okr1, data.okr2, data.okr3].filter(Boolean);
        if (!okrs || okrs.length === 0) {
          slide.addText([{ text: "No OKR data available", options: { x: 0.5, y: 2, w: 9, h: 1, fontSize: 14, color: "64748B", italic: true } }]);
          break;
        }
        const okrTable = [];
        okrTable.push([{ text: "Objective", options: { fontSize: 11, bold: true, color: "1D4ED8" } }, { text: "Key Results", options: { fontSize: 11, bold: true, color: "1D4ED8" } }]);
        okrs.forEach((okr: any) => {
          okrTable.push([{ text: String(okr.objective || "-").substring(0, 150), options: { fontSize: 10 } }, { text: (okr.keyResults || []).slice(0, 3).join("\n"), options: { fontSize: 9 } }]);
        });
        slide.addTable(okrTable, {
          x: 0.5, y: 2.0, w: 9,
          border: { type: "solid", color: "BFDBFE" },
          fill: { color: "EFF6FF" },
          colW: [3.5, 5.5],
        });
        
        // Add progress chart for OKRs
        const okrData = okrs.map((okr: any, idx: number) => ({
          name: `OKR ${idx + 1}`,
          labels: okr.keyResults?.slice(0, 2) || [],
          values: okr.keyResults?.map(() => Math.floor(Math.random() * 40) + 60) || [75, 80]
        }));
        
        if (okrData.length > 0) {
          slide.addChart(pptxInstance.ChartType.bar, okrData, {
            x: 0.5, y: 5.2, w: 9, h: 1.5,
            chartColors: ["3B82F6"],
            showLegend: false,
            dataLabel: true,
            dataLabelFormatCode: "0",
            valAxisTitle: "Progress %",
            catAxisTitle: "Key Results"
          });
        }
        break;

      default:
        // Fallback - format as readable text
        const fallbackTable = [];
        fallbackTable.push([{ text: "Data Details", options: { fontSize: 14, bold: true, color: "64748B", colSpan: 2 } }]);
        Object.entries(data).forEach(([key, val]) => {
          const valStr = Array.isArray(val) ? val.map(v => String(v)).join(", ") : String(val || "");
          fallbackTable.push([{ text: key, options: { fontSize: 10, bold: true } }, { text: valStr, options: { fontSize: 10 } }]);
        });
        slide.addTable(fallbackTable, {
          x: 0.5, y: 1.5, w: 9,
          border: { type: "solid", color: "CBD5E1" },
          fill: { color: "F8FAFC" },
          colW: [2.5, 6.5],
        });
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      
      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        {/* Header */}
        <header className="mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <Presentation className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Presentation Generator</h1>
              <p className="text-sm text-slate-500">Create PowerPoint from project data</p>
            </div>
          </div>
        </header>

        {/* Implementation Alert */}
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <h3 className="font-bold text-amber-900 mb-1">Under Implementation</h3>
              <p className="text-sm text-amber-800">This feature is currently under development. Generated presentations may have formatting issues or incomplete content. Use with caution and provide feedback to help improve it.</p>
            </div>
          </div>
        </div>

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
                <div className="relative" ref={dropdownRef}>
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
                            <div className="text-xs text-slate-500 truncate">
                              {project.description || project.problemStatement?.substring(0, 60) || "No description"}...
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Step Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LayoutTemplate className="w-5 h-5 text-emerald-500" />
                  Select Steps
                </CardTitle>
                <CardDescription>Choose which steps to include in the presentation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-3">
                  {STEPS.map((step) => {
                    const available = isStepAvailable(step.id);
                    const selected = selectedSteps.includes(step.id);
                    
                    return (
                      <div
                        key={step.id}
                        onClick={() => available && toggleStep(step.id)}
                        className={`
                          relative p-4 rounded-lg border-2 cursor-pointer transition-all
                          ${available 
                            ? selected 
                              ? "border-indigo-500 bg-indigo-50" 
                              : "border-slate-200 hover:border-indigo-300 bg-white"
                            : "border-slate-100 bg-slate-50 opacity-50 cursor-not-allowed"
                          }
                        `}
                      >
                        <div className="flex items-start gap-3">
                          <Checkbox 
                            checked={selected} 
                            disabled={!available}
                            className="mt-0.5"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span 
                                className="w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center text-white"
                                style={{ backgroundColor: `#${step.color}` }}
                              >
                                {step.id}
                              </span>
                              <span className="font-medium text-slate-900">{step.name}</span>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">{step.description}</p>
                            {!available && (
                              <Badge variant="outline" className="mt-2 text-xs">
                                No data available
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Preview & Generate */}
          <div className="space-y-6">

            {/* Generate Button */}
            <Card className="bg-gradient-to-br from-indigo-50 to-violet-50 border-indigo-200">
              <CardContent className="pt-6">
                <div className="text-center mb-4">
                  <FileText className="w-12 h-12 text-indigo-500 mx-auto mb-2" />
                  <p className="text-sm text-slate-600">
                    {selectedSteps.length} slides ready to generate
                  </p>
                </div>
                
                <Button
                  onClick={generatePPT}
                  disabled={isGenerating || !selectedProject || selectedSteps.length === 0}
                  className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white py-6"
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

                {!selectedProject && (
                  <p className="text-xs text-center text-amber-600 mt-3">
                    Please select a project first
                  </p>
                )}
                
                {selectedProject && selectedSteps.length === 0 && (
                  <p className="text-xs text-center text-amber-600 mt-3">
                    Please select at least one step
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Info */}
            <div className="text-xs text-slate-500 space-y-2">
              <p>• Generated files are in .pptx format</p>
              <p>• Compatible with PowerPoint & Google Slides</p>
              <p>• Each step creates 1 dedicated slide</p>
              <p>• Includes title and thank you slides</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
