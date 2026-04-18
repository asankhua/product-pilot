// Landing page - Product Pilot
// Ultra-modern design with glassmorphism, gradients, and micro-interactions

"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Sparkles,
  FileText,
  GitBranch,
  ArrowRight,
  Zap,
  CheckCircle,
  Rocket,
  Brain,
  Target,
  TrendingUp,
  Users,
  Search,
  Database,
  Workflow,
  Layers,
  Play,
  Menu,
  X,
  ArrowUpRight,
  MessageSquare,
  BarChart3,
  Clock,
  Lightbulb,
  Mic,
  FileCode,
  Wrench,
  Kanban,
  Terminal,
} from "lucide-react";
import { useState, useRef } from "react";
import { Badge } from "@/components/ui/badge";

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  const steps = [
    { 
      num: "01", 
      title: "Reframe Problem", 
      desc: "AI analyzes and restructures your problem statement",
      icon: Lightbulb,
      gradient: "from-amber-400 to-orange-500"
    },
    { 
      num: "02", 
      title: "Product Vision", 
      desc: "Generate compelling vision and value proposition",
      icon: Target,
      gradient: "from-blue-400 to-indigo-500"
    },
    { 
      num: "03", 
      title: "User Personas", 
      desc: "AI creates detailed user profiles automatically",
      icon: Users,
      gradient: "from-violet-400 to-purple-500"
    },
    { 
      num: "04", 
      title: "Clarify Questions", 
      desc: "Generate smart questions to validate assumptions",
      icon: MessageSquare,
      gradient: "from-pink-400 to-rose-500"
    },
    { 
      num: "05", 
      title: "Market Analysis", 
      desc: "Real-time competitor research via Google Search",
      icon: BarChart3,
      gradient: "from-emerald-400 to-teal-500"
    },
    { 
      num: "06", 
      title: "Generate PRD", 
      desc: "Professional PRD with requirements and specs",
      icon: FileText,
      gradient: "from-cyan-400 to-blue-500"
    },
    { 
      num: "07", 
      title: "User Stories", 
      desc: "RICE-scored user stories with acceptance criteria",
      icon: GitBranch,
      gradient: "from-lime-400 to-green-500"
    },
    { 
      num: "08", 
      title: "Build Roadmap", 
      desc: "Prioritized timeline with phases and milestones",
      icon: Clock,
      gradient: "from-fuchsia-400 to-pink-500"
    },
    { 
      num: "09", 
      title: "Define OKRs", 
      desc: "Objectives and key results with success metrics",
      icon: Zap,
      gradient: "from-yellow-400 to-amber-500"
    },
  ];

  const techStack = [
    { name: "GPT-4o", color: "#10A37F" },
    { name: "Claude 3.5", color: "#CC785C" },
    { name: "Llama 4", color: "#4F46E5" },
    { name: "Pinecone", color: "#8B5CF6" },
    { name: "Neon DB", color: "#00D9A5" },
    { name: "Serper", color: "#3B82F6" },
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-slate-50 text-slate-900 overflow-hidden relative">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-slate-50" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100/60 via-slate-50 to-white" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-violet-200/40 via-indigo-100/30 to-transparent rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-blue-200/40 via-cyan-100/30 to-transparent rounded-full blur-[80px]" />
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-gradient-to-br from-pink-100/30 to-transparent rounded-full blur-[60px]" />
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/70 border-b border-slate-200/50 shadow-sm"
      >
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div 
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <Sparkles className="w-5 h-5 text-white" />
            </motion.div>
            <span className="font-bold text-lg text-slate-900">
              Product Pilot
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#how-it-works" className="text-sm text-slate-600 hover:text-indigo-600 transition-colors">How it Works</a>
            <a href="#features" className="text-sm text-slate-600 hover:text-indigo-600 transition-colors">Features</a>
            <a href="#tools" className="text-sm text-slate-600 hover:text-indigo-600 transition-colors">Tools</a>
            <Link href="/dashboard">
              <Button className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-700 hover:to-violet-700 font-medium">
                Get Started
              </Button>
            </Link>
          </nav>

          <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </motion.header>

      <div className="h-16" />

      {/* Hero Section */}
      <section className="relative pt-24 pb-32">
        <motion.div style={{ y, opacity }} className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-200/50">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                <span className="text-sm text-indigo-700 font-medium">Now with GPT-4o, Claude 3.5 & Llama 4</span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.8 }}
              className="text-6xl md:text-8xl font-bold mb-8 tracking-tight"
            >
              <span className="text-slate-900">
                Ship Products
              </span>
              <br />
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                10x Faster
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed"
            >
              The AI co-pilot that transforms your ideas into
              <span className="text-slate-900 font-semibold"> PRDs, Roadmaps & OKRs </span>
              in minutes, not weeks.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/dashboard">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-700 hover:to-violet-700 px-8 py-6 text-lg font-medium rounded-xl shadow-xl shadow-indigo-500/25">
                    <Rocket className="w-5 h-5 mr-2" />
                    Start Building Free
                  </Button>
                </motion.div>
              </Link>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button variant="outline" size="lg" className="border-slate-300 text-slate-700 hover:bg-slate-100 hover:border-slate-400 px-8 py-6 text-lg rounded-xl">
                  <Play className="w-5 h-5 mr-2" />
                  Watch Demo
                </Button>
              </motion.div>
            </motion.div>

            {/* Tech Stack Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-16 flex flex-wrap items-center justify-center gap-3"
            >
              {techStack.map((tech, idx) => (
                <div
                  key={idx}
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 shadow-sm text-sm font-medium"
                  style={{ color: tech.color }}
                >
                  {tech.name}
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* How It Works - 9 Steps */}
      <section id="how-it-works" className="py-24 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">
              9 Steps to Product-Market Fit
            </h2>
            <p className="text-xl text-slate-600">From problem statement to launch-ready roadmap</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="relative p-6 rounded-2xl border border-slate-200 backdrop-blur-sm transition-all duration-300 cursor-pointer bg-white shadow-sm hover:border-indigo-200 hover:shadow-md">
                  <div className="flex items-start gap-4">
                    <div className={`
                      w-12 h-12 rounded-xl bg-gradient-to-br ${step.gradient} 
                      flex items-center justify-center flex-shrink-0 shadow-lg
                    `}>
                      <step.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <span className="text-xs font-medium text-slate-500 mb-1 block">Step {step.num}</span>
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">{step.title}</h3>
                      <p className="text-sm text-slate-600 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-indigo-100 text-indigo-700 border-indigo-200">Why Product Pilot?</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">Everything You Need</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              AI-powered tools that actually understand product management
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              { icon: Brain, title: "Multi-Model AI", desc: "GPT-4o, Claude 3.5 Sonnet, Llama 4 Scout", gradient: "from-violet-500 to-purple-600" },
              { icon: Search, title: "Real-Time Research", desc: "Live competitor analysis via Google Search API", gradient: "from-blue-500 to-cyan-500" },
              { icon: Database, title: "Vector Memory", desc: "Pinecone-powered semantic search across projects", gradient: "from-emerald-500 to-teal-500" },
              { icon: Workflow, title: "Smart Templates", desc: "9 structured templates from problem to OKRs", gradient: "from-orange-500 to-amber-500" },
              { icon: Target, title: "RICE Scoring", desc: "Automated prioritization with impact analysis", gradient: "from-rose-500 to-pink-500" },
              { icon: Layers, title: "Export Anywhere", desc: "Jira, Confluence, Notion, PDF, Word support", gradient: "from-indigo-500 to-blue-500" },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full bg-white border-slate-200 hover:border-indigo-200 hover:shadow-lg transition-all duration-300 group">
                  <CardContent className="p-6">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">{feature.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Tools */}
      <section id="tools" className="py-24 relative bg-slate-50/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-violet-100 text-violet-700 border-violet-200">Advanced Tools</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">AI-Powered Toolkit</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Supercharge your productivity with our suite of specialized AI tools
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              { 
                icon: Mic, 
                title: "MeetingPro AI", 
                desc: "AI-powered meeting assistant for automated transcription, smart summaries, and actionable insights. Transform meetings into organized, searchable knowledge.", 
                gradient: "from-blue-500 to-indigo-600",
                link: "https://asankhua.github.io/meetingpro-ai/"
              },
              { 
                icon: FileCode, 
                title: "PDF/Doc Generator", 
                desc: "Powerful client-side document conversion tool. Transform multiple file formats into unified PDF or Word documents with zero server dependencies.", 
                gradient: "from-emerald-500 to-teal-600",
                link: "https://asankhua.github.io/ConvertFlow-PDF-Doc-Generator/"
              },
              { 
                icon: Wrench, 
                title: "Engineer Prompt", 
                desc: "AI-powered toolkit for software engineers with SDLC prompts, dark mode, search functionality, and personalization. Streamline your development workflow.", 
                gradient: "from-orange-500 to-amber-600",
                link: "https://asankhua.github.io/engineer-toolkit/"
              },
              { 
                icon: Kanban, 
                title: "Backlog Manager", 
                desc: "Modern agile project management tool with Kanban board, sprint tracking, and team collaboration features. Built for efficient project delivery.", 
                gradient: "from-rose-500 to-pink-600",
                link: "https://asankhua.github.io/agile-backlog-manager/"
              },
              { 
                icon: Terminal, 
                title: "Prompt Builder", 
                desc: "Advanced AI prompt building tool for crafting effective prompts. Features templates, examples, and best practices with zero server dependencies.", 
                gradient: "from-violet-500 to-purple-600",
                link: "https://asankhua.github.io/prompt-builder/"
              },
            ].map((tool, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full bg-white border-slate-200 hover:border-violet-200 hover:shadow-lg transition-all duration-300 group">
                  <CardContent className="p-6">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                      <tool.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">{tool.title}</h3>
                    <p className="text-slate-600 leading-relaxed mb-4">{tool.desc}</p>
                    <a 
                      href={tool.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-violet-600 hover:text-violet-700 font-medium text-sm transition-colors"
                    >
                      Try it now
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-slate-900">
              Ready to Ship
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent"> Faster?</span>
            </h2>
            <p className="text-xl text-slate-600 mb-10">
              Join 10,000+ product managers who use AI to build better products
            </p>
            <Link href="/dashboard">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="inline-block">
                <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-700 hover:to-violet-700 px-10 py-6 text-lg font-medium rounded-xl shadow-xl shadow-indigo-500/25">
                  <Rocket className="w-5 h-5 mr-2" />
                  Start Building Free
                  <ArrowUpRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-200 relative">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-slate-900">Product Pilot</span>
            </div>
            <p className="text-slate-500 text-sm">
              © 2026 Product Pilot. All rights reserved. - Ashish Kumar Sankhua
            </p>
            <div className="flex items-center gap-6">
              <a 
                href="/LICENSE" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-slate-600 hover:text-indigo-600 transition-colors"
              >
                License
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
