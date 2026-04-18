// Roadmap Template
// Generate comprehensive roadmaps from PRDs and user stories

export interface Roadmap {
  title: string
  description: string
  timeframe: {
    startDate: string
    endDate: string
    totalWeeks: number
  }
  
  phases: {
    name: string
    startDate: string
    endDate: string
    duration: number // in weeks
    objectives: string[]
    userStories: {
      title: string
      description: string
      priority: string
      storyPoints: number
    }[]
    milestones: string[]
    deliverables: string[]
  }[]
  
  summary: {
    totalStories: number
    totalStoryPoints: number
    phases: number
    keyMilestones: string[]
  }
}

export const roadmapTemplate = {
  // Generate roadmap from PRD and user stories (with optional RICE scores)
  generateFromPRD(prd: any, userStories: any[], config: any = {}, riceScores?: any[]): Roadmap {
    const totalWeeks = config.totalWeeks || 12 // default 12 weeks
    const startDate = new Date(config.startDate || new Date())
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + (totalWeeks * 7))
    
    // If RICE scores are provided, use them for prioritization
    let prioritizedStories = userStories
    if (riceScores && riceScores.length > 0) {
      // Sort user stories by RICE score (highest first)
      prioritizedStories = userStories.map(story => {
        const riceScore = riceScores.find((r: any) => r.storyId === story.id)
        return {
          ...story,
          riceScore: riceScore?.riceScore || 0,
          ricePriority: riceScore?.priority || story.priority,
        }
      }).sort((a, b) => (b.riceScore || 0) - (a.riceScore || 0))
    }
    
    // Group user stories by priority (or RICE priority if available)
    const p0Stories = prioritizedStories.filter(s => {
      const priority = s.ricePriority || s.priority
      return this.mapPriority(priority) === 'P0'
    })
    const p1Stories = prioritizedStories.filter(s => {
      const priority = s.ricePriority || s.priority
      return this.mapPriority(priority) === 'P1'
    })
    const p2Stories = prioritizedStories.filter(s => {
      const priority = s.ricePriority || s.priority
      return this.mapPriority(priority) === 'P2'
    })
    
    // Calculate phase durations based on priority
    const p0Duration = Math.ceil(p0Stories.length * 0.5) // 0.5 weeks per P0 story
    const p1Duration = Math.ceil(p1Stories.length * 0.75) // 0.75 weeks per P1 story
    const p2Duration = Math.ceil(p2Stories.length * 0.5) // 0.5 weeks per P2 story
    
    const totalCalculatedWeeks = p0Duration + p1Duration + p2Duration
    const scaleFactor = totalWeeks / totalCalculatedWeeks
    
    // Generate phases
    const phases: Roadmap['phases'] = []
    let currentDate = new Date(startDate)
    
    // Phase 1: Foundation (P0 stories)
    if (p0Stories.length > 0) {
      const phaseDuration = Math.round(p0Duration * scaleFactor) || 1
      const phaseEndDate = new Date(currentDate)
      phaseEndDate.setDate(phaseEndDate.getDate() + (phaseDuration * 7))
      
      phases.push({
        name: 'Phase 1: Foundation',
        startDate: currentDate.toISOString().split('T')[0],
        endDate: phaseEndDate.toISOString().split('T')[0],
        duration: phaseDuration,
        objectives: [
          'Establish core infrastructure',
          'Implement critical features',
          'Ensure system stability'
        ],
        userStories: p0Stories.map(s => ({
          title: s.title,
          description: s.description,
          priority: s.ricePriority || this.mapPriority(s.priority),
          storyPoints: s.storyPoints || 3,
        })),
        milestones: [
          'Core architecture complete',
          'First stable release',
          'Performance benchmarks met'
        ],
        deliverables: [
          'Functional MVP',
          'API documentation',
          'Security audit passed'
        ]
      })
      
      currentDate = new Date(phaseEndDate)
    }
    
    // Phase 2: Enhancement (P1 stories)
    if (p1Stories.length > 0) {
      const phaseDuration = Math.round(p1Duration * scaleFactor) || 1
      const phaseEndDate = new Date(currentDate)
      phaseEndDate.setDate(phaseEndDate.getDate() + (phaseDuration * 7))
      
      phases.push({
        name: 'Phase 2: Enhancement',
        startDate: currentDate.toISOString().split('T')[0],
        endDate: phaseEndDate.toISOString().split('T')[0],
        duration: phaseDuration,
        objectives: [
          'Expand feature set',
          'Improve user experience',
          'Add integrations'
        ],
        userStories: p1Stories.map(s => ({
          title: s.title,
          description: s.description,
          priority: s.ricePriority || this.mapPriority(s.priority),
          storyPoints: s.storyPoints || 3,
        })),
        milestones: [
          'Feature parity with competitors',
          'User onboarding flow complete',
          'Analytics dashboard live'
        ],
        deliverables: [
          'Enhanced feature set',
          'User guides and tutorials',
          'Integration documentation'
        ]
      })
      
      currentDate = new Date(phaseEndDate)
    }
    
    // Phase 3: Optimization (P2 stories)
    if (p2Stories.length > 0) {
      const phaseDuration = Math.round(p2Duration * scaleFactor) || 1
      const phaseEndDate = new Date(currentDate)
      phaseEndDate.setDate(phaseEndDate.getDate() + (phaseDuration * 7))
      
      phases.push({
        name: 'Phase 3: Optimization',
        startDate: currentDate.toISOString().split('T')[0],
        endDate: phaseEndDate.toISOString().split('T')[0],
        duration: phaseDuration,
        objectives: [
          'Optimize performance',
          'Add polish and refinement',
          'Prepare for scaling'
        ],
        userStories: p2Stories.map(s => ({
          title: s.title,
          description: s.description,
          priority: s.ricePriority || this.mapPriority(s.priority),
          storyPoints: s.storyPoints || 3,
        })),
        milestones: [
          'Performance targets met',
          'Code coverage above 80%',
          'Load testing passed'
        ],
        deliverables: [
          'Performance optimization report',
          'Scaling guide',
          'Maintenance documentation'
        ]
      })
    }
    
    // Calculate summary
    const totalStoryPoints = userStories.reduce((sum, s) => sum + (s.storyPoints || 0), 0)
    const keyMilestones = phases.flatMap(p => p.milestones)
    
    return {
      title: `${prd.title} - Roadmap`,
      description: `Strategic roadmap for ${prd.title} development`,
      timeframe: {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        totalWeeks,
      },
      phases,
      summary: {
        totalStories: userStories.length,
        totalStoryPoints,
        phases: phases.length,
        keyMilestones,
      },
    }
  },
  
  mapPriority(priority: string): string {
    if (!priority) return 'P1'
    const p = priority.toUpperCase()
    if (['P0', 'P1', 'P2'].includes(p)) return p
    return 'P1'
  },
}

