// New Project page - Product Pilot
// Based on WIREFRAMES.md Screen 3

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "@/components/sidebar";
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  FileText,
  Smartphone,
  Store,
  Building,
  Code,
  Wand2,
} from "lucide-react";

const templates = [
  {
    name: "SaaS Product",
    icon: Code,
    projectName: "Analytics Dashboard for E-commerce",
    problemStatement: `CUSTOMER PROBLEM:
Small e-commerce businesses struggle to understand customer behavior and sales patterns. They currently rely on spreadsheets or expensive enterprise analytics tools that are too complex for their needs.

BUSINESS IMPACT:
- 40% of SMBs abandon analytics tools due to complexity
- Lost revenue opportunity: $2M ARR potential in target segment
- Customer churn rate of 25% for lack of insights

TARGET AUDIENCE:
- E-commerce store owners (1-50 employees)
- Marketing managers at SMBs
- Operations teams needing quick insights

SUCCESS CRITERIA:
- Reduce time-to-insight from 2 hours to 5 minutes
- Achieve 80% daily active user rate
- 50% reduction in customer support tickets
- $100K MRR within 12 months`,
  },
  {
    name: "Mobile App",
    icon: Smartphone,
    projectName: "Mindfulness & Meditation App",
    problemStatement: `CUSTOMER PROBLEM:
Working professionals struggle with stress and anxiety but find existing meditation apps too time-consuming or spiritually-focused. They need quick, science-based stress relief that fits into busy schedules.

BUSINESS IMPACT:
- 73% of professionals report workplace stress
- Mental health apps market growing 16% annually
- Average user retention for meditation apps is only 15%

TARGET AUDIENCE:
- Ages 25-45 working professionals
- Commuters with 15-30 min daily availability
- People new to meditation seeking secular approach

SUCCESS CRITERIA:
- 10-minute daily session completion rate >60%
- 30-day retention rate of 40%+
- 4.5+ app store rating
- 100K downloads in first 6 months`,
  },
  {
    name: "Marketplace",
    icon: Store,
    projectName: "Local Home Services Marketplace",
    problemStatement: `CUSTOMER PROBLEM:
Homeowners struggle to find reliable, vetted service providers (plumbers, electricians, cleaners) quickly. Current solutions are fragmented across Facebook groups, local classifieds, or expensive franchise services.

BUSINESS IMPACT:
- Home services market: $500B+ globally
- Average homeowner spends $3K annually on repairs
- 60% of service requests go unfulfilled due to lack of trusted providers

TARGET AUDIENCE:
- Homeowners aged 30-55
- Property managers with multiple units
- Emergency repair seekers needing same-day service

SUCCESS CRITERIA:
- Match homeowner to provider within 2 hours
- Provider rating of 4.5+ stars
- 30% month-over-month transaction growth
- $1M GMV within first year`,
  },
  {
    name: "Internal Tool",
    icon: Building,
    projectName: "Employee Onboarding Portal",
    problemStatement: `CUSTOMER PROBLEM:
HR teams spend 20+ hours per new hire on manual onboarding tasks. New employees feel lost, paperwork gets lost, and compliance requirements are often missed. Current process uses email, spreadsheets, and shared drives.

BUSINESS IMPACT:
- Average onboarding time: 5 days (industry best: 1 day)
- 40% of new hires report poor onboarding experience
- Compliance violations cost company $50K annually
- HR productivity loss: 30% of time on admin tasks

TARGET AUDIENCE:
- HR managers at mid-size companies (50-500 employees)
- Department heads hiring frequently
- New employees in their first 90 days

SUCCESS CRITERIA:
- Reduce onboarding time to under 4 hours
- 95% compliance completion rate
- New hire satisfaction score >4.5/5
- HR admin time reduced by 70%`,
  },
  {
    name: "API Platform",
    icon: Code,
    projectName: "Payment Gateway API",
    problemStatement: `CUSTOMER PROBLEM:
Developers struggle with existing payment APIs that are poorly documented, have inconsistent error handling, and lack modern features like instant payouts and multi-currency support.

BUSINESS IMPACT:
- Payment processing market: $2T annually
- Developer friction causes 30% integration abandonment
- Average integration time: 3 weeks (target: 3 days)

TARGET AUDIENCE:
- SaaS developers building billing systems
- Marketplace operators needing split payments
- Fintech startups requiring white-label solutions

SUCCESS CRITERIA:
- Integration time under 3 days
- 99.99% API uptime
- <100ms average response time
- Process $10M monthly volume within 12 months`,
  },
  {
    name: "Custom",
    icon: Wand2,
    projectName: "",
    problemStatement: "",
  },
];

