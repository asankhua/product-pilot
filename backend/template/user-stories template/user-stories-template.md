# User Stories Template

> **Based on:** Agile best practices and Gherkin syntax (Given-When-Then)  
> **Author:** Product Team  
> **Use this template for consistent user story generation from PRDs**

---

# {{featureName}} - User Stories

---

## Story Format Guidelines

### Standard Format
```
As a [type of user], I want [some goal], so that [some reason/benefit]
```

### Acceptance Criteria Format (Gherkin)
```
Given [precondition/context]
When [action/trigger]
Then [expected outcome/result]
```

### INVEST Principles
- **Independent**: Stories should not depend on each other
- **Negotiable**: Details can be discussed and changed
- **Valuable**: Delivers value to users/business
- **Estimable**: Team can estimate the effort
- **Small**: Can be completed in one sprint
- **Testable**: Clear criteria to verify completion

---

## Priority Levels

### P0 - Must Have (Critical)
Critical stories that must be delivered for MVP. These are core features without which the product cannot function.

**Example Stories:**

#### 1. User Registration
**Description:** As a new user, I want to create an account with my email, so that I can access the platform's features

**Story Points:** 3

**Acceptance Criteria:**
```
Given I am on the registration page
When I enter valid email and password
Then my account is created and I am redirected to onboarding

Given I enter an existing email
When I submit the form
Then I see an error message 'Email already registered'

Given I enter invalid password (less than 8 characters)
When I submit the form
Then I see validation error for password strength
```

#### 2. User Login
**Description:** As a registered user, I want to log in with my credentials, so that I can access my account

**Story Points:** 2

**Acceptance Criteria:**
```
Given I am on the login page
When I enter valid email and password
Then I am authenticated and redirected to dashboard

Given I enter invalid credentials
When I submit the form
Then I see an error message 'Invalid email or password'

Given I click 'Forgot Password'
When I enter my email
Then I receive a password reset link via email
```

---

### P1 - Should Have (Important)
Important stories that enhance the core experience but aren't blockers for launch.

**Example Stories:**

#### 3. Password Reset
**Description:** As a user, I want to reset my password, so that I can regain access if I forget it

**Story Points:** 3

**Acceptance Criteria:**
```
Given I request a password reset
When I click the link in my email
Then I am taken to a secure password reset page

Given I am on the password reset page
When I enter a new valid password
Then my password is updated and I receive confirmation
```

#### 4. User Profile Management
**Description:** As a user, I want to update my profile information, so that my account details are current

**Story Points:** 2

**Acceptance Criteria:**
```
Given I am on my profile page
When I update my name and save
Then the changes are persisted and I see a success message

Given I upload a profile photo
When the image exceeds 5MB
Then I see an error message 'Image must be less than 5MB'
```

---

### P2 - Could Have (Nice-to-Have)
Nice-to-have stories that add value but aren't critical for launch.

**Example Stories:**

#### 5. Social Login Integration
**Description:** As a user, I want to sign up/login with my Google account, so that I can access the platform faster

**Story Points:** 5

**Acceptance Criteria:**
```
Given I click 'Sign in with Google'
When I authenticate with valid Google credentials
Then my account is created/linked and I am logged in

Given I have an existing email account
When I sign in with the same email via Google
Then the accounts are linked automatically
```

#### 6. Email Notifications
**Description:** As a user, I want to receive email notifications for important updates, so that I stay informed

**Story Points:** 3

**Acceptance Criteria:**
```
Given I have notifications enabled
When a critical update occurs
Then I receive an email notification within 5 minutes

Given I click unsubscribe in the email
When I confirm the action
Then I stop receiving that type of notification
```

---

## Story Points Guidelines

| Points | Description |
|--------|-------------|
| **1** | Trivial change, configuration, or documentation update |
| **2** | Simple change with clear implementation path |
| **3** | Standard feature requiring some investigation |
| **5** | Complex feature with multiple components |
| **8** | Large feature requiring significant architecture work |
| **13** | Epic-level work that should be broken down further |

---

## Definition of Ready

- [ ] Story has clear title and description
- [ ] Acceptance criteria defined in Given-When-Then format
- [ ] Story points estimated by the team
- [ ] Dependencies identified and resolved
- [ ] UX/UI designs attached (if applicable)
- [ ] Technical approach discussed with developers

---

## Definition of Done

- [ ] Code implemented and follows coding standards
- [ ] Unit tests written with >80% coverage
- [ ] Acceptance criteria verified and passing
- [ ] Code reviewed and approved by peer
- [ ] QA testing completed on staging
- [ ] Documentation updated (if applicable)
- [ ] No critical bugs or blockers

---

## Generated Stories from PRD

{{generatedStories}}

---

## Summary

- **Total Stories:** {{totalStories}}
- **Total Story Points:** {{totalPoints}}
- **P0 (Must Have):** {{p0Count}} stories
- **P1 (Should Have):** {{p1Count}} stories
- **P2 (Could Have):** {{p2Count}} stories
