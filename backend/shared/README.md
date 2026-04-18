# Shared Module

Shared types, utilities, and configuration used across all phases.

## Structure

```
shared/
├── types/
│   ├── project.ts      # Project, PipelineStep, ProjectStatus types
│   ├── pipeline.ts     # PipelineContext, StepOutput, orchestrator interfaces
│   ├── persona.ts      # Persona, Demographics types
│   ├── prd.ts          # PRD, PRDSection, FunctionalRequirement types
│   ├── story.ts        # UserStory, Epic, AcceptanceCriteria types
│   ├── market.ts       # Competitor, MarketOverview, SWOT types
│   └── okr.ts          # OKR, KeyResult, SuccessMetric types
├── utils/
│   ├── export.ts       # PDF/Markdown/DOCX export utilities
│   ├── validators.ts   # Zod schemas for all output types
│   └── token-counter.ts # Token counting for prompt budget management
└── config/
    ├── env.ts          # Environment variable validation (Zod)
    └── constants.ts    # Step names, model configs, limits
```
