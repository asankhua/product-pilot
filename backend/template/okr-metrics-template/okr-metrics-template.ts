// OKRs + Success Metrics Template
// Comprehensive framework combining OKRs and product metrics
// Sources: Asana, Aakash Gupta, Oboard, Product School
// Use for Step 9: OKRs + Success Metrics in the Product Pilot pipeline

export interface OKRSet {
  objective: string
  keyResults: {
    description: string
    current: string
    target: string
    status: 'on-track' | 'at-risk' | 'behind'
  }[]
  alignment: string
  initiatives: string[]
}

export interface Metric {
  name: string
  definition: string
  current: string
  target: string
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly'
}

export interface OKRMetrics {
  // Metadata
  productName: string
  quarter: string
  teamName: string
  productLead: string
  lastUpdated: string

  // North Star Metric
  northStarDefinition: string
  northStarCurrent: string
  northStarTarget: string
  northStarRationale: string

  // OKRs (3 sets)
  okr1: OKRSet
  okr2: OKRSet
  okr3: OKRSet

  // Metrics by Category
  acquisitionMetrics: Metric[]
  engagementMetrics: Metric[]
  retentionMetrics: Metric[]
  revenueMetrics: Metric[]
  qualityMetrics: Metric[]

  // AARRR Framework
  acquisition: {
    channel: string
    volume: string
    cost: string
  }
  activation: {
    event: string
    rate: string
    timeToFirstValue: string
  }
  retention: {
    cohort: string
    day7: string
    day30: string
  }
  revenue: {
    arpu: string
    ltv: string
    mrrArr: string
  }
  referral: {
    nps: string
    rate: string
    viralCoefficient: string
  }
}

