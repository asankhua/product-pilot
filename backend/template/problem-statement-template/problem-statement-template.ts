// Problem Statement Template
// Based on ProductPlan's 5-component framework
// Source: https://www.productplan.com/learn/guide-to-writing-an-effective-problem-statement/
// Use for Step 1: Reframe Problem Statement in the Product Pilot pipeline

export interface ProblemStatement {
  // Overview
  problemTitle: string
  oneLineSummary: string
  
  // 1. The Problem
  problemDescription: string
  affectedUsers: string
  painPoints: string
  
  // 2. Context
  rootCauses: string
  whenItOccurs: string
  howItManifests: string
  currentWorkarounds: string
  existingSolutionFailures: string
  
  // 3. Scope
  inScope: string
  outOfScope: string
  boundaries: string
  
  // 4. Measurability
  currentMetric: string
  targetMetric: string
  timeframe: string
  successCriteria: string
  
  // 5. Impact
  businessImpact: string
  userImpact: string
  consequences: string
  benefits: string
  
  // Validation
  supportingData: string
  userResearch: string
  marketEvidence: string
  stakeholderInput: string
  
  // Concise format (Mad Libs style)
  targetUser: string
  whoStatement: string
  theProblem: string
  isAProblem: string
  thatCauses: string
  unlikeCurrent: string
  ourSolution: string
  
  // Next steps
  nextStep1: string
  nextStep2: string
  nextStep3: string
}

export const problemStatementTemplate = {
  title: "{{problemTitle}}",
  
  overview: {
    oneLineSummary: "{{oneLineSummary}}"
  },

  // 1. The Problem
  problem: {
    description: "{{problemDescription}}",
    affectedUsers: "{{affectedUsers}}",
    painPoints: "{{painPoints}}"
  },

  // 2. Context
  context: {
    rootCauses: "{{rootCauses}}",
    whenItOccurs: "{{whenItOccurs}}",
    howItManifests: "{{howItManifests}}",
    currentWorkarounds: "{{currentWorkarounds}}",
    existingSolutionFailures: "{{existingSolutionFailures}}"
  },

  // 3. Scope
  scope: {
    inScope: "{{inScope}}",
    outOfScope: "{{outOfScope}}",
    boundaries: "{{boundaries}}"
  },

  // 4. Measurability
  measurability: {
    currentMetric: "{{currentMetric}}",
    targetMetric: "{{targetMetric}}",
    timeframe: "{{timeframe}}",
    successCriteria: "{{successCriteria}}"
  },

  // 5. Impact
  impact: {
    businessImpact: "{{businessImpact}}",
    userImpact: "{{userImpact}}",
    consequences: "{{consequences}}",
    benefits: "{{benefits}}"
  },

  // Validation
  validation: {
    supportingData: "{{supportingData}}",
    userResearch: "{{userResearch}}",
    marketEvidence: "{{marketEvidence}}",
    stakeholderInput: "{{stakeholderInput}}"
  },

  // Concise format (Mad Libs style)
  conciseFormat: {
    targetUser: "{{targetUser}}",
    whoStatement: "{{whoStatement}}",
    theProblem: "{{theProblem}}",
    isAProblem: "{{isAProblem}}",
    thatCauses: "{{thatCauses}}",
    unlikeCurrent: "{{unlikeCurrent}}",
    ourSolution: "{{ourSolution}}"
  },

  // Next steps
  nextSteps: [
    "{{nextStep1}}",
    "{{nextStep2}}",
    "{{nextStep3}}"
  ]
}

// Variable placeholders for template filling
export const templateVariables = [
  // Overview
  'problemTitle', 'oneLineSummary',
  
  // Problem
  'problemDescription', 'affectedUsers', 'painPoints',
  
  // Context
  'rootCauses', 'whenItOccurs', 'howItManifests', 'currentWorkarounds', 'existingSolutionFailures',
  
  // Scope
  'inScope', 'outOfScope', 'boundaries',
  
  // Measurability
  'currentMetric', 'targetMetric', 'timeframe', 'successCriteria',
  
  // Impact
  'businessImpact', 'userImpact', 'consequences', 'benefits',
  
  // Validation
  'supportingData', 'userResearch', 'marketEvidence', 'stakeholderInput',
  
  // Concise format
  'targetUser', 'whoStatement', 'theProblem', 'isAProblem', 'thatCauses', 'unlikeCurrent', 'ourSolution',
  
  // Next steps
  'nextStep1', 'nextStep2', 'nextStep3'
]

