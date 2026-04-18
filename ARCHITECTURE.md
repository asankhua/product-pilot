# Product Pilot - Architecture Document

## 1. System Overview

Product Pilot is an AI-powered Product Manager productivity platform that transforms a raw problem statement into a complete product planning suite through a sequential 9-step AI pipeline. The system uses a **Plan-and-Execute Agent Pattern** where each step builds on the accumulated context from all previous steps.

### Core Workflow

```
User enters Problem Statement
        │
        ▼
┌─────────────────────────────────────────────────────────┐
│                  PIPELINE ORCHESTRATOR                   │
│                                                         │
│  Step 1: Reframe Problem Statement                      │
│      ▼                                                  │
│  Step 2: Write Product Vision                           │
│      ▼                                                  │
│  Step 3: Identify & Profile Personas                    │
│      ▼                                                  │
│  Step 4: Clarifying Questions + AI Q&A                  │
│      ▼                                                  │
│  Step 5: Market & Competitive Analysis                  │
│      ▼                                                  │
│  Step 6: Generate PRD                                   │
│      ▼                                                  │
│  Step 7: User Stories + Acceptance Criteria              │
│      ▼                                                  │
│  Step 8: Prioritized Backlog + Roadmap                  │
│      ▼                                                  │
│  Step 9: OKRs + Success Metrics                         │
│                                                         │
└─────────────────────────────────────────────────────────┘
        │
        ▼
  Exportable Artifacts (PDF / Markdown / Confluence)
```

---

## 2. Tech Stack

| Layer              | Technology                                      | Purpose                                    |
|--------------------|------------------------------------------------|--------------------------------------------|
| Frontend           | Next.js 16 (App Router)                        | Server-rendered React UI                   |
| UI Components      | Tailwind CSS v4 + shadcn/ui                    | Design system (light theme)                |
| State (Client)     | React useState/useContext                      | Client-side state management               |
| State (Server)     | React Server Components                        | Server-side data fetching                  |
| API                | Next.js Route Handlers                         | Backend endpoints                          |
| LLM                | OpenAI GPT-4                                   | AI inference for pipeline steps            |
| Vector Database    | Pinecone (Serverless)                          | RAG context store                          |
| Embeddings         | Pinecone Inference / text-embedding-3-small    | Text vectorization                         |
| Relational DB      | Neon PostgreSQL (Serverless)                    | Structured data persistence                |
| Database Client    | @neondatabase/serverless                       | Direct SQL with type-safe queries          |
| PPT Generation     | PptxGenJS                                      | Client-side PowerPoint generation          |
| Templates          | TypeScript Objects + JSON Schema               | 6 templates with pre-filled problem statements |
| Template Reference | ProductPlan + Product School                   | Problem Statement & Persona templates        |
| Chatbot            | RAG + Project Context                          | Project Q&A with full step data access     |
| Streaming          | Server-Sent Events (SSE)                       | Real-time LLM output streaming             |
| Export             | PptxGenJS                                      | PowerPoint export from project data         |
| Notifications      | Browser Console / UI States                    | Pipeline status feedback                   |
| Icons              | Lucide React                                   | Icon library                               |
| Regenerate         | Step-level retry                               | Regenerate any step independently          |
| Navigation         | Next Step Buttons                              | Conditional progression between steps      |
| Landing Page       | Advanced Tools Section                         | MeetingPro AI, PDF Generator, etc.        |
| Footer             | MIT License with copyright                     | All pages except landing                   |
| Step Completion    | Saved Sessions Based                           | Steps marked complete based on saved data  |
| Deployment         | Docker + Hugging Face Spaces                   | Cloud deployment platform                  |
| CI/CD              | GitHub Actions                                 | Auto-sync to Hugging Face on main push    |

---

## 2.1 UI/UX Architecture

