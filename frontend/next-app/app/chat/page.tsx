// Chatbot page - RAG-powered chat interface
// Based on WIREFRAMES.md Chatbot Component

"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "@/components/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Send,
  Bot,
  User,
  FileText,
  RefreshCw,
  Trash2,
  Eye,
  CheckCircle,
  Loader2,
  Sparkles,
  ChevronDown,
  Folder,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: string[];
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    role: "assistant",
    content: "Hi! Ask me anything about this project:",
  },
];

interface Project {
  id: string;
  name: string;
  problemStatement: string;
  template: string | null;
  createdAt: string;
  // Step data from pipeline
  phase1Data?: {
    reframe?: {
      problemTitle?: string;
      oneLineSummary?: string;
      problem?: { description?: string; affectedUsers?: string; painPoints?: string };
    } | null;
    vision?: {
      visionStatement?: string;
      missionStatement?: string;
      valueProposition?: string;
    } | null;
  };
  phase2Data?: {
    personas?: { personas?: any[] } | null;
    questions?: { questions?: any[] } | null;
  };
  phase3Data?: {
    marketAnalysis?: any;
  };
  savedSessions?: {
    stepNumber: number;
    data: any;
  }[];
  projectContext?: any;
}

// Load projects from API
async function loadProjects(): Promise<Project[]> {
  try {
    const response = await fetch("/api/projects/list");
    const data = await response.json();
    return data.success ? data.projects : [];
  } catch (error) {
    console.error("Failed to load projects:", error);
    return [];
  }
}

