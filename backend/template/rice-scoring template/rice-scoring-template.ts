// RICE Scoring Template
// Calculate RICE scores for feature prioritization
// RICE = (Reach × Impact × Confidence) / Effort

export interface RICEScore {
  storyId: string
  storyTitle: string
  description: string
  
  // RICE Components
  reach: number // Number of users affected (e.g., 1000)
  reachType: 'EXACT' | 'ESTIMATE' | 'RANGE'
  
  impact: number // 1-3 scale (1 = Low, 2 = Medium, 3 = High)
  impactType: 'QUALITATIVE' | 'QUANTITATIVE'
  
  confidence: number // Percentage (0-100)
  confidenceFactors: string[]
  
  effort: number // Person-months or story points
  effortType: 'PERSON_MONTHS' | 'STORY_POINTS' | 'HOURS'
  
  // Calculated Score
  riceScore: number
  riceScoreNormalized: number // Normalized to 0-100 scale
  
  // Priority
  priority: 'P0' | 'P1' | 'P2' | 'P3'
  priorityReason: string
}

export interface RICEAnalysis {
  scores: RICEScore[]
  summary: {
    totalStories: number
    averageRICEScore: number
    highPriorityCount: number
    mediumPriorityCount: number
    lowPriorityCount: number
  }
  recommendations: string[]
}

export const riceScoringTemplate = {
  // Calculate RICE scores for user stories
  calculateScores(userStories: any[]): RICEAnalysis {
    const scores: RICEScore[] = userStories.map(story => {
      // Estimate Reach based on story priority
      const reach = this.estimateReach(story.priority, story.storyPoints || 3)
      
      // Estimate Impact based on story points and description
      const impact = this.estimateImpact(story.storyPoints || 3, story.description)
      
      // Calculate Confidence based on story clarity
      const confidence = this.estimateConfidence(story.description, story.acceptanceCriteria || [])
      
      // Effort is the story points (converted to person-months scale)
      const effort = this.storyPointsToEffort(story.storyPoints || 3)
      
      // Calculate RICE score
      const riceScore = (reach * impact * confidence) / effort
      
      // Normalize to 0-100 scale
      const riceScoreNormalized = this.normalizeScore(riceScore)
      
      // Determine priority
      const priority = this.determinePriority(riceScoreNormalized)
      
      return {
        storyId: story.id,
        storyTitle: story.title,
        description: story.description,
        reach,
        reachType: 'ESTIMATE',
        impact,
        impactType: 'QUALITATIVE',
        confidence,
        confidenceFactors: this.getConfidenceFactors(story),
        effort,
        effortType: 'STORY_POINTS',
        riceScore,
        riceScoreNormalized,
        priority,
        priorityReason: this.getPriorityReason(riceScoreNormalized, priority),
      }
    })
    
    // Sort by RICE score (descending)
    scores.sort((a, b) => b.riceScore - a.riceScore)
    
    // Calculate summary
    const totalStories = scores.length
    const averageRICEScore = scores.reduce((sum, s) => sum + s.riceScore, 0) / totalStories
    const highPriorityCount = scores.filter(s => s.priority === 'P0').length
    const mediumPriorityCount = scores.filter(s => s.priority === 'P1').length
    const lowPriorityCount = scores.filter(s => s.priority === 'P2' || s.priority === 'P3').length
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(scores)
    
    return {
      scores,
      summary: {
        totalStories,
        averageRICEScore,
        highPriorityCount,
        mediumPriorityCount,
        lowPriorityCount,
      },
      recommendations,
    }
  },
  
  // Estimate reach based on priority
  estimateReach(priority: string, storyPoints: number): number {
    const p = this.mapPriority(priority)
    
    // Base reach estimates
    const baseReach: Record<string, number> = {
      'P0': 10000, // High priority features affect many users
      'P1': 5000,
      'P2': 2000,
      'P3': 500,
    }
    
    // Adjust based on story points (complex features might have more reach)
    const multiplier = 1 + (storyPoints / 13) * 0.5
    
    return Math.round((baseReach[p] || 2000) * multiplier)
  },
  
  // Estimate impact on 1-3 scale
  estimateImpact(storyPoints: number, description: string): number {
    let impact = 2 // Default to medium
    
    // Higher story points might indicate higher impact
    if (storyPoints >= 8) impact = 3
    else if (storyPoints <= 2) impact = 1
    
    // Check description for impact keywords
    const highImpactKeywords = ['critical', 'essential', 'must', 'required', 'core', 'fundamental']
    const lowImpactKeywords = ['nice to have', 'optional', 'enhancement', 'improvement']
    
    const descLower = description.toLowerCase()
    
    if (highImpactKeywords.some(k => descLower.includes(k))) impact = 3
    if (lowImpactKeywords.some(k => descLower.includes(k))) impact = 1
    
    return impact
  },
  
  // Estimate confidence percentage
  estimateConfidence(description: string, acceptanceCriteria: string[]): number {
    let confidence = 70 // Base confidence
    
    // More detailed acceptance criteria = higher confidence
    if (acceptanceCriteria.length >= 3) confidence += 15
    else if (acceptanceCriteria.length >= 2) confidence += 10
    else if (acceptanceCriteria.length === 1) confidence += 5
    
    // Longer, more detailed description = higher confidence
    if (description.length > 200) confidence += 5
    else if (description.length > 100) confidence += 2
    
    // Cap at 95% (never 100% certain)
    return Math.min(confidence, 95)
  },
  
  // Get confidence factors
  getConfidenceFactors(story: any): string[] {
    const factors: string[] = []
    
    if (story.acceptanceCriteria && story.acceptanceCriteria.length >= 3) {
      factors.push('Detailed acceptance criteria')
    }
    
    if (story.description && story.description.length > 150) {
      factors.push('Comprehensive description')
    }
    
    if (story.storyPoints && story.storyPoints <= 5) {
      factors.push('Small, well-defined scope')
    }
    
    if (factors.length === 0) {
      factors.push('Standard confidence level')
    }
    
    return factors
  },
  
  // Convert story points to effort scale
  storyPointsToEffort(storyPoints: number): number {
    // Convert story points to a scale that makes sense in RICE calculation
    // Using a scale where 1 story point = 1 unit of effort
    return storyPoints
  },
  
  // Normalize RICE score to 0-100 scale
  normalizeScore(riceScore: number): number {
    // Typical RICE scores range from 0 to ~10000
    // Normalize to 0-100 for easier comparison
    const maxScore = 10000
    const normalized = (riceScore / maxScore) * 100
    return Math.min(Math.round(normalized), 100)
  },
  
  // Determine priority based on normalized score
  determinePriority(normalizedScore: number): 'P0' | 'P1' | 'P2' | 'P3' {
    if (normalizedScore >= 70) return 'P0'
    if (normalizedScore >= 40) return 'P1'
    if (normalizedScore >= 20) return 'P2'
    return 'P3'
  },
  
  // Get reason for priority assignment
  getPriorityReason(normalizedScore: number, priority: string): string {
    const reasons: Record<string, string> = {
      'P0': 'High RICE score indicates significant impact with reasonable effort',
      'P1': 'Moderate RICE score suggests good value but may need validation',
      'P2': 'Lower RICE score indicates limited impact or high effort required',
      'P3': 'Low RICE score suggests minimal impact or high uncertainty',
    }
    return reasons[priority] || 'Standard priority assignment'
  },
  
  // Map priority to standard format
  mapPriority(priority: string): string {
    if (!priority) return 'P1'
    const p = priority.toUpperCase()
    if (['P0', 'P1', 'P2', 'P3'].includes(p)) return p
    return 'P1'
  },
  
  // Generate recommendations based on RICE scores
  generateRecommendations(scores: RICEScore[]): string[] {
    const recommendations: string[] = []
    
    const highPriority = scores.filter(s => s.priority === 'P0')
    const lowConfidence = scores.filter(s => s.confidence < 70)
    const highEffort = scores.filter(s => s.effort >= 8)
    
    if (highPriority.length > 0) {
      recommendations.push(`Prioritize ${highPriority.length} high-RICE features for immediate development`)
    }
    
    if (lowConfidence.length > 0) {
      recommendations.push(`Conduct spike stories for ${lowConfidence.length} features with low confidence to improve estimates`)
    }
    
    if (highEffort.length > 0) {
      recommendations.push(`Consider breaking down ${highEffort.length} complex features into smaller stories`)
    }
    
    const avgScore = scores.reduce((sum, s) => sum + s.riceScoreNormalized, 0) / scores.length
    if (avgScore < 30) {
      recommendations.push('Overall RICE scores are low - consider revisiting feature selection and priorities')
    }
    
    if (recommendations.length === 0) {
      recommendations.push('All features have reasonable RICE scores - proceed with current prioritization')
    }
    
    return recommendations
  },
}

