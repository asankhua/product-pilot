// User Stories Template
// Based on agile best practices and Gherkin syntax (Given-When-Then)
// Use this template for consistent user story generation from PRDs

export const userStoriesTemplate = {
  title: "{{featureName}} - User Stories",
  author: "Product Team",
  
  // Story Format Guidelines
  format: {
    description: `As a [type of user], I want [some goal], so that [some reason/benefit]`,
    
    acceptanceCriteria: `Given [precondition/context]
When [action/trigger]
Then [expected outcome/result]`,
    
    investPrinciples: `- **Independent**: Stories should not depend on each other
- **Negotiable**: Details can be discussed and changed
- **Valuable**: Delivers value to users/business
- **Estimable**: Team can estimate the effort
- **Small**: Can be completed in one sprint
- **Testable**: Clear criteria to verify completion`
  },
  
  // Priority Levels
  priorities: {
    p0: {
      label: "Must Have (P0)",
      description: "Critical stories that must be delivered for MVP",
      examples: [
        {
          title: "User Registration",
          story: "As a new user, I want to create an account with my email, so that I can access the platform's features",
          acceptanceCriteria: [
            "Given I am on the registration page\nWhen I enter valid email and password\nThen my account is created and I am redirected to onboarding",
            "Given I enter an existing email\nWhen I submit the form\nThen I see an error message 'Email already registered'",
            "Given I enter invalid password (less than 8 characters)\nWhen I submit the form\nThen I see validation error for password strength"
          ],
          storyPoints: 3
        },
        {
          title: "User Login",
          story: "As a registered user, I want to log in with my credentials, so that I can access my account",
          acceptanceCriteria: [
            "Given I am on the login page\nWhen I enter valid email and password\nThen I am authenticated and redirected to dashboard",
            "Given I enter invalid credentials\nWhen I submit the form\nThen I see an error message 'Invalid email or password'",
            "Given I click 'Forgot Password'\nWhen I enter my email\nThen I receive a password reset link via email"
          ],
          storyPoints: 2
        }
      ]
    },
    
    p1: {
      label: "Should Have (P1)",
      description: "Important stories that enhance the core experience",
      examples: [
        {
          title: "Password Reset",
          story: "As a user, I want to reset my password, so that I can regain access if I forget it",
          acceptanceCriteria: [
            "Given I request a password reset\nWhen I click the link in my email\nThen I am taken to a secure password reset page",
            "Given I am on the password reset page\nWhen I enter a new valid password\nThen my password is updated and I receive confirmation"
          ],
          storyPoints: 3
        },
        {
          title: "User Profile Management",
          story: "As a user, I want to update my profile information, so that my account details are current",
          acceptanceCriteria: [
            "Given I am on my profile page\nWhen I update my name and save\nThen the changes are persisted and I see a success message",
            "Given I upload a profile photo\nWhen the image exceeds 5MB\nThen I see an error message 'Image must be less than 5MB'"
          ],
          storyPoints: 2
        }
      ]
    },
    
    p2: {
      label: "Could Have (P2)",
      description: "Nice-to-have stories that add value but aren't critical",
      examples: [
        {
          title: "Social Login Integration",
          story: "As a user, I want to sign up/login with my Google account, so that I can access the platform faster",
          acceptanceCriteria: [
            "Given I click 'Sign in with Google'\nWhen I authenticate with valid Google credentials\nThen my account is created/linked and I am logged in",
            "Given I have an existing email account\nWhen I sign in with the same email via Google\nThen the accounts are linked automatically"
          ],
          storyPoints: 5
        },
        {
          title: "Email Notifications",
          story: "As a user, I want to receive email notifications for important updates, so that I stay informed",
          acceptanceCriteria: [
            "Given I have notifications enabled\nWhen a critical update occurs\nThen I receive an email notification within 5 minutes",
            "Given I click unsubscribe in the email\nWhen I confirm the action\nThen I stop receiving that type of notification"
          ],
          storyPoints: 3
        }
      ]
    }
  },
  
  // Story Points Guidelines
  storyPoints: {
    1: "Trivial change, configuration, or documentation update",
    2: "Simple change with clear implementation path",
    3: "Standard feature requiring some investigation",
    5: "Complex feature with multiple components",
    8: "Large feature requiring significant architecture work",
    13: "Epic-level work that should be broken down further"
  },
  
  // Definition of Ready
  definitionOfReady: `- Story has clear title and description
- Acceptance criteria defined in Given-When-Then format
- Story points estimated by the team
- Dependencies identified and resolved
- UX/UI designs attached (if applicable)
- Technical approach discussed with developers`,
  
  // Definition of Done
  definitionOfDone: `- Code implemented and follows coding standards
- Unit tests written with >80% coverage
- Acceptance criteria verified and passing
- Code reviewed and approved by peer
- QA testing completed on staging
- Documentation updated (if applicable)
- No critical bugs or blockers`
}

// Helper function to generate user story from PRD feature
export function generateUserStoryFromFeature(
  featureName: string,
  userType: string,
  goal: string,
  benefit: string,
  scenarios: { given: string; when: string; then: string }[],
  points: 1 | 2 | 3 | 5 | 8 | 13 = 3
) {
  return {
    title: featureName,
    description: `As a ${userType}, I want ${goal}, so that ${benefit}`,
    acceptanceCriteria: scenarios.map(s => 
      `Given ${s.given}\nWhen ${s.when}\nThen ${s.then}`
    ),
    storyPoints: points
  }
}

// Helper to format acceptance criteria for display
export function formatAcceptanceCriteria(criteria: string[]): string {
  return criteria.map((criterion, index) => {
    const lines = criterion.split('\n')
    return `**Scenario ${index + 1}:**
${lines.map(line => `  ${line}`).join('\n')}`
  }).join('\n\n')
}

export function generateMarkdown(stories: any[]): string {
  return `# User Stories

## Summary
- **Total Stories:** ${stories.length}
- **Total Story Points:** ${stories.reduce((sum, s) => sum + (s.storyPoints || 0), 0)}

---

${stories.map((story, index) => `
## ${index + 1}. ${story.title}

**Description:**
${story.description}

**Story Points:** ${story.storyPoints || 3}

**Acceptance Criteria:**
${formatAcceptanceCriteria(story.acceptanceCriteria || [])}
`).join('\n---\n')}

---

## Definition of Done
${userStoriesTemplate.definitionOfDone}
`.trim()
}

export default userStoriesTemplate
