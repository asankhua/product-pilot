// Templates page - Product Pilot

import { Sidebar } from "@/components/sidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Smartphone, Store, Building, Code, Wand2, ArrowRight } from "lucide-react";
import Link from "next/link";

const templates = [
  {
    name: "SaaS Product",
    icon: Code,
    description: "Subscription-based software product with tiered pricing",
    tags: ["B2B", "Recurring Revenue", "Cloud"],
  },
  {
    name: "Mobile App",
    icon: Smartphone,
    description: "iOS/Android application with native or cross-platform approach",
    tags: ["Consumer", "App Store", "Mobile-first"],
  },
  {
    name: "Marketplace",
    icon: Store,
    description: "Two-sided platform connecting buyers and sellers",
    tags: ["Platform", "Network Effects", "Transaction"],
  },
  {
    name: "Internal Tool",
    icon: Building,
    description: "Enterprise software for internal team productivity",
    tags: ["B2E", "Efficiency", "Workflow"],
  },
  {
    name: "API Platform",
    icon: Code,
    description: "Developer-focused API service with documentation",
    tags: ["Developer", "Integration", "Infrastructure"],
  },
  {
    name: "Custom",
    icon: Wand2,
    description: "Build your own custom product from scratch",
    tags: ["Flexible", "Unique", "Bespoke"],
  },
];

export default function TemplatesPage() {
  return (
    <div className="min-h-screen flex">
      <Sidebar />

      <main className="flex-1 p-8 overflow-auto relative">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Templates</h1>
            <p className="text-slate-600 mt-1">
              Choose a template to jumpstart your product definition
            </p>
          </div>

          {/* Template Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <Card key={template.name} className="bg-white border-slate-200 hover:border-indigo-300 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center mb-4">
                    <template.icon className="w-6 h-6 text-indigo-600" />
                  </div>
                  <CardTitle className="text-slate-900">{template.name}</CardTitle>
                  <CardDescription className="text-slate-600">
                    {template.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {template.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Link href="/project/new">
                    <Button variant="outline" className="w-full gap-2">
                      Use Template
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