### Theme System
- **Approach:** Fixed Light Theme (no dark mode toggle)
- **Background:** Gradient from `sky-50` to `white` via `globals.css`
- **Color Palette:**
  - Primary: Indigo (#6366f1) - buttons, active states
  - Text: Slate-900 (headings), Slate-600 (body), Slate-500 (muted)
  - Backgrounds: White cards, Slate-50/Slate-100 for secondary areas
  - Borders: Slate-200 for card borders, Slate-300 for inputs
  - Success: Emerald-500/Emerald-600
  - Warning: Amber-500/Amber-600
  - Error: Rose-500/Rose-600

### Component Structure
- **Layout:** Fixed sidebar (256px) + scrollable main content
- **Navigation:** Dashboard, Projects, Chat, Presentation, Settings (5 items)
- **Cards:** White background, slate-200 border, shadow-sm
- **Buttons:** Indigo primary, outline secondary, ghost tertiary
- **Inputs:** White bg, slate-300 border, slate-900 text (visible on light bg)

### Responsive Breakpoints
- Desktop: 1280px+ (full sidebar)
- Tablet: 768px-1279px (collapsible sidebar)
- Mobile: <768px (hidden sidebar, hamburger menu)

---

## 2.2 Template Data Structures

### Step 1: Problem Statement Template (ProductPlan-based)

The problem statement follows the ProductPlan template structure with 9 sections:

```typescript
interface ProblemStatement {
  problemTitle: string;
  oneLineSummary: string;
  problem: {
    description: string;
    affectedUsers: string;
    painPoints: string;
  };
  context: {
    rootCauses: string;
    whenItOccurs: string;
    howItManifests: string;
    currentWorkarounds: string;
    existingSolutionFailures: string;
  };
  scope: {
    inScope: string;
    outOfScope: string;
    boundaries: string;
  };
  measurability: {
    currentMetric: string;
    targetMetric: string;
    timeframe: string;
    successCriteria: string;
  };
  impact: {
    businessImpact: string;
    userImpact: string;
    consequences: string;
    benefits: string;
  };
  validation: {
    supportingData: string;
    userResearch: string;
    marketEvidence: string;
    stakeholderInput: string;
  };
  conciseFormat: {
    targetUser: string;
    whoStatement: string;
    theProblem: string;
    isAProblem: string;
    thatCauses: string;
    unlikeCurrent: string;
    ourSolution: string;
  };
  nextSteps: string[];
}
```

### Step 3: Persona Template (Product School-based)

User personas follow the Product School template with comprehensive profiling:

```typescript
interface Persona {
  overview: {
    name: string;
    role: string;
    age: number;
    generation: string;
    location: string;
    quote: string;
  };
  demographics: {
    personal: {
      gender: string;
      education: string;
      occupation: string;
      incomeLevel: string;
      familyStatus: string;
      livingSituation: string;
    };
    professional: {
      industry: string;
      companySize: string;
      yearsExperience: string;
      technicalSkill: number;  // 1-5 scale
      toolsUsed: string[];
    };
  };
  psychographics: {
    personalityTraits: string;
    values: string;
    fears: string;
    motivations: string;
    hobbies: string;
    favoriteBrands: string[];
    influencers: string[];
  };
  usageProfile: {
    patterns: {
      frequency: string;
      sessionDuration: string;
      primaryDevices: string[];
      context: string;
      timeOfDay: string;
    };
    goals: string[];
    painPoints: { title: string; description: string }[];
    needs: string[];
  };
  journeyContext: {
    currentBehavior: string;
    dayInTheLife: string;
    triggerEvents: string;
    decisionMaking: string;
  };
  productFit: {
    whyNeedProduct: string;
    howTheyllUseIt: string;
    successMetrics: string;
    objections: string;
  };
}
```

### Template Reference Architecture

Each pipeline step uses templates as:
1. **Prompt reference** - LLM receives template structure in system prompt
2. **Validation schema** - Output validated against template JSON schema
3. **UI rendering guide** - Frontend uses template to display structured data

Template files stored in `/backend/template/`:
- `problem-statement-template/` - ProductPlan template
- `persona-template/` - Product School template
- `vision-template/` - Product vision framework

---

## 3. System Architecture

### 3.1 High-Level Component Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                          CLIENT (Browser)                        │
│                                                                  │
│  ┌──────────┐ ┌─────────────┐ ┌───────────┐ ┌───────────────┐  │
│  │Dashboard │ │Pipeline View│ │Step Detail│ │Export Manager │  │
│  │  Page    │ │  (Progress) │ │  (Output) │ │              │  │
│  └────┬─────┘ └──────┬──────┘ └─────┬─────┘ └──────┬────────┘  │
│       │               │              │               │           │
│  ┌────┴───────────────┴──────────────┴───────────────┴────────┐  │
│  │                    Zustand Store                            │  │
│  │  - currentProject  - pipelineState  - streamingOutput      │  │
│  └────────────────────────┬───────────────────────────────────┘  │
│                           │                                      │
└───────────────────────────┼──────────────────────────────────────┘
                            │ HTTP / SSE
┌───────────────────────────┼──────────────────────────────────────┐
│                      NEXT.JS SERVER                              │
│                           │                                      │
│  ┌────────────────────────┴───────────────────────────────────┐  │
│  │                   API Route Layer                          │  │
│  │  /api/projects  /api/pipeline/*  /api/qa/*  /api/rag/*     │  │
│  │  /api/chat/*    /api/export                                    │  │
│  └──────────┬─────────────┬──────────────┬──────────┬─────────┘  │
│             │             │              │           │            │
│  ┌──────────┴─────────────┴──────────────┴───────────┴────────┐  │
│  │                Pipeline Orchestrator                        │  │
│  │  - Step sequencing    - Context assembly                   │  │
│  │  - Error recovery     - State persistence                  │  │
│  └──────────┬─────────────┬──────────────┬────────────────────┘  │
│             │             │              │                        │
│  ┌──────────┴──┐ ┌───────┴────┐ ┌───────┴──────────┐           │
│  │ LLM Router  │ │  Pinecone  │ │  External APIs   │           │
│  │             │ │  Client    │ │  (Serper)        │           │
│  │ Groq ←→    │ │            │ │                  │           │
│  │ OpenRouter  │ │ Embed +    │ │                  │           │
│  │             │ │ Retrieve   │ │                  │           │
│  └──────┬──┬──┘ └─────┬──────┘ └──────────────────┘           │
│         │  │           │                                        │
└─────────┼──┼───────────┼────────────────────────────────────────┘
          │  │           │
     ┌────┘  └────┐      │
     ▼            ▼      ▼
┌─────────┐ ┌──────────┐ ┌──────────┐
│  Groq   │ │OpenRouter│ │ Pinecone │
│  API    │ │   API    │ │ (Vector) │
└─────────┘ └──────────┘ └──────────┘
     │                              │
     │         ┌──────────┐         │
     └────────▶│PostgreSQL│◀────────┘
               │ (Prisma) │
               └──────────┘
```

### 3.2 Request Flow (Single Pipeline Step)

```
1. Client triggers step execution
        │
        ▼
2. API Route receives request, validates auth + project ownership
        │
        ▼
3. Orchestrator loads PipelineContext:
   a. Fetch project + all previous step outputs from PostgreSQL
   b. Query Pinecone for relevant RAG context (similarity search)
   c. Assemble full context object
        │
        ▼
4. Orchestrator calls step.getPrompt(context) to build prompt
        │
        ▼
5. LLM Router sends prompt to Groq (primary):
   - If Groq succeeds → stream response via SSE to client
   - If Groq fails (rate limit / timeout / error):
     → Retry with exponential backoff (3 attempts)
     → Fallback to OpenRouter (auto-select model)
        │
        ▼
6. Response Handler processes streamed output:
   a. Parse structured JSON from LLM response
   b. Validate output schema (Zod)
   c. Store structured output in PostgreSQL
   d. Generate embedding → store in Pinecone
   e. Update pipeline step status to "complete"
        │
        ▼
7. Client receives final output, updates Zustand store, renders UI
```

---

## 4. LLM Integration Details

### 4.1 OpenAI GPT-4 Configuration

```
Endpoint:       https://api.openai.com/v1/chat/completions
Model:          gpt-4o (primary)
Fallback:       gpt-4-turbo (if gpt-4o unavailable)

Rate Limits:
  - 10,000 tokens/minute (gpt-4o)
  - 200 requests/minute

Streaming:      Enabled (SSE via stream: true)
Temperature:    0.7 for creative tasks, 0.3 for structured output
Max Tokens:     Varies by step (2048 - 4096)
```

### 4.2 Model Selection per Step

| Step | Task                    | Model         | Max Tokens | Temp | Rationale |
|------|-------------------------|---------------|------------|------|-----------|
| 1    | Reframe Problem         | gpt-4o        | 2048       | 0.7  | Creative insight generation |
| 2    | Write Vision            | gpt-4o        | 2048       | 0.7  | Strategic narrative, compelling writing |
| 3    | Persona Profiles        | gpt-4o        | 4096       | 0.7  | Deep psychological insight generation |
| 4    | Clarifying Questions    | gpt-4o        | 2048       | 0.5  | Structured Q&A output, gap analysis |
| 5    | Market Analysis         | gpt-4o        | 4096       | 0.3  | Complex synthesis & strategic analysis |
| 6    | PRD Generation          | gpt-4o        | 4096       | 0.4  | Technical writing, comprehensive docs |
| 7    | User Stories            | gpt-4o        | 4096       | 0.4  | Structured JSON output for stories |
| 8    | Backlog & Roadmap       | gpt-4o        | 4096       | 0.3  | RICE prioritization & planning |
| 9    | OKRs & Metrics          | gpt-4o        | 2048       | 0.4  | Precise metric generation |

---

## 5. Pinecone Vector Database Design

### 5.1 Index Configuration

```
Index Name:     pm-pilot
Metric:         cosine
Dimensions:     1536 (text-embedding-3-small) or 768 (if Pinecone Inference)
Cloud:          AWS
Region:         us-east-1
Type:           Serverless

Namespaces:
  - project_{projectId}    # Per-project isolation
```

### 5.2 Vector Record Schema

```json
{
  "id": "proj_abc123_step_3_persona_1",
  "values": [0.012, -0.034, ...],       // 1536-dim embedding
  "metadata": {
    "projectId": "abc123",
    "stepNumber": 3,
    "stepName": "personas",
    "contentType": "persona_profile",    // persona_profile | vision | prd | story | etc.
    "personaName": "Product Manager",    // optional, step-specific
    "createdAt": "2026-04-16T10:00:00Z",
    "chunkIndex": 0,                     // for long outputs split into chunks
    "totalChunks": 1
  }
}
```

### 5.3 Embedding Strategy

```
Input Text Chunking:
  - Max chunk size: 512 tokens
  - Overlap: 50 tokens
  - Split by: paragraph boundaries first, then sentence boundaries

Embedding Generation:
  - Primary: Pinecone Inference API (built-in, no extra cost)
  - Fallback: OpenAI text-embedding-3-small via OpenRouter

Storage Flow:
  1. Pipeline step completes → output text generated
  2. Text chunked into ≤512 token segments
  3. Each chunk embedded via Pinecone Inference
  4. Vectors upserted to namespace "project_{projectId}"
  5. Metadata includes stepNumber, contentType, timestamp

Retrieval Flow (RAG):
  1. New step starts → assemble query from problem statement + step goal
  2. Query Pinecone namespace for top-K similar vectors (K=10)
  3. Filter by projectId and stepNumber < currentStep
  4. Return text chunks as additional context for LLM prompt
```

### 5.4 Namespace Strategy

Each project gets its own Pinecone namespace, which provides:
- Data isolation between projects
- Efficient deletion (delete entire namespace when project deleted)
- Scoped similarity search (no cross-project leakage)

---

## 5.5 PPT Generation Architecture

### 5.5.1 PptxGenJS Integration

The Presentation Generator uses PptxGenJS to create PowerPoint presentations from project data:

```typescript
// Presentation Generation Flow
1. User selects project and steps
2. Fetch step data from savedSessions
3. Create PptxGenJS instance
4. Generate slides for each selected step
5. Add formatted content (tables, charts, shapes)
6. Download .pptx file
```

### 5.5.2 Slide Content Generation

Each pipeline step has dedicated content formatting:

| Step | Content Type | Format |
|------|--------------|--------|
| 1 (Problem Reframe) | Table with problem, causes, impact | 2-column table with colored headers |
| 2 (Vision) | Table with vision, pitch, metrics | 2-column table with green theme |
| 3 (Personas) | Card-style persona profiles | Multiple tables with purple theme |
| 4 (Questions) | Q&A format with categories | Compact tables with orange theme |
| 5 (Market Analysis) | Competitor data and trends | Table with blue theme |
| 6 (PRD) | Structured document content | Table with purple theme |
| 7 (User Stories) | Stories with RICE scores | 4-column table with green theme |
| 8 (Roadmap) | Timeline with milestones | 3-column table with amber theme |
| 9 (OKRs) | Objectives with progress chart | Table + bar chart |

### 5.5.3 PptxGenJS Features Used

- **Shapes**: Rectangles for backgrounds and decorative elements
- **Tables**: Structured data presentation with custom styling
- **Charts**: Bar charts for OKR progress visualization
- **Text**: Multi-line text with formatting (bold, colors, alignment)
- **Colors**: Step-specific color schemes for visual consistency
- **Layout**: Master slides with consistent header/footer

### 5.5.4 Error Handling

Common issues and solutions:
- ShapeType/ChartType access errors - use string values instead of enums
- Chart data format - pass array of data objects, not single element
- Content truncation - increased substring limits for better readability

---

## 5.6 Deployment Architecture

### 5.6.1 Hugging Face Spaces Deployment

The application is deployed to Hugging Face Spaces using Docker:

```
Deployment Flow:
1. Code pushed to GitHub main branch
2. GitHub Actions workflow triggered
3. README_HF.md copied to README.md (Hugging Face metadata)
4. Code synced to Hugging Face Space via git
5. Hugging Face builds Docker image
6. Application deployed and available
```

### 5.6.2 Docker Configuration

```dockerfile
# Base image
FROM node:18-slim

# Build process
- Copy package files
- Install production dependencies
- Copy application code
- Run npm run build

# Runtime
- Expose port 7860 (Hugging Face default)
- Set NODE_ENV=production
- Start with npm start
```

### 5.6.3 GitHub Actions Workflow

```yaml
Workflow: Sync to Hugging Face
Trigger: Push to main branch, manual dispatch

Steps:
1. Checkout repository
2. Copy README_HF.md to README.md (includes Hugging Face metadata)
3. Configure git
4. Push to Hugging Face Space (ashishsankhua/product-pilot)
```

### 5.6.4 Environment Variables

Hugging Face Space requires these environment variables:
- `OPENAI_API_KEY` - OpenAI API key for LLM
- `NEON_DATABASE_URL` - Neon PostgreSQL connection string
- `PINECONE_API_KEY` - Pinecone API key for vector DB
- `PINECONE_ENVIRONMENT` - Pinecone environment (e.g., us-east-1-aws)
- `PINECONE_INDEX` - Pinecone index name

### 5.6.5 Deployment URLs

- GitHub: https://github.com/asankhua/product-pilot
- Hugging Face Space: https://huggingface.co/spaces/ashishsankhua/product-pilot

---

## 6. Database Schema (PostgreSQL + Prisma)

### 6.1 Entity Relationship Diagram

```
┌──────────┐     ┌───────────────┐     ┌──────────────────┐
│   User   │────<│    Project    │────<│  PipelineStep    │
│          │     │               │     │                  │
│ id       │     │ id            │     │ id               │
│ email    │     │ userId        │     │ projectId        │
│ name     │     │ name          │     │ stepNumber (1-9) │
│ image    │     │ problemStmt   │     │ stepName         │
│ createdAt│     │ status        │     │ status           │
└──────────┘     │ createdAt     │     │ inputData (JSON) │
                 │ updatedAt     │     │ outputData (JSON)│
                 └───────┬───────┘     │ startedAt        │
                         │             │ completedAt      │
                         │             └──────────────────┘
                         │
            ┌────────────┼────────────────────┐
            │            │                    │
     ┌──────┴──────┐ ┌──┴───────────┐ ┌─────┴──────────┐
     │   Persona   │ │   Competitor │ │      PRD       │
     │             │ │              │ │                │
     │ id          │ │ id           │ │ id             │
     │ projectId   │ │ projectId    │ │ projectId      │
     │ name        │ │ name         │ │ title          │
     │ role        │ │ website      │ │ content (Text) │
     │ bio         │ │ strengths    │ │ version        │
     │ painPoints  │ │ weaknesses   │ │ sections (JSON)│
     │ goals       │ │ marketShare  │ │ createdAt      │
     │ motivations │ │ pricing      │ │ updatedAt      │
     │ behaviors   │ │ features     │ └────────────────┘
     │ frustrations│ │ swot (JSON)  │
     │ interests   │ └──────────────┘
     └─────────────┘
            │
     ┌──────┴──────────────┐
     │ ClarifyingQuestion  │     ┌──────────────────┐     ┌──────────┐
     │                     │     │    UserStory      │     │   OKR    │
     │ id                  │     │                   │     │          │
     │ projectId           │     │ id                │     │ id       │
     │ personaId (optional)│     │ projectId         │     │ projectId│
     │ question            │     │ epicName          │     │ objective│
     │ category            │     │ title             │     │ keyResults│
     │ aiAnswer            │     │ asA               │     │   (JSON) │
     │ userAnswer          │     │ iWant             │     │ metrics  │
     │ isAnswered          │     │ soThat            │     │   (JSON) │
     │ priority            │     │ acceptanceCriteria│     │ quarter  │
     └────────────────────-┘     │   (JSON)          │     │ status   │
                                 │ storyPoints       │     └──────────┘
                                 │ priority          │
                                 │ sprint            │
                                 │ status            │
                                 └───────────────────┘
```

### 6.2 Prisma Schema

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String    @id @default(cuid())
  email     String    @unique
  name      String?
  image     String?
  projects  Project[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

model Project {
  id               String             @id @default(cuid())
  userId           String
  user             User               @relation(fields: [userId], references: [id], onDelete: Cascade)
  name             String
  problemStatement String             @db.Text
  status           ProjectStatus      @default(DRAFT)
  currentStep      Int                @default(0)
  pipelineSteps    PipelineStep[]
  personas         Persona[]
  questions        ClarifyingQuestion[]
  competitors      Competitor[]
  prd              PRD?
  userStories      UserStory[]
  okrs             OKR[]
  createdAt        DateTime           @default(now())
  updatedAt        DateTime           @updatedAt

  @@index([userId])
}

enum ProjectStatus {
  DRAFT
  IN_PROGRESS
  COMPLETED
  ARCHIVED
}

model PipelineStep {
  id          String         @id @default(cuid())
  projectId   String
  project     Project        @relation(fields: [projectId], references: [id], onDelete: Cascade)
  stepNumber  Int
  stepName    String
  status      StepStatus     @default(PENDING)
  inputData   Json?
  outputData  Json?
  rawOutput   String?        @db.Text
  tokenUsage  Json?          // { promptTokens, completionTokens, totalTokens }
  model       String?        // which LLM model was used
  startedAt   DateTime?
  completedAt DateTime?
  errorMessage String?
  createdAt   DateTime       @default(now())

  @@unique([projectId, stepNumber])
  @@index([projectId])
}

enum StepStatus {
  PENDING
  RUNNING
  COMPLETED
  ERROR
  SKIPPED
}

model Persona {
  id           String   @id @default(cuid())
  projectId    String
  project      Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
  name         String
  role         String
  bio          String   @db.Text
  painPoints   Json     // string[]
  frustrations Json     // string[]
  goals        Json     // string[]
  motivations  Json     // string[]
  behaviors    Json     // string[]
  interests    Json     // string[]
  demographics Json?    // { age, location, education, income }
  createdAt    DateTime @default(now())

  @@index([projectId])
}

model ClarifyingQuestion {
  id         String   @id @default(cuid())
  projectId  String
  project    Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
  question   String   @db.Text
  category   String   // "user_needs" | "technical" | "business" | "scope" | "constraints"
  aiAnswer   String?  @db.Text
  userAnswer String?  @db.Text
  isAnswered Boolean  @default(false)
  priority   Int      @default(0)
  createdAt  DateTime @default(now())

  @@index([projectId])
}

model Competitor {
  id          String   @id @default(cuid())
  projectId   String
  project     Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
  name        String
  website     String?
  description String?  @db.Text
  strengths   Json     // string[]
  weaknesses  Json     // string[]
  marketShare String?
  pricing     String?
  features    Json?    // string[]
  swot        Json?    // { strengths, weaknesses, opportunities, threats }
  sourceUrl   String?
  createdAt   DateTime @default(now())

  @@index([projectId])
}

model PRD {
  id        String   @id @default(cuid())
  projectId String   @unique
  project   Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
  title     String
  content   String   @db.Text
  sections  Json     // structured PRD sections
  version   Int      @default(1)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model UserStory {
  id                 String   @id @default(cuid())
  projectId          String
  project            Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
  epicName           String
  title              String
  asA                String   // "As a [persona]..."
  iWant              String   // "I want [feature]..."
  soThat             String   // "So that [benefit]..."
  acceptanceCriteria Json     // [{ given, when, then }]
  storyPoints        Int
  priority           StoryPriority @default(MEDIUM)
  sprint             String?
  status             StoryStatus   @default(BACKLOG)
  riceScore          Float?
  createdAt          DateTime @default(now())

  @@index([projectId])
}

enum StoryPriority {
  CRITICAL
  HIGH
  MEDIUM
  LOW
}

enum StoryStatus {
  BACKLOG
  TODO
  IN_PROGRESS
  DONE
}

model OKR {
  id         String   @id @default(cuid())
  projectId  String
  project    Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
  objective  String   @db.Text
  keyResults Json     // [{ description, target, unit, current }]
  metrics    Json     // [{ name, formula, target, frequency }]
  quarter    String?  // "Q1 2026"
  status     OKRStatus @default(ON_TRACK)
  createdAt  DateTime @default(now())

  @@index([projectId])
}

enum OKRStatus {
  ON_TRACK
  AT_RISK
  BEHIND
  COMPLETED
}
```

---

## 7. API Contracts

### 7.1 Project Endpoints

#### POST /api/projects
Create a new project.
```json
// Request
{
  "name": "Food Delivery App",
  "problemStatement": "Restaurant owners in tier-2 cities struggle to reach online customers due to high commission fees from existing platforms..."
}

// Response (201)
{
  "id": "proj_abc123",
  "name": "Food Delivery App",
  "problemStatement": "...",
  "status": "DRAFT",
  "currentStep": 0,
  "createdAt": "2026-04-16T10:00:00Z"
}
```

#### GET /api/projects/[id]
Fetch project with all step data.

#### GET /api/projects
List all projects for authenticated user.

#### DELETE /api/projects/[id]
Delete project and cascade to all related data + Pinecone namespace.

### 7.2 Pipeline Endpoints

#### POST /api/pipeline/execute
Start or resume pipeline execution.
```json
// Request
{
  "projectId": "proj_abc123",
  "startFromStep": 1,     // optional, defaults to next pending step
  "stopAfterStep": 9      // optional, defaults to 9 (run all)
}

// Response (200) - SSE Stream
event: step_start
data: {"stepNumber": 1, "stepName": "reframe_problem"}

event: stream
data: {"content": "The reframed problem..."}

event: stream
data: {"content": " statement focuses on..."}

event: step_complete
data: {"stepNumber": 1, "output": { ... }}

event: step_start
data: {"stepNumber": 2, "stepName": "write_vision"}
...
event: pipeline_complete
data: {"projectId": "proj_abc123", "completedSteps": 9}
```

#### POST /api/pipeline/[step]/regenerate
Re-run a specific step with optional user edits.
```json
// Request
{
  "projectId": "proj_abc123",
  "stepNumber": 3,
  "userOverrides": {          // optional: user modifications to context
    "additionalContext": "Focus on B2B personas only"
  }
}

// Response: SSE stream (same format as execute)
```

#### GET /api/pipeline/[projectId]/status
```json
// Response
{
  "projectId": "proj_abc123",
  "currentStep": 5,
  "steps": [
    { "stepNumber": 1, "status": "COMPLETED", "completedAt": "..." },
    { "stepNumber": 2, "status": "COMPLETED", "completedAt": "..." },
    { "stepNumber": 3, "status": "COMPLETED", "completedAt": "..." },
    { "stepNumber": 4, "status": "COMPLETED", "completedAt": "..." },
    { "stepNumber": 5, "status": "RUNNING",   "startedAt": "..." },
    { "stepNumber": 6, "status": "PENDING" },
    { "stepNumber": 7, "status": "PENDING" },
    { "stepNumber": 8, "status": "PENDING" },
    { "stepNumber": 9, "status": "PENDING" }
  ]
}
```

### 7.3 Q&A Assistant Endpoint (Step 4)

#### POST /api/qa/ask
```json
// Request
{
  "projectId": "proj_abc123",
  "questionId": "q_xyz789",
  "userMessage": "Can you elaborate on the technical constraints?"
}

// Response (SSE stream)
event: stream
data: {"content": "Based on the problem statement and personas..."}

event: complete
data: {
  "answer": "Full answer text...",
  "questionId": "q_xyz789",
  "relatedQuestions": ["What about scalability?", "..."]
}
```

### 7.4 Market Search Endpoint (Step 5)

#### POST /api/market/search
```json
// Request
{
  "projectId": "proj_abc123",
  "searchQueries": [
    "food delivery platforms tier-2 cities India",
    "restaurant ordering SaaS competitors",
    "Swiggy Zomato market share 2026"
  ]
}

// Response
{
  "results": [
    {
      "query": "food delivery platforms tier-2 cities India",
      "sources": [
        { "title": "...", "url": "...", "snippet": "..." }
      ]
    }
  ],
  "competitors": [
    { "name": "Swiggy", "url": "...", "marketShare": "~45%" }
  ]
}
```

### 7.5 Export Endpoint

#### GET /api/pipeline/[projectId]/export?format=pdf|markdown|docx
```json
// Response for format=markdown
{
  "content": "# Food Delivery App - Product Plan\n\n## Problem Statement\n...",
  "filename": "food-delivery-app-product-plan.md"
}

// Response for format=pdf
// Binary PDF file download
```

---

## 8. Pipeline Step Specifications

### Step 1: Reframe Problem Statement

**Input:** Raw problem statement from user
**Output Schema:**
```json
{
  "originalProblem": "string",
  "reframedProblem": "string",
  "keyInsights": ["string"],
  "scope": {
    "inScope": ["string"],
    "outOfScope": ["string"]
  },
  "assumptions": ["string"],
  "constraints": ["string"]
}
```

### Step 2: Write Product Vision

**Input:** Reframed problem + original problem
**Output Schema:**
```json
{
  "visionStatement": "string",
  "missionStatement": "string",
  "valueProposition": "string",
  "targetOutcome": "string",
  "northStarMetric": "string",
  "principles": ["string"],
  "elevatorPitch": "string"
}
```

### Step 3: Persona Profiles

**Input:** Problem statement + vision
**Output Schema:**
```json
{
  "personas": [
    {
      "name": "string",
      "role": "string",
      "bio": "string (2-3 sentences)",
      "demographics": {
        "ageRange": "string",
        "location": "string",
        "education": "string",
        "incomeLevel": "string"
      },
      "painPoints": ["string"],
      "frustrations": ["string"],
      "goals": ["string"],
      "motivations": ["string"],
      "behaviors": ["string"],
      "interests": ["string"],
      "techSavviness": "low | medium | high",
      "quote": "string (a representative quote)"
    }
  ]
}
```

### Step 4: Clarifying Questions + AI Q&A

**Input:** Problem + vision + personas
**Output Schema:**
```json
{
  "questions": [
    {
      "question": "string",
      "category": "user_needs | technical | business | scope | constraints",
      "priority": 1,
      "aiSuggestedAnswer": "string",
      "relatedPersona": "string | null"
    }
  ]
}
```
The AI assistant answers questions interactively using the full project context from Pinecone RAG.

### Step 5: Market & Competitive Analysis

**Input:** Problem + vision + personas + Q&A answers
**Output Schema:**
```json
{
  "marketOverview": {
    "marketSize": "string",
    "growthRate": "string",
    "trends": ["string"],
    "opportunities": ["string"]
  },
  "competitors": [
    {
      "name": "string",
      "website": "string",
      "description": "string",
      "marketShare": "string",
      "pricing": "string",
      "strengths": ["string"],
      "weaknesses": ["string"],
      "features": ["string"],
      "swot": {
        "strengths": ["string"],
        "weaknesses": ["string"],
        "opportunities": ["string"],
        "threats": ["string"]
      }
    }
  ],
  "competitiveAdvantage": "string",
  "positioningStrategy": "string",
  "sources": [{ "title": "string", "url": "string" }]
}
```

### Step 6: PRD Generation

**Input:** All previous steps (1-5)
**Output Schema:**
```json
{
  "title": "string",
  "sections": {
    "overview": "string",
    "problemStatement": "string",
    "goals": ["string"],
    "targetUsers": "string",
    "proposedSolution": "string",
    "scopeInOut": { "in": ["string"], "out": ["string"] },
    "userFlows": ["string"],
    "functionalRequirements": [
      { "id": "FR-001", "title": "string", "description": "string", "priority": "P0|P1|P2" }
    ],
    "nonFunctionalRequirements": [
      { "id": "NFR-001", "title": "string", "description": "string" }
    ],
    "technicalConsiderations": "string",
    "successMetrics": [{ "metric": "string", "target": "string" }],
    "timeline": "string",
    "openQuestions": ["string"],
    "appendix": "string"
  }
}
```

### Step 7: User Stories + Acceptance Criteria

**Input:** PRD + personas
**Output Schema:**
```json
{
  "epics": [
    {
      "name": "string",
      "description": "string",
      "stories": [
        {
          "title": "string",
          "asA": "string",
          "iWant": "string",
          "soThat": "string",
          "acceptanceCriteria": [
            {
              "given": "string",
              "when": "string",
              "then": "string"
            }
          ],
          "storyPoints": 1,
          "priority": "CRITICAL | HIGH | MEDIUM | LOW",
          "notes": "string"
        }
      ]
    }
  ]
}
```

### Step 8: Prioritized Backlog + Roadmap

**Input:** User stories + market analysis + PRD
**Output Schema:**
```json
{
  "prioritizationFramework": "RICE",
  "backlog": [
    {
      "storyTitle": "string",
      "epicName": "string",
      "riceScore": {
        "reach": 0,
        "impact": 0,
        "confidence": 0,
        "effort": 0,
        "score": 0.0
      },
      "priority": "P0 | P1 | P2 | P3",
      "sprint": "string",
      "dependencies": ["string"]
    }
  ],
  "roadmap": {
    "phases": [
      {
        "name": "MVP / Phase 1",
        "duration": "string",
        "goals": ["string"],
        "stories": ["string"],
        "milestones": ["string"]
      }
    ],
    "timeline": "string"
  }
}
```

### Step 9: OKRs + Success Metrics

**Input:** Vision + PRD + roadmap
**Output Schema:**
```json
{
  "okrs": [
    {
      "objective": "string",
      "quarter": "string",
      "keyResults": [
        {
          "description": "string",
          "targetValue": "string",
          "unit": "string",
          "currentValue": "string",
          "confidence": "high | medium | low"
        }
      ]
    }
  ],
  "successMetrics": [
    {
      "category": "acquisition | activation | retention | revenue | referral",
      "name": "string",
      "formula": "string",
      "target": "string",
      "frequency": "daily | weekly | monthly | quarterly",
      "dataSource": "string"
    }
  ],
  "northStarMetric": {
    "name": "string",
    "definition": "string",
    "target": "string",
    "rationale": "string"
  }
}
```

---

## 9. Template System

The Template System ensures consistent, high-quality AI-generated outputs across all pipeline steps. Each template provides a structured format (Markdown + TypeScript) that guides the LLM to produce professional product management artifacts.

### 9.1 Template Structure

Each template consists of:
- **`.md` file**: Markdown reference for LLM prompts with `{{variable}}` placeholders
- **`.ts` file**: TypeScript template object with `fillTemplate()` and `generateMarkdown()` helpers
- **`.json` file**: JSON Schema for output validation

### 9.2 Available Templates (8 Total)

| Template | Source | Pipeline Step | Purpose |
|----------|--------|---------------|---------|
| **ChatPRD** | chatprd.ai | Step 6 | 6-section PRD with MoSCoW prioritization |
| **Product School Persona** | productschool.com | Step 3 | Comprehensive persona profiles |
| **ProductPlan Problem Statement** | productplan.com | Step 1 | 5-component problem framework |
| **Competitive Analysis** | Internal | Step 5 | SWOT + market positioning |
| **User Stories** | Internal | Step 7 | Gherkin format + acceptance criteria |
| **RICE Scoring** | Internal | Step 8 | Feature prioritization algorithm |
| **Roadmap** | Internal | Step 8 | Phased timeline generation |
| **OKR + Metrics** | Multiple sources | Step 9 | AARRR + OKR framework |

### 9.3 Template Variable System

```typescript
// Example: ChatPRD Template Variables
const templateVariables = [
  // Metadata
  'productName', 'authorName', 'date', 'status', 'version',
  
  // Background
  'problemStatement1', 'marketOpportunity1',
  'persona1Name', 'persona1Characteristics',
  'visionStatement', 'productOrigin',
  
  // Objectives (SMART)
  'smartSpecific', 'smartMeasurable', 'smartAchievable',
  'smartRelevant', 'smartTimebound',
  
  // Features
  'feature1Name', 'feature1Description', 'feature1Benefit',
  'priority0Feature', 'priority0Rationale', // MoSCoW
  
  // ... 100+ variables per template
];

// Fill template with data
const filled = fillTemplate(template, {
  productName: "Product Pilot",
  problemStatement1: "PMs spend weeks on product planning...",
  // ... other values
});

// Generate markdown output
const markdown = generateMarkdown(filled);
```

### 9.4 Template Storage

```
backend/template/
├── chatprd-template/             # Step 6 - Primary PRD template
│   ├── chatprd-template.md         # 6-section PRD reference
│   ├── chatprd-template.ts         # TypeScript implementation
│   └── chatprd-template.json       # JSON Schema
├── competitive-template/         # Step 5 - Market analysis
├── okr-metrics-template/           # Step 9 - OKRs & success metrics
├── persona-template/               # Step 3 - User personas
├── problem-statement-template/     # Step 1 - Problem framing
├── rice-scoring-template/          # Step 8 - Feature prioritization
├── roadmap-template/               # Step 8 - Product roadmap
└── user-stories-template/          # Step 7 - Agile user stories
```

---

## 10. RAG Chatbot System

The RAG (Retrieval-Augmented Generation) Chatbot allows users to ask natural language questions about their product documentation. The system indexes all pipeline artifacts into a vector database and retrieves relevant context to answer queries.

### 10.1 System Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│   Project   │────▶│   Artifacts  │────▶│  Text Chunking  │
│  (Prisma)   │     │ (JSON/Markdown)│    │  (512 tokens)   │
└─────────────┘     └──────────────┘     └────────┬────────┘
                                                  │
┌─────────────────────────────────────────────────▼─────────┐
│              Pinecone Vector Database                     │
│  Namespace: project_{projectId} (per-project isolation) │
│  • text-embedding-3-small (1536 dimensions)              │
│  • Cosine similarity search                              │
│  • Metadata: sourceType, stepNumber, chunkIndex         │
└─────────────────────────┬───────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────┐
│  Query Flow:                                              │
│  1. User asks: "What are the main features?"             │
│  2. Embed query → vector                                  │
│  3. Search Pinecone (top 10 results)                    │
│  4. Format context + sources                              │
│  5. Send to LLM with RAG prompt                         │
│  6. Return response + source citations                  │
└─────────────────────────────────────────────────────────┘
```

### 10.2 Indexed Artifacts

| Source Type | Step | Content Indexed |
|-------------|------|-----------------|
| `problem_statement` | 1 | Problem description, affected users |
| `persona` | 3 | Name, role, bio, pain points, goals |
| `market_analysis` | 5 | Competitor analysis, SWOT |
| `prd` | 6 | Full PRD content with features |
| `user_stories` | 7 | Stories, acceptance criteria |
| `roadmap` | 8 | Phases, milestones, timeline |
| `okrs` | 9 | Objectives, key results, metrics |

### 10.3 API Endpoints

```typescript
// Index all project artifacts
POST /api/rag/[projectId]
Body: { force?: boolean } // re-index if true
Response: { 
  success: boolean, 
  vectorCount: number, 
  status: "READY" | "FAILED" 
}

// Query RAG chatbot
POST /api/chat/[projectId]
Body: { message: string, history?: ChatMessage[] }
Response: { 
  message: {
    role: "assistant",
    content: string,
    sources: Array<{
      text: string,
      sourceType: string,
      sourceTitle: string,
      score: number
    }>
  }
}

// Get chat history
GET /api/chat/[projectId]
Response: { messages: ChatMessage[] }

// Delete RAG index
DELETE /api/rag/[projectId]
Response: { success: boolean, message: string }

// Check indexing status
GET /api/rag/[projectId]/status
Response: { 
  database: RagIndex,
  pinecone: { status, vectorCount },
  isReady: boolean 
}
```

### 10.4 Database Schema (Prisma)

```prisma
model RagIndex {
  id            String    @id @default(cuid())
  projectId     String    @unique
  project       Project   @relation(fields: [projectId], references: [id], onDelete: Cascade)
  
  status        RagStatus @default(PENDING)
  vectorCount   Int       @default(0)
  indexedAt     DateTime?
  lastQueriedAt DateTime?
  deletedAt     DateTime?
  errorMessage  String?
  indexedArtifacts Json?  // { problemStatement: true, personas: [...], ... }
  
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

enum RagStatus {
  PENDING
  INDEXING
  READY
  FAILED
  DELETED
}

model ChatMessage {
  id        String    @id @default(cuid())
  projectId String
  project   Project   @relation(fields: [projectId], references: [id], onDelete: Cascade)
  
  role      ChatRole  // USER | ASSISTANT | SYSTEM
  content   String    @db.Text
  sources   Json?     // RAG sources for assistant messages
  
  createdAt DateTime  @default(now())

  @@index([projectId])
  @@index([createdAt])
}

enum ChatRole {
  USER
  ASSISTANT
  SYSTEM
}
```

### 10.5 Services

**Embedding Service** (`/shared/services/embedding-service.ts`):
- Text chunking: 512 tokens max, 50 overlap, paragraph-aware
- OpenAI text-embedding-3-small via OpenRouter
- Query embedding generation

**RAG Service** (`/shared/services/rag-service.ts`):
- `indexProjectArtifacts()` - Chunk and index all artifacts
- `queryRAG()` - Semantic search with filters
- `deleteProjectRAG()` - Delete namespace + vectors
- `generateRAGResponse()` - LLM with RAG context

---

## 11. Interactive UI & Real-Time Experience

This section defines the professional, interactive UI layer that gives Product Pilot a polished, dashboard-grade feel with live streaming feedback and hands-on data manipulation.

### 11.1 Real-Time Streaming UI

LLM output streams token-by-token into the browser using the **Vercel AI SDK** (`useCompletion` hook) over Server-Sent Events. This eliminates the "blank screen" wait and gives users immediate feedback.

```
User clicks "Run Step"
        │
        ▼
┌───────────────────────────────────────────────────────┐
│  Browser (React Client)                               │
│                                                       │
│  1. Show skeleton loader (pulsing gray blocks)        │
│  2. SSE connection opens to /api/pipeline/execute      │
│  3. First token arrives → skeleton fades out           │
│  4. Tokens stream in with typing cursor (█)           │
│  5. Structured data parsed live → charts render        │
│  6. "step_complete" event → cursor removed             │
│     → success toast fires                             │
│     → progress bar advances to next step              │
│                                                       │
└───────────────────────────────────────────────────────┘
```

**Key behaviors:**
- **Skeleton loaders:** Appear instantly on step trigger, match the layout of the expected output (text blocks, card grids, table rows)
- **Typing cursor:** Blinking `█` character appended to the last streamed token; removed on completion
- **Incremental JSON parsing:** For structured outputs (personas, competitors), parse partial JSON as it arrives and render cards progressively
- **Auto-scroll:** Output container scrolls to keep the latest content visible during streaming
- **Abort control:** User can cancel a running step; sends abort signal to close the SSE connection

**Implementation:**
```typescript
// Client-side streaming with Vercel AI SDK
import { useCompletion } from "ai/react";

const { completion, isLoading, stop } = useCompletion({
  api: `/api/pipeline/execute`,
  body: { projectId, stepNumber },
  onFinish: (prompt, completion) => {
    // Parse final JSON, update Zustand store, fire success toast
  },
  onError: (error) => {
    // Fire error toast, mark step as ERROR
  },
});
```

### 11.2 Interactive Data Dashboards

Every data-rich pipeline step includes interactive Recharts visualizations that respond to hover, click, and filter actions.

#### Market Analysis (Step 5)

| Chart Type        | Data Source              | Interactions                            |
|-------------------|--------------------------|-----------------------------------------|
| Pie Chart         | Competitor market share  | Hover: tooltip with %, name; Click: highlight competitor in table |
| Radar Chart       | Feature comparison       | Toggle competitors on/off; hover: score per axis |
| Bar Chart         | Pricing comparison       | Sort ascending/descending; hover: full pricing details |

#### Backlog Prioritization (Step 8)

| Chart Type           | Data Source             | Interactions                            |
|----------------------|-------------------------|-----------------------------------------|
| Scatter Plot         | RICE scores (x=effort, y=impact, bubble=reach) | Hover: story title + scores; Click: expand story detail |
| Sortable Data Table  | Full backlog            | Click column headers to sort; filter by epic, priority, sprint |
| Priority Matrix      | Impact vs Effort (2x2)  | Quadrant labels: Quick Wins, Major Projects, Fill-ins, Avoid |

#### Roadmap (Step 8)

| Chart Type           | Data Source             | Interactions                            |
|----------------------|-------------------------|-----------------------------------------|
| Horizontal Gantt     | Phases + stories        | Hover: duration + goals; stories shown as nested bars within phases |
| Milestone Markers    | Phase milestones        | Diamond markers on timeline; hover: milestone description |

#### OKRs & Metrics (Step 9)

| Chart Type           | Data Source             | Interactions                            |
|----------------------|-------------------------|-----------------------------------------|
| Progress Bars        | Key result completion   | Color-coded: green (on track), amber (at risk), red (behind) |
| Donut Chart          | AARRR metric categories | Segments: Acquisition, Activation, Retention, Revenue, Referral |
| Gauge Meters         | North star metric       | Animated fill on page load; target marker line |

### 11.3 Drag-and-Drop Interactions

**@hello-pangea/dnd** enables direct manipulation of pipeline outputs, making the tool feel like a real PM workspace rather than a read-only report.

```
┌─────────────────────────────────────────────────────────────┐
│  Backlog Board (Kanban-style)                               │
│                                                             │
│  ┌─ Sprint 1 ──────┐  ┌─ Sprint 2 ──────┐  ┌─ Icebox ──┐ │
│  │                  │  │                  │  │            │ │
│  │ ┌──────────────┐ │  │ ┌──────────────┐ │  │ ┌────────┐│ │
│  │ │ Registration │ │  │ │ Order Track  │ │  │ │ Loyalty ││ │
│  │ │ 5 SP · P0    │ │  │ │ 3 SP · P1    │ │  │ │ 8 SP   ││ │
│  │ └──────────────┘ │  │ └──────────────┘ │  │ └────────┘│ │
│  │                  │  │                  │  │            │ │
│  │ ┌──────────────┐ │  │ ┌──────────────┐ │  │            │ │
│  │ │ Place Order  │ │  │ │ Analytics    │ │  │            │ │
│  │ │ 5 SP · P0   ↕│ │  │ │ 3 SP · P2    │ │  │            │ │
│  │ └──────────────┘ │  │ └──────────────┘ │  │            │ │
│  │                  │  │                  │  │            │ │
│  │  ↕ drag to       │  │                  │  │            │ │
│  │    reorder        │  │                  │  │            │ │
│  └──────────────────┘  └──────────────────┘  └────────────┘ │
│                                                             │
│  ← drag stories between columns to reassign sprints →      │
└─────────────────────────────────────────────────────────────┘
```

**Drag-and-drop surfaces:**

| Surface                    | Action                                      | Persistence                              |
|----------------------------|---------------------------------------------|------------------------------------------|
| Backlog story reordering   | Drag stories within a sprint column         | Updates priority rank in PostgreSQL      |
| Sprint assignment          | Drag stories between sprint columns         | Updates sprint field on UserStory        |
| Roadmap phase reassignment | Drag stories between roadmap phase lanes    | Updates phase assignment in roadmap JSON |
| Persona card arrangement   | Drag to reorder persona display priority    | Updates display order                    |

### 11.4 Toast & Notification System

**Sonner** provides non-intrusive, bottom-right toast notifications for all asynchronous pipeline events.

| Event                   | Toast Type | Message Example                              | Duration |
|-------------------------|------------|----------------------------------------------|----------|
| Step started            | Info       | "Generating persona profiles..."             | 3s       |
| Step completed          | Success    | "Step 3 complete: 4 personas identified"     | 5s       |
| Step error              | Error      | "Market analysis failed. Retry?"             | Persist  |
| Regeneration triggered  | Info       | "Regenerating PRD with updated context..."   | 3s       |
| Export ready            | Success    | "PDF exported. Download started."            | 5s       |
| Rate limit warning      | Warning    | "API rate limited. Retrying in 4s..."        | 4s       |
| Pipeline complete       | Success    | "All 9 steps complete! Ready to export."     | 8s       |
| Drag-drop saved         | Success    | "Backlog order updated."                     | 2s       |

### 10.5 Live Progress Indicators

The pipeline progress system provides constant visual feedback across the entire session.

**Global Pipeline Progress Bar:**
```
┌─────────────────────────────────────────────────────────────┐
│  ①──②──③──④──⑤──⑥──⑦──⑧──⑨                               │
│  ✓   ✓   ✓   ✓   ◉   ○   ○   ○   ○                       │
│                    ↑                                        │
│  [████████████████████░░░░░░░░░░░░░░░░░░] 44% · Step 5/9  │
│  ≈ 3 min remaining                                         │
└─────────────────────────────────────────────────────────────┘
```

**Per-step status badges:**

| Status    | Visual                                | Behavior                                   |
|-----------|---------------------------------------|---------------------------------------------|
| PENDING   | Gray outlined circle, muted label     | Static, no animation                        |
| RUNNING   | Indigo pulsing circle with spinner    | Pulse animation (1s ease-in-out infinite)   |
| COMPLETED | Green filled circle with checkmark    | Brief scale-up animation on completion      |
| ERROR     | Red filled circle with X              | Shake animation; click to retry             |

**Time estimation:**
- Track average duration per step across all projects
- Display "~X min remaining" based on (remaining steps x avg duration)
- Update estimate live as each step completes faster or slower than average

### 11.6 Component-to-Library Mapping

| Component              | Page / Step       | Primary Library       | Features                                  |
|------------------------|-------------------|-----------------------|-------------------------------------------|
| StreamingOutput        | All steps         | Vercel AI SDK         | Token streaming, skeleton, typing cursor  |
| MarketPieChart         | Step 5            | Recharts PieChart     | Market share, hover tooltips, click focus |
| FeatureRadar           | Step 5            | Recharts RadarChart   | Multi-competitor overlay, toggle legend   |
| RICEScatterPlot        | Step 8 Backlog    | Recharts ScatterChart | Bubble size=reach, quadrant labels        |
| BacklogTable           | Step 8 Backlog    | shadcn/ui DataTable   | Column sort, filter, pagination           |
| GanttTimeline          | Step 8 Roadmap    | Recharts BarChart     | Horizontal stacked bars, phase lanes      |
| OKRProgressBars        | Step 9            | Recharts BarChart     | Horizontal progress, color-coded status   |
| MetricDonut            | Step 9            | Recharts PieChart     | AARRR category breakdown                  |
| BacklogKanban          | Step 8 Backlog    | @hello-pangea/dnd     | Cross-column drag, reorder within column  |
| RoadmapDnD             | Step 8 Roadmap    | @hello-pangea/dnd     | Phase reassignment via drag               |
| PipelineProgress       | All project pages | Custom + Tailwind     | Animated stepper, time estimate           |
| Toaster                | Global            | Sonner                | All pipeline event notifications          |
| SkeletonLoader         | All steps         | shadcn/ui Skeleton    | Layout-matching placeholder blocks        |

---

## 12. Performance & Scalability Considerations

### LLM Optimization
- **Token budget management:** Track token usage per step, warn when approaching limits
- **Streaming:** All LLM calls use SSE streaming for perceived performance
- **Caching:** Cache identical prompts for 1 hour (reduce redundant API calls)
- **Context window management:** Keep conversation history under 4K tokens for Groq KV cache optimization
- **Parallel embedding:** Batch embed step outputs asynchronously after step completion

### Database Optimization
- **Connection pooling:** Prisma connection pool (10 connections for serverless)
- **Indexes:** On projectId for all child tables, composite unique on [projectId, stepNumber]
- **JSON columns:** Use PostgreSQL JSONB for flexible schema evolution

### Pinecone Optimization
- **Namespace isolation:** Prevents cross-project interference
- **Metadata filtering:** Pre-filter by stepNumber to reduce search space
- **Batch upsert:** Send up to 100 vectors per upsert call
- **Top-K tuning:** Start with K=10, configurable per step

---

## 13. Error Handling Strategy

```
┌──────────────────────────────────────────────┐
│              Error Handling Flow              │
│                                              │
│  LLM Error                                   │
│  ├─ Rate Limit → Exponential backoff (3x)    │
│  │               → Fallback to OpenRouter    │
│  ├─ Timeout    → Retry once                  │
│  │               → Fallback to OpenRouter    │
│  ├─ Invalid JSON → Re-prompt with schema     │
│  │                 → Parse with fallback      │
│  └─ Server Error → Log + retry               │
│                    → Show user error          │
│                                              │
│  Pipeline Error                              │
│  ├─ Step Failure → Mark step as ERROR        │
│  │                → Allow manual retry        │
│  ├─ Partial Output → Save partial            │
│  │                   → Show with warning      │
│  └─ Context Too Large → Summarize context    │
│                         → Re-attempt          │
│                                              │
│  Database Error                              │
│  ├─ Connection → Retry with backoff          │
│  └─ Write Fail → Transaction rollback        │
│                                              │
│  Pinecone Error                              │
│  ├─ Upsert Fail → Queue for retry           │
│  └─ Query Fail  → Proceed without RAG        │
│                    (degraded mode)            │
└──────────────────────────────────────────────┘
```

---

## 14. Security Measures

| Concern                | Mitigation                                            |
|------------------------|------------------------------------------------------|
| API key exposure       | Server-side only; never in client bundles             |
| Prompt injection       | Input sanitization + system prompt hardening          |
| Rate limiting          | Per-user rate limits on API routes (10 req/min)       |
| Data isolation         | Pinecone namespaces + DB row-level security           |
| XSS                    | React auto-escaping + CSP headers                    |
| CSRF                   | NextAuth.js built-in CSRF protection                 |
| SQL injection          | Prisma parameterized queries                         |
| Sensitive data in logs | Redact API keys and PII from logs                    |

---

## 15. Monitoring & Observability

- **Custom Metrics (logged to console / future observability provider):**
  - LLM latency per step (TTFT, total)
  - Token usage per step and per project
  - Pipeline completion rate
  - Error rates by step and by LLM provider
  - Pinecone query latency
  - User engagement (steps completed, exports generated)

---

## 16. Development Phase Timeline

| Phase   | Scope                                    | Duration  | Dependencies        | Status |
|---------|------------------------------------------|-----------|---------------------|--------|
| Phase 1 | Core: Setup, LLM, Pinecone, Steps 1-2   | 2 weeks   | None                | ✅ Complete |
| Phase 2 | Personas & Clarifying Qs (Steps 3-4)     | 1.5 weeks | Phase 1             | ✅ Complete |
| Phase 3 | Market & Competitive Analysis (Step 5)   | 1.5 weeks | Phase 2             | ✅ Complete |
| Phase 4 | PRD Generation (Step 6)                  | 1 week    | Phase 3             | ✅ Complete |
| Phase 5 | User Stories (Step 7)                    | 1 week    | Phase 4             | ⏳ Pending |
| Phase 6 | Backlog & Roadmap (Step 8)               | 1 week    | Phase 5             | ⏳ Pending |
| Phase 7 | OKRs & Metrics (Step 9)                  | 1 week    | Phase 6             | ⏳ Pending |
| Polish  | Export, auth, error handling, UI polish   | 1 week    | All phases          | ⏳ Pending |
| **Total** |                                        | **~10 weeks** |                  | 4/7 Complete |

---

## 17. Implementation Status

### ✅ Phase 1: Core Definition (Steps 1-2)

| Component | File | Status |
|-----------|------|--------|
| Reframe Problem API | `/backend/api/pipeline/reframe/route.ts` | ✅ Implemented |
| Write Vision API | `/backend/api/pipeline/vision/route.ts` | ✅ Implemented |
| LLM Router | `/backend/phase-1-core-lib/llm/llm-router.ts` | ✅ Implemented |
| Groq Client | `/backend/phase-1-core-lib/llm/groq-client.ts` | ✅ Implemented |
| OpenRouter Client | `/backend/phase-1-core-lib/llm/openrouter-client.ts` | ✅ Implemented |
| Project Pipeline UI | `/frontend/next-app/app/project/[id]/page.tsx` | ✅ Implemented |

**Features:**
- SSE streaming for real-time LLM output
- Load distribution: Step 1 (Groq), Step 2 (OpenRouter)
- Auto-advance from Step 1 to Step 2
- Structured output display for Reframe and Vision

### ✅ Phase 2: User Understanding (Steps 3-4)

| Component | File | Status |
|-----------|------|--------|
| Persona Profiles API | `/backend/api/pipeline/personas/route.ts` | ✅ Implemented |
| Clarifying Questions API | `/backend/api/pipeline/questions/route.ts` | ✅ Implemented |
| Persona Prompt | `/backend/phase-2-personas-lib/llm/prompts/personas.ts` | ✅ Implemented |
| Questions Prompt | `/backend/phase-2-personas-lib/llm/prompts/questions.ts` | ✅ Implemented |

**Features:**
- 3-5 persona generation with full profiles (bio, pain points, goals, etc.)
- Clarifying questions with AI-suggested answers
- Categorized questions (user_needs, technical, business, scope, constraints)
- Priority ranking for questions
- Related persona linking

### ✅ Phase 3: Market Analysis (Step 5)

| Component | File | Status |
|-----------|------|--------|
| Market Analysis API | `/backend/api/pipeline/market/route.ts` | ✅ Implemented |
| Serper Search Client | `/backend/phase-3-market-lib/external/serper-client.ts` | ✅ Implemented |
| Market Analysis Prompt | `/backend/phase-3-market-lib/llm/prompts/market-analysis.ts` | ✅ Implemented |

**Features:**
- Google Search integration via Serper API
- Parallel search execution (up to 4 queries)
- Market overview (size, growth, trends, opportunities)
- Competitor analysis (3-7 competitors with SWOT)
- Competitive advantage identification
- Positioning strategy generation
- Source attribution

### ✅ Phase 4: PRD Generation (Step 6)

| Component | File | Status |
|-----------|------|--------|
| PRD Generation API | `/backend/api/pipeline/prd/route.ts` | ✅ Implemented |
| PRD Prompt | `/backend/phase-4-prd-lib/llm/prompts/prd.ts` | ✅ Implemented |

**Features:**
- 13-section PRD generation
- Functional requirements with priorities (P0/P1/P2)
- Non-functional requirements
- User flows and scope definition
- Success metrics and timeline
- Technical considerations

### 🎨 Frontend Updates

| Feature | Status | Notes |
|---------|--------|-------|
| Landing Page | ✅ Updated | Removed header "Start" button, added animations |
| Feature Cards | ✅ Animated | Hover lift, shadow, icon scale |
| CTA Button | ✅ Animated | Subtle bounce animation |
| Chat Page | ✅ Updated | Project selector centered in chat area |
| Project Selector | ✅ Implemented | Dropdown to switch RAG context |
| Pipeline Progress | ✅ Implemented | Phase 1-4 complete banners |

### 🔧 API Routes Summary

| Route | Method | Description | Status |
|-------|--------|-------------|--------|
| `/api/pipeline/reframe` | POST | Step 1: Reframe Problem | ✅ |
| `/api/pipeline/vision` | POST | Step 2: Write Vision | ✅ |
| `/api/pipeline/personas` | POST | Step 3: Persona Profiles | ✅ |
| `/api/pipeline/questions` | POST | Step 4: Clarifying Questions | ✅ |
| `/api/pipeline/market` | POST | Step 5: Market Analysis | ✅ |
| `/api/pipeline/prd` | POST | Step 6: PRD Generation | ✅ |
| `/api/pipeline/stories` | POST | Step 7: User Stories | ⏳ |
| `/api/pipeline/backlog` | POST | Step 8: Backlog & Roadmap | ⏳ |
| `/api/pipeline/okrs` | POST | Step 9: OKRs & Metrics | ⏳ |

### 🔧 New Features Summary

| Feature | Description | Location |
|---------|-------------|----------|
| **Advanced Tools** | 5 AI-powered tool cards (MeetingPro, PDF Generator, Engineer Prompt, Backlog Manager, Prompt Builder) | Landing Page |
| **Presentation Generator** | PPT generation from project step data | `/presentation` |
| **Step Completion Sync** | All 9 steps sync based on saved sessions | Project Pipeline |
| **Export Enhanced** | PDF/DOC export with UI-matching format | Project Detail |
| **License & Footer** | MIT License with copyright footer | All Pages |
| **Neon Database** | Replaced Prisma with @neondatabase/serverless | Backend |
| **Sidebar Updated** | 5 navigation items (added Presentation) | Layout |
