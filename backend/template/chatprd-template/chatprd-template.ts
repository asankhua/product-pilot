// ChatPRD Template
// Comprehensive 6-section PRD template
// Source: https://www.chatprd.ai/templates/prd-product-requirement-document-template
// Use for Step 6: Generate PRD in the Product Pilot pipeline

export interface ChatPRD {
  // Metadata
  productName: string
  authorName: string
  date: string
  status: string
  version: string

  // 1. Background
  problemStatement1: string
  problemStatement2: string
  problemStatement3: string
  marketOpportunity1: string
  marketOpportunity2: string
  marketOpportunity3: string
  
  persona1Name: string
  persona1Characteristics: string
  persona1Needs: string
  persona1Challenges: string
  
  persona2Name: string
  persona2Characteristics: string
  persona2Needs: string
  persona2Challenges: string
  
  visionStatement: string
  productOrigin: string

  // 2. Objectives
  smartSpecific: string
  smartMeasurable: string
  smartAchievable: string
  smartRelevant: string
  smartTimebound: string
  
  kpi1: string
  kpi2: string
  kpi3: string
  
  qualitativeObjective1: string
  qualitativeObjective2: string
  
  strategicAlignment: string
  
  risk1: string
  risk2: string
  risk3: string
  mitigationStrategy1: string
  mitigationStrategy2: string
  mitigationStrategy3: string
  contingencyPlan1: string
  contingencyPlan2: string

  // 3. Features
  feature1Name: string
  feature1Description: string
  feature1Benefit: string
  feature1Specs: string
  
  feature2Name: string
  feature2Description: string
  feature2Benefit: string
  feature2Specs: string
  
  feature3Name: string
  feature3Description: string
  feature3Benefit: string
  feature3Specs: string
  
  targetUser1: string
  benefitForUser1: string
  targetUser2: string
  benefitForUser2: string
  
  technicalSpecifications: string
  
  priority0Feature: string
  priority0Rationale: string
  priority1Feature: string
  priority1Rationale: string
  priority2Feature: string
  priority2Rationale: string
  priority3Feature: string
  priority3Rationale: string
  
  futureEnhancement1: string
  futureEnhancement2: string
  futureEnhancement3: string

  // 4. User Experience
  uiDesignPrinciples: string
  uiVisualStyle: string
  uiWireframes: string
  
  userJourneyOnboarding: string
  userJourneyCore: string
  userJourneyEngagement: string
  
  usabilityTesting1: string
  usabilityTesting2: string
  
  accessibilityRequirements: string
  feedbackLoops: string

  // 5. Milestones
  phase1Activity: string
  phase1Duration: string
  phase1Status: string
  phase2Activity: string
  phase2Duration: string
  phase2Status: string
  phase3Activity: string
  phase3Duration: string
  phase3Status: string
  phase4Activity: string
  phase4Duration: string
  phase4Status: string
  phase5Activity: string
  phase5Duration: string
  phase5Status: string
  
  criticalPath: string
  
  reviewPoint1: string
  reviewPoint2: string
  reviewPoint3: string
  
  launchMarketing: string
  launchTraining: string
  launchSupport: string
  
  postLaunchEvaluation: string

  // 6. Technical Requirements
  techFrontend: string
  techBackend: string
  techDatabase: string
  techCloud: string
  techCICD: string
  
  systemArchitecture: string
  
  securityMeasure1: string
  securityMeasure2: string
  securityMeasure3: string
  
  performanceResponseTime: string
  performanceUptime: string
  performanceScalability: string
  
  integration1: string
  integration2: string
  integration3: string

  // 7. Success Metrics
  primaryMetrics: string
  secondaryMetrics: string
  reportingCadence: string

  // 8. Appendix
  glossary: string
  references: string
  
  changeDate1: string
  changeVersion1: string
  changeDescription1: string
  changeAuthor1: string
}