// Get project summary for chat context - includes all 9 steps
function getProjectSummary(project: Project | null): string {
  if (!project) return "No project selected";
  
  const parts = [`Project: ${project.name}`];
  const savedSessions = project.savedSessions || [];
  
  // Step 1: Problem
  if (project.phase1Data?.reframe?.problemTitle) {
    parts.push(`Problem: ${project.phase1Data.reframe.problemTitle}`);
  } else if (project.problemStatement) {
    parts.push(`Problem: ${project.problemStatement}`);
  }
  
  // Step 2: Vision
  if (project.phase1Data?.vision?.visionStatement) {
    parts.push(`Vision: ${project.phase1Data.vision.visionStatement}`);
  }
  
  // Step 3: Personas
  if (project.phase2Data?.personas?.personas?.length) {
    parts.push(`Personas: ${project.phase2Data.personas.personas.map((p: any) => p.overview?.name || p.name).join(", ")}`);
  }
  
  // Step 5: Market Analysis
  if (project.phase3Data?.marketAnalysis) {
    const market = project.phase3Data.marketAnalysis;
    if (market.marketOverview?.marketSize?.totalAddressableMarket) {
      parts.push(`TAM: ${market.marketOverview.marketSize.totalAddressableMarket}`);
    }
  }
  
  // Step 6: PRD
  const prdSession = savedSessions.find(s => s.stepNumber === 6 && "appendix" in s.data);
  if (prdSession) {
    const prd = prdSession.data;
    parts.push(`PRD: ${prd.title || "Product Requirements Document completed"}`);
  }
  
  // Step 7: User Stories
  const storiesSession = savedSessions.find(s => s.stepNumber === 7 && "stories" in s.data);
  if (storiesSession) {
    const stories = storiesSession.data;
    if (stories.stories?.length) {
      parts.push(`User Stories: ${stories.stories.length} stories defined`);
    }
  }
  
  // Step 8: Roadmap
  const roadmapSession = savedSessions.find(s => s.stepNumber === 8 && "phases" in s.data);
  if (roadmapSession) {
    const roadmap = roadmapSession.data;
    if (roadmap.phases?.length) {
      parts.push(`Roadmap: ${roadmap.phases.length} phases planned`);
    }
  }
  
  // Step 9: OKRs
  const okrSession = savedSessions.find(s => s.stepNumber === 9 && "okr1" in s.data);
  if (okrSession) {
    const okrs = okrSession.data;
    if (okrs.okr1?.objective) {
      parts.push(`OKR 1: ${okrs.okr1.objective}`);
    }
  }
  
  return parts.join("\n");
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [ragStatus, setRagStatus] = useState<"ready" | "indexing" | "error">("ready");
  const [vectorCount, setVectorCount] = useState(45);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load projects on mount
  useEffect(() => {
    async function init() {
      const loadedProjects = await loadProjects();
      setProjects(loadedProjects);
      if (loadedProjects.length > 0) {
        setSelectedProject(loadedProjects[0]);
      }
    }
    init();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Call the chat API with project context
    try {
      const project = selectedProject;
      
      if (!project) {
        const response: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Please select a project first to get context-aware responses.",
        };
        setMessages((prev) => [...prev, response]);
        setIsLoading(false);
        return;
      }

      // Check if project has generated data
      const hasPhaseData = project.phase1Data?.reframe || project.phase2Data?.personas || project.phase3Data?.marketAnalysis;
      const hasSavedSessions = project.savedSessions && project.savedSessions.length > 0;
      const hasData = hasPhaseData || hasSavedSessions;
      
      if (!hasData) {
        const response: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "This project doesn't have any generated data yet. Please complete the pipeline steps first:\n\n1. Go to the project page\n2. Complete Step 1 (Reframe Problem)\n3. Complete Step 2 (Write Vision)\n4. Continue through the remaining steps to generate data\n\nOnce you have generated data for at least one step, I'll be able to provide context-aware answers about your project.",
        };
        setMessages((prev) => [...prev, response]);
        setIsLoading(false);
        return;
      }

      // Build project context for the API
      const projectContext = {
        phase1Data: project.phase1Data,
        phase2Data: project.phase2Data,
        phase3Data: project.phase3Data,
        savedSessions: project.savedSessions,
      };

      // Call chat API
      const apiResponse = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          projectId: project.id,
          projectContext,
        }),
      });

      if (!apiResponse.ok) {
        throw new Error("Failed to get chat response");
      }

      const data = await apiResponse.json();

      const response: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response || "Sorry, I couldn't generate a response.",
        sources: data.sources,
      };

      setMessages((prev) => [...prev, response]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error while processing your question. Please try again.",
      };
      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowProjectDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
    setShowProjectDropdown(false);
    
    // Build context-aware welcome message with actual project data
    const summary = getProjectSummary(project);
    const hasPhaseData = project.phase1Data?.reframe || project.phase2Data?.personas;
    const hasSavedSessions = project.savedSessions && project.savedSessions.length > 0;
    const hasData = hasPhaseData || hasSavedSessions;
    
    let welcomeMessage = `**${project.name}**\n\n`;
    welcomeMessage += "```\n" + summary + "\n```\n\n";
    
    if (hasData) {
      welcomeMessage += "I have access to all your project data across all 9 pipeline steps. Ask me anything!\n\n";
      welcomeMessage += "**Example Questions:**\n";
      welcomeMessage += "• What are the key pain points? (Step 1)\n";
      welcomeMessage += "• Tell me about the user personas (Step 3)\n";
      welcomeMessage += "• What is our value proposition? (Step 2)\n";
      welcomeMessage += "• Show me the PRD features (Step 6)\n";
      welcomeMessage += "• What user stories are defined? (Step 7)\n";
      welcomeMessage += "• Show me the roadmap (Step 8)\n";
      welcomeMessage += "• What are our OKRs? (Step 9)\n";
      welcomeMessage += "• Who are our competitors? (Step 5)";
    } else {
      welcomeMessage += "This project doesn't have pipeline data yet. Complete the pipeline steps to enable full RAG functionality!";
    }
    
    // Reset messages when switching projects
    setMessages([{
      id: `welcome-${selectedProject?.id || 'new'}-${Math.random().toString(36).substring(2, 9)}`,
      role: "assistant",
      content: welcomeMessage,
    }]);
  };

  return (
    <div className="min-h-screen flex">
      <Sidebar projectId={selectedProject?.id} />

      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header */}
        <header className="border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-slate-900">Project Chatbot</h1>
            </div>
          </div>
          <Badge
            variant={ragStatus === "ready" ? "default" : "secondary"}
            className={
              ragStatus === "ready"
                ? "bg-emerald-100 text-emerald-700"
                : "bg-amber-100 text-amber-700"
            }
          >
            {ragStatus === "ready" ? (
              <>
                <CheckCircle className="w-3 h-3 mr-1" />
                Ready
              </>
            ) : (
              <>
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                Indexing...
              </>
            )}
          </Badge>
        </header>

        <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
          {/* Project Selector - Centered */}
          <div className="py-4 flex justify-center" ref={dropdownRef}>
            <div className="relative w-72">
              <button
                onClick={() => setShowProjectDropdown(!showProjectDropdown)}
                disabled={projects.length === 0}
                className="w-full flex items-center justify-between gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:border-indigo-300 hover:text-indigo-600 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <Folder className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">
                    {selectedProject ? selectedProject.name : (projects.length === 0 ? "No projects" : "Select project")}
                  </span>
                </div>
                <ChevronDown className={`w-4 h-4 flex-shrink-0 transition-transform ${showProjectDropdown ? "rotate-180" : ""}`} />
              </button>
              {showProjectDropdown && projects.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                  <div className="py-1">
                    <p className="px-3 py-2 text-xs text-slate-400 font-medium border-b border-slate-100">
                      Select Project ({projects.length} available)
                    </p>
                    {projects.map((project) => (
                      <button
                        key={project.id}
                        onClick={() => handleProjectSelect(project)}
                        className={`w-full text-left px-3 py-3 hover:bg-slate-50 border-b border-slate-50 last:border-0 ${
                          selectedProject?.id === project.id ? "bg-indigo-50" : ""
                        }`}
                      >
                        <p className={`font-medium text-sm truncate ${
                          selectedProject?.id === project.id ? "text-indigo-700" : "text-slate-900"
                        }`}>
                          {project.name}
                        </p>
                        <p className="text-xs text-slate-500 line-clamp-1 mt-1">
                          {project.problemStatement}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Chat Window */}
          <ScrollArea className="flex-1 p-6 relative" ref={scrollRef}>
            <div className="space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-4 ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] ${
                      message.role === "user" ? "bg-indigo-500 text-white" : "bg-white border border-slate-200"
                    } rounded-lg p-4 shadow-sm`}
                  >
                    <div className={`text-sm whitespace-pre-wrap ${message.role === "assistant" ? "text-slate-800" : ""}`}>{message.content}</div>

                    {message.sources && message.sources.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-200">
                        <p className="text-xs text-slate-500 flex items-center gap-1 mb-2">
                          <FileText className="w-3 h-3" />
                          Sources:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {message.sources.map((source, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {source}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {message.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-slate-700" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-4 justify-start">
                  <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white border border-slate-200 rounded-lg p-4 flex items-center gap-2 shadow-sm">
                    <Loader2 className="w-4 h-4 animate-spin text-slate-600" />
                    <span className="text-sm text-slate-600">Thinking...</span>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="p-6 border-t border-slate-200">
            <div className="flex gap-2">
              <Input
                placeholder="Type your question about the project..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="bg-white border-slate-300"
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="bg-indigo-500 hover:bg-indigo-600"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* RAG Controls */}
          <Card className="m-6 mt-0 bg-white border-slate-200 shadow-sm">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm">
                <span className="text-slate-600">
                  Status:{" "}
                  <span className="text-emerald-600">Ready ({vectorCount} vectors indexed)</span>
                </span>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Eye className="w-4 h-4" />
                  View Sources
                </Button>
                <Button variant="ghost" size="sm" className="gap-2 text-rose-500 hover:text-rose-600">
                  <Trash2 className="w-4 h-4" />
                  Delete RAG
                </Button>
                <Button variant="ghost" size="sm" className="gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Re-index
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
