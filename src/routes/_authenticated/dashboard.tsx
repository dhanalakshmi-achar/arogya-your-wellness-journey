import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

// import { useEffect } from "react";
import { motion } from "framer-motion";
import { Apple, Dumbbell, Moon, Brain, Droplets, Flame, Footprints, Sparkles, Check, Trash2, Plus } from "lucide-react";
import { ProgressRing } from "@/components/health/ProgressRing";
import { StatCard } from "@/components/health/StatCard";
import { QuickActionCard } from "@/components/health/QuickActionCard";
import { SectionHeader } from "@/components/health/SectionHeader";
import { greeting } from "@/lib/health";
import { useApp } from "@/store/app";
import { useToday } from "@/lib/derive";
import { levelFromXp } from "@/lib/health";
import { NotificationBell } from "@/components/layout/NotificationBell";
import { CommandPalette } from "@/components/layout/CommandPalette";
// import { useState } from "react";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Arogya" },
      { name: "description", content: "Your daily health score, progress rings, and AI recommendations." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const profile = useApp((s) => s.profile);
  const targets = useApp((s) => s.targets);
  const xp = useApp((s) => s.xp);
  const streaks = useApp((s) => s.streaks);
  const seed = useApp((s) => s.seedChecklistIfEmpty);
  const allChecklist = useApp((s) => s.checklist);
const today = new Date().toISOString().slice(0, 10);

const checklist = useMemo(() => {
  return allChecklist.filter((c) => c.date === today);
}, [allChecklist]);

const toggle = useApp((s) => s.toggleChecklistItem);
const removeItem = useApp((s) => s.removeChecklistItem);
const addItem = useApp((s) => s.addChecklistItem);
const t = useToday();
const stepLog = useApp((s) => s.stepLog);

const todaySteps =
  stepLog.find((s) => s.date === today)?.steps ?? 0;
  const [newTask, setNewTask] = useState("");

  useEffect(() => { seed(); }, [seed]);

  const done = checklist.filter((i) => i.done).length;
  const pct = checklist.length ? (done / checklist.length) * 100 : 0;
  const lvl = levelFromXp(xp);
  const bestStreak = Math.max(0, ...Object.values(streaks).map((s) => s.current));

  const name = profile.name || "there";

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-6 md:px-8 md:py-10">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
        <div className="min-w-0">
          <div className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{greeting()}</div>
          <h1 className="mt-0.5 truncate font-heading text-2xl font-bold sm:text-3xl">
            Hi {name} <span className="inline-block animate-pulse">👋</span>
          </h1>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <CommandPalette />
          <NotificationBell />
          <div className="grid h-10 w-10 place-items-center rounded-2xl gradient-hero font-semibold text-white shadow-glow">
            {name?.[0]?.toUpperCase() ?? "A"}
          </div>
        </div>
      </div>

      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[2rem] border p-6 shadow-glow gradient-hero text-white sm:p-8"
      >
        <div className="absolute -right-10 -top-10 h-56 w-56 rounded-full bg-white/15 blur-2xl" aria-hidden />
        <div className="relative grid gap-6 md:grid-cols-[auto_1fr] md:items-center">
          <ProgressRing value={t.score} size={140} stroke={12} color="white">
            <div className="text-center">
              <div className="tabular text-4xl font-bold">{t.score}</div>
              <div className="text-[10px] font-medium uppercase tracking-widest opacity-80">Health</div>
            </div>
          </ProgressRing>
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest opacity-80">Today</div>
            <h2 className="mt-1 font-heading text-2xl font-bold sm:text-3xl">
              {t.score >= 80 ? "You're crushing it." : t.score >= 50 ? "Great start — keep going." : "Small steps count."}
            </h2>
            <p className="mt-1 max-w-md text-sm opacity-90">
              {t.score >= 80 ? "Keep the streak alive with one mindful moment tonight." : "Log a meal, sip some water, or take a 5-min walk."}
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full bg-white/20 px-3 py-1 backdrop-blur">🔥 {bestStreak}-day streak</span>
              <span className="rounded-full bg-white/20 px-3 py-1 backdrop-blur">⭐ {xp} XP</span>
              <span className="rounded-full bg-white/20 px-3 py-1 backdrop-blur">Lv {lvl.level}</span>
            </div>
          </div>
        </div>
      </motion.section>

      <section>
        <SectionHeader eyebrow="Quick actions" title="Log something" />
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <QuickActionCard to="/nutrition" label="Nutrition" hint="Log a meal" icon={Apple} accent="var(--color-success)" />
          <QuickActionCard to="/fitness" label="Fitness" hint="Start workout" icon={Dumbbell} accent="var(--color-primary)" />
          <QuickActionCard to="/sleep" label="Sleep" hint="Log rest" icon={Moon} accent="var(--color-info)" />
          <QuickActionCard to="/mental" label="Mind" hint="Meditate" icon={Brain} accent="var(--color-accent)" />
        </div>
      </section>

      <section>
        <SectionHeader eyebrow="Today's rings" title="Your progress" description="Close every ring to reach your daily goal." />
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { l: "Calories", v: pctOf(t.totals.calories, targets.calories), sub: `${Math.round(t.totals.calories)} / ${targets.calories}`, color: "var(--color-warning)" },
            { l: "Water", v: pctOf(t.water, targets.waterMl), sub: `${(t.water / 1000).toFixed(1)}L / ${(targets.waterMl / 1000).toFixed(1)}L`, color: "var(--color-info)" },
            { l: "Sleep", v: pctOf(t.sleep?.hours ?? 0, targets.sleepHours), sub: t.sleep ? `${t.sleep.hours}h` : "Not logged", color: "var(--color-primary)" },
            { l: "Exercise", v: pctOf(t.exerciseMin, targets.exerciseMin), sub: `${t.exerciseMin} / ${targets.exerciseMin} min`, color: "var(--color-success)" },
          ].map((r) => (
            <div key={r.l} className="flex flex-col items-center gap-2 rounded-3xl border bg-card p-5 shadow-soft">
              <ProgressRing value={r.v} label={r.l} sub={r.sub} color={r.color} />
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard icon={Flame} label="Calories out" value={<span>{t.caloriesOut}</span>} hint={`${t.workouts.length} workout${t.workouts.length === 1 ? "" : "s"}`} accent="var(--color-warning)" />
        <StatCard icon={Droplets} label="Hydration" value={<span>{(t.water / 1000).toFixed(1)}L</span>} hint={`${Math.round((t.water / targets.waterMl) * 100)}% of goal`} accent="var(--color-info)" />
        <StatCard icon={Apple} label="Meals" value={<span>{t.meals.length}</span>} hint={`${Math.round(t.totals.protein)}g protein`} accent="var(--color-primary)" />
        <StatCard icon={Footprints} label="Steps" value={<span>{todaySteps.toLocaleString()}</span>} hint={`${Math.round((todaySteps / targets.steps) * 100)}% of goal`} accent="var(--color-success)" />
        <StatCard icon={Brain} label="Mood" value={<span>{t.mood?.emoji ?? "—"}</span>} hint={t.mood ? new Date(t.mood.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Not logged"} accent="var(--color-accent)" />
      </section>

      <section className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="relative overflow-hidden rounded-3xl border bg-card p-6 shadow-soft">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-30 blur-2xl gradient-hero" aria-hidden />
          <div className="flex items-start gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl gradient-hero text-white shadow-glow">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-semibold uppercase tracking-widest text-primary">Coach suggestion</div>
              <h3 className="mt-1 font-heading text-lg font-semibold">{coachTip(t, targets)}</h3>
              <p className="mt-1 text-sm text-muted-foreground">Ask your coach for a personalised plan anytime.</p>
              <a href="/ai-coach" className="mt-3 inline-block rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground shadow-soft">Chat with coach</a>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border bg-card p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-base font-semibold">Today's checklist</h3>
            <span className="tabular text-xs text-muted-foreground">{done}/{checklist.length}</span>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
            <motion.div className="h-full rounded-full gradient-hero" initial={{ width: 0 }} animate={{ width: `${pct}%` }} />
          </div>
          <ul className="mt-4 space-y-1">
            {checklist.map((i) => (
              <li key={i.id} className="group flex items-center gap-2 rounded-2xl px-1 py-1 hover:bg-accent/40">
                <button
                  onClick={() => toggle(i.id)}
                  className="flex flex-1 items-center gap-3 px-1 py-1 text-left text-sm"
                >
                  <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border ${i.done ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>
                    {i.done && <Check className="h-3 w-3" />}
                  </span>
                  <span className={i.done ? "text-muted-foreground line-through" : "text-foreground"}>{i.title}</span>
                </button>
                <button onClick={() => removeItem(i.id)} className="opacity-0 transition-opacity group-hover:opacity-100" aria-label="Delete">
                  <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                </button>
              </li>
            ))}
          </ul>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!newTask.trim()) return;
              addItem(newTask.trim());
              setNewTask("");
            }}
            className="mt-3 flex items-center gap-2"
          >
            <input
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Add a task…"
              className="flex-1 rounded-2xl border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
            <button type="submit" className="grid h-9 w-9 place-items-center rounded-2xl bg-primary text-primary-foreground" aria-label="Add">
              <Plus className="h-4 w-4" />
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

function pctOf(v: number, goal: number) { return goal ? Math.min(100, Math.round((v / goal) * 100)) : 0; }
function coachTip(t: ReturnType<typeof useToday>, tg: { waterMl: number; sleepHours: number; exerciseMin: number }) {
  if (!t.sleep) return "Log last night's sleep to unlock personalised recovery tips.";
  if (t.water < tg.waterMl * 0.5) return "You're behind on hydration — a glass now sets up better focus this afternoon.";
  if (t.exerciseMin < tg.exerciseMin) return "A 15-min brisk walk closes your exercise ring today.";
  if (t.meals.length < 3) return "Add your next meal so your macros stay balanced.";
  return "You're on a great streak — one mindful breath break tonight will lock in the day.";
}