export const chatPrdTemplate = {
  metadata: {
    productName: "{{productName}}",
    authorName: "{{authorName}}",
    date: "{{date}}",
    status: "{{status}}",
    version: "{{version}}"
  },

  // 1. Background
  background: {
    problemStatement: [
      "{{problemStatement1}}",
      "{{problemStatement2}}",
      "{{problemStatement3}}"
    ],
    marketOpportunity: [
      "{{marketOpportunity1}}",
      "{{marketOpportunity2}}",
      "{{marketOpportunity3}}"
    ],
    userPersonas: {
      persona1: {
        name: "{{persona1Name}}",
        characteristics: "{{persona1Characteristics}}",
        needs: "{{persona1Needs}}",
        challenges: "{{persona1Challenges}}"
      },
      persona2: {
        name: "{{persona2Name}}",
        characteristics: "{{persona2Characteristics}}",
        needs: "{{persona2Needs}}",
        challenges: "{{persona2Challenges}}"
      }
    },
    visionStatement: "{{visionStatement}}",
    productOrigin: "{{productOrigin}}"
  },

  // 2. Objectives
  objectives: {
    smartGoals: {
      specific: "{{smartSpecific}}",
      measurable: "{{smartMeasurable}}",
      achievable: "{{smartAchievable}}",
      relevant: "{{smartRelevant}}",
      timebound: "{{smartTimebound}}"
    },
    kpis: ["{{kpi1}}", "{{kpi2}}", "{{kpi3}}"],
    qualitativeObjectives: ["{{qualitativeObjective1}}", "{{qualitativeObjective2}}"],
    strategicAlignment: "{{strategicAlignment}}",
    riskMitigation: {
      risks: ["{{risk1}}", "{{risk2}}", "{{risk3}}"],
      strategies: ["{{mitigationStrategy1}}", "{{mitigationStrategy2}}", "{{mitigationStrategy3}}"],
      contingencies: ["{{contingencyPlan1}}", "{{contingencyPlan2}}"]
    }
  },

  // 3. Features
  features: {
    coreFeatures: {
      feature1: {
        name: "{{feature1Name}}",
        description: "{{feature1Description}}",
        benefit: "{{feature1Benefit}}",
        specs: "{{feature1Specs}}"
      },
      feature2: {
        name: "{{feature2Name}}",
        description: "{{feature2Description}}",
        benefit: "{{feature2Benefit}}",
        specs: "{{feature2Specs}}"
      },
      feature3: {
        name: "{{feature3Name}}",
        description: "{{feature3Description}}",
        benefit: "{{feature3Benefit}}",
        specs: "{{feature3Specs}}"
      }
    },
    userBenefits: {
      user1: { target: "{{targetUser1}}", benefit: "{{benefitForUser1}}" },
      user2: { target: "{{targetUser2}}", benefit: "{{benefitForUser2}}" }
    },
    technicalSpecifications: "{{technicalSpecifications}}",
    prioritization: {
      p0: { feature: "{{priority0Feature}}", rationale: "{{priority0Rationale}}" },
      p1: { feature: "{{priority1Feature}}", rationale: "{{priority1Rationale}}" },
      p2: { feature: "{{priority2Feature}}", rationale: "{{priority2Rationale}}" },
      p3: { feature: "{{priority3Feature}}", rationale: "{{priority3Rationale}}" }
    },
    futureEnhancements: ["{{futureEnhancement1}}", "{{futureEnhancement2}}", "{{futureEnhancement3}}"]
  },

  // 4. User Experience
  userExperience: {
    uiDesign: {
      principles: "{{uiDesignPrinciples}}",
      visualStyle: "{{uiVisualStyle}}",
      wireframes: "{{uiWireframes}}"
    },
    userJourney: {
      onboarding: "{{userJourneyOnboarding}}",
      coreFlow: "{{userJourneyCore}}",
      engagement: "{{userJourneyEngagement}}"
    },
    usabilityTesting: ["{{usabilityTesting1}}", "{{usabilityTesting2}}"],
    accessibility: "{{accessibilityRequirements}}",
    feedbackLoops: "{{feedbackLoops}}"
  },

  // 5. Milestones
  milestones: {
    phases: [
      { activity: "{{phase1Activity}}", duration: "{{phase1Duration}}", status: "{{phase1Status}}" },
      { activity: "{{phase2Activity}}", duration: "{{phase2Duration}}", status: "{{phase2Status}}" },
      { activity: "{{phase3Activity}}", duration: "{{phase3Duration}}", status: "{{phase3Status}}" },
      { activity: "{{phase4Activity}}", duration: "{{phase4Duration}}", status: "{{phase4Status}}" },
      { activity: "{{phase5Activity}}", duration: "{{phase5Duration}}", status: "{{phase5Status}}" }
    ],
    criticalPath: "{{criticalPath}}",
    reviewPoints: ["{{reviewPoint1}}", "{{reviewPoint2}}", "{{reviewPoint3}}"],
    launchPlan: {
      marketing: "{{launchMarketing}}",
      training: "{{launchTraining}}",
      support: "{{launchSupport}}"
    },
    postLaunchEvaluation: "{{postLaunchEvaluation}}"
  },

  // 6. Technical Requirements
  technicalRequirements: {
    techStack: {
      frontend: "{{techFrontend}}",
      backend: "{{techBackend}}",
      database: "{{techDatabase}}",
      cloud: "{{techCloud}}",
      cicd: "{{techCICD}}"
    },
    systemArchitecture: "{{systemArchitecture}}",
    security: ["{{securityMeasure1}}", "{{securityMeasure2}}", "{{securityMeasure3}}"],
    performance: {
      responseTime: "{{performanceResponseTime}}",
      uptime: "{{performanceUptime}}",
      scalability: "{{performanceScalability}}"
    },
    integrations: ["{{integration1}}", "{{integration2}}", "{{integration3}}"]
  },

  // 7. Success Metrics
  successMetrics: {
    primary: "{{primaryMetrics}}",
    secondary: "{{secondaryMetrics}}",
    reportingCadence: "{{reportingCadence}}"
  },

  // 8. Appendix
  appendix: {
    glossary: "{{glossary}}",
    references: "{{references}}",
    changeLog: {
      date: "{{changeDate1}}",
      version: "{{changeVersion1}}",
      description: "{{changeDescription1}}",
      author: "{{changeAuthor1}}"
    }
  }
}