// Generate markdown from roadmap
export function generateMarkdown(roadmap: Roadmap): string {
  return `# ${roadmap.title}

${roadmap.description}

**Timeframe:** ${roadmap.timeframe.startDate} to ${roadmap.timeframe.endDate} (${roadmap.timeframe.totalWeeks} weeks)

---

## Summary

- **Total User Stories:** ${roadmap.summary.totalStories}
- **Total Story Points:** ${roadmap.summary.totalStoryPoints}
- **Phases:** ${roadmap.summary.phases}
- **Key Milestones:** ${roadmap.summary.keyMilestones.length}

---

## Roadmap Phases

${roadmap.phases.map((phase, index) => `
### ${phase.name}

**Duration:** ${phase.duration} weeks
**Start:** ${phase.startDate}
**End:** ${phase.endDate}

#### Objectives
${phase.objectives.map(obj => `- ${obj}`).join('\n')}

#### User Stories (${phase.userStories.length})
${phase.userStories.map(story => `
**${story.title}** (${story.storyPoints} pts - ${story.priority})
${story.description}
`).join('\n')}

#### Milestones
${phase.milestones.map(m => `- ${m}`).join('\n')}

#### Deliverables
${phase.deliverables.map(d => `- ${d}`).join('\n')}
`).join('\n')}

---

## Key Milestones Timeline

${roadmap.phases.map((phase, index) => `
### ${phase.startDate} - ${phase.endDate}: ${phase.name}
${phase.milestones.map(m => `- ${m}`).join('\n')}
`).join('\n')}

---

*Generated on ${new Date().toLocaleDateString()}*
`.trim()
}

export default roadmapTemplate