export const okrMetricsTemplate = {
  metadata: {
    productName: "{{productName}}",
    quarter: "{{quarter}}",
    teamName: "{{teamName}}",
    productLead: "{{productLead}}",
    lastUpdated: "{{lastUpdated}}"
  },

  northStar: {
    definition: "{{northStarDefinition}}",
    current: "{{northStarCurrent}}",
    target: "{{northStarTarget}}",
    rationale: "{{northStarRationale}}"
  },

  okrs: {
    okr1: {
      objective: "{{okr1Objective}}",
      keyResults: [
        { description: "{{okr1KR1Description}}", current: "{{okr1KR1Current}}", target: "{{okr1KR1Target}}", status: "{{okr1KR1Status}}" },
        { description: "{{okr1KR2Description}}", current: "{{okr1KR2Current}}", target: "{{okr1KR2Target}}", status: "{{okr1KR2Status}}" },
        { description: "{{okr1KR3Description}}", current: "{{okr1KR3Current}}", target: "{{okr1KR3Target}}", status: "{{okr1KR3Status}}" }
      ],
      alignment: "{{okr1Alignment}}",
      initiatives: ["{{okr1Initiative1}}", "{{okr1Initiative2}}", "{{okr1Initiative3}}"]
    },
    okr2: {
      objective: "{{okr2Objective}}",
      keyResults: [
        { description: "{{okr2KR1Description}}", current: "{{okr2KR1Current}}", target: "{{okr2KR1Target}}", status: "{{okr2KR1Status}}" },
        { description: "{{okr2KR2Description}}", current: "{{okr2KR2Current}}", target: "{{okr2KR2Target}}", status: "{{okr2KR2Status}}" },
        { description: "{{okr2KR3Description}}", current: "{{okr2KR3Current}}", target: "{{okr2KR3Target}}", status: "{{okr2KR3Status}}" }
      ],
      alignment: "{{okr2Alignment}}",
      initiatives: ["{{okr2Initiative1}}", "{{okr2Initiative2}}", "{{okr2Initiative3}}"]
    },
    okr3: {
      objective: "{{okr3Objective}}",
      keyResults: [
        { description: "{{okr3KR1Description}}", current: "{{okr3KR1Current}}", target: "{{okr3KR1Target}}", status: "{{okr3KR1Status}}" },
        { description: "{{okr3KR2Description}}", current: "{{okr3KR2Current}}", target: "{{okr3KR2Target}}", status: "{{okr3KR2Status}}" },
        { description: "{{okr3KR3Description}}", current: "{{okr3KR3Current}}", target: "{{okr3KR3Target}}", status: "{{okr3KR3Status}}" }
      ],
      alignment: "{{okr3Alignment}}",
      initiatives: ["{{okr3Initiative1}}", "{{okr3Initiative2}}", "{{okr3Initiative3}}"]
    }
  },

  metrics: {
    acquisition: [
      { name: "{{acqMetric1Name}}", definition: "{{acqMetric1Def}}", current: "{{acqMetric1Current}}", target: "{{acqMetric1Target}}", frequency: "{{acqMetric1Freq}}" },
      { name: "{{acqMetric2Name}}", definition: "{{acqMetric2Def}}", current: "{{acqMetric2Current}}", target: "{{acqMetric2Target}}", frequency: "{{acqMetric2Freq}}" },
      { name: "{{acqMetric3Name}}", definition: "{{acqMetric3Def}}", current: "{{acqMetric3Current}}", target: "{{acqMetric3Target}}", frequency: "{{acqMetric3Freq}}" }
    ],
    engagement: [
      { name: "{{engMetric1Name}}", definition: "{{engMetric1Def}}", current: "{{engMetric1Current}}", target: "{{engMetric1Target}}", frequency: "{{engMetric1Freq}}" },
      { name: "{{engMetric2Name}}", definition: "{{engMetric2Def}}", current: "{{engMetric2Current}}", target: "{{engMetric2Target}}", frequency: "{{engMetric2Freq}}" },
      { name: "{{engMetric3Name}}", definition: "{{engMetric3Def}}", current: "{{engMetric3Current}}", target: "{{engMetric3Target}}", frequency: "{{engMetric3Freq}}" }
    ],
    retention: [
      { name: "{{retMetric1Name}}", definition: "{{retMetric1Def}}", current: "{{retMetric1Current}}", target: "{{retMetric1Target}}", frequency: "{{retMetric1Freq}}" },
      { name: "{{retMetric2Name}}", definition: "{{retMetric2Def}}", current: "{{retMetric2Current}}", target: "{{retMetric2Target}}", frequency: "{{retMetric2Freq}}" },
      { name: "{{retMetric3Name}}", definition: "{{retMetric3Def}}", current: "{{retMetric3Current}}", target: "{{retMetric3Target}}", frequency: "{{retMetric3Freq}}" }
    ],
    revenue: [
      { name: "{{revMetric1Name}}", definition: "{{revMetric1Def}}", current: "{{revMetric1Current}}", target: "{{revMetric1Target}}", frequency: "{{revMetric1Freq}}" },
      { name: "{{revMetric2Name}}", definition: "{{revMetric2Def}}", current: "{{revMetric2Current}}", target: "{{revMetric2Target}}", frequency: "{{revMetric2Freq}}" },
      { name: "{{revMetric3Name}}", definition: "{{revMetric3Def}}", current: "{{revMetric3Current}}", target: "{{revMetric3Target}}", frequency: "{{revMetric3Freq}}" }
    ],
    quality: [
      { name: "{{qualMetric1Name}}", definition: "{{qualMetric1Def}}", current: "{{qualMetric1Current}}", target: "{{qualMetric1Target}}", frequency: "{{qualMetric1Freq}}" },
      { name: "{{qualMetric2Name}}", definition: "{{qualMetric2Def}}", current: "{{qualMetric2Current}}", target: "{{qualMetric2Target}}", frequency: "{{qualMetric2Freq}}" },
      { name: "{{qualMetric3Name}}", definition: "{{qualMetric3Def}}", current: "{{qualMetric3Current}}", target: "{{qualMetric3Target}}", frequency: "{{qualMetric3Freq}}" }
    ]
  },

  aarrr: {
    acquisition: {
      channel: "{{acquisitionChannel}}",
      volume: "{{acquisitionVolume}}",
      cost: "{{acquisitionCost}}"
    },
    activation: {
      event: "{{activationEvent}}",
      rate: "{{activationRate}}",
      timeToFirstValue: "{{timeToFirstValue}}"
    },
    retention: {
      cohort: "{{retentionCohort}}",
      day7: "{{day7Retention}}",
      day30: "{{day30Retention}}"
    },
    revenue: {
      arpu: "{{arpu}}",
      ltv: "{{ltv}}",
      mrrArr: "{{mrrArr}}"
    },
    referral: {
      nps: "{{npsScore}}",
      rate: "{{referralRate}}",
      viralCoefficient: "{{viralCoefficient}}"
    }
  },

  leadingLagging: {
    leading: [
      { indicator: "{{leadingIndicator1}}", why: "{{leadingIndicator1Why}}" },
      { indicator: "{{leadingIndicator2}}", why: "{{leadingIndicator2Why}}" },
      { indicator: "{{leadingIndicator3}}", why: "{{leadingIndicator3Why}}" }
    ],
    lagging: [
      { indicator: "{{laggingIndicator1}}", what: "{{laggingIndicator1What}}" },
      { indicator: "{{laggingIndicator2}}", what: "{{laggingIndicator2What}}" },
      { indicator: "{{laggingIndicator3}}", what: "{{laggingIndicator3What}}" }
    ]
  },

  ownership: {
    metricOwners: [
      { metric: "{{metricOwner1Metric}}", owner: "{{metricOwner1Name}}", cadence: "{{metricOwner1Cadence}}", tool: "{{metricOwner1Tool}}" },
      { metric: "{{metricOwner1Metric}}", owner: "{{metricOwner2Name}}", cadence: "{{metricOwner2Cadence}}", tool: "{{metricOwner2Tool}}" },
      { metric: "{{metricOwner1Metric}}", owner: "{{metricOwner3Name}}", cadence: "{{metricOwner3Cadence}}", tool: "{{metricOwner3Tool}}" }
    ]
  },

  risks: [
    { description: "{{risk1Description}}", impact: "{{risk1Impact}}", mitigation: "{{risk1Mitigation}}" },
    { description: "{{risk2Description}}", impact: "{{risk2Impact}}", mitigation: "{{risk2Mitigation}}" },
    { description: "{{risk3Description}}", impact: "{{risk3Impact}}", mitigation: "{{risk3Mitigation}}" }
  ],

  reviewSchedule: {
    weekly: "{{weeklyReviewDay}}",
    monthly: "{{monthlyReviewDate}}",
    quarterly: "{{quarterlyReviewDate}}"
  }
}