// All template variables
export const templateVariables = [
  // Metadata
  'productName', 'authorName', 'date', 'status', 'version',
  
  // Background
  'problemStatement1', 'problemStatement2', 'problemStatement3',
  'marketOpportunity1', 'marketOpportunity2', 'marketOpportunity3',
  'persona1Name', 'persona1Characteristics', 'persona1Needs', 'persona1Challenges',
  'persona2Name', 'persona2Characteristics', 'persona2Needs', 'persona2Challenges',
  'visionStatement', 'productOrigin',
  
  // Objectives
  'smartSpecific', 'smartMeasurable', 'smartAchievable', 'smartRelevant', 'smartTimebound',
  'kpi1', 'kpi2', 'kpi3',
  'qualitativeObjective1', 'qualitativeObjective2',
  'strategicAlignment',
  'risk1', 'risk2', 'risk3',
  'mitigationStrategy1', 'mitigationStrategy2', 'mitigationStrategy3',
  'contingencyPlan1', 'contingencyPlan2',
  
  // Features
  'feature1Name', 'feature1Description', 'feature1Benefit', 'feature1Specs',
  'feature2Name', 'feature2Description', 'feature2Benefit', 'feature2Specs',
  'feature3Name', 'feature3Description', 'feature3Benefit', 'feature3Specs',
  'targetUser1', 'benefitForUser1',
  'targetUser2', 'benefitForUser2',
  'technicalSpecifications',
  'priority0Feature', 'priority0Rationale',
  'priority1Feature', 'priority1Rationale',
  'priority2Feature', 'priority2Rationale',
  'priority3Feature', 'priority3Rationale',
  'futureEnhancement1', 'futureEnhancement2', 'futureEnhancement3',
  
  // User Experience
  'uiDesignPrinciples', 'uiVisualStyle', 'uiWireframes',
  'userJourneyOnboarding', 'userJourneyCore', 'userJourneyEngagement',
  'usabilityTesting1', 'usabilityTesting2',
  'accessibilityRequirements', 'feedbackLoops',
  
  // Milestones
  'phase1Activity', 'phase1Duration', 'phase1Status',
  'phase2Activity', 'phase2Duration', 'phase2Status',
  'phase3Activity', 'phase3Duration', 'phase3Status',
  'phase4Activity', 'phase4Duration', 'phase4Status',
  'phase5Activity', 'phase5Duration', 'phase5Status',
  'criticalPath',
  'reviewPoint1', 'reviewPoint2', 'reviewPoint3',
  'launchMarketing', 'launchTraining', 'launchSupport',
  'postLaunchEvaluation',
  
  // Technical Requirements
  'techFrontend', 'techBackend', 'techDatabase', 'techCloud', 'techCICD',
  'systemArchitecture',
  'securityMeasure1', 'securityMeasure2', 'securityMeasure3',
  'performanceResponseTime', 'performanceUptime', 'performanceScalability',
  'integration1', 'integration2', 'integration3',
  
  // Success Metrics
  'primaryMetrics', 'secondaryMetrics', 'reportingCadence',
  
  // Appendix
  'glossary', 'references',
  'changeDate1', 'changeVersion1', 'changeDescription1', 'changeAuthor1'
]

