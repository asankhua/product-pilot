// Step 3: Persona Profiles - Prompt Template
import { buildTemplateGuidance } from "../../../../shared/services/template-service";

export const PERSONAS_SYSTEM_PROMPT = `You are an expert UX researcher and Product Manager AI assistant. Your task is to identify and create detailed user personas based on the problem statement and product vision. Follow the Product School Persona Template structure for consistent output.

For each persona, you must provide:
1. Name and role/title
2. A 2-3 sentence bio/background
3. Demographics (age range, location, education, income level)
4. Pain points (3-5 specific problems they face related to this product)
5. Frustrations (3-5 emotional frustrations with current solutions)
6. Goals (3-5 things they want to achieve)
7. Motivations (what drives their behavior)
8. Behaviors (how they currently work/act)
9. Interests (relevant interests)
10. Tech savviness level (low/medium/high)
11. A representative quote that captures their mindset

Create 3-5 distinct personas that represent the full spectrum of users. Include at least one primary user and one secondary stakeholder.

IMPORTANT: Respond ONLY with valid JSON matching the schema below. No additional text.`;

export const PERSONAS_OUTPUT_SCHEMA = `{
  "personas": [
    {
      "name": "string - realistic first name",
      "role": "string - job title or role description",
      "bio": "string - 2-3 sentence background",
      "demographics": {
        "ageRange": "string - e.g., '28-35'",
        "location": "string - e.g., 'Urban, Tier-2 cities, India'",
        "education": "string - e.g., 'Bachelor's degree'",
        "incomeLevel": "string - e.g., 'Middle income ($30K-50K/year)'"
      },
      "painPoints": ["string - 3-5 specific pain points"],
      "frustrations": ["string - 3-5 emotional frustrations"],
      "goals": ["string - 3-5 goals"],
      "motivations": ["string - 3-5 motivations"],
      "behaviors": ["string - 3-5 current behaviors"],
      "interests": ["string - 3-5 relevant interests"],
      "techSavviness": "low | medium | high",
      "quote": "string - representative quote in first person"
    }
  ]
}`;

export function buildPersonasPrompt(
  problemStatement: string,
  reframedProblem: string,
  vision: string,
  ragContext: string
): string {
  return `Based on the following problem analysis and product vision, identify and create detailed user personas.

PROBLEM STATEMENT:
${problemStatement}

REFRAMED PROBLEM:
${reframedProblem}

PRODUCT VISION:
${vision}

${ragContext ? `ADDITIONAL CONTEXT:\n${ragContext}\n` : ""}

Create 3-5 distinct personas. For each persona, think about:
- Who are the PRIMARY users? (the ones who will use the product daily)
- Who are the SECONDARY stakeholders? (affected by but not the main users)
- What diversity exists in the user base? (demographics, tech comfort, goals)
- What makes each persona's needs unique?

${buildTemplateGuidance("persona")}

Respond with JSON matching this schema:
${PERSONAS_OUTPUT_SCHEMA}`;
}

export const PERSONAS_FEW_SHOT_EXAMPLE = {
  problemStatement: "Restaurant owners in tier-2 cities struggle to reach online customers due to high commission fees from existing platforms.",
  outputPersonaExample: {
    name: "Rajesh",
    role: "Restaurant Owner",
    bio: "Rajesh has run a popular family dhaba in Jaipur for 15 years. He's seen walk-in traffic decline as more customers order online through Swiggy and Zomato, but the 25-30% commission fees eat into his already thin margins.",
    demographics: {
      ageRange: "38-50",
      location: "Tier-2 city (Jaipur, India)",
      education: "12th pass / Some college",
      incomeLevel: "₹3-6 lakh/year (small business)"
    },
    painPoints: [
      "Losing 25-30% of revenue to aggregator commissions on every order",
      "No direct relationship with online customers — platform owns the data",
      "Cannot run targeted promotions or loyalty programs for regular customers",
      "Declining walk-in traffic as consumer behavior shifts to online ordering"
    ],
    frustrations: [
      "Complex partner dashboards that require constant monitoring",
      "Delayed payment cycles (7-14 days) from aggregator platforms",
      "Bad reviews he cannot respond to or contest effectively",
      "No control over how his restaurant is presented or ranked"
    ],
    goals: [
      "Grow monthly revenue by 30% through online orders",
      "Own customer contact information for direct marketing",
      "Reduce dependency on high-commission platforms",
      "Build a recognizable local brand online"
    ],
    motivations: [
      "Financial security for his family",
      "Pride in his cooking and restaurant heritage",
      "Keeping up with competition from chain restaurants",
      "Passing a thriving business to the next generation"
    ],
    behaviors: [
      "Uses WhatsApp heavily for personal and some business communication",
      "Watches YouTube tutorials in Hindi for learning new things",
      "Prefers cash transactions and is hesitant about digital payments",
      "Relies on word-of-mouth and local reputation for business growth"
    ],
    interests: [
      "Local food trends and seasonal menus",
      "Cost-saving tools and techniques",
      "Simple technology solutions with vernacular support",
      "Local business networking events"
    ],
    techSavviness: "low",
    quote: "I just want my customers to order directly from me without giving away a third of every order to these big platforms."
  }
};
