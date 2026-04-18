---
title: Product Pilot
emoji: 🚀
colorFrom: indigo
colorTo: purple
sdk: docker
pinned: false
license: mit
---

# Product Pilot

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

**AI-powered product strategy platform** that transforms problem statements into complete product planning suites. 9-step pipeline from idea to presentation-ready PRD with user stories, roadmaps, and OKRs.

## Who Is This For?

| User | Benefit |
|------|---------|
| **Product Managers** | Generate complete PRDs with user stories and roadmaps in minutes |
| **Startup Founders** | Validate ideas and create investor-ready product documentation |
| **Product Teams** | Align on vision with structured 9-step framework |
| **Consultants** | Deliver professional product strategy documents to clients |
| **Students** | Learn product management with AI-assisted guidance |

## How It Helps

- **Saves Hours** - Complete product strategy in minutes instead of days
- **Structured Process** - 9-step pipeline ensures nothing is missed
- **Professional Output** - PRDs, user stories, and roadmaps ready to share
- **AI-Powered Chat** - Ask questions about your product anytime
- **Export Ready** - Generate PowerPoint presentations from your data
- **Free to Use** - Open source with no subscription required

## Pipeline Steps

1. **Reframe Problem Statement** - AI analyzes using HMW framework
2. **Write Product Vision** - Vision, mission, value proposition
3. **Identify Personas** - Detailed user profiles with pain points
4. **Clarifying Questions** - AI Q&A to fill knowledge gaps
5. **Market Analysis** - Competitor research and SWOT
6. **Generate PRD** - Full Product Requirements Document
7. **User Stories** - Epics with RICE scoring and acceptance criteria
8. **Prioritized Roadmap** - Phased delivery plan
9. **OKRs & Metrics** - Objectives and success metrics

**Bonus: Project Chatbot** - RAG-powered Q&A on your product docs

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Next.js 16)                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌───────────────┐  │
│  │  Dashboard  │  │  Pipeline   │  │   Chat      │  │ Presentation  │  │
│  │             │  │   (9 Steps) │  │  (RAG)      │  │   (PPT Gen)   │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  └───────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         BACKEND (Next.js API)                           │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    9-Step AI Pipeline                           │   │
│  │  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌────────────┐  │   │
│  │  │  Step 1   │  │  Step 2   │  │  Step 3   │  │  Steps 4-9 │  │   │
│  │  │ Problem   │─▶│  Vision   │─▶│  Personas │─▶│  (Cascade) │  │   │
│  │  └───────────┘  └───────────┘  └───────────┘  └────────────┘  │   │
│  │       │              │              │              │          │   │
│  │       └──────────────┴──────────────┴──────────────┘          │   │
│  │                              ▼                                │   │
│  │                    ┌──────────────┐                          │   │
│  │                    │ OpenAI GPT-4│                          │   │
│  │                    │  (LLM)      │                          │   │
│  │                    └──────────────┘                          │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           DATA LAYER                                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌───────────┐  │
│  │   Pinecone   │  │ Neon PostgreSQL│  │  PptxGenJS │  │  OpenAI   │  │
│  │  (Vector DB) │  │  (Relational) │  │  (PPT Gen) │  │   GPT-4   │  │
│  │              │  │               │  │              │  │           │  │
│  │• RAG Context │  │• Projects    │  │• Export PPT │  │• LLM      │  │
│  │• Embeddings  │  │• Sessions    │  │• Templates  │  │• Streaming│  │
│  └──────────────┘  └──────────────┘  └──────────────┘  └───────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

### Data Flow
1. **User Input** - Problem statement via Next.js UI
2. **Sequential Pipeline** - Each step builds on previous context
3. **AI Generation** - OpenAI GPT-4 streams real-time output
4. **Storage** - Results saved to Neon PostgreSQL
5. **RAG Indexing** - Embeddings stored in Pinecone for chatbot
6. **Export** - Generate PowerPoint from any step

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes, Neon PostgreSQL
- **AI**: OpenAI GPT-4, Pinecone Vector Database
- **PPT Generation**: PptxGenJS

## Project Structure

