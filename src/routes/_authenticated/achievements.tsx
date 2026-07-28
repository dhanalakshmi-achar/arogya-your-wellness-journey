import { createFileRoute } from "@tanstack/react-router";
import { Trophy, Flame, Star, Target } from "lucide-react";
import { PageHeader } from "@/components/health/PageHeader";
import { useApp } from "@/store/app";
import { levelFromXp } from "@/lib/health";
import { useEffect } from "react";

export const Route = createFileRoute("/_authenticated/achievements")({
  head: () => ({ meta: [{ title: "Achievements — Arogya" }, { name: "description", content: "XP, streaks and badges." }] }),
  component: AchievementsPage,
});

const BADGES = [
  { id: "first-meal", name: "First bite", desc: "Log your first meal", icon: "🍎", check: (s: any) => s.meals.length >= 1 },
  { id: "hydration", name: "Hydration hero", desc: "Reach water goal", icon: "💧", check: (s: any) => s.water.reduce((a: number, b: any) => a + b.ml, 0) >= s.targets.waterMl },
  { id: "first-workout", name: "Iron start", desc: "Complete a workout", icon: "🏋️", check: (s: any) => s.workouts.some((w: any) => w.completed) },
  { id: "sleep-3", name: "Restful", desc: "Log 3 nights of sleep", icon: "🌙", check: (s: any) => s.sleep.length >= 3 },
  { id: "meditate-5", name: "Mindful", desc: "5 mindful minutes", icon: "🧘", check: (s: any) => s.meditations.reduce((a: number, b: any) => a + b.minutes, 0) >= 5 },
  { id: "streak-3", name: "On a roll", desc: "3-day streak in any area", icon: "🔥", check: (s: any) => Object.values(s.streaks).some((x: any) => x.current >= 3) },
  { id: "journal-1", name: "Reflective", desc: "Write a journal entry", icon: "📓", check: (s: any) => s.journal.length >= 1 },
  { id: "cycle-1", name: "In tune", desc: "Log a cycle", icon: "🌸", check: (s: any) => s.cycles.length >= 1 },
];

function AchievementsPage() {
  const xp = useApp((s) => s.xp);
  const badges = useApp((s) => s.badges);
  const streaks = useApp((s) => s.streaks);
  const unlock = useApp((s) => s.unlockBadge);
  const lvl = levelFromXp(xp);

  useEffect(() => {
    const s = useApp.getState();
    BADGES.forEach((b) => { if (b.check(s)) unlock(b.id, b.name, b.desc, b.icon); });
  });

  const missions = [
    { id: "drink", label: "Drink 2L of water today", done: false },
    { id: "walk", label: "Complete a workout", done: false },
    { id: "log", label: "Log 3 meals", done: false },
    { id: "reflect", label: "Add a journal entry", done: false },
  ];
  const leaderboard = [
    { name: "You", xp },
    { name: "Priya", xp: 1240 },
    { name: "Aditi", xp: 980 },
    { name: "Rahul", xp: 760 },
    { name: "Maya", xp: 540 },
  ].sort((a, b) => b.xp - a.xp);

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 md:px-8 md:py-10">
      <PageHeader icon={Trophy} title="Achievements" description="XP, streaks, badges and daily challenges." accent="var(--color-warning)" />

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-3xl border bg-card p-5 shadow-soft">
          <div className="flex items-center gap-2 text-primary"><Star className="h-4 w-4" /><span className="text-xs uppercase tracking-widest">Level</span></div>
          <div className="mt-2 tabular text-3xl font-bold">Lv {lvl.level}</div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full gradient-hero" style={{ width: `${(lvl.remainder / lvl.next) * 100}%` }} />
          </div>
          <div className="mt-1 text-xs text-muted-foreground">{lvl.remainder} / {lvl.next} XP</div>
        </div>
        <div className="rounded-3xl border bg-card p-5 shadow-soft">
          <div className="flex items-center gap-2 text-warning"><Flame className="h-4 w-4" style={{ color: "var(--color-warning)" }} /><span className="text-xs uppercase tracking-widest">Streaks</span></div>
          <ul className="mt-2 space-y-1 text-sm">
            {Object.entries(streaks).length === 0 && <li className="text-muted-foreground">Log something to start a streak.</li>}
            {Object.entries(streaks).map(([k, v]) => (
              <li key={k} className="flex justify-between"><span className="capitalize">{k}</span><span className="tabular font-semibold">{v.current}d · best {v.longest}</span></li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl border bg-card p-5 shadow-soft">
          <div className="flex items-center gap-2 text-primary"><Target className="h-4 w-4" /><span className="text-xs uppercase tracking-widest">XP</span></div>
          <div className="mt-2 tabular text-3xl font-bold">{xp}</div>
          <p className="mt-1 text-xs text-muted-foreground">Lifetime</p>
        </div>
      </section>

      <section>
        <h3 className="font-heading text-lg font-semibold">Badges</h3>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {BADGES.map((b) => {
            const unlocked = badges.some((x) => x.id === b.id && x.unlockedAt);
            return (
              <div key={b.id} className={`rounded-3xl border p-4 text-center shadow-soft ${unlocked ? "bg-card" : "bg-muted/40 opacity-60"}`}>
                <div className="text-3xl">{b.icon}</div>
                <div className="mt-2 text-sm font-semibold">{b.name}</div>
                <div className="text-xs text-muted-foreground">{b.desc}</div>
                {!unlocked && <div className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">Locked</div>}
              </div>
            );
          })}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border bg-card p-6 shadow-soft">
          <h3 className="font-heading text-lg font-semibold">Daily missions</h3>
          <ul className="mt-3 space-y-2">
            {missions.map((m) => (
              <li key={m.id} className="flex items-center justify-between rounded-2xl border bg-background p-3 text-sm">
                <span>{m.label}</span>
                <span className="text-xs text-muted-foreground">+15 XP</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl border bg-card p-6 shadow-soft">
          <h3 className="font-heading text-lg font-semibold">Leaderboard</h3>
          <ul className="mt-3 space-y-2">
            {leaderboard.map((p, i) => (
              <li key={p.name} className={`flex items-center justify-between rounded-2xl border p-3 text-sm ${p.name === "You" ? "border-primary bg-primary/5" : "bg-background"}`}>
                <span><span className="tabular text-xs text-muted-foreground">#{i + 1}</span> · {p.name}</span>
                <span className="tabular font-semibold">{p.xp} XP</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
