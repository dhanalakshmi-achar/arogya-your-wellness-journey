
# Arogya v1 — Build Plan

The full spec is huge (14 pages, 4 pillars, ~40 features). Trying to ship it all in one pass would produce a shallow, buggy app. This plan delivers a polished, production-ready foundation you can grow into, matching the premium wellness feel described.

## Scope decisions (chosen for you)

- **Build first:** design system, landing, auth, onboarding, main Dashboard, Women's Health (fully themed), and routed skeletons for every other page so navigation feels complete.
- **Backend:** enable Lovable Cloud now — email + Google auth, profiles table, and schema for the trackers we render. Other tables stubbed as we build each module.
- **AI Coach:** ship the floating AI button and chat UI shell now, wire the actual model in a follow-up pass to keep this build focused.

## What you get in v1

### 1. Design system (`src/styles.css` + tokens)
- Two themes as semantic tokens: **main** (indigo/violet #8B7CF6, soft slate bg) and **women** (rose/pink #EC4899, blush bg #FFF7FB), switched via a `data-theme="women"` attribute on route subtrees.
- Radius 24px, soft shadows, pastel gradients, glass hero utility, dark mode variables.
- Fonts loaded via `<link>` in `__root.tsx`: Poppins (headings), Inter (body), Manrope (numbers).
- All shadcn components re-skinned through tokens — no hardcoded colors in components.

### 2. Routes (TanStack Router — the stack this template uses)
```text
/                       Landing (hero, pillars, CTA)
/auth                   Sign in / Sign up (email + Google)
/onboarding             Multi-step: profile, goals, units
/_authenticated/
  dashboard             Main dashboard (fully built)
  nutrition             Skeleton with header + empty state
  fitness               Skeleton
  sleep                 Skeleton
  mental                Skeleton
  women                 Women's Health (fully built, pink theme)
    /cycle /pregnancy /hormones /symptoms /calendar /insights
  ai-coach              Chat UI shell (no model yet)
  reports               Skeleton
  achievements          Skeleton
  profile               Profile + settings
```
Note: the stack is **TanStack Start + Tailwind v4**, not Vite + React Router as the brief lists. I'll keep the requested libraries (Framer Motion, shadcn, Recharts, RHF+Zod, Lucide) and use the actual routing/styling the template ships with.

### 3. Dashboard
Greeting + avatar + notifications + search · Hero card with health score, XP, streak, quote · 2×2 quick actions · 4 animated progress rings (calories/water/sleep/exercise) via Recharts + Framer Motion · AI recommendation card · Today's checklist · Bottom nav (mobile) + sidebar (desktop) · Floating AI button.

### 4. Women's Health (dedicated pink experience)
Distinct rose palette, floral SVG illustrations, wave backgrounds, cycle ring, upcoming-period card, symptoms grid, mood strip, calendar with phase coloring, insight cards. Fully responsive.

### 5. Auth & data (Lovable Cloud)
- Email + Google sign-in (Google via Lovable broker).
- `profiles` table (name, dob, sex, height, weight, goal, units, avatar) + trigger on signup.
- `user_roles` table + `has_role()` (security-definer) — future-proofing.
- Starter tables: `health_metrics` (daily rings), `cycle_logs` (women's), `checklist_items`.
- RLS + grants per project rules; owner-only policies.

### 6. Reusable components
`HealthCard`, `ProgressRing`, `StatCard`, `QuickActionCard`, `SectionHeader`, `GlassHero`, `BottomNav`, `TopNav`, `FloatingAIButton`, `AIChatBubble`, `EmptyState`, `LoadingState`, `ErrorState`, `CycleRing`, `PeriodCalendar`. All under 250 lines, token-driven, responsive.

### 7. Utilities (`src/lib/health/`)
Pure functions with types: `bmi`, `bmr`, `tdee`, `caloriesBurned`, `waterTarget`, `healthScore`, `cyclePredict`, `xpFor`, `streakFor`.

## What's intentionally NOT in v1
Nutrition/Fitness/Sleep/Mental full features, AI model wiring, meditation library, achievements engine, reports/analytics screens, community, wearables, PWA/offline. Each gets its own follow-up pass so it's actually good, not a placeholder that looks broken.

## Suggested next passes (after v1 ships)
1. Nutrition tracker (food log + macro rings) + Fitness (workouts + calories).
2. Mental Wellness (mood, breathing, journal) + wire AI Coach to Lovable AI Gateway.
3. Sleep tracker + Reports (Recharts weekly/monthly).
4. Achievements/XP engine + Community.

Approve to start building v1.