// Generate markdown from RICE analysis
export function generateMarkdown(riceAnalysis: RICEAnalysis, prdTitle: string): string {
  return `# RICE Scoring Analysis for ${prdTitle}

## Summary

- **Total Stories:** ${riceAnalysis.summary.totalStories}
- **Average RICE Score:** ${Math.round(riceAnalysis.summary.averageRICEScore)}
- **High Priority (P0):** ${riceAnalysis.summary.highPriorityCount}
- **Medium Priority (P1):** ${riceAnalysis.summary.mediumPriorityCount}
- **Low Priority (P2/P3):** ${riceAnalysis.summary.lowPriorityCount}

## RICE Scores

| Story | Reach | Impact | Confidence | Effort | RICE Score | Priority |
|-------|--------|--------|------------|--------|------------|----------|
${riceAnalysis.scores.map(score => `
| ${score.storyTitle} | ${score.reach.toLocaleString()} | ${score.impact} | ${score.confidence}% | ${score.effort} | ${Math.round(score.riceScore)} (${score.riceScoreNormalized}/100) | ${score.priority} |
`).join('')}

## Detailed Analysis

${riceAnalysis.scores.map((score, index) => `
### ${index + 1}. ${score.storyTitle}

**RICE Score:** ${Math.round(score.riceScore)} (${score.riceScoreNormalized}/100)
**Priority:** ${score.priority}

**Components:**
- **Reach:** ${score.reach.toLocaleString()} users (${score.reachType})
- **Impact:** ${score.impact}/3 (${score.impactType})
- **Confidence:** ${score.confidence}% (${score.confidenceFactors.join(', ')})
- **Effort:** ${score.effort} (${score.effortType})

**Reasoning:** ${score.priorityReason}

**Description:**
${score.description}
`).join('\n')}

## Recommendations

${riceAnalysis.recommendations.map(rec => `- ${rec}`).join('\n')}

---

*Generated on ${new Date().toLocaleDateString()}*
`.trim()
}

export default riceScoringTemplate
