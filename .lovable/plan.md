# Arogya — Full Functionality Pass (Frontend-Only)

Goal: turn every screen from a high-fidelity mockup into a working app. No backend changes — all data lives in a centralized client store (Zustand + `localStorage` persistence) so a real API can be wired later without touching UI.

## 1. Foundations

- **Global store** (`src/store/`): Zustand slices with `persist` middleware, one key per domain.
  - `profile` — name, avatar, physical metrics, goals, preferences, theme.
  - `nutrition` — meals[], water entries, daily targets, derived macros.
  - `fitness` — workouts[], exercise library, completed sessions, XP awards.
  - `sleep` — sleep logs[], derived score, recommendations.
  - `mental` — mood logs[], journal entries[], meditation sessions[].
  - `women` — cycle logs[], symptoms[], hormone notes, predictions.
  - `gamification` — xp, level, streaks, badges, daily missions.
  - `notifications` — items[], reminder settings, read state.
  - `checklist` — today's tasks, completion state per date.
  - `ai` — conversation history, suggestions.
- **Selectors / derivations** (`src/lib/derive.ts`): health score, macro totals, sleep score, cycle prediction, weekly aggregates, XP + streak calculators.
- **Seed data** (`src/lib/seed.ts`): realistic starter meals/exercises/moods so first-run UI isn't empty; user actions replace/extend it.
- **Shared UI primitives**:
  - `EmptyState`, `LoadingState`, `ErrorState` (extend existing `EmptyState`).
  - `Modal`, `Sheet`, `ConfirmDialog` wrappers over shadcn.
  - `FormField` with Zod + react-hook-form validation and inline errors.
  - Toast-based feedback for every create/update/delete.

## 2. Dashboard

- Health score computed from today's nutrition/water/sleep/exercise vs goals.
- Progress rings + stat cards read live from store selectors.
- Checklist becomes interactive with add/toggle/delete + per-date persistence.
- Quick-action cards link to real module screens (already routed).
- Working search command palette (`cmdk`) over routes, meals, workouts, journal.
- Notification bell opens the notification center sheet.

## 3. Nutrition

- CRUD meals with fields (name, time, portions, macros); food library with search.
- Auto-sum calories/protein/carbs/fat vs goals; ring updates live.
- Water tracker: +/- glasses, ml progress, resets daily.
- Meal history grouped by day; edit/delete inline.
- Charts (Recharts) driven by last-7-day store data.

## 4. Fitness

- Workout builder: pick from exercise library, sets/reps/duration, save as template.
- Start session → log completion → award XP + update streak.
- History list with filters; per-exercise progress charts.
- Rest timer + set checkoff during active session.

## 5. Sleep

- Log bedtime/wake, quality, interruptions.
- Sleep score derived from duration vs goal and quality.
- 7/30-day trend charts; personalized recommendations from recent averages.

## 6. Mental Wellness

- Mood check-in (emoji + tags + note) with day timeline.
- Journal CRUD with tags and search.
- Breathing exercise (animated box-breath timer) and meditation player (interval bells).
- Mood analytics: weekly trend, tag frequency, correlation hints.

## 7. Women's Health

- Cycle log CRUD (period start/end, flow, symptoms, hormone notes).
- Predict next period, fertile window, current phase (using `src/lib/health.ts`).
- Interactive calendar month view; click a day to log/inspect.
- Symptom + hormone trend charts; insights derived from last 3 cycles.

## 8. AI Coach

- Local rule-based responder over user store (no LLM call): greets by name, references today's rings, suggests actions, deep-links to modules.
- Persistent conversation history in store; new-chat/reset.
- Quick-prompt chips ("summarize my week", "why am I tired?").
- Voice UI: use Web Speech API (`SpeechRecognition` + `speechSynthesis`) when available, graceful fallback.
- Generates a weekly health summary on demand from store data.

## 9. Reports & Analytics

- Weekly/monthly aggregators for every domain.
- Recharts dashboards driven entirely by store.
- Export: CSV + JSON download of selected range (`Blob` + `URL.createObjectURL`).

## 10. Gamification

- XP awarded on: meal log, workout complete, sleep log, mood check, journal, checklist complete.
- Streak counter per domain, longest-streak tracking.
- Badge catalog with unlock rules (e.g. 7-day water streak); toast on unlock.
- Daily missions generated each morning from current gaps.
- Local leaderboard vs simulated friends (seed data).

## 11. Notifications

- Notification center sheet from bell icon; read/unread + mark-all-read.
- Reminder settings page (time-of-day per domain) persisted; scheduled via `setTimeout` while tab is open and surfaced as toasts.
- Auto-generated notifications on badge unlocks, missed logs, streak risk.

## 12. Profile & Settings

- Editable profile (name, DOB, sex, height, weight, goals, avatar upload via `FileReader` → data URL).
- Preferences: units (metric/imperial), theme (system/light/dark), women-theme toggle, reminder defaults.
- Data controls: reset module, export all, import JSON.

## 13. Auth (frontend-only polish)

- Keep existing Supabase-backed auth (already working) but ensure:
  - Post-signup → onboarding → dashboard flow is enforced.
  - Loading + error states on every submit; disabled buttons while pending.
  - Guarded routes already handled by `_authenticated`.

## 14. UX polish

- Loading skeletons per module, empty states with primary CTA, error boundary per route.
- Form validation via Zod on every input surface.
- Toast confirmations for create/update/delete/undo.
- Framer Motion micro-interactions retained; no layout regressions.

## Technical notes

- **State**: `zustand` + `zustand/middleware` persist to `localStorage` under `arogya:<slice>`.
- **Forms**: `react-hook-form` + `zod` (both already available via shadcn form).
- **Charts**: `recharts` (already in deps) fed from selector hooks.
- **Search**: `cmdk` (shadcn command).
- **No backend writes**: existing Supabase calls in dashboard/profile stay as read-only session bootstrap; all new features are local-first. A single `src/lib/api.ts` façade wraps the store so a real backend can replace it later without UI changes.
- **File layout**: `src/store/*.ts`, `src/features/<domain>/`, `src/components/<domain>/` for domain widgets; routes stay thin.

## Rollout order

1. Store scaffolding + seed + selectors + shared UI primitives.
2. Dashboard wired to live store; checklist interactive; search + notifications shell.
3. Nutrition → Fitness → Sleep → Mental → Women's (each: CRUD, charts, XP hooks).
4. AI Coach logic + voice.
5. Reports/export, gamification unlocks, notifications engine.
6. Profile/settings + preferences + import/export.
7. Empty/loading/error pass and validation sweep.
