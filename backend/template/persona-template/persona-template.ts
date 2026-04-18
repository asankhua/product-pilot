// User Persona Template
// Based on Product School's persona methodology
// Source: https://productschool.com/blog/user-experience/product-persona
// Use for Step 3: Identify & Profile Personas in the Product Pilot pipeline

export interface Persona {
  // Basic Info
  personaName: string
  personaRole: string
  name: string
  role: string
  age: number
  generation: string // Gen Z, Millennial, Gen X, Boomer
  location: string
  quote: string
  
  // Demographics
  gender: string
  education: string
  occupation: string
  incomeLevel: string
  familyStatus: string
  livingSituation: string
  
  // Professional
  industry: string
  companySize: string
  yearsExperience: string
  technicalSkill: number // 1-5 scale
  toolsUsed: string[]
  
  // Psychographics
  personalityTraits: string
  values: string
  fears: string
  motivations: string
  hobbies: string
  favoriteBrands: string[]
  influencers: string[]
  
  // Usage Patterns
  usageFrequency: string
  sessionDuration: string
  primaryDevices: string[]
  usageContext: string
  timeOfDay: string
  
  // Goals & Pain Points
  goals: string[]
  painPoints: {
    title: string
    description: string
  }[]
  needs: string[]
  
  // Journey Context
  currentBehavior: string
  dayInTheLife: string
  triggerEvents: string
  decisionMaking: string
  
  // Product Fit
  whyNeedProduct: string
  howTheyllUseIt: string
  successMetrics: string
  objections: string
  
  // Metadata
  isPrimaryPersona: boolean
  relatedPersonas: string[]
  personaSegment: string
  
  // Validation
  dataSources: string
  validatedAssumptions: string
  openQuestions: string
}

export const personaTemplate = {
  title: "{{personaName}} - {{personaRole}}",
  
  overview: {
    name: "{{name}}",
    role: "{{role}}",
    age: "{{age}}",
    generation: "{{generation}}",
    location: "{{location}}",
    quote: "{{quote}}"
  },

  demographics: {
    personal: {
      gender: "{{gender}}",
      education: "{{education}}",
      occupation: "{{occupation}}",
      incomeLevel: "{{incomeLevel}}",
      familyStatus: "{{familyStatus}}",
      livingSituation: "{{livingSituation}}"
    },
    professional: {
      industry: "{{industry}}",
      companySize: "{{companySize}}",
      yearsExperience: "{{yearsExperience}}",
      technicalSkill: "{{technicalSkill}}",
      toolsUsed: "{{toolsUsed}}"
    }
  },

  psychographics: {
    personalityTraits: "{{personalityTraits}}",
    values: "{{values}}",
    fears: "{{fears}}",
    motivations: "{{motivations}}",
    hobbies: "{{hobbies}}",
    favoriteBrands: "{{favoriteBrands}}",
    influencers: "{{influencers}}"
  },

  usageProfile: {
    patterns: {
      frequency: "{{usageFrequency}}",
      sessionDuration: "{{sessionDuration}}",
      primaryDevices: "{{primaryDevices}}",
      context: "{{usageContext}}",
      timeOfDay: "{{timeOfDay}}"
    },
    goals: ["{{goal1}}", "{{goal2}}", "{{goal3}}"],
    painPoints: [
      { title: "{{painPoint1Title}}", description: "{{painPoint1Description}}" },
      { title: "{{painPoint2Title}}", description: "{{painPoint2Description}}" },
      { title: "{{painPoint3Title}}", description: "{{painPoint3Description}}" }
    ],
    needs: ["{{need1}}", "{{need2}}", "{{need3}}"]
  },

  journeyContext: {
    currentBehavior: "{{currentBehavior}}",
    dayInTheLife: "{{dayInTheLife}}",
    triggerEvents: "{{triggerEvents}}",
    decisionMaking: "{{decisionMaking}}"
  },

  productFit: {
    whyNeedProduct: "{{whyNeedProduct}}",
    howTheyllUseIt: "{{howTheyllUseIt}}",
    successMetrics: "{{successMetrics}}",
    objections: "{{objections}}"
  },

  metadata: {
    isPrimaryPersona: "{{isPrimaryPersona}}",
    relatedPersonas: "{{relatedPersonas}}",
    personaSegment: "{{personaSegment}}"
  },

  validation: {
    dataSources: "{{dataSources}}",
    validatedAssumptions: "{{validatedAssumptions}}",
    openQuestions: "{{openQuestions}}"
  }
}