// Helper function to fill template with data
export function fillTemplate(
  template: typeof problemStatementTemplate,
  data: Record<string, string>
): typeof problemStatementTemplate {
  const filled = JSON.parse(JSON.stringify(template))
  
  function replaceVars(obj: any) {
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        let str = obj[key]
        for (const [varName, value] of Object.entries(data)) {
          str = str.replace(new RegExp(`{{${varName}}}`, 'g'), value)
        }
        obj[key] = str
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        if (Array.isArray(obj[key])) {
          obj[key] = obj[key].map((item: any) => {
            if (typeof item === 'string') {
              let str = item
              for (const [varName, value] of Object.entries(data)) {
                str = str.replace(new RegExp(`{{${varName}}}`, 'g'), value)
              }
              return str
            }
            return item
          })
        } else {
          replaceVars(obj[key])
        }
      }
    }
  }
  
  replaceVars(filled)
  return filled
}

// Generate markdown from filled template
export function generateMarkdown(
  problemStatement: typeof problemStatementTemplate,
  productName: string
): string {
  return `# ${problemStatement.title}

## One-Line Summary
${problemStatement.overview.oneLineSummary}

---

## Problem Statement Framework

### 1. The Problem

**Problem Description:**
${problemStatement.problem.description}

**Who is affected:**
${problemStatement.problem.affectedUsers}

**Current pain points:**
${problemStatement.problem.painPoints}

---

### 2. Context

**Root Causes:**
${problemStatement.context.rootCauses}

**When it occurs:**
${problemStatement.context.whenItOccurs}

**How it manifests:**
${problemStatement.context.howItManifests}

**Current workarounds (if any):**
${problemStatement.context.currentWorkarounds}

**Why existing solutions fail:**
${problemStatement.context.existingSolutionFailures}

---

### 3. Scope

**In Scope:**
${problemStatement.scope.inScope}

**Out of Scope:**
${problemStatement.scope.outOfScope}

**Boundaries & Constraints:**
${problemStatement.scope.boundaries}

---

### 4. Measurability

**Current State Metric:**
${problemStatement.measurability.currentMetric}

**Target State Metric:**
${problemStatement.measurability.targetMetric}

**Timeframe:**
${problemStatement.measurability.timeframe}

**Success Criteria:**
${problemStatement.measurability.successCriteria}

---

### 5. Impact

**Business Impact:**
${problemStatement.impact.businessImpact}

**User Impact:**
${problemStatement.impact.userImpact}

**Consequences of not solving:**
${problemStatement.impact.consequences}

**Benefits of solving:**
${problemStatement.impact.benefits}

---

## Validation & Evidence

### Supporting Data
${problemStatement.validation.supportingData}

### User Research Insights
${problemStatement.validation.userResearch}

### Market Evidence
${problemStatement.validation.marketEvidence}

### Stakeholder Input
${problemStatement.validation.stakeholderInput}

---

## Problem Statement Draft (Concise Version)

> **For:** ${problemStatement.conciseFormat.targetUser}  
> **Who:** ${problemStatement.conciseFormat.whoStatement}  
> **The:** ${problemStatement.conciseFormat.theProblem}  
> **Is a:** ${problemStatement.conciseFormat.isAProblem}  
> **That:** ${problemStatement.conciseFormat.thatCauses}  
> **Unlike:** ${problemStatement.conciseFormat.unlikeCurrent}  
> **Our solution:** ${problemStatement.conciseFormat.ourSolution}

---

## Next Steps

1. ${problemStatement.nextSteps[0]}
2. ${problemStatement.nextSteps[1]}
3. ${problemStatement.nextSteps[2]}

---

*Generated for ${productName} - Product Pilot Step 1*
`
}

// Generate from raw input (AI pipeline use)
export function generateFromRawInput(
  rawProblem: string,
  productName: string
): string {
  // This would be used by the LLM to reframe the raw problem statement
  const template = { ...problemStatementTemplate }
  
  // Placeholder logic - in actual use, the LLM fills these
  const data: Record<string, string> = {
    problemTitle: `${productName} - Problem Statement`,
    oneLineSummary: rawProblem.substring(0, 100) + '...',
    problemDescription: rawProblem,
    affectedUsers: 'To be determined through research',
    // ... other fields would be filled by LLM
    nextStep1: 'Conduct user interviews to validate problem',
    nextStep2: 'Quantify impact with metrics',
    nextStep3: 'Move to Step 2: Product Vision'
  }
  
  const filled = fillTemplate(template, data)
  return generateMarkdown(filled, productName)
}

export default problemStatementTemplate