```
product-pilot/
├── ARCHITECTURE.md         # Full technical architecture
├── WIREFRAMES.md           # UI specifications
├── README.md               # This file
├── .env                    # Environment variables
├── .env.example            # Environment variables template
├── backend/                # 🖥️ Backend (Next.js API routes, services, templates)
│   ├── api/                # API routes (RAG, chat, pipeline)
│   ├── lib/                # Core pipeline logic (Steps 1-2)
│   ├── phase-1-core-lib/   # Step 1-2 logic
│   ├── phase-2-personas-lib/   # Step 3-4 logic
│   ├── phase-3-market-lib/     # Step 5 logic
│   ├── phase-4-prd-lib/        # Step 6 logic
│   ├── phase-5-stories-lib/    # Step 7 logic
│   ├── phase-6-roadmap-lib/    # Step 8 logic
│   ├── phase-7-success metrics-lib/  # Step 9 logic
│   ├── prisma/             # Database schema
│   ├── shared/             # Shared types, config, utils, services
│   │   ├── config/         # Environment & constants
│   │   ├── db/             # Prisma client
│   │   ├── services/       # RAG, embedding, template services
│   │   ├── types/          # TypeScript types
│   │   └── utils/          # Helper functions
│   └── template/           # 📁 AI Output Templates (8 templates)
│       ├── chatprd-template/
│       ├── competitive-template/
│       ├── okr-metrics-template/
│       ├── persona-template/
│       ├── problem-statement-template/
│       ├── rice-scoring-template/
│       ├── roadmap-template/
│       └── user-stories-template/
└── frontend/               # 🎨 Frontend (Next.js App Router)
    ├── app/                # Next.js pages
    │   ├── layout.tsx      # Root layout
    │   ├── page.tsx        # Landing page
    │   └── project/        # Project pages
    └── components/         # React components
        └── pipeline/       # Pipeline UI components
```

## Getting Started

```bash
# 1. Copy environment variables
cp .env.example .env.local

# 2. Install dependencies
npm install

# 3. Set up database
npx prisma db push

# 4. Run development server
npm run dev
```

## Environment Variables

The following environment variables are required for the application to function:

```
OPENAI_API_KEY=your_openai_api_key
NEON_DATABASE_URL=your_neon_database_url
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_ENVIRONMENT=your_pinecone_environment
PINECONE_INDEX=your_pinecone_index_name
```

### Setting Environment Variables in Hugging Face Spaces

1. Go to your Hugging Face Space settings
2. Navigate to "Variables and Secrets"
3. Add the following environment variables:
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `NEON_DATABASE_URL`: Your Neon PostgreSQL database URL
   - `PINECONE_API_KEY`: Your Pinecone API key
   - `PINECONE_ENVIRONMENT`: Your Pinecone environment (e.g., "us-east-1-aws")
   - `PINECONE_INDEX`: Your Pinecone index name

## Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/asankhua/product-pilot.git
cd product-pilot

# 2. Install dependencies
cd frontend/next-app
npm install

# 3. Configure environment
cp .env.example .env.local
# Edit .env.local and add your OPENAI_API_KEY and other secrets

# 4. Run development server
npm run dev
```

## Configuration

Create `.env.local` file:
```bash
OPENAI_API_KEY=your_openai_api_key
NEON_DATABASE_URL=your_neon_database_url
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_ENVIRONMENT=us-east-1-aws
PINECONE_INDEX=your_index_name
```

## Deployment

### Hugging Face Spaces (Recommended)

This app auto-deploys to Hugging Face via GitHub Actions on every push to `main`.

**Setup:**
1. Fork this repo
2. Create a Hugging Face Space with Docker SDK
3. Add `HF_TOKEN` secret to your GitHub repo settings
4. Push to `main` - deployment happens automatically

**Live Demo:** https://huggingface.co/spaces/ashishsankhua/product-pilot

### Local Development

```bash
cd frontend/next-app
npm install
npm run dev
```

## Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture and design
- [WIREFRAMES.md](./WIREFRAMES.md) - UI specifications
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide

---

*Product Pilot - AI-powered product strategy for modern teams*