// All template variables
export const templateVariables = [
  // Metadata
  'productName', 'quarter', 'teamName', 'productLead', 'lastUpdated',
  
  // North Star
  'northStarDefinition', 'northStarCurrent', 'northStarTarget', 'northStarRationale',
  
  // OKR 1
  'okr1Objective',
  'okr1KR1Description', 'okr1KR1Current', 'okr1KR1Target', 'okr1KR1Status',
  'okr1KR2Description', 'okr1KR2Current', 'okr1KR2Target', 'okr1KR2Status',
  'okr1KR3Description', 'okr1KR3Current', 'okr1KR3Target', 'okr1KR3Status',
  'okr1Alignment', 'okr1Initiative1', 'okr1Initiative2', 'okr1Initiative3',
  
  // OKR 2
  'okr2Objective',
  'okr2KR1Description', 'okr2KR1Current', 'okr2KR1Target', 'okr2KR1Status',
  'okr2KR2Description', 'okr2KR2Current', 'okr2KR2Target', 'okr2KR2Status',
  'okr2KR3Description', 'okr2KR3Current', 'okr2KR3Target', 'okr2KR3Status',
  'okr2Alignment', 'okr2Initiative1', 'okr2Initiative2', 'okr2Initiative3',
  
  // OKR 3
  'okr3Objective',
  'okr3KR1Description', 'okr3KR1Current', 'okr3KR1Target', 'okr3KR1Status',
  'okr3KR2Description', 'okr3KR2Current', 'okr3KR2Target', 'okr3KR2Status',
  'okr3KR3Description', 'okr3KR3Current', 'okr3KR3Target', 'okr3KR3Status',
  'okr3Alignment', 'okr3Initiative1', 'okr3Initiative2', 'okr3Initiative3',
  
  // Acquisition Metrics
  'acqMetric1Name', 'acqMetric1Def', 'acqMetric1Current', 'acqMetric1Target', 'acqMetric1Freq',
  'acqMetric2Name', 'acqMetric2Def', 'acqMetric2Current', 'acqMetric2Target', 'acqMetric2Freq',
  'acqMetric3Name', 'acqMetric3Def', 'acqMetric3Current', 'acqMetric3Target', 'acqMetric3Freq',
  
  // Engagement Metrics
  'engMetric1Name', 'engMetric1Def', 'engMetric1Current', 'engMetric1Target', 'engMetric1Freq',
  'engMetric2Name', 'engMetric2Def', 'engMetric2Current', 'engMetric2Target', 'engMetric2Freq',
  'engMetric3Name', 'engMetric3Def', 'engMetric3Current', 'engMetric3Target', 'engMetric3Freq',
  
  // Retention Metrics
  'retMetric1Name', 'retMetric1Def', 'retMetric1Current', 'retMetric1Target', 'retMetric1Freq',
  'retMetric2Name', 'retMetric2Def', 'retMetric2Current', 'retMetric2Target', 'retMetric2Freq',
  'retMetric3Name', 'retMetric3Def', 'retMetric3Current', 'retMetric3Target', 'retMetric3Freq',
  
  // Revenue Metrics
  'revMetric1Name', 'revMetric1Def', 'revMetric1Current', 'revMetric1Target', 'revMetric1Freq',
  'revMetric2Name', 'revMetric2Def', 'revMetric2Current', 'revMetric2Target', 'revMetric2Freq',
  'revMetric3Name', 'revMetric3Def', 'revMetric3Current', 'revMetric3Target', 'revMetric3Freq',
  
  // Quality Metrics
  'qualMetric1Name', 'qualMetric1Def', 'qualMetric1Current', 'qualMetric1Target', 'qualMetric1Freq',
  'qualMetric2Name', 'qualMetric2Def', 'qualMetric2Current', 'qualMetric2Target', 'qualMetric2Freq',
  'qualMetric3Name', 'qualMetric3Def', 'qualMetric3Current', 'qualMetric3Target', 'qualMetric3Freq',
  
  // AARRR
  'acquisitionChannel', 'acquisitionVolume', 'acquisitionCost',
  'activationEvent', 'activationRate', 'timeToFirstValue',
  'retentionCohort', 'day7Retention', 'day30Retention',
  'arpu', 'ltv', 'mrrArr',
  'npsScore', 'referralRate', 'viralCoefficient',
  
  // Leading/Lagging
  'leadingIndicator1', 'leadingIndicator1Why',
  'leadingIndicator2', 'leadingIndicator2Why',
  'leadingIndicator3', 'leadingIndicator3Why',
  'laggingIndicator1', 'laggingIndicator1What',
  'laggingIndicator2', 'laggingIndicator2What',
  'laggingIndicator3', 'laggingIndicator3What',
  
  // Ownership
  'metricOwner1Metric', 'metricOwner1Name', 'metricOwner1Cadence', 'metricOwner1Tool',
  'metricOwner2Metric', 'metricOwner2Name', 'metricOwner2Cadence', 'metricOwner2Tool',
  'metricOwner3Metric', 'metricOwner3Name', 'metricOwner3Cadence', 'metricOwner3Tool',
  
  // Risks
  'risk1Description', 'risk1Impact', 'risk1Mitigation',
  'risk2Description', 'risk2Impact', 'risk2Mitigation',
  'risk3Description', 'risk3Impact', 'risk3Mitigation',
  
  // Review Schedule
  'weeklyReviewDay', 'monthlyReviewDate', 'quarterlyReviewDate'
]

