# Product Pilot - Wireframes & UI Specification

## Design System

- **Framework:** Tailwind CSS + shadcn/ui
- **Theme:** Fixed Light Theme (light blue to white gradient background)
- **Typography:** Geist Sans (headings), Geist Mono (code/data)
- **Colors:** Indigo primary (#6366f1), Emerald success, Amber warning, Rose error, Slate text
- **Layout:** Sidebar navigation + main content area
- **Responsive:** Desktop-first, tablet-adaptive, mobile-aware
- **Background:** Gradient from sky-50 to white

---

## Screen 0: Presentation Generator (/presentation)

```
┌──────────────────────────────────────────────────────────────────────┐
│ ┌─────────┐                                                          │
│ │ SIDEBAR │  Presentation Generator          [Export ▼] [Share] [⚙]     │
│ │         │                                                          │
│ │ ○ Dash  │  ⚠️ Under Implementation                                  │
│ │ ○ Proj  │  This feature is currently under development. Generated  │
│ │ ○ Chat  │  presentations may have formatting issues or incomplete  │
│ │ ○ Pres  │  content. Use with caution and provide feedback.         │
│ │ ○ Setti │                                                          │
│ │         │  ┌─ Select Project ───────────────────────────────────┐  │
│ │         │  │                                                     │  │
│ │         │  │ [Food Delivery App ▼]                               │  │
│ │         │  │                                                     │  │
│ │         │  │ Step 5/9 · Market Analysis in progress              │  │
│ │         │  └─────────────────────────────────────────────────────┘  │
│ │         │                                                          │
│ │         │  ┌─ Select Steps to Include ─────────────────────────┐  │
│ │         │  │                                                     │  │
│ │         │  │ [✓] 1. Problem Reframe                              │  │
│ │         │  │ [✓] 2. Product Vision                               │  │
│ │         │  │ [✓] 3. Personas                                    │  │
│ │         │  │ [✓] 4. Clarifying Questions                         │  │
│ │         │  │ [✓] 5. Market Analysis                             │  │
│ │         │  │ [ ] 6. PRD Generation                               │  │
│ │         │  │ [ ] 7. User Stories                                 │  │
│ │         │  │ [ ] 8. Roadmap                                      │  │
│ │         │  │ [ ] 9. OKRs                                        │  │
│ │         │  │                                                     │  │
│ │         │  │ [Select All] [Clear All]                             │  │
│ │         │  └─────────────────────────────────────────────────────┘  │
│ │         │                                                          │
│ │         │  ┌─ Presentation Settings ─────────────────────────────┐  │
│ │         │  │                                                     │  │
│ │         │  │ Title: Product Pilot - Food Delivery App             │  │
│ │         │  │ ┌─────────────────────────────────────────────────┐ │  │
│ │         │  │ │ Product Pilot - Food Delivery App                │ │  │
│ │         │  │ └─────────────────────────────────────────────────┘ │  │
│ │         │  │                                                     │  │
│ │         │  │ Author: [Ashish Sankhua]                           │  │
│ │         │  │ ┌─────────────────────────────────────────────────┐ │  │
│ │         │  │ │ Ashish Sankhua                                 │ │  │
│ │         │  │ └─────────────────────────────────────────────────┘ │  │
│ │         │  │                                                     │  │
│ │         │  │ Date: [2026-04-18]                                 │  │
│ │         │  │ ┌─────────────────────────────────────────────────┐ │  │
│ │         │  │ │ 2026-04-18                                     │ │  │
│ │         │  │ └─────────────────────────────────────────────────┘ │  │
│ │         │  └─────────────────────────────────────────────────────┘  │
│ │         │                                                          │
│ │         │     [Cancel] [Generate Presentation →]                  │
│ └─────────┘                                                          │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Screen 1: Landing Page (/)

```
┌──────────────────────────────────────────────────────────────────────┐
│  [Logo] Product Pilot                                                │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│                    AI-Powered Product Management                     │
│                                                                      │
│          From problem statement to product roadmap                   │
│                    in minutes, not weeks.                            │
│                                                                      │
│                      [Start Building →]                              │
│                   (animated bounce button)                           │
│                                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │  9 AI Steps  │  │  Smart PRD   │  │ Auto Roadmap │              │
│  │  Sequential  │  │  Generation  │  │ & Backlog    │              │
│  │  pipeline    │  │  with export │  │ with RICE    │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│    (hover: lift + shadow + icon scale)                              │
│                                                                      │
│  ── How It Works ──                                                  │
│                                                                      │
│  ① Enter Problem  → ② AI Analyzes → ③ Get Artifacts               │
│     Statement         & Generates      PRD, Stories,                │
│                       9 outputs        Roadmap, OKRs                │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

**Animations:**
- CTA Button: Subtle bounce animation (`animate-bounce-subtle`), shadow on hover, scale up
- Feature Cards: Hover lift (-translate-y-1), shadow increase, icon scale (group-hover)

---

## Screen 2: Dashboard (/dashboard)

```
┌──────────────────────────────────────────────────────────────────────┐
│ ┌─────────┐                                                          │
│ │ SIDEBAR │  Dashboard                         [+ New Project]       │
│ │         │                                                          │
│ │ ○ Dash  │  ┌─ Stats Bar ──────────────────────────────────────┐   │
│ │ ○ Proj  │  │  Total: 12    In Progress: 3    Completed: 8    │   │
│ │ ○ Chat  │  │  Drafts: 1                                      │   │
│ │ ○ Pres  │  └──────────────────────────────────────────────────┘   │
│ │ ○ Setti │                                                          │
│ │         │                                                          │
│ │ ─────── │                                                          │
│ │ 🔧 Tools│                                                          │
│ │ ▹ Meet  │                                                          │
│ │ ▹ PDF   │                                                          │
│ │ ▹ Eng   │                                                          │
│ │ ▹ Back  │                                                          │
│ │ ▹ Prom  │                                                          │
│ │ ▹ Daily │                                                          │
│ │         │                                                          │
│ │         │  ┌─ Recent Projects ─────────────────────────────────┐  │
│ │         │  │                                                    │  │
│ │         │  │ ┌──────────────────────────────────────────────┐  │  │
│ │         │  │ │ Food Delivery App                     ●●●●●○○○○│  │
│ │         │  │ │ Step 5/9 · Market Analysis in progress       │  │  │
│ │         │  │ │ Updated 2 hours ago            [Continue →]  │  │  │
│ │         │  │ └──────────────────────────────────────────────┘  │  │
│ │         │  │                                                    │  │
│ │         │  │ ┌──────────────────────────────────────────────┐  │  │
│ │         │  │ │ HR Analytics Platform               ●●●●●●●●●│  │
│ │         │  │ │ Completed · 9/9 steps done                   │  │  │
│ │         │  │ │ Updated 1 day ago        [View] [Export ▼]  │  │  │
│ │         │  │ └──────────────────────────────────────────────┘  │  │
│ │         │  │                                                    │  │
│ │         │  │ ┌──────────────────────────────────────────────┐  │  │
│ │         │  │ │ E-Learning Marketplace              ●●●○○○○○○│  │
│ │         │  │ │ Step 3/9 · Persona generation                │  │  │
│ │         │  │ │ Updated 3 days ago           [Continue →]    │  │  │
│ │         │  │ └──────────────────────────────────────────────┘  │  │
│ │         │  │                                                    │  │
│ │         │  └────────────────────────────────────────────────────┘  │
│ └─────────┘                                                          │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Screen 3: New Project (/project/new)

```
┌──────────────────────────────────────────────────────────────────────┐
│ ┌─────────┐                                                          │
│ │ SIDEBAR │  Create New Project                                      │
│ │         │                                                          │
│ │         │  ┌─────────────────────────────────────────────────────┐ │
│ │         │  │ Project Name                                        │ │
│ │         │  │ ┌─────────────────────────────────────────────────┐ │ │
│ │         │  │ │ Food Delivery App for Tier-2 Cities            │ │ │
│ │         │  │ └─────────────────────────────────────────────────┘ │ │
│ │         │  │                                                     │ │
│ │         │  │ Problem Statement                                   │ │
│ │         │  │ ┌─────────────────────────────────────────────────┐ │ │
│ │         │  │ │ Restaurant owners in tier-2 cities struggle     │ │ │
│ │         │  │ │ to reach online customers due to high           │ │ │
│ │         │  │ │ commission fees from existing platforms like    │ │ │
│ │         │  │ │ Swiggy and Zomato. They need an affordable     │ │ │
│ │         │  │ │ way to accept orders online without losing     │ │ │
│ │         │  │ │ 25-30% of revenue to platform commissions.     │ │ │
│ │         │  │ │                                                 │ │ │
│ │         │  │ │                                        📎 ↕   │ │ │
│ │         │  │ └─────────────────────────────────────────────────┘ │ │
│ │         │  │                                                     │ │
│ │         │  │ ── Or choose a template (pre-fills form) ──        │ │
│ │         │  │                                                     │ │
│ │         │  │ [SaaS Product] [Mobile App] [Marketplace]          │ │
│ │         │  │ [Internal Tool] [API Platform] [Custom]            │ │
│ │         │  │                                                     │ │
│ │         │  │ ℹ️ Template "SaaS Product" loaded                  │ │
│ │         │  │     Project name and problem statement pre-filled    │ │
│ │         │  │ ┌─────────────┐  ┌──────────────────────────┐     │ │
│ │         │  │ │   Cancel    │  │  Start AI Pipeline  →    │     │ │
│ │         │  │ └─────────────┘  └──────────────────────────┘     │ │
│ │         │  └─────────────────────────────────────────────────────┘ │
│ └─────────┘                                                          │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Screen 4: Pipeline View (/project/[id])

The main project view with step-by-step pipeline progress.

```
┌──────────────────────────────────────────────────────────────────────┐
│ ┌─────────┐                                                          │
│ │ SIDEBAR │  Food Delivery App           [Export ▼] [Share] [⚙]     │
│ │         │                                                          │
│ │ Steps:  │  ┌─ Pipeline Progress ──────────────────────────────┐   │
│ │         │  │                                                    │   │
│ │ ✓ 1.Reframe│ │  ①──②──③──④──⑤──⑥──⑦──⑧──⑨                 │   │
│ │ ✓ 2.Vision│ │  ✓   ✓   ✓   ✓   ◉   ○   ○   ○   ○          │   │
│ │ ✓ 3.Persona│ │                    ↑                            │   │
│ │ ✓ 4.Questn│ │              Currently running                  │   │
│ │ ◉ 5.Market│ │                                                  │   │
│ │ ○ 6.PRD  │ └──────────────────────────────────────────────────┘   │
│ │ ○ 7.Story │                                                        │
│ │ ○ 8.Roadmp│  ┌─ Step 5: Market & Competitive Analysis ────────┐  │
│ │ ○ 9.OKRs │  │                                                  │  │
│ │         │  │  ⟳ Analyzing market landscape...                  │  │
│ │         │  │                                                    │  │
│ │         │  │  ┌─ Streaming Output ──────────────────────────┐  │  │
│ │         │  │  │                                              │  │  │
│ │         │  │  │  ## Market Overview                          │  │  │
│ │         │  │  │  The food delivery market in India is        │  │  │
│ │         │  │  │  valued at $12.5B in 2026, growing at       │  │  │
│ │         │  │  │  25% CAGR. Tier-2 cities represent...       │  │  │
│ │         │  │  │  █                                           │  │  │
│ │         │  │  │                                              │  │  │
│ │         │  │  └──────────────────────────────────────────────┘  │  │
│ │         │  │                                                    │  │
│ │         │  │  [⏸ Pause] [↻ Regenerate] [✏ Edit Context]       │  │
│ │         │  └────────────────────────────────────────────────────┘  │
│ └─────────┘                                                          │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Screen 5: Step 1 - Problem Statement (/project/[id]/problem)

```
┌──────────────────────────────────────────────────────────────────────┐
│ ┌─────────┐                                                          │
│ │ SIDEBAR │  Step 1: Problem Statement (ProductPlan Template)       │
│ │         │                                                          │
│ │ Steps:  │  ┌─ Problem Title ───────────────────────────────────┐  │
│ │ ◉ 1     │  │                                                     │  │
│ │ ○ 2-9   │  │  High Cart Abandonment Due to Checkout Friction   │  │
│ │         │  │                                                     │  │
│ │         │  │  Users abandon carts due to a confusing, multi-step │  │
│ │         │  │  checkout process with unexpected costs...        │  │
│ │         │  └─────────────────────────────────────────────────────┘  │
│ │         │                                                          │
│ │         │  ┌─ Problem Description ───────────────────────────┐  │
│ │         │  │ Our e-commerce platform experiences a 65% cart    │  │
│ │         │  │ abandonment rate. Users drop off due to friction  │  │
│ │         │  │ points including unexpected shipping costs...     │  │
│ │         │  └─────────────────────────────────────────────────────┘  │
│ │         │                                                          │
│ │         │  ┌─ Context ───────────────┐ ┌─ Scope ─────────────────┐  │
│ │         │  │ Root Causes:            │ │ In Scope:             │  │
│ │         │  │ • Legacy checkout       │ │ • Guest checkout      │  │
│ │         │  │ • No mobile opt         │ │ • Multiple payments   │  │
│ │         │  │                         │ │ • Transparent pricing │  │
│ │         │  │ When: During purchase   │ │                       │  │
│ │         │  │ decision phase          │ │ Out of Scope:         │  │
│ │         │  │                         │ │ • One-click for new   │  │
│ │         │  │ Manifestation:          │ │ • Crypto payments     │  │
│ │         │  │ 65% abandonment         │ │ • Social commerce     │  │
│ │         │  └─────────────────────────┘ └─────────────────────────┘  │
│ │         │                                                          │
│ │         │  ┌─ Impact ──────────────────────────────────────────┐  │
│ │         │  │ Business Impact                      User Impact   │  │
│ │         │  │ • $600K annual loss    │  • Faster checkout        │  │
│ │         │  │ • 25% higher CAC       │  • Reduced frustration    │  │
│ │         │  │ • Decreased LTV        │  • Better trust           │  │
│ │         │  └─────────────────────────────────────────────────────┘  │
│ │         │                                                          │
│ │         │  ┌─ Concise Problem Statement (Mad Libs) ───────────┐  │
│ │         │  │                                                     │  │
│ │         │  │ For online shoppers who need a fast checkout,    │  │
│ │         │  │ the complex multi-step process is a barrier    │  │
│ │         │  │ that causes 65% abandonment. Unlike competitors, │  │
│ │         │  │ our solution streamlines checkout to under 60s. │  │
│ │         │  │                                                     │  │
│ │         │  └─────────────────────────────────────────────────────┘  │
│ │         │                                                          │
│ │         │  ┌─ Next Steps ──────────────────────────────────────┐  │
│ │         │  │ 1. Conduct checkout UX audit                        │  │
│ │         │  │ 2. Benchmark top 5 competitors                        │  │
│ │         │  │ 3. Create wireframes for review                     │  │
│ │         │  │ 4. Develop technical requirements                   │  │
│ │         │  │ 5. Secure budget approval                             │  │
│ │         │  └─────────────────────────────────────────────────────┘  │
│ │         │                                                          │
│ │         │     [✏ Edit] [↻ Regenerate Step 1] [→ Next Step]        │
│ └─────────┘                                                          │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Screen 6: Step 2 - Vision (/project/[id]/vision)

```
┌──────────────────────────────────────────────────────────────────────┐
│ ┌─────────┐                                                          │
│ │ SIDEBAR │  Step 2: Product Vision                                  │
│ │         │                                                          │
│ │         │  ┌─ Vision Statement ────────────────────────────────┐  │
│ │         │  │                                                    │  │
│ │         │  │  "Empower every restaurant in India's tier-2      │  │
│ │         │  │   cities to own their digital storefront and      │  │
│ │         │  │   build direct customer relationships without     │  │
│ │         │  │   sacrificing margins to aggregators."            │  │
│ │         │  │                                                    │  │
│ │         │  └────────────────────────────────────────────────────┘  │
│ │         │                                                          │
│ │         │  ┌─ Mission ─────────┐  ┌─ Value Proposition ────────┐  │
│ │         │  │ Democratize online │  │ Zero-commission online    │  │
│ │         │  │ food ordering for  │  │ ordering with built-in    │  │
│ │         │  │ small restaurants  │  │ marketing tools at 1/10th │  │
│ │         │  └────────────────────┘  │ the cost of aggregators   │  │
│ │         │                          └────────────────────────────┘  │
│ │         │                                                          │
│ │         │  ┌─ North Star Metric ───────────────────────────────┐  │
│ │         │  │  Monthly Active Ordering Restaurants (MAOR)       │  │
│ │         │  └────────────────────────────────────────────────────┘  │
│ │         │                                                          │
│ │         │  ┌─ Elevator Pitch ──────────────────────────────────┐  │
│ │         │  │  "Shopify for restaurants — a white-label         │  │
│ │         │  │   ordering platform that lets any restaurant      │  │
│ │         │  │   go online in 15 minutes for ₹999/month."       │  │
│ │         │  └────────────────────────────────────────────────────┘  │
│ │         │                                                          │
│ │         │  ┌─ Guiding Principles ──────────────────────────────┐  │
│ │         │  │  1. Restaurant-first economics                    │  │
│ │         │  │  2. Simplicity over features                      │  │
│ │         │  │  3. Vernacular-first (local language support)     │  │
│ │         │  │  4. Mobile-first for restaurant owners            │  │
│ │         │  └────────────────────────────────────────────────────┘  │
│ │         │                                                          │
│ │         │       [← Previous] [✏ Edit] [↻ Regen] [→ Next Step]    │
│ └─────────┘                                                          │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Screen 7: Step 3 - Personas (/project/[id]/personas)

```
┌──────────────────────────────────────────────────────────────────────┐
│ ┌─────────┐                                                          │
│ │ SIDEBAR │  Step 3: Identify & Profile Personas                     │
│ │         │  (Product School Template)                               │
│ │         │                                                          │
│ │         │  ┌─ Persona 1: Sarah Chen ─────────────────────────────┐  │
│ │         │  │                                                     │  │
│ │         │  │  👤 SC                                             │  │
│ │         │  │  Sarah Chen • Product Manager • Millennial        │  │
│ │         │  │  San Francisco, CA                                 │  │
│ │         │  │                                                     │  │
│ │         │  │  "If I could save just 1 hour a day on admin      │  │
│ │         │  │   tasks, I'd have time for strategic thinking."   │  │
│ │         │  │                                                     │  │
│ │         │  │  ┌─ Overview ───┬─── Age ───┬─── Industry ───┐     │  │
│ │         │  │  │ Sarah Chen   │ 32        │ Tech/SaaS    │     │  │
│ │         │  │  └──────────────┴───────────┴──────────────┘     │  │
│ │         │  │                                                     │  │
│ │         │  │  ┌─ Personal ───────────┐ ┌─ Professional ─────┐ │  │
│ │         │  │  │ Gender: Female        │ │ Industry: Tech     │ │  │
│ │         │  │  │ Education: Bachelor │ │ Company: 100-500   │ │  │
│ │         │  │  │ Income: $90k-$120k    │ │ Experience: 5-8 yr │ │  │
│ │         │  │  │ Family: Single        │ │ Tech Skill: 4/5  │ │  │
│ │         │  │  │ Living: Rents apt     │ │ Tools: Jira, Slack │ │  │
│ │         │  │  └────────────────────────┘ └────────────────────┘ │  │
│ │         │  │                                                     │  │
│ │         │  │  ┌─ Psychographics ─────────────────────────────┐  │  │
│ │         │  │  │ Traits: Organized, ambitious, collaborative   │  │  │
│ │         │  │  │ Values: Efficiency, work-life balance, growth │  │  │
│ │         │  │  │ Motivations: Ship great products, team growth │  │  │
│ │         │  │  │ Fears: Missing deadlines, burnout from admin│  │  │
│ │         │  │  └──────────────────────────────────────────────┘  │  │
│ │         │  │                                                     │  │
│ │         │  │  ┌─ Goals ──────────────┐ ┌─ Pain Points ───────┐ │  │
│ │         │  │  │ • Ship on time       │ │ • Tool Overload   │ │  │
│ │         │  │  │ • Better collab      │ │ • Status tracking │ │  │
│ │         │  │  │ • Reduce admin 30%   │ │ • Manual reporting│ │  │
│ │         │  │  │ • Strategic time     │ │ • Communication gaps│ │  │
│ │         │  │  └──────────────────────┘ └─────────────────────┘ │  │
│ │         │  │                                                     │  │
│ │         │  └─────────────────────────────────────────────────────┘  │
│ │         │                                                          │
│ │         │  ┌─ Persona 2: Marcus Rodriguez ────────────────────────┐  │
│ │         │  │                                                     │  │
│ │         │  │  👤 MR                                             │  │
│ │         │  │  Marcus Rodriguez • Operations Lead • Millennial  │  │
│ │         │  │  Austin, TX                                        │  │
│ │         │  │                                                     │  │
│ │         │  │  "I need to see the big picture without getting   │  │
│ │         │  │   lost in the details."                           │  │
│ │         │  │                                                     │  │
│ │         │  │  ┌─ Overview ───┬─── Age ───┬─── Industry ───┐     │  │
│ │         │  │  │ Marcus R     │ 38        │ Tech/Startup   │     │  │
│ │         │  │  └──────────────┴───────────┴──────────────┘     │  │
│ │         │  │                                                     │  │
│ │         │  │  ┌─ Personal ───────────┐ ┌─ Professional ─────┐ │  │
│ │         │  │  │ Gender: Male          │ │ Industry: Tech     │ │  │
│ │         │  │  │ Education: MBA        │ │ Company: 50-200    │ │  │
│ │         │  │  │ Income: $100k-$140k   │ │ Experience: 10-12  │ │  │
│ │         │  │  │ Family: Married, 2 kids│ │ Tech Skill: 3/5   │ │  │
│ │         │  │  │ Living: Suburban home │ │ Tools: Excel, SFDC │ │  │
│ │         │  │  └────────────────────────┘ └────────────────────┘ │  │
│ │         │  │                                                     │  │
│ │         │  │  ┌─ Psychographics ─────────────────────────────┐  │  │
│ │         │  │  │ Traits: Analytical, process-oriented      │  │  │
│ │         │  │  │ Values: Efficiency, scalability          │  │  │
│ │         │  │  │ Motivations: Building systems, growth    │  │  │
│ │         │  │  │ Fears: Operational chaos at scale       │  │  │
│ │         │  │  └──────────────────────────────────────────────┘  │  │
│ │         │  │                                                     │  │
│ │         │  │  ┌─ Goals ──────────────┐ ┌─ Pain Points ───────┐ │  │
│ │         │  │  │ • Improve 40%        │ │ • Siloed data     │ │  │
│ │         │  │  │ • Data-driven        │ │ • Manual reports  │ │  │
│ │         │  │  │ • Scale processes    │ │ • No visibility   │ │  │
│ │         │  │  │ • Single source      │ │ • Inconsistent    │ │  │
│ │         │  │  └──────────────────────┘ └─────────────────────┘ │  │
│ │         │  │                                                     │  │
│ │         │  └─────────────────────────────────────────────────────┘  │
│ │         │                                                          │
│ │         │     [← Previous] [✏ Edit] [↻ Regen Step 3] [→ Next]     │
│ └─────────┘                                                          │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Screen 8: Step 4 - Clarifying Questions (/project/[id]/questions)

```
┌──────────────────────────────────────────────────────────────────────┐
│ ┌─────────┐                                                          │
│ │ SIDEBAR │  Step 4: Clarifying Questions                            │
│ │         │                                                          │
│ │         │  ┌─ Questions List ──────────────────────────────────┐  │
│ │         │  │                                                    │  │
│ │         │  │  Filter: [All ▼] [User Needs] [Technical]         │  │
│ │         │  │          [Business] [Scope] [Constraints]          │  │
│ │         │  │                                                    │  │
│ │         │  │  ┌─ Q1 (Business) ────────────── Priority: ★★★ ┐ │  │
│ │         │  │  │ What is the target revenue model — monthly   │ │  │
│ │         │  │  │ subscription, per-order fee, or freemium?    │ │  │
│ │         │  │  │                                               │ │  │
│ │         │  │  │ AI Answer: "Based on the problem statement,  │ │  │
│ │         │  │  │ a monthly subscription model (₹999-2999/mo)  │ │  │
│ │         │  │  │ would align best with the low-commission     │ │  │
│ │         │  │  │ value proposition..."                        │ │  │
│ │         │  │  │                                               │ │  │
│ │         │  │  │ Your Answer: [Type your answer...      ]     │ │  │
│ │         │  │  │              [Ask AI to elaborate ↻]         │ │  │
│ │         │  │  └───────────────────────────────────────────────┘ │  │
│ │         │  │                                                    │  │
│ │         │  │  ┌─ Q2 (Technical) ─────────────── Priority: ★★ ┐ │  │
│ │         │  │  │ Should the platform support payment gateway  │ │  │
│ │         │  │  │ integration from day 1, or start with COD?   │ │  │
│ │         │  │  │                                               │ │  │
│ │         │  │  │ AI Answer: "Starting with COD + UPI reduces  │ │  │
│ │         │  │  │ complexity for MVP. Razorpay integration     │ │  │
│ │         │  │  │ can be Phase 2..."                           │ │  │
│ │         │  │  │                                               │ │  │
│ │         │  │  │ Your Answer: [                          ]     │ │  │
│ │         │  │  └───────────────────────────────────────────────┘ │  │
│ │         │  │                                                    │  │
│ │         │  │  ... (8-12 more questions) ...                    │  │
│ │         │  │                                                    │  │
│ │         │  └────────────────────────────────────────────────────┘  │
│ │         │                                                          │
│ │         │  ┌─ AI Chat Assistant ────────────────────────────────┐  │
│ │         │  │ 💬 Ask follow-up questions about any topic        │  │
│ │         │  │ ┌──────────────────────────────────────────────┐   │  │
│ │         │  │ │ Type a question...                  [Send →] │   │  │
│ │         │  │ └──────────────────────────────────────────────┘   │  │
│ │         │  └────────────────────────────────────────────────────┘  │
│ │         │                                                          │
│ │         │       [← Previous] [Accept All AI Answers] [→ Next]     │
│ └─────────┘                                                          │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Screen 9: Step 5 - Market Analysis (/project/[id]/market)

```
┌──────────────────────────────────────────────────────────────────────┐
│ ┌─────────┐                                                          │
│ │ SIDEBAR │  Step 5: Market & Competitive Analysis                   │
│ │         │                                                          │
│ │         │  ┌─ Market Overview ─────────────────────────────────┐  │
│ │         │  │  Market Size: $12.5B (2026)  Growth: 25% CAGR    │  │
│ │         │  │                                                    │  │
│ │         │  │  Key Trends:                                      │  │
│ │         │  │  • Direct-to-consumer ordering growing 40% YoY   │  │
│ │         │  │  • Tier-2/3 city digitization accelerating        │  │
│ │         │  │  • WhatsApp commerce adoption in food sector      │  │
│ │         │  └────────────────────────────────────────────────────┘  │
│ │         │                                                          │
│ │         │  ┌─ Competitor Comparison Table ──────────────────────┐  │
│ │         │  │                                                    │  │
│ │         │  │  Competitor  │ Share │ Pricing    │ Rating │ Key   │  │
│ │         │  │  ────────────┼───────┼────────────┼────────┼─────  │  │
│ │         │  │  Swiggy      │  45%  │ 25-30%/ord │ ★★★★   │ Scale│  │
│ │         │  │  Zomato      │  40%  │ 20-25%/ord │ ★★★★   │ Brand│  │
│ │         │  │  DotPe       │   5%  │ ₹999/mo    │ ★★★    │ Value│  │
│ │         │  │  Thrive      │   3%  │ ₹1499/mo   │ ★★★    │ UX   │  │
│ │         │  │  Petpooja    │   2%  │ ₹1999/mo   │ ★★★    │ POS  │  │
│ │         │  │                                                    │  │
│ │         │  └────────────────────────────────────────────────────┘  │
│ │         │                                                          │
│ │         │  ┌─ SWOT (Selected: DotPe) ──────────────────────────┐  │
│ │         │  │                                                    │  │
│ │         │  │  Strengths        │  Weaknesses                   │  │
│ │         │  │  • Low pricing    │  • Limited marketing tools    │  │
│ │         │  │  • WhatsApp focus │  • Poor analytics             │  │
│ │         │  │  ────────────────────────────────────────          │  │
│ │         │  │  Opportunities    │  Threats                      │  │
│ │         │  │  • Tier-2 gap     │  • Swiggy launching own POS   │  │
│ │         │  │  • Vernacular UX  │  • Google direct ordering     │  │
│ │         │  │                                                    │  │
│ │         │  └────────────────────────────────────────────────────┘  │
│ │         │                                                          │
│ │         │  ┌─ Competitive Advantage ────────────────────────────┐  │
│ │         │  │  "Zero-commission model with AI-powered marketing │  │
│ │         │  │   tools specifically designed for non-tech-savvy  │  │
│ │         │  │   restaurant owners in tier-2 cities"             │  │
│ │         │  └────────────────────────────────────────────────────┘  │
│ │         │                                                          │
│ │         │       [← Previous] [↻ Regen] [→ Next Step]              │
│ └─────────┘                                                          │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Screen 10: Step 6 - PRD (/project/[id]/prd)

```
┌──────────────────────────────────────────────────────────────────────┐
│ ┌─────────┐                                                          │
│ │ SIDEBAR │  Step 6: Product Requirements Document                   │
│ │         │                                                          │
│ │         │  ┌─ PRD Navigation ─┐ ┌─ Content ────────────────────┐  │
│ │         │  │                   │ │                              │  │
│ │         │  │ ▸ Overview        │ │ # Food Delivery Platform    │  │
│ │         │  │ ▸ Problem         │ │ ## for Tier-2 Cities        │  │
│ │         │  │ ▸ Goals           │ │                              │  │
│ │         │  │ ▸ Target Users    │ │ ### 1. Overview              │  │
│ │         │  │ ▸ Solution        │ │                              │  │
│ │         │  │ ▸ Scope (In/Out)  │ │ A white-label online        │  │
│ │         │  │ ▸ User Flows      │ │ ordering platform enabling  │  │
│ │         │  │ ▸ Functional Req  │ │ restaurant owners to accept │  │
│ │         │  │ ▸ Non-Func Req    │ │ orders directly...          │  │
│ │         │  │ ▸ Tech Approach   │ │                              │  │
│ │         │  │ ▸ Success Metrics │ │ ### 2. Problem Statement    │  │
│ │         │  │ ▸ Timeline        │ │                              │  │
│ │         │  │ ▸ Open Questions  │ │ Restaurant owners in        │  │
│ │         │  │                   │ │ tier-2 cities...            │  │
│ │         │  │                   │ │                              │  │
│ │         │  │ Version: v1       │ │ ### 3. Goals                │  │
│ │         │  │                   │ │                              │  │
│ │         │  │ [📋 Copy MD]     │ │ • Reduce commission from   │  │
│ │         │  │ [📄 Export PDF]  │ │   25% to 0%                │  │
│ │         │  │ [📝 Edit Mode]  │ │ • Onboard 1000 restaurants │  │
│ │         │  │                   │ │   in 6 months              │  │
│ │         │  └───────────────────┘ │                              │  │
│ │         │                        │ ...                          │  │
│ │         │                        └──────────────────────────────┘  │
│ │         │                                                          │
│ │         │       [← Previous] [↻ Regen] [→ Next Step]              │
│ └─────────┘                                                          │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Screen 11: Step 7 - User Stories (/project/[id]/stories)

```
┌──────────────────────────────────────────────────────────────────────┐
│ ┌─────────┐                                                          │
│ │ SIDEBAR │  Step 7: User Stories           [Filter ▼] [Group by ▼] │
│ │         │                                                          │
│ │         │  ┌─ Epic: Restaurant Onboarding ─────────────────────┐  │
│ │         │  │                                                    │  │
│ │         │  │ ┌─ US-001 ─────────────────────── 5 SP ── HIGH ┐ │  │
│ │         │  │ │ Restaurant Registration                       │ │  │
│ │         │  │ │                                                │ │  │
│ │         │  │ │ As a restaurant owner,                        │ │  │
│ │         │  │ │ I want to register my restaurant with basic   │ │  │
│ │         │  │ │ details (name, address, phone, menu),         │ │  │
│ │         │  │ │ So that I can start receiving online orders.  │ │  │
│ │         │  │ │                                                │ │  │
│ │         │  │ │ Acceptance Criteria:                          │ │  │
│ │         │  │ │ ┌────────────────────────────────────────┐    │ │  │
│ │         │  │ │ │ Given a new restaurant owner           │    │ │  │
│ │         │  │ │ │ When they fill in name, address,       │    │ │  │
│ │         │  │ │ │      phone, and upload menu photos     │    │ │  │
│ │         │  │ │ │ Then a restaurant profile is created   │    │ │  │
│ │         │  │ │ │      and a unique ordering link is     │    │ │  │
│ │         │  │ │ │      generated                         │    │ │  │
│ │         │  │ │ ├────────────────────────────────────────┤    │ │  │
│ │         │  │ │ │ Given invalid phone number             │    │ │  │
│ │         │  │ │ │ When they submit the form              │    │ │  │
│ │         │  │ │ │ Then an error message is shown         │    │ │  │
│ │         │  │ │ └────────────────────────────────────────┘    │ │  │
│ │         │  │ └────────────────────────────────────────────────┘ │  │
│ │         │  │                                                    │  │
│ │         │  │ ┌─ US-002 ─────────────────────── 3 SP ── MED ──┐ │  │
│ │         │  │ │ Menu Management                                │ │  │
│ │         │  │ │ As a restaurant owner, I want to add/edit     │ │  │
│ │         │  │ │ menu items with prices and photos...          │ │  │
│ │         │  │ │                                    [Expand ▼] │ │  │
│ │         │  │ └────────────────────────────────────────────────┘ │  │
│ │         │  │                                                    │  │
│ │         │  └────────────────────────────────────────────────────┘  │
│ │         │                                                          │
│ │         │  ┌─ Epic: Customer Ordering ─────────────────────────┐  │
│ │         │  │  US-005 · Browse Menu ···· 2 SP ···· HIGH         │  │
│ │         │  │  US-006 · Place Order ···· 5 SP ···· CRITICAL     │  │
│ │         │  │  US-007 · Track Order ···· 3 SP ···· MEDIUM       │  │
│ │         │  │                                        [Expand ▼] │  │
│ │         │  └────────────────────────────────────────────────────┘  │
│ │         │                                                          │
│ │         │  Total: 24 stories · 89 story points                    │
│ │         │       [← Previous] [↻ Regen] [→ Next Step]              │
│ └─────────┘                                                          │
└──────────────────────────────────────────────────────────────────────┘
```

**Step 7 Interaction Flow:**
1. User clicks "Generate User Stories" → AI streams stories with RICE scoring
2. User reviews generated stories in the UI
3. User can click "Edit Results" to make changes before saving
4. User clicks "Save Results" to persist to database (manual save required)
5. Once saved, user can proceed to Step 8

**Note:** Unlike earlier steps, Step 7 requires manual save to allow users to review and edit user stories before persisting.

---

## Screen 12: Step 8 - Backlog & Roadmap (/project/[id]/backlog)

```
┌──────────────────────────────────────────────────────────────────────┐
│ ┌─────────┐                                                          │
│ │ SIDEBAR │  Step 8: Prioritized Backlog    [Backlog] [Roadmap]     │
│ │         │                                                          │
│ │         │  ┌─ Prioritization (RICE Framework) ─────────────────┐  │
│ │         │  │                                                    │  │
│ │         │  │  Story           │ Reach│Impact│Conf │Effort│Score │  │
│ │         │  │  ────────────────┼──────┼──────┼─────┼──────┼───── │  │
│ │         │  │  Place Order     │  10K │  3   │ 90% │  5   │ 5400│  │
│ │         │  │  Registration    │   5K │  3   │ 80% │  3   │ 4000│  │
│ │         │  │  Browse Menu     │  10K │  2   │ 90% │  2   │ 9000│  │
│ │         │  │  Payment (UPI)   │   8K │  3   │ 70% │  5   │ 3360│  │
│ │         │  │  Menu Management │   5K │  2   │ 80% │  3   │ 2667│  │
│ │         │  │  Order Tracking  │   8K │  1   │ 60% │  3   │ 1600│  │
│ │         │  │  ...             │      │      │     │      │     │  │
│ │         │  │                                                    │  │
│ │         │  └────────────────────────────────────────────────────┘  │
│ │         │                                                          │
│ └─────────┘                                                          │
└──────────────────────────────────────────────────────────────────────┘
```

### Roadmap Tab

```
┌──────────────────────────────────────────────────────────────────────┐
│ ┌─────────┐                                                          │
│ │ SIDEBAR │  Step 8: Roadmap                [Backlog] [Roadmap]     │
│ │         │                                                          │
│ │         │  ┌─ Timeline View ───────────────────────────────────┐  │
│ │         │  │                                                    │  │
│ │         │  │  Phase 1: MVP (Weeks 1-6)                         │  │
│ │         │  │  ┌──────────────────────────────────────────────┐ │  │
│ │         │  │  │▓▓▓▓▓ Registration                            │ │  │
│ │         │  │  │▓▓▓▓▓▓▓▓ Menu Management                     │ │  │
│ │         │  │  │    ▓▓▓▓▓▓▓▓▓▓ Browse & Order                │ │  │
│ │         │  │  │         ▓▓▓▓▓ UPI Payment                   │ │  │
│ │         │  │  └──────────────────────────────────────────────┘ │  │
│ │         │  │  Milestone: Launch MVP with 10 pilot restaurants  │  │
│ │         │  │                                                    │  │
│ │         │  │  Phase 2: Growth (Weeks 7-12)                     │  │
│ │         │  │  ┌──────────────────────────────────────────────┐ │  │
│ │         │  │  │▓▓▓▓▓ Order Tracking                          │ │  │
│ │         │  │  │▓▓▓▓▓▓▓ Analytics Dashboard                  │ │  │
│ │         │  │  │    ▓▓▓▓▓▓▓▓ Marketing Tools                 │ │  │
│ │         │  │  │         ▓▓▓▓▓ Multi-language                 │ │  │
│ │         │  │  └──────────────────────────────────────────────┘ │  │
│ │         │  │  Milestone: 100 active restaurants                │  │
│ │         │  │                                                    │  │
│ │         │  │  Phase 3: Scale (Weeks 13-20)                     │  │
│ │         │  │  ┌──────────────────────────────────────────────┐ │  │
│ │         │  │  │▓▓▓▓▓▓▓ Delivery Partner Integration         │ │  │
│ │         │  │  │    ▓▓▓▓▓▓▓▓ Loyalty Program                 │ │  │
│ │         │  │  │         ▓▓▓▓▓▓▓▓ API / Integrations         │ │  │
│ │         │  │  └──────────────────────────────────────────────┘ │  │
│ │         │  │  Milestone: 1000 restaurants, revenue positive    │  │
│ │         │  │                                                    │  │
│ │         │  └────────────────────────────────────────────────────┘  │
│ │         │                                                          │
│ │         │       [← Previous] [↻ Regen] [→ Next Step]              │
│ └─────────┘                                                          │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Screen 13: Step 9 - OKRs (/project/[id]/okrs)

```
┌──────────────────────────────────────────────────────────────────────┐
│ ┌─────────┐                                                          │
│ │ SIDEBAR │  Step 9: OKRs & Success Metrics                         │
│ │         │                                                          │
│ │         │  ┌─ OKR Tree ────────────────────────────────────────┐  │
│ │         │  │                                                    │  │
│ │         │  │  O1: Establish product-market fit in tier-2 cities│  │
│ │         │  │  ├─ KR1: Onboard 100 restaurants by Q2 end       │  │
│ │         │  │  │       Target: 100  │  Current: 0  │  ░░░░░░░  │  │
│ │         │  │  ├─ KR2: Achieve 50% week-2 retention            │  │
│ │         │  │  │       Target: 50%  │  Current: 0% │  ░░░░░░░  │  │
│ │         │  │  └─ KR3: Process 5000 orders/month               │  │
│ │         │  │          Target: 5K   │  Current: 0  │  ░░░░░░░  │  │
│ │         │  │                                                    │  │
│ │         │  │  O2: Build a delightful ordering experience       │  │
│ │         │  │  ├─ KR1: Achieve NPS > 40                        │  │
│ │         │  │  │       Target: 40   │  Current: -  │  ░░░░░░░  │  │
│ │         │  │  ├─ KR2: Order completion rate > 85%             │  │
│ │         │  │  │       Target: 85%  │  Current: -  │  ░░░░░░░  │  │
│ │         │  │  └─ KR3: Average order time < 3 minutes          │  │
│ │         │  │          Target: 3min │  Current: -  │  ░░░░░░░  │  │
│ │         │  │                                                    │  │
│ │         │  └────────────────────────────────────────────────────┘  │
│ │         │                                                          │
│ │         │  ┌─ Success Metrics (AARRR) ─────────────────────────┐  │
│ │         │  │                                                    │  │
│ │         │  │  Acquisition    │ Activation     │ Retention       │  │
│ │         │  │  ┌────────────┐ │ ┌────────────┐ │ ┌────────────┐ │  │
│ │         │  │  │ New signups│ │ │ First order│ │ │ W2 return  │ │  │
│ │         │  │  │ Target:    │ │ │ within 48h │ │ │ rate       │ │  │
│ │         │  │  │ 200/month  │ │ │ Target:60% │ │ │ Target:50% │ │  │
│ │         │  │  └────────────┘ │ └────────────┘ │ └────────────┘ │  │
│ │         │  │                 │                 │                │  │
│ │         │  │  Revenue        │ Referral        │                │  │
│ │         │  │  ┌────────────┐ │ ┌────────────┐ │                │  │
│ │         │  │  │ MRR        │ │ │ Viral coeff│ │  North Star:  │  │
│ │         │  │  │ Target:    │ │ │ Target:    │ │  Monthly Active│  │
│ │         │  │  │ ₹2L by Q2 │ │ │ > 1.2      │ │  Ordering     │  │
│ │         │  │  └────────────┘ │ └────────────┘ │  Restaurants  │  │
│ │         │  │                                                    │  │
│ │         │  └────────────────────────────────────────────────────┘  │
│ │         │                                                          │
│ │         │       [← Previous] [↻ Regen] [Export All ▼]             │
│ └─────────┘                                                          │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Screen 14: Export Modal

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│           Export Product Plan                             │
│                                                          │
│  Select sections to export:                              │
│                                                          │
│  [✓] Problem Statement (Reframed)                       │
│  [✓] Product Vision                                     │
│  [✓] Persona Profiles                                   │
│  [✓] Clarifying Questions & Answers                     │
│  [✓] Market & Competitive Analysis                      │
│  [✓] PRD                                                │
│  [✓] User Stories                                       │
│  [✓] Backlog & Roadmap                                  │
│  [✓] OKRs & Success Metrics                            │
│                                                          │
│  Format:                                                 │
│  (●) PDF    ( ) Markdown    ( ) DOCX    ( ) Confluence  │
│                                                          │
│  ┌──────────┐  ┌────────────────────────┐               │
│  │  Cancel   │  │  Export & Download  ↓  │               │
│  └──────────┘  └────────────────────────┘               │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## UI Component Specifications

### StepProgress Component

```
Horizontal stepper showing all 9 steps:

  ①──②──③──④──⑤──⑥──⑦──⑧──⑨

States:
  ✓  = Completed (green circle with checkmark)
  ◉  = In Progress (pulsing indigo circle)
  ○  = Pending (gray outlined circle)
  ✕  = Error (red circle with X)

Connecting lines: solid green for completed, dashed gray for pending
Each step label shown below the circle on hover/always on desktop
```

### OutputCard Component

```
┌─ [Section Title] ───────────── [✏ Edit] [↻ Regen] ┐
│                                                      │
│  Content rendered as Markdown                        │
│  with syntax highlighting for code blocks            │
│  and structured data displayed in tables              │
│                                                      │
│  Timestamps: Generated at 10:23 AM · llama-3.3-70b  │
└──────────────────────────────────────────────────────┘
```

### PersonaCard Component

```
┌────────────────────────────┐
│  [Avatar placeholder]      │
│  Name                      │
│  Role / Title              │
│                            │
│  "Representative quote"    │
│                            │
│  Tech Savvy: ●●●○○         │
│  Pain Points: 4            │
│  Goals: 3                  │
│                            │
│  [View Details →]          │
└────────────────────────────┘

Size: ~280px wide, ~320px tall
Grid: 2-3 columns on desktop, 1 on mobile
```

### QAChat Component (Step 4)

```
┌─ AI Assistant ──────────────────────────────────┐
│                                                  │
│  ┌─ AI ─────────────────────────────────────┐   │
│  │ Based on the personas and problem         │   │
│  │ statement, here are some thoughts...      │   │
│  └───────────────────────────────────────────┘   │
│                                                  │
│  ┌─ You ────────────────────────────────────┐   │
│  │ What about delivery logistics?            │   │
│  └───────────────────────────────────────────┘   │
│                                                  │
│  ┌─ AI ─────────────────────────────────────┐   │
│  │ Delivery logistics is currently marked    │   │
│  │ out of scope, but consider...             │   │
│  └───────────────────────────────────────────┘   │
│                                                  │
│  ┌───────────────────────────────── [Send] ┐    │
│  │ Type your question...                    │    │
│  └──────────────────────────────────────────┘    │
└──────────────────────────────────────────────────┘
```

### Chatbot Component (RAG)

```
┌──────────────────────────────────────────────────────────────────────┐
│ ┌─────────┐                                                          │
│ │ SIDEBAR │  🤖 Project Chatbot                                      │
│ │         │                                                          │
│ │ ○ Dash  │  ┌─ Project Selector (Centered) ──────────────────────┐   │
│ │ ○ Proj  │  │                                                     │   │
│ │ ● Chat  │  │   [📁 Food Delivery App ▼]                        │   │
│ │         │  │   Dropdown: Select Project                         │   │
│ │         │  │   • Food Delivery App                              │   │
│ │         │  │   • Analytics Dashboard                            │   │
│ │         │  │   • E-Learning Platform                            │   │
│ │         │  └─────────────────────────────────────────────────────┘   │
│ │         │                                                          │
│ │         │  ┌─ Chat Window ──────────────────────────────────────┐   │
│ │         │  │                                                    │   │
│ │         │  │ Bot: Hi! Ask me anything about this project:      │   │
│ │         │  │      • Problem statement                           │   │
│ │         │  │      • Personas and user needs                     │   │
│ │         │  │      • PRD features                                │   │
│ │         │  │      • Market analysis                             │   │
│ │         │  │      • Roadmap and timeline                        │   │
│ │         │  │                                                    │   │
│ │         │  │ You: What are the top 3 features in our PRD?       │   │
│ │         │  │                                                    │   │
│ │         │  │ ┌─ Bot Response ───────────────────────────────┐ │   │
│ │         │  │ │ Based on the PRD, the top 3 features are:     │ │   │
│ │         │  │ │                                                 │ │   │
│ │         │  │ │ 1. **AI-powered problem reframing** (P0)       │ │   │
│ │         │  │ │ 2. **Multi-step pipeline orchestration** (P0)  │ │   │
│ │         │  │ │ 3. **RAG-based knowledge retrieval** (P1)      │ │   │
│ │         │  │ │                                                 │ │   │
│ │         │  │ │ 📄 Source: PRD Template - Section 3.1          │ │   │
│ │         │  │ └────────────────────────────────────────────────┘ │   │
│ │         │  │                                                    │   │
│ │         │  │ You: Who are our target personas?                  │   │
│ │         │  │                                                    │   │
│ │         │  │ ┌─ Bot Response ───────────────────────────────┐ │   │
│ │         │  │ │ We have 2 primary personas:                   │ │   │
│ │         │  │ │                                                 │ │   │
│ │         │  │ │ **1. Sarah - The Busy Professional**          │ │   │
│ │         │  │ │ Age: 32, Tech-savvy, Values convenience       │ │   │
│ │         │  │ │                                                 │ │   │
│ │         │  │ │ **2. Mike - The Restaurant Owner**              │ │   │
│ │         │  │ │ Age: 45, Moderate tech skills, Wants growth   │ │   │
│ │         │  │ │                                                 │ │   │
│ │         │  │ │ 📄 Sources:                                     │ │   │
│ │         │  │ │ • Persona: Sarah (Step 3)                        │ │   │
│ │         │  │ │ • Persona: Mike (Step 3)                         │ │   │
│ │         │  │ └────────────────────────────────────────────────┘ │   │
│ │         │  │                                                    │   │
│ │         │  └────────────────────────────────────────────────────┘   │
│ │         │                                                          │
│ │         │  ┌─ Input Area ──────────────────────────────────────────┐│
│ │         │  │ [🎤] Type your question about the project...      [↑] ││
│ │         │  └───────────────────────────────────────────────────────┘│
│ │         │                                                          │
│ │         │  ┌─ RAG Controls ──────────────────────────────────────┐│
│ │         │  │ Status: ✅ Ready (45 vectors indexed)                ││
│ │         │  │ [View Sources] [Delete RAG] [Re-index]              ││
│ │         │  └───────────────────────────────────────────────────────┘│
│ │         │                                                          │
│ └─────────┘                                                          │
└──────────────────────────────────────────────────────────────────────┘
```

**Chatbot Features:**
- **Project Selector**: Centered dropdown to switch between projects for RAG context
- **Saved Results Display**: When selecting a project, displays saved pipeline data (problem statement, vision, personas) in welcome message
- **RAG Status Indicator**: Shows indexing status and vector count
- **Source Attribution**: Each response shows which step documents were used (Step 1, Step 3, etc.)
- **Quick Actions**: Delete RAG index, re-index, view source documents
- **Persistent History**: Chat messages saved to database per project
- **Context Awareness**: Maintains conversation context across multiple questions
- **Project Switching**: Changing project resets chat with new context showing actual project data

**Query Types:**
- Persona queries → Shows all user personas with quotes and details
- Problem queries → Displays problem description and pain points
- Vision queries → Shows vision, mission, value proposition
- Generic queries → Shows project summary with suggested follow-ups

---

## Responsive Breakpoints

| Breakpoint | Width     | Layout Changes                              |
|------------|-----------|---------------------------------------------|
| Desktop    | >= 1280px | Sidebar visible, 3-col persona grid         |
| Tablet     | >= 768px  | Sidebar collapsible, 2-col grid             |
| Mobile     | < 768px   | Sidebar hidden (hamburger), 1-col, stacked  |

---

## Navigation Controls

Each pipeline step features consistent navigation controls:

```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│  [← Previous] [✏ Edit Results] [↻ Regenerate Step N] [→ Next Step]  │
│                                                                      │
│  • Previous: Returns to previous step with saved state              │
│  • Edit: Opens inline edit mode for current step output             │
│  • Regenerate: Re-runs AI generation for current step               │
│  • Next: Proceeds to next step (only if current step complete)     │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

**Regenerate Buttons:**
- Step 1: [↻ Regenerate Step 1] - Regenerates problem statement with template
- Step 2: [↻ Regenerate Step 2] - Regenerates vision statement
- Step 3: [↻ Regenerate Step 3] - Regenerates personas with Product School template
- Steps 4-9: Similar pattern for remaining pipeline steps

**Next Step Progression:**
- Button only appears when current step has completed output
- Automatically advances step number and resets streaming state
- Maintains backward compatibility to view/edit previous steps

---

## Animation & Interactions

- **Step transitions:** Smooth slide-in from right when moving to next step
- **Streaming text:** Character-by-character typing effect for LLM output
- **Progress bar:** Animated fill as pipeline progresses
- **Persona cards:** Hover lift effect with shadow
- **Skeleton loading:** Gray pulsing placeholders while LLM generates
- **Toast notifications:** Bottom-right for step completion, errors, exports
- **Sidebar:** Smooth collapse/expand with 200ms transition

---

## Presentation Generator

### Purpose
Generate professional PowerPoint presentations from project step data

### UI Layout
- Project selector dropdown (fetches from `/api/projects/list`)
- Step selection checklist with progress indicators
- **Template selector** (Professional, Minimal, Dark, Startup)
- **Generation mode toggle:** Client-side (PptxGenJS) or Python Microservice
- Settings panel for title customization
- Generate button with loading state

### Features
- **Auto-detects** available steps from saved sessions
- **Two generation modes:**
  1. **Client-side** (PptxGenJS) - Fallback, runs in browser
  2. **Python Microservice** - Higher quality with professional templates
- **4 Professional Templates:**
  | Template | Style | Best For |
  |----------|-------|----------|
  | Professional | Clean corporate blue | Business presentations |
  | Minimal | Whitespace-focused | Simple, elegant decks |
  | Dark | Modern dark theme | Tech/startup pitches |
  | Startup | Bold rose/orange | Investor pitches |
- **Matplotlib Charts:** TAM/SAM/SOM funnel, OKR progress bars
- **Visual Cards:** Persona cards, feature cards, info boxes
- Download as `.pptx` file
- Title slide + agenda + selected step slides + thank you slide

### Architecture
```
┌─────────────────────────────────────────────────────────────────┐
│                    User clicks "Generate"                          │
└──────────────────────────┬───────────────────────────────────────┘
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
         ▼                 ▼                 ▼
┌────────────────┐  ┌────────────────┐  ┌────────────────────┐
│  Check Health  │  │ Python Service │  │  PptxGenJS       │
│  localhost:8000│  │ Available?     │  │  (Fallback)      │
└───────┬────────┘  └───────┬────────┘  └────────────────────┘
        │                   │ Yes
        │ No                │
        │                   ▼
        │           ┌────────────────┐
        │           │ POST /generate │
        │           │ FastAPI        │
        │           │ python-pptx    │
        │           │ matplotlib     │
        │           └───────┬────────┘
        │                   │
        └───────────────────┤
                            ▼
                    ┌──────────────┐
                    │  .pptx File  │
                    │  Download    │
                    └──────────────┘
```

### Python Microservice Integration
```typescript
// lib/ppt-service.ts - Integration helper

async function generateWithPythonService(project, steps, template) {
  // Check if service is available
  const isHealthy = await fetch('http://localhost:8000/health');
  if (!isHealthy.ok) throw new Error('Service unavailable');
  
  // Generate via microservice
  const response = await fetch('http://localhost:8000/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      projectName: project.name,
      projectDescription: project.description,
      steps: steps.map(s => ({
        stepId: s.id,
        stepName: s.name,
        data: s.savedData
      })),
      template: template, // 'professional' | 'minimal' | 'dark' | 'startup'
      includeCharts: true,
      includeImages: true
    })
  });
  
  const result = await response.json();
  const fileResponse = await fetch(`http://localhost:8000${result.downloadUrl}`);
  return await fileResponse.blob();
}
```

### Step Formatting (Python Service)
- **Step 1 (Reframe):** Title, reframed problem, root causes list
- **Step 2 (Vision):** Vision statement (italic), elevator pitch
- **Step 3 (Personas):** 2-column grid of persona cards
- **Step 4 (Questions):** Q&A cards with answers
- **Step 5 (Market):** Overview + competitors list

---

## Updated Sidebar Navigation
**Items (5 total):**
1. Dashboard
2. Projects
3. Chat
4. **Presentation (NEW)**
5. Settings

---

## Advanced Tools Section (Landing Page & Sidebar)
**6 Tool Cards:**
1. **MeetingPro AI** - Meeting transcription & summaries (External)
2. **PDF/Doc Generator** - Document conversion (External)
3. **Engineer Prompt** - SDLC toolkit (External)
4. **Backlog Manager** - Agile project management (External)
5. **Prompt Builder** - AI prompt crafting (External)
6. **Daily Drops** - Tech news RSS feed from ScienceDaily (Internal)

**Daily Drops Details:**
- **Location:** Landing Page (card) + Sidebar under "Advanced Tools" section
- **URL:** `/tools/daily-drops`
- **API:** `/api/tools/product-news` - Fetches from https://www.sciencedaily.com/rss/top/technology.xml
- **Features:** News tiles grid, article excerpts, direct links, refresh button
- **Icon:** Newspaper (Lucide React)
- **Color:** Sky-500 to Blue-600 gradient

---

## Screen X: Daily Drops (/tools/daily-drops)

```
┌──────────────────────────────────────────────────────────────────────┐
│ [← Back]  📰 Daily Drops                    [ScienceDaily] [↻ Refresh]│
│              Tech News Curated Daily                                  │
├──────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌─ News Tile 1 ──────────────────────────────────────────────────┐  │
│  │ AI Breakthrough in Quantum Computing                           │  │
│  │ Jan 15, 2026                                                   │  │
│  │ Researchers have developed a new quantum algorithm that...     │  │
│  │ [Read Full Story →]                                            │  │
│  └─────────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  ┌─ News Tile 2 ──────────────────────────────────────────────────┐  │
│  │ New Solar Panel Efficiency Record                              │  │
│  │ Jan 14, 2026                                                   │  │
│  │ Scientists achieve 47.6% efficiency in multi-junction solar... │  │
│  │ [Read Full Story →]                                            │  │
│  └─────────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  ┌─ News Tile 3 ──────────────────────────────────────────────────┐  │
│  │ SpaceX Starship Successfully Docks with ISS                    │  │
│  │ Jan 13, 2026                                                   │  │
│  │ The latest Starship mission marks a milestone in commercial... │  │
│  │ [Read Full Story →]                                            │  │
│  └─────────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  ... (more tiles in responsive grid)                                  │
│                                                                       │
└──────────────────────────────────────────────────────────────────────┘
│  News feed provided by ScienceDaily                    © 2024 PP     │
└──────────────────────────────────────────────────────────────────────┘
```

**Interactions:**
- Click "Read Full Story" → Opens article in new tab
- Click "Refresh" → Reloads RSS feed (cached for 1 hour)
- Responsive grid: 3 cols (desktop), 2 cols (tablet), 1 col (mobile)

---

## Footer
- **Landing Page:** Copyright "2026 Product Pilot. All rights reserved. - Ashish Kumar Sankhua" + License link
- **Other Pages:** Minimal footer or no footer
- **License File:** `/public/LICENSE` (MIT License)

---

## Completed Updates Log

| Date | Feature | Description |
|------|---------|-------------|
| 2026-04-18 | Dashboard | Removed mock data, now fetches from API |
| 2026-04-18 | Landing Page | Added Advanced Tools section (6 tools including Daily Drops) |
| 2026-04-18 | Landing Page | Updated footer with copyright and license |
| 2026-04-18 | Database | Removed Prisma, now using @neondatabase/serverless |
| 2026-04-18 | Export | Enhanced PDF/DOC formatters to match UI display |
| 2026-04-18 | Step Completion | All 9 steps now sync based on saved sessions |
| 2026-04-18 | Presentation | New tab and page for PPT generation |
| 2026-04-18 | Footer | Added license file and link on landing page |
