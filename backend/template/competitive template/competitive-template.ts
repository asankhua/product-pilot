// Competitive Analysis Report Template
// Based on https://www.chatprd.ai/templates/competitive-analysis-report-template
// Use this template for consistent competitive analysis generation

export const competitiveTemplate = {
  title: "{{competitorName}} - Competitive Analysis Report",
  author: "Your Name Here",
  
  // 01 - Company Background
  companyBackground: {
    sectionIntro: `Provide a comprehensive understanding of each competitor's foundational aspects. Include relevant history, operational scale, and financial stability to set the context.`,
    
    companyOverview: `### Company Overview
Summarize the competitor's history, company size, and present financial condition. Mention mission statements, vision, core values, and any unique attributes that set them apart.

{{companyOverview}}`,
    
    productServiceOverview: `### Product/Service Overview
Detail the primary products or services offered by the competitor. Discuss key features, unique selling points, and target demographics, along with any notable variations in their offerings.

{{productServiceOverview}}`,
    
    leadershipStructure: `### Leadership and Organizational Structure
Describe the key stakeholders and leadership team. Include organizational hierarchy, notable leadership changes, and their impact on strategy.

{{leadershipStructure}}`,
    
    financialHealth: `### Financial Health
Provide an overview of the financial standing including revenue, profit margins, market share, and growth trajectory. Highlight significant financial milestones and stability signals.

{{financialHealth}}`,
    
    recentDevelopments: `### Recent Developments and Future Plans
Identify any recent initiatives, strategic pivots, mergers, acquisitions, or future plans disclosed that indicate the direction they are heading towards.

{{recentDevelopments}}`
  },
  
  // 02 - Competitor Analysis
  competitorAnalysis: {
    sectionIntro: `Conduct an in-depth analysis of each competitor's strengths, weaknesses, opportunities, and threats. Compare this with your own product and market position.`,
    
    swotAnalysis: `### SWOT Analysis
Perform a comprehensive SWOT analysis, detailing the internal strengths and weaknesses, as well as external opportunities and threats. Discuss specific examples and implications.

**Strengths:**
{{strengths}}

**Weaknesses:**
{{weaknesses}}

**Opportunities:**
{{opportunities}}

**Threats:**
{{threats}}`,
    
    productComparison: `### Product Comparison
Compare key product features, value propositions, and performance metrics against your offerings. Highlight competitive advantages and areas for improvement.

{{productComparison}}`,
    
    customerReviews: `### Customer Reviews and Feedback
Analyze customer reviews and feedback concerning the competitor's product. Identify recurring positive and negative points and their impact on customer satisfaction.

{{customerReviews}}`,
    
    innovationTechnology: `### Innovation and Technology
Assess the level of innovation and technology advancements employed by the competitor. Discuss R&D investments, tech partnerships, and their impact on the product.

{{innovationTechnology}}`,
    
    marketShareGrowth: `### Market Share and Growth
Evaluate the competitor's market share, growth trends, and strategic moves that have contributed to their current position. Consider geographical presence and market segments.

{{marketShareGrowth}}`
  },
  
  // 03 - Market Positioning
  marketPositioning: {
    sectionIntro: `Evaluate how competitors position themselves in the market, including brand perception, marketing strategies, and pricing tactics. Understanding these aspects will help identify gaps and opportunities for your product.`,
    
    marketPerception: `### Market Perception
Explore how the market perceives the competitor brand. Discuss customer trust, brand reputation, and overall satisfaction levels.

{{marketPerception}}`,
    
    marketingPricingStrategy: `### Marketing and Pricing Strategy
Detail the competitor's marketing approach, including digital, traditional, and social media. Describe their pricing strategies and positioning within the market in terms of value and affordability.

{{marketingPricingStrategy}}`,
    
    customerAcquisition: `### Customer Acquisition and Retention
Analyze the strategies competitors use to acquire new customers and retain existing ones. Discuss loyalty programs, membership benefits, and customer service quality.

{{customerAcquisition}}`,
    
    geographicDemographic: `### Geographic and Demographic Targeting
Identify the primary geographic and demographic segments targeted by the competitor. Discuss regional strengths, local marketing initiatives, and niche demographics.

{{geographicDemographic}}`,
    
    brandPartnerships: `### Brand Partnerships and Sponsorships
Detail any strategic partnerships, sponsorships, or endorsements that bolster the competitor's market position. Examine the effectiveness and impact of these alliances.

{{brandPartnerships}}`
  }
}

// Variable placeholders for template filling
export const templateVariables = [
  'competitorName',
  'author',
  'companyOverview',
  'productServiceOverview',
  'leadershipStructure',
  'financialHealth',
  'recentDevelopments',
  'strengths',
  'weaknesses',
  'opportunities',
  'threats',
  'productComparison',
  'customerReviews',
  'innovationTechnology',
  'marketShareGrowth',
  'marketPerception',
  'marketingPricingStrategy',
  'customerAcquisition',
  'geographicDemographic',
  'brandPartnerships'
]

// Helper function to fill template with data
export function fillTemplate(
  template: typeof competitiveTemplate,
  data: Record<string, string>
): typeof competitiveTemplate {
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
        replaceVars(obj[key])
      }
    }
  }
  
  replaceVars(filled)
  return filled
}

export function generateMarkdown(report: typeof competitiveTemplate): string {
  return `# ${report.title}
Author: ${report.author}

## 01 - Company Background
${report.companyBackground.sectionIntro}

${report.companyBackground.companyOverview}

${report.companyBackground.productServiceOverview}

${report.companyBackground.leadershipStructure}

${report.companyBackground.financialHealth}

${report.companyBackground.recentDevelopments}

## 02 - Competitor Analysis
${report.competitorAnalysis.sectionIntro}

${report.competitorAnalysis.swotAnalysis}

${report.competitorAnalysis.productComparison}

${report.competitorAnalysis.customerReviews}

${report.competitorAnalysis.innovationTechnology}

${report.competitorAnalysis.marketShareGrowth}

## 03 - Market Positioning
${report.marketPositioning.sectionIntro}

${report.marketPositioning.marketPerception}

${report.marketPositioning.marketingPricingStrategy}

${report.marketPositioning.customerAcquisition}

${report.marketPositioning.geographicDemographic}

${report.marketPositioning.brandPartnerships}
`
}

export default competitiveTemplate