// Helper function to fill template with data
export function fillTemplate(
  template: typeof okrMetricsTemplate,
  data: Record<string, string>
): typeof okrMetricsTemplate {
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
export function generateMarkdown(okrMetrics: typeof okrMetricsTemplate): string {
  const formatTable = (headers: string[], rows: any[][], separator = '|') => {
    const header = `${separator} ${headers.join(` ${separator} `)} ${separator}`
    const divider = `${separator} ${headers.map(() => '---').join(` ${separator} `)} ${separator}`
    const body = rows.map(row => `${separator} ${row.join(` ${separator} `)} ${separator}`).join('\n')
    return `${header}\n${divider}\n${body}`
  }

  const formatArray = (arr: string[]) => arr.map((item, i) => `${i + 1}. ${item}`).join('\n')

  const okrSection = (title: string, okr: any) => `## ${title}: ${okr.objective}

### Objective
${okr.objective}

### Key Results

${formatTable(
  ['Key Result', 'Current', 'Target', 'Status'],
  okr.keyResults.map((kr: any) => [kr.description, kr.current, kr.target, kr.status])
)}

### Strategic Alignment
${okr.alignment}

### Initiatives to Achieve
${formatArray(okr.initiatives)}`

  const metricsSection = (title: string, metrics: any[]) => `### ${title}

${formatTable(
  ['Metric', 'Definition', 'Current', 'Target', 'Frequency'],
  metrics.map((m: any) => [m.name, m.definition, m.current, m.target, m.frequency]
))}`

  return `# ${okrMetrics.metadata.productName} - OKRs & Success Metrics

**Quarter:** ${okrMetrics.metadata.quarter}  
**Team:** ${okrMetrics.metadata.teamName}  
**Product Lead:** ${okrMetrics.metadata.productLead}  
**Last Updated:** ${okrMetrics.metadata.lastUpdated}

---

## North Star Metric

> The single metric that best captures the core value your product delivers to customers.

### Definition
${okrMetrics.northStar.definition}

### Current Value
${okrMetrics.northStar.current}

### Target Value
${okrMetrics.northStar.target}

### Why This Matters
${okrMetrics.northStar.rationale}

---

${okrSection('OKR Set 1', okrMetrics.okrs.okr1)}

---

${okrSection('OKR Set 2', okrMetrics.okrs.okr2)}

---

${okrSection('OKR Set 3', okrMetrics.okrs.okr3)}

---

## Success Metrics Dashboard

${metricsSection('Acquisition Metrics', okrMetrics.metrics.acquisition)}

${metricsSection('Engagement Metrics', okrMetrics.metrics.engagement)}

${metricsSection('Retention Metrics', okrMetrics.metrics.retention)}

${metricsSection('Revenue Metrics', okrMetrics.metrics.revenue)}

${metricsSection('Product Quality Metrics', okrMetrics.metrics.quality)}

---

## AARRR Framework Summary

### Acquisition
- **Primary Channel:** ${okrMetrics.aarrr.acquisition.channel}
- **Volume Metric:** ${okrMetrics.aarrr.acquisition.volume}
- **Cost Metric:** ${okrMetrics.aarrr.acquisition.cost}

### Activation
- **Activation Event:** ${okrMetrics.aarrr.activation.event}
- **Activation Rate:** ${okrMetrics.aarrr.activation.rate}
- **Time to First Value:** ${okrMetrics.aarrr.activation.timeToFirstValue}

### Retention
- **Retention Cohort:** ${okrMetrics.aarrr.retention.cohort}
- **Day 7 Retention:** ${okrMetrics.aarrr.retention.day7}
- **Day 30 Retention:** ${okrMetrics.aarrr.retention.day30}

### Revenue
- **ARPU:** ${okrMetrics.aarrr.revenue.arpu}
- **LTV:** ${okrMetrics.aarrr.revenue.ltv}
- **MRR/ARR:** ${okrMetrics.aarrr.revenue.mrrArr}

### Referral
- **NPS Score:** ${okrMetrics.aarrr.referral.nps}
- **Referral Rate:** ${okrMetrics.aarrr.referral.rate}
- **Viral Coefficient:** ${okrMetrics.aarrr.referral.viralCoefficient}

---

## Leading vs Lagging Indicators

### Leading Indicators (Predictive)
| Indicator | Why It Predicts Success |
|-----------|------------------------|
${okrMetrics.leadingLagging.leading.map((l: any) => `| ${l.indicator} | ${l.why} |`).join('\n')}

### Lagging Indicators (Outcome)
| Indicator | What It Measures |
|-----------|-----------------|
${okrMetrics.leadingLagging.lagging.map((l: any) => `| ${l.indicator} | ${l.what} |`).join('\n')}

---

## Review Schedule

- **Weekly Metrics Review:** ${okrMetrics.reviewSchedule.weekly}
- **Monthly OKR Check-in:** ${okrMetrics.reviewSchedule.monthly}
- **Quarterly OKR Retrospective:** ${okrMetrics.reviewSchedule.quarterly}

---

*Generated for ${okrMetrics.metadata.productName} - Product Pilot Step 9*
`
}

// Pre-defined OKR examples from sources
export const okrExamples = {
  // From Aakash Gupta
  acquisition: {
    objective: "Accelerate user base growth to establish market leadership",
    krs: [
      "Increase new user sign-ups from 15,000 to 25,000 per month",
      "Achieve a 40% Week 1 retention rate for new cohorts",
      "Decrease CAC from $2.50 to $1.80"
    ]
  },
  
  engagement: {
    objective: "Transform casual users into deeply engaged power users",
    krs: [
      "Increase Week 4 retention from 30% to 45%",
      "Increase DAU/MAU ratio from 0.25 to 0.40",
      "Increase average comments per user per week from 5 to 8"
    ]
  },

  // From Oboard
  business: {
    breakEven: {
      objective: "Make our application break even",
      krs: [
        "Achieve a 15% increase in sales",
        "Increase the subscription cost by 25%",
        "Increase conversion rate to 20%"
      ]
    },
    
    globalExpansion: {
      objective: "Expand our presence on global markets",
      krs: [
        "Launch sales in three new markets",
        "Gain at least 1,000 new users in each new market",
        "Implement 5 new features requested by new market users"
      ]
    }
  },

  // From Product School
  engagementMetric: {
    objective: "Enhance user engagement in our mobile app",
    krs: [
      "Increase average session length from 2 to 5 minutes",
      "Improve DAU by 20%",
      "Launch two new features aimed at increasing interaction"
    ]
  }
}

// Common product metrics by category (from sources)
export const commonMetrics = {
  acquisition: [
    { name: 'CPA', definition: 'Cost Per Acquisition' },
    { name: 'CAC', definition: 'Customer Acquisition Cost' },
    { name: 'Bounce Rate', definition: 'Percentage of visitors who leave without interacting' }
  ],
  
  engagement: [
    { name: 'DAU/MAU', definition: 'Daily/Monthly Active Users and stickiness ratio' },
    { name: 'Session Duration', definition: 'Average time spent per session' },
    { name: 'Session Frequency', definition: 'How often users return' },
    { name: 'Feature Adoption', definition: 'Percentage using new features' }
  ],
  
  retention: [
    { name: 'Retention Rate', definition: 'Percentage of users retained over time' },
    { name: 'Churn Rate', definition: 'Percentage of users lost' },
    { name: 'NPS', definition: 'Net Promoter Score' },
    { name: 'CSAT', definition: 'Customer Satisfaction Score' },
    { name: 'CES', definition: 'Customer Effort Score' }
  ],
  
  revenue: [
    { name: 'LTV/CLV', definition: 'Lifetime Value / Customer Lifetime Value' },
    { name: 'MRR/ARR', definition: 'Monthly/Annual Recurring Revenue' },
    { name: 'ARPU', definition: 'Average Revenue Per User' }
  ],
  
  quality: [
    { name: 'Bug Count', definition: 'Number of reported bugs' },
    { name: 'Uptime', definition: 'System availability percentage' },
    { name: 'Load Time', definition: 'Average page/app load time' }
  ]
}

// Generate from product data (AI pipeline use)
export function generateFromProductData(
  productName: string,
  productType: 'saas' | 'mobile' | 'b2b' | 'b2c',
  primaryGoal: string,
  quarter: string
): string {
  const data: Record<string, string> = {
    productName,
    quarter,
    teamName: 'Product Team',
    productLead: 'TBD',
    lastUpdated: new Date().toISOString().split('T')[0],
    
    northStarDefinition: `Number of users achieving ${primaryGoal}`,
    northStarCurrent: 'TBD',
    northStarTarget: 'TBD',
    northStarRationale: `Captures the core value of ${productName}`,
    
    // Default OKR based on product type
    okr1Objective: productType === 'saas' 
      ? 'Transform casual users into deeply engaged power users'
      : 'Accelerate user base growth',
    okr1KR1Description: 'TBD',
    okr1KR1Current: 'TBD',
    okr1KR1Target: 'TBD',
    okr1KR1Status: 'on-track',
    
    // AARRR defaults
    acquisitionChannel: productType === 'saas' ? 'Product-led growth' : 'Paid marketing',
    activationEvent: 'First successful action',
    retentionCohort: 'Week 1'
  }
  
  const filled = fillTemplate(okrMetricsTemplate, data)
  return generateMarkdown(filled)
}

export default okrMetricsTemplate