// Sample problem statement from previous session
const SAMPLE_PROBLEM_STATEMENT = `CUSTOMER PROBLEM:
Users are dropping off during the checkout process, specifically at the payment step. Analytics show 65% of users who add items to cart never complete the purchase.

BUSINESS IMPACT:
- Estimated revenue loss: $50K/month
- Cart abandonment rate increased from 45% to 65% in last quarter
- Customer support tickets about checkout issues up 40%

TARGET AUDIENCE:
- Primarily affects mobile users (78% of drop-offs)
- Users on slower connections
- First-time buyers who haven't saved payment info

SUCCESS CRITERIA:
- Reduce cart abandonment from 65% to under 50%
- Increase mobile conversion rate by 25%
- Reduce checkout completion time to under 2 minutes
- Decrease checkout-related support tickets by 50%`;

export default function NewProjectPage() {
  const router = useRouter();
  const [projectName, setProjectName] = useState("");
  const [problemStatement, setProblemStatement] = useState("");
  const [showSample, setShowSample] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const handleLoadSample = () => {
    setProblemStatement(SAMPLE_PROBLEM_STATEMENT);
    setShowSample(false);
  };

  const handleTemplateSelect = (templateName: string) => {
    if (selectedTemplate === templateName) {
      // Deselect if already selected
      setSelectedTemplate(null);
      setProjectName("");
      setProblemStatement("");
    } else {
      // Select template and pre-fill
      setSelectedTemplate(templateName);
      const template = templates.find((t) => t.name === templateName);
      if (template) {
        if (templateName === "Custom") {
          // Custom clears the fields for blank start
          setProjectName("");
          setProblemStatement("");
        } else {
          // Other templates pre-fill the data
          setProjectName(template.projectName);
          setProblemStatement(template.problemStatement);
        }
      }
    }
  };

  const handleStartPipeline = async () => {
    try {
      // Create project with unique ID
      const projectId = Date.now().toString();
      
      // Call API to create project
      const response = await fetch("/api/projects/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          projectName,
          problemStatement,
          template: selectedTemplate,
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to create project");
      }

      // Navigate to project page
      router.push(`/project/${projectId}`);
    } catch (error) {
      console.error("Failed to create project:", error);
      alert("Failed to create project. Please try again.");
    }
  };

  const canStart = projectName.trim() && problemStatement.trim();

  return (
    <div className="min-h-screen flex">
      <Sidebar />

      <main className="flex-1 p-8 overflow-auto relative">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-slate-900">Create New Project</h1>
          </div>

          <div className="space-y-6">
            {/* Project Name */}
            <div>
              <label className="block text-sm font-medium mb-2 text-slate-900">Project Name</label>
              <Input
                placeholder="e.g., Food Delivery App for Tier-2 Cities"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="bg-white border-slate-300"
              />
            </div>

            {/* Problem Statement */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-slate-900">Problem Statement</label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSample(!showSample)}
                  className="gap-2"
                >
                  <FileText className="w-4 h-4" />
                  {showSample ? "Hide Sample" : "Load Sample"}
                </Button>
              </div>

              {/* Sample Preview */}
              {showSample && (
                <Card className="mb-4 bg-amber-50 border-amber-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-amber-700 flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        Sample Problem Statement
                      </h4>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={handleLoadSample}
                      >
                        Use This Sample
                      </Button>
                    </div>
                    <pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans">
                      {SAMPLE_PROBLEM_STATEMENT}
                    </pre>
                  </CardContent>
                </Card>
              )}

              <Textarea
                placeholder="Describe the problem you want to solve. Be specific about customer pain points, business impact, and success criteria."
                value={problemStatement}
                onChange={(e) => setProblemStatement(e.target.value)}
                className="bg-white border-slate-300 min-h-[300px] font-sans leading-relaxed"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-2">
                <span>{problemStatement.length} characters</span>
                <span>
                  {problemStatement.trim().split(/\s+/).filter(Boolean).length} words
                </span>
              </div>
            </div>

            {/* Template Selection */}
            <div>
              <label className="block text-sm font-medium mb-3 text-slate-900">Or choose a template</label>
              <div className="flex flex-wrap gap-2">
                {templates.map((template) => (
                  <Badge
                    key={template.name}
                    variant={selectedTemplate === template.name ? "default" : "secondary"}
                    className="cursor-pointer px-3 py-2 text-sm gap-2"
                    onClick={() => handleTemplateSelect(template.name)}
                  >
                    <template.icon className="w-4 h-4" />
                    {template.name}
                  </Badge>
                ))}
              </div>
              {selectedTemplate && (
                <p className="text-xs text-indigo-600 mt-2">
                  {selectedTemplate === "Custom"
                    ? "Custom template selected. Start with a blank project."
                    : `Template "${selectedTemplate}" loaded. Project name and problem statement pre-filled.`}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-200">
              <Link href="/dashboard">
                <Button variant="outline">Cancel</Button>
              </Link>
              <Button
                onClick={handleStartPipeline}
                disabled={!canStart}
                className="gap-2 bg-indigo-500 hover:bg-indigo-600"
              >
                <Sparkles className="w-4 h-4" />
                Start AI Pipeline
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
