// Sidebar component - Navigation sidebar
// Based on WIREFRAMES.md

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LayoutDashboard,
  FolderKanban,
  Settings,
  Sparkles,
  MessageSquare,
  ChevronRight,
  Wrench,
  Video,
  FileText,
  Code,
  ListTodo,
  ExternalLink,
  Presentation,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Projects", href: "/projects", icon: FolderKanban },
  { name: "Chat", href: "/chat", icon: MessageSquare },
  { name: "Presentation", href: "/presentation", icon: Presentation },
  { name: "Settings", href: "/settings", icon: Settings },
];

const pipelineSteps = [
  { id: 1, name: "Reframe", label: "1. Problem" },
  { id: 2, name: "Vision", label: "2. Vision" },
  { id: 3, name: "Persona", label: "3. Personas" },
  { id: 4, name: "Question", label: "4. Q&A" },
  { id: 5, name: "Market", label: "5. Market" },
  { id: 6, name: "PRD", label: "6. PRD" },
  { id: 7, name: "Stories", label: "7. Stories" },
  { id: 8, name: "Roadmap", label: "8. Roadmap" },
  { id: 9, name: "OKRs", label: "9. OKRs" },
];

// Toolkit items - external tools
const toolkitItems = [
  { name: "MeetingPro AI", href: "https://asankhua.github.io/meetingpro-ai/", icon: Video },
  { name: "PDF/Doc Generator", href: "https://asankhua.github.io/ConvertFlow-PDF-Doc-Generator/", icon: FileText },
  { name: "Engineer Prompt", href: "https://asankhua.github.io/engineer-toolkit/", icon: Code },
  { name: "Backlog Manager", href: "https://asankhua.github.io/agile-backlog-manager/", icon: ListTodo },
  { name: "Prompt Builder", href: "https://asankhua.github.io/prompt-builder/", icon: Sparkles },
];

interface SidebarProps {
  currentStep?: number;
  projectId?: string;
  onStepClick?: (stepId: number) => void;
  maxCompletedStep?: number;
}

export function Sidebar({ currentStep, projectId, onStepClick, maxCompletedStep }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className="w-64 border-r border-slate-200 bg-white flex flex-col h-screen relative">
      {/* Logo */}
      <div className="p-4 border-b border-slate-200">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold text-lg text-slate-900">Product Pilot</span>
        </Link>
      </div>

      <ScrollArea className="flex-1 relative">
        {/* Main Navigation */}
        <div className="p-4 space-y-1">
          {navItems.map((item) => (
            <Link key={item.name} href={item.href}>
              <Button
                variant={pathname === item.href ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-2",
                  pathname === item.href && "bg-slate-100"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Button>
            </Link>
          ))}
        </div>

        {/* Advanced Tools Section - Only show on Dashboard */}
        {pathname === "/dashboard" && (
          <div className="p-4 border-t border-slate-200">
            <h3 className="text-xs font-semibold text-slate-500 uppercase mb-2 flex items-center gap-1">
              <Wrench className="w-3 h-3" />
              Advanced Tools
            </h3>
            <div className="space-y-1">
              {toolkitItems.map((tool) => (
                <a
                  key={tool.name}
                  href={tool.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start gap-2 text-sm text-slate-700 hover:text-indigo-600 hover:bg-indigo-50"
                  >
                    <tool.icon className="w-4 h-4" />
                    <span className="truncate">{tool.name}</span>
                    <ExternalLink className="w-3 h-3 ml-auto text-slate-400" />
                  </Button>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Pipeline Steps - Only show if projectId provided and not on Chat page */}
        {projectId && pathname !== "/chat" && (
          <div className="p-4 border-t border-slate-200">
            <h3 className="text-xs font-semibold text-slate-500 uppercase mb-2">
              Pipeline Steps
            </h3>
            <div className="space-y-1">
              {pipelineSteps.map((step) => {
                const isActive = currentStep === step.id;
                const isCompleted = maxCompletedStep !== undefined
                  ? maxCompletedStep >= step.id
                  : (currentStep && currentStep > step.id);
                const isClickable = isCompleted || isActive || (maxCompletedStep !== undefined && step.id <= (maxCompletedStep + 1));

                return (
                  <Button
                    key={step.id}
                    variant="ghost"
                    size="sm"
                    onClick={() => onStepClick?.(step.id)}
                    disabled={!isClickable && !!onStepClick}
                    className={cn(
                      "w-full justify-start gap-2 text-sm",
                      isActive && "bg-indigo-100 text-indigo-600",
                      isCompleted && "text-emerald-600",
                      !isClickable && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <div
                      className={cn(
                        "w-4 h-4 rounded-full flex items-center justify-center text-xs",
                        isActive && "bg-indigo-500 text-white",
                        isCompleted && "bg-emerald-500 text-white",
                        !isActive && !isCompleted && "bg-slate-200"
                      )}
                    >
                      {isCompleted ? "✓" : step.id}
                    </div>
                    <span className="truncate">{step.label}</span>
                    {isActive && (
                      <ChevronRight className="w-3 h-3 ml-auto" />
                    )}
                  </Button>
                );
              })}
            </div>
          </div>
        )}
      </ScrollArea>

    </div>
  );
}
