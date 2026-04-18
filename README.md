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

AI-Powered Product Manager Productivity Platform.

Transform a raw problem statement into a complete product planning suite through a sequential 9-step AI pipeline.

## Pipeline Steps

1. **Reframe Problem Statement** - AI analyzes and restructures the problem using HMW framework
2. **Write Product Vision** - Generates vision, mission, value proposition, and north star metric
3. **Identify & Profile Personas** - Creates detailed persona cards with pain points, goals, and behaviors
4. **Clarifying Questions + AI Q&A** - Generates critical questions with an AI assistant to answer them
5. **Market & Competitive Analysis** - Fetches competitor data, SWOT analysis, market sizing
6. **Generate PRD** - Full Product Requirements Document with 6-8 sections using ChatPRD template
7. **User Stories + Acceptance Criteria** - Epics, stories in Gherkin format with story points
8. **Prioritized Backlog + Roadmap** - RICE scoring and phased roadmap
9. **OKRs + Success Metrics** - Objectives, key results, AARRR metrics

**Bonus: Project Chatbot** - Ask questions about your product documentation using RAG (Retrieval-Augmented Generation)

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

## Key Features

### 🎯 9-Step AI Pipeline
Sequential product planning from problem statement to OKRs

### 📝 Template System
8 professional templates (ChatPRD, Product School, ProductPlan) ensure consistent AI output

### 🤖 Project Chatbot
RAG-powered chatbot lets you ask questions about your product documentation:
- "What are the main features in our PRD?"
- "Who are our target personas?"
- "What's on the Q3 roadmap?"

### 📊 RAG System
- Vector embeddings stored in Pinecone
- Per-project namespace isolation
- Semantic search across all artifacts
- One-click delete & re-index

## Deployment

This application is automatically deployed to Hugging Face Spaces via GitHub Actions when changes are pushed to the main branch.

### Manual Deployment

To manually deploy to Hugging Face:

1. Create a new Space on Hugging Face with Docker SDK
2. Add the following secrets to your GitHub repository:
   - `HF_TOKEN`: Your Hugging Face access token
3. Push to the main branch to trigger the workflow

### Local Development

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Full technical architecture
- [WIREFRAMES.md](./WIREFRAMES.md) - UI wireframes and component specs
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Detailed deployment guide

## License

MIT License - see LICENSE file for details
