// Step 9: OKRs & Success Metrics - Prompt Template

export const OKRS_SYSTEM_PROMPT = `You are an expert Product Manager AI assistant specializing in OKR (Objectives and Key Results) frameworks and success metrics. Your task is to define measurable OKRs and AARRR metrics for a product.

OKR Guidelines:
- Objectives should be qualitative, inspirational, and time-bound
- Key Results should be quantitative, measurable, and challenging but achievable
- Each objective should have 2-4 key results
- Focus on outcomes, not outputs
- Align OKRs with the product vision and roadmap

AARRR Metrics (Pirate Metrics):
- Acquisition: How do users find us?
- Activation: Do users have a great first experience?
- Retention: Do users come back?
- Revenue: How do we make money?
- Referral: Do users tell others?

Also identify a North Star Metric — the single metric that best captures the core value the product delivers.

IMPORTANT: Respond ONLY with valid JSON matching the schema below. No additional text.`;

export const OKRS_OUTPUT_SCHEMA = `{
  "okrs": [
    {
      "objective": "string - qualitative, inspirational objective",
      "quarter": "string - e.g., 'Q3 2026'",
      "keyResults": [
        {
          "description": "string - specific, measurable KR",
          "targetValue": "string - e.g., '1000'",
          "unit": "string - e.g., 'restaurants'",
          "currentValue": "string - starting point, e.g., '0'",
          "confidence": "high | medium | low"
        }
      ]
    }
  ],
  "successMetrics": [
    {
      "category": "acquisition | activation | retention | revenue | referral",
      "name": "string - metric name",
      "formula": "string - how to calculate",
      "target": "string - target value with timeframe",
      "frequency": "daily | weekly | monthly | quarterly",
      "dataSource": "string - where the data comes from"
    }
  ],
  "northStarMetric": {
    "name": "string - metric name",
    "definition": "string - precise definition",
    "target": "string - initial target",
    "rationale": "string - why this is the north star"
  }
}`;

export function buildOKRsPrompt(
  vision: string,
  prd: string,
  roadmap: string,
  ragContext: string
): string {
  return `Based on the product vision, PRD, and roadmap, define OKRs and success metrics.

PRODUCT VISION:
${vision}

PRD SUMMARY:
${prd}

ROADMAP:
${roadmap}

${ragContext ? `ADDITIONAL CONTEXT:\n${ragContext}\n` : ""}

Instructions:
1. Create 2-4 OKRs for the first quarter of product launch
2. Each objective should have 2-4 measurable key results
3. Define AARRR metrics (at least one per category)
4. Identify the North Star Metric with clear rationale
5. All targets should be ambitious but realistic for a new product
6. Include the measurement formula and data source for each metric
7. Confidence levels: high = proven proxy, medium = reasonable estimate, low = aspirational

Respond with JSON matching this schema:
${OKRS_OUTPUT_SCHEMA}`;
}