// Helper function to fill template with data
export function fillTemplate(
  template: typeof chatPrdTemplate,
  data: Record<string, string>
): typeof chatPrdTemplate {
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
export function generateMarkdown(prd: typeof chatPrdTemplate): string {
  const formatArray = (arr: string[]) => arr.map(item => `- ${item}`).join('\n')
  const formatObjectArray = (obj: Record<string, { target: string, benefit: string }>) => 
    Object.entries(obj).map(([key, val]) => `- **For ${val.target}:** ${val.benefit}`).join('\n')

  return `# ${prd.metadata.productName} - Product Requirements Document

**Author:** ${prd.metadata.authorName}  
**Date:** ${prd.metadata.date}  
**Status:** ${prd.metadata.status}  
**Version:** ${prd.metadata.version}

---

## 1. Background

### 1.1 Problem Statement
${formatArray(prd.background.problemStatement)}

### 1.2 Market Opportunity
${formatArray(prd.background.marketOpportunity)}

### 1.3 User Personas

#### Persona 1: ${prd.background.userPersonas.persona1.name}
- **Characteristics:** ${prd.background.userPersonas.persona1.characteristics}
- **Needs:** ${prd.background.userPersonas.persona1.needs}
- **Challenges:** ${prd.background.userPersonas.persona1.challenges}

#### Persona 2: ${prd.background.userPersonas.persona2.name}
- **Characteristics:** ${prd.background.userPersonas.persona2.characteristics}
- **Needs:** ${prd.background.userPersonas.persona2.needs}
- **Challenges:** ${prd.background.userPersonas.persona2.challenges}

### 1.4 Vision Statement
${prd.background.visionStatement}

### 1.5 Product Origin
${prd.background.productOrigin}

---

## 2. Objectives

### 2.1 SMART Goals
- **Specific:** ${prd.objectives.smartGoals.specific}
- **Measurable:** ${prd.objectives.smartGoals.measurable}
- **Achievable:** ${prd.objectives.smartGoals.achievable}
- **Relevant:** ${prd.objectives.smartGoals.relevant}
- **Time-bound:** ${prd.objectives.smartGoals.timebound}

### 2.2 Key Performance Indicators (KPIs)
${formatArray(prd.objectives.kpis)}

### 2.3 Qualitative Objectives
${formatArray(prd.objectives.qualitativeObjectives)}

### 2.4 Strategic Alignment
${prd.objectives.strategicAlignment}

### 2.5 Risk Mitigation

#### Risks
${formatArray(prd.objectives.riskMitigation.risks)}

#### Mitigation Strategies
${formatArray(prd.objectives.riskMitigation.strategies)}

#### Contingency Plans
${formatArray(prd.objectives.riskMitigation.contingencies)}

---

## 3. Features

### 3.1 Core Features

#### Feature 1: ${prd.features.coreFeatures.feature1.name}
- **Description:** ${prd.features.coreFeatures.feature1.description}
- **User Benefit:** ${prd.features.coreFeatures.feature1.benefit}
- **Technical Specs:** ${prd.features.coreFeatures.feature1.specs}

#### Feature 2: ${prd.features.coreFeatures.feature2.name}
- **Description:** ${prd.features.coreFeatures.feature2.description}
- **User Benefit:** ${prd.features.coreFeatures.feature2.benefit}
- **Technical Specs:** ${prd.features.coreFeatures.feature2.specs}

#### Feature 3: ${prd.features.coreFeatures.feature3.name}
- **Description:** ${prd.features.coreFeatures.feature3.description}
- **User Benefit:** ${prd.features.coreFeatures.feature3.benefit}
- **Technical Specs:** ${prd.features.coreFeatures.feature3.specs}

### 3.2 User Benefits
- **For ${prd.features.userBenefits.user1.target}:** ${prd.features.userBenefits.user1.benefit}
- **For ${prd.features.userBenefits.user2.target}:** ${prd.features.userBenefits.user2.benefit}

### 3.3 Technical Specifications
${prd.features.technicalSpecifications}

### 3.4 Feature Prioritization

| Priority | Feature | MoSCoW | Rationale |
|----------|---------|--------|-----------|
| P0 | ${prd.features.prioritization.p0.feature} | Must Have | ${prd.features.prioritization.p0.rationale} |
| P1 | ${prd.features.prioritization.p1.feature} | Should Have | ${prd.features.prioritization.p1.rationale} |
| P2 | ${prd.features.prioritization.p2.feature} | Could Have | ${prd.features.prioritization.p2.rationale} |
| P3 | ${prd.features.prioritization.p3.feature} | Won't Have (Now) | ${prd.features.prioritization.p3.rationale} |

### 3.5 Future Enhancements
${formatArray(prd.features.futureEnhancements)}

---

## 4. User Experience

### 4.1 User Interface (UI) Design
- **Design Principles:** ${prd.userExperience.uiDesign.principles}
- **Visual Style:** ${prd.userExperience.uiDesign.visualStyle}
- **Wireframes:** ${prd.userExperience.uiDesign.wireframes}

### 4.2 User Journey
- **Onboarding:** ${prd.userExperience.userJourney.onboarding}
- **Core Flow:** ${prd.userExperience.userJourney.coreFlow}
- **Engagement:** ${prd.userExperience.userJourney.engagement}

### 4.3 Usability Testing
${formatArray(prd.userExperience.usabilityTesting)}

### 4.4 Accessibility
${prd.userExperience.accessibility}

### 4.5 Feedback Loops
${prd.userExperience.feedbackLoops}

---

## 5. Milestones

### 5.1 Development Phases

| Phase | Activity | Duration | Status |
|-------|----------|----------|--------|
| 1 | ${prd.milestones.phases[0].activity} | ${prd.milestones.phases[0].duration} | ${prd.milestones.phases[0].status} |
| 2 | ${prd.milestones.phases[1].activity} | ${prd.milestones.phases[1].duration} | ${prd.milestones.phases[1].status} |
| 3 | ${prd.milestones.phases[2].activity} | ${prd.milestones.phases[2].duration} | ${prd.milestones.phases[2].status} |
| 4 | ${prd.milestones.phases[3].activity} | ${prd.milestones.phases[3].duration} | ${prd.milestones.phases[3].status} |
| 5 | ${prd.milestones.phases[4].activity} | ${prd.milestones.phases[4].duration} | ${prd.milestones.phases[4].status} |

### 5.2 Critical Path
${prd.milestones.criticalPath}

### 5.3 Review Points
${formatArray(prd.milestones.reviewPoints)}

### 5.4 Launch Plan
- **Marketing:** ${prd.milestones.launchPlan.marketing}
- **Training:** ${prd.milestones.launchPlan.training}
- **Support:** ${prd.milestones.launchPlan.support}

### 5.5 Post-Launch Evaluation
${prd.milestones.postLaunchEvaluation}

---

## 6. Technical Requirements

### 6.1 Tech Stack
- **Frontend:** ${prd.technicalRequirements.techStack.frontend}
- **Backend:** ${prd.technicalRequirements.techStack.backend}
- **Database:** ${prd.technicalRequirements.techStack.database}
- **Cloud Services:** ${prd.technicalRequirements.techStack.cloud}
- **CI/CD:** ${prd.technicalRequirements.techStack.cicd}

### 6.2 System Architecture
${prd.technicalRequirements.systemArchitecture}

### 6.3 Security Measures
${formatArray(prd.technicalRequirements.security)}

### 6.4 Performance Metrics
- **Response Time:** ${prd.technicalRequirements.performance.responseTime}
- **Uptime:** ${prd.technicalRequirements.performance.uptime}
- **Scalability:** ${prd.technicalRequirements.performance.scalability}

### 6.5 Integration Requirements
${formatArray(prd.technicalRequirements.integrations)}

---

## 7. Success Metrics & Analytics

### 7.1 Primary Metrics
${prd.successMetrics.primary}

### 7.2 Secondary Metrics
${prd.successMetrics.secondary}

### 7.3 Reporting Cadence
${prd.successMetrics.reportingCadence}

---

## 8. Appendix

### 8.1 Glossary
${prd.appendix.glossary}

### 8.2 References
${prd.appendix.references}

### 8.3 Change Log
| Date | Version | Changes | Author |
|------|---------|---------|--------|
| ${prd.appendix.changeLog.date} | ${prd.appendix.changeLog.version} | ${prd.appendix.changeLog.description} | ${prd.appendix.changeLog.author} |

---

*Generated for ${prd.metadata.productName} - Product Pilot Step 6*
`
}

export default chatPrdTemplate
