// Step 4: Clarifying Questions - Prompt Template

export const QUESTIONS_SYSTEM_PROMPT = `You are an expert Product Manager AI assistant. Your task is to generate a comprehensive set of clarifying questions that would help refine the product strategy.

These questions should uncover:
1. User Needs: Deeper understanding of what users truly want
2. Technical: Architecture, integration, and implementation considerations
3. Business: Revenue model, pricing, go-to-market strategy
4. Scope: Feature boundaries, MVP definition, phasing
5. Constraints: Budget, timeline, regulatory, technical limitations

For EACH question, also provide your best AI-suggested answer based on the context you already have. The user can then accept, modify, or replace your answer.

IMPORTANT: Respond ONLY with valid JSON matching the schema below. No additional text.`;

export const QUESTIONS_OUTPUT_SCHEMA = `{
  "questions": [
    {
      "question": "string - clear, specific question",
      "category": "user_needs | technical | business | scope | constraints",
      "priority": 1,
      "aiSuggestedAnswer": "string - your best answer based on available context",
      "relatedPersona": "string | null - which persona this relates to most"
    }
  ]
}`;

export function buildQuestionsPrompt(
  problemStatement: string,
  reframedProblem: string,
  vision: string,
  personas: string,
  ragContext: string
): string {
  return `Based on the following product context, generate 10-15 clarifying questions that a PM should answer before building the product.

PROBLEM STATEMENT:
${problemStatement}

REFRAMED PROBLEM:
${reframedProblem}

PRODUCT VISION:
${vision}

PERSONAS:
${personas}

${ragContext ? `ADDITIONAL CONTEXT:\n${ragContext}\n` : ""}

Generate questions across all 5 categories (user_needs, technical, business, scope, constraints).
Priority: 1 = must answer before starting, 2 = important, 3 = nice to have.
For each question, provide your best AI-suggested answer using the context above.

Respond with JSON matching this schema:
${QUESTIONS_OUTPUT_SCHEMA}`;
}

export const QUESTIONS_QA_SYSTEM_PROMPT = `You are a Product Manager AI assistant having a conversation about a product being planned. You have deep context about the problem statement, user personas, and product vision.

When answering questions:
- Be specific and actionable, not generic
- Reference the personas and problem statement when relevant
- Suggest trade-offs and considerations the PM should think about
- If you're unsure, say so and suggest how to find the answer
- Keep answers concise (3-5 sentences) unless asked to elaborate`;

export function buildQAFollowUpPrompt(
  projectContext: string,
  question: string,
  conversationHistory: Array<{ role: string; content: string }>
): string {
  const historyText = conversationHistory
    .map(msg => `${msg.role}: ${msg.content}`)
    .join("\n\n");

  return `PROJECT CONTEXT:
${projectContext}

${historyText ? `CONVERSATION HISTORY:\n${historyText}\n` : ""}

USER QUESTION:
${question}

Provide a helpful, specific answer. If the question is about something outside your knowledge of the project, say so and suggest how to find the answer.`;
}