// Variable placeholders for template filling
export const templateVariables = [
  // Overview
  'personaName', 'personaRole', 'name', 'role', 'age', 'generation', 'location', 'quote',
  
  // Demographics - Personal
  'gender', 'education', 'occupation', 'incomeLevel', 'familyStatus', 'livingSituation',
  
  // Demographics - Professional
  'industry', 'companySize', 'yearsExperience', 'technicalSkill', 'toolsUsed',
  
  // Psychographics
  'personalityTraits', 'values', 'fears', 'motivations', 'hobbies', 'favoriteBrands', 'influencers',
  
  // Usage Profile
  'usageFrequency', 'sessionDuration', 'primaryDevices', 'usageContext', 'timeOfDay',
  
  // Goals & Pain Points
  'goal1', 'goal2', 'goal3',
  'painPoint1Title', 'painPoint1Description',
  'painPoint2Title', 'painPoint2Description',
  'painPoint3Title', 'painPoint3Description',
  'need1', 'need2', 'need3',
  
  // Journey Context
  'currentBehavior', 'dayInTheLife', 'triggerEvents', 'decisionMaking',
  
  // Product Fit
  'whyNeedProduct', 'howTheyllUseIt', 'successMetrics', 'objections',
  
  // Metadata
  'isPrimaryPersona', 'relatedPersonas', 'personaSegment',
  
  // Validation
  'dataSources', 'validatedAssumptions', 'openQuestions'
]

// Helper function to fill template with data
export function fillTemplate(
  template: typeof personaTemplate,
  data: Record<string, string>
): typeof personaTemplate {
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
            } else if (typeof item === 'object' && item !== null) {
              replaceVars(item)
              return item
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
export function generateMarkdown(persona: typeof personaTemplate, productName: string): string {
  const goalsList = persona.usageProfile.goals.map((g, i) => `${i + 1}. ${g}`).join('\n')
  const painPointsList = persona.usageProfile.painPoints.map((p, i) => 
    `${i + 1}. **${p.title}:** ${p.description}`
  ).join('\n')
  const needsList = persona.usageProfile.needs.map((n, i) => `${i + 1}. ${n}`).join('\n')

  return `# ${persona.overview.name} - ${persona.overview.role}

## Persona Overview

| Attribute | Details |
|-----------|---------|
| **Name** | ${persona.overview.name} |
| **Role/Title** | ${persona.overview.role} |
| **Age** | ${persona.overview.age} |
| **Generation** | ${persona.overview.generation} |
| **Location** | ${persona.overview.location} |
| **Quote** | *"${persona.overview.quote}"* |

---

## Demographics & Background

### Personal Information
- **Gender:** ${persona.demographics.personal.gender}
- **Education:** ${persona.demographics.personal.education}
- **Occupation:** ${persona.demographics.personal.occupation}
- **Income Level:** ${persona.demographics.personal.incomeLevel}
- **Family Status:** ${persona.demographics.personal.familyStatus}
- **Living Situation:** ${persona.demographics.personal.livingSituation}

### Professional Background
- **Industry:** ${persona.demographics.professional.industry}
- **Company Size:** ${persona.demographics.professional.companySize}
- **Years of Experience:** ${persona.demographics.professional.yearsExperience}
- **Technical Skill Level:** ${persona.demographics.professional.technicalSkill}/5
- **Tools They Use:** ${persona.demographics.professional.toolsUsed}

---

## Psychographics

### Personality Traits
${persona.psychographics.personalityTraits}

### Values & Beliefs
${persona.psychographics.values}

### Fears & Frustrations
${persona.psychographics.fears}

### Motivations & Aspirations
${persona.psychographics.motivations}

### Hobbies & Interests
${persona.psychographics.hobbies}

### Favorite Brands
${persona.psychographics.favoriteBrands}

### Influencers They Follow
${persona.psychographics.influencers}

---

## Product Usage Profile

### Usage Patterns
| Metric | Details |
|--------|---------|
| **Usage Frequency** | ${persona.usageProfile.patterns.frequency} |
| **Session Duration** | ${persona.usageProfile.patterns.sessionDuration} |
| **Primary Device(s)** | ${persona.usageProfile.patterns.primaryDevices} |
| **Usage Context** | ${persona.usageProfile.patterns.context} |
| **Time of Day** | ${persona.usageProfile.patterns.timeOfDay} |

### Goals & Objectives
${goalsList}

### Pain Points & Challenges
${painPointsList}

### Needs from Product
${needsList}

---

## User Journey Context

### Current Behavior
${persona.journeyContext.currentBehavior}

### Day in the Life
${persona.journeyContext.dayInTheLife}

### Trigger Events
${persona.journeyContext.triggerEvents}

### Decision Making Process
${persona.journeyContext.decisionMaking}

---

## Product Fit

### Why They Need This Product
${persona.productFit.whyNeedProduct}

### How They'll Use It
${persona.productFit.howTheyllUseIt}

### Success Metrics for This Persona
${persona.productFit.successMetrics}

### Potential Objections
${persona.productFit.objections}

---

## Related Personas

- **Primary Persona:** ${persona.metadata.isPrimaryPersona}
- **Related Personas:** ${persona.metadata.relatedPersonas}
- **Persona Segment:** ${persona.metadata.personaSegment}

---

## Validation & Research

### Data Sources
${persona.validation.dataSources}

### Assumptions Validated
${persona.validation.validatedAssumptions}

### Open Questions
${persona.validation.openQuestions}

---

*Generated for ${productName} - Product Pilot Step 3*
`
}

// Generate multiple personas from analysis data
export function generatePersonasFromData(
  personaData: Array<{
    name: string
    role: string
    age: number
    painPoints: string[]
    goals: string[]
    characteristics: Record<string, string>
  }>,
  productName: string
): string[] {
  return personaData.map(data => {
    const filledData: Record<string, string> = {
      personaName: data.name,
      personaRole: data.role,
      name: data.name,
      role: data.role,
      age: data.age.toString(),
      generation: data.age < 28 ? 'Gen Z' : data.age < 43 ? 'Millennial' : data.age < 59 ? 'Gen X' : 'Boomer',
      location: data.characteristics.location || 'TBD',
      quote: data.characteristics.quote || `"I need a solution that helps me ${data.goals[0] || 'achieve my goals'}."`,
      goal1: data.goals[0] || 'TBD',
      goal2: data.goals[1] || 'TBD',
      goal3: data.goals[2] || 'TBD',
      painPoint1Title: data.painPoints[0]?.split(':')[0] || 'Pain Point 1',
      painPoint1Description: data.painPoints[0]?.split(':')[1] || data.painPoints[0] || 'TBD',
      painPoint2Title: data.painPoints[1]?.split(':')[0] || 'Pain Point 2',
      painPoint2Description: data.painPoints[1]?.split(':')[1] || data.painPoints[1] || 'TBD',
      painPoint3Title: data.painPoints[2]?.split(':')[0] || 'Pain Point 3',
      painPoint3Description: data.painPoints[2]?.split(':')[1] || data.painPoints[2] || 'TBD',
      ...data.characteristics
    }
    
    const filled = fillTemplate(personaTemplate, filledData)
    return generateMarkdown(filled, productName)
  })
}

export default personaTemplate
