import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bell, Search, Apple, Dumbbell, Moon, Brain, Droplets, Flame, Footprints, Sparkles, Check, Circle } from "lucide-react";
import { ProgressRing } from "@/components/health/ProgressRing";
import { StatCard } from "@/components/health/StatCard";
import { QuickActionCard } from "@/components/health/QuickActionCard";
import { SectionHeader } from "@/components/health/SectionHeader";
import { supabase } from "@/integrations/supabase/client";
import { greeting } from "@/lib/health";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Arogya" },
      { name: "description", content: "Your daily health score, progress rings, and AI recommendations." },
    ],
  }),
  component: Dashboard,
});

type ChecklistItem = { id: string; title: string; done: boolean };

function Dashboard() {
  const [name, setName] = useState("");
  const [items, setItems] = useState<ChecklistItem[]>([]);

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      const uid = u.user?.id;
      if (!uid) return;
      const { data: p } = await supabase.from("profiles").select("full_name").eq("id", uid).maybeSingle();
      setName((p?.full_name as string) || (u.user?.email?.split("@")[0] ?? "friend"));
      const today = new Date().toISOString().slice(0, 10);
      const { data: cl } = await supabase.from("checklist_items").select("id,title,done").eq("day", today).order("created_at");
      if (cl && cl.length > 0) setItems(cl as ChecklistItem[]);
      else
        setItems([
          { id: "seed-1", title: "Drink 500ml water", done: false },
          { id: "seed-2", title: "10-min stretch", done: false },
          { id: "seed-3", title: "Log breakfast", done: false },
          { id: "seed-4", title: "Evening reflection", done: false },
        ]);
    })();
  }, []);

  const toggle = (id: string) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, done: !i.done } : i)));

  const done = items.filter((i) => i.done).length;
  const pct = items.length ? (done / items.length) * 100 : 0;

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-6 md:px-8 md:py-10">
      {/* Top bar */}
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
        <div className="min-w-0">
          <div className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{greeting()}</div>
          <h1 className="mt-0.5 truncate font-heading text-2xl font-bold sm:text-3xl">
            Hi {name || "there"} <span className="inline-block animate-pulse">👋</span>
          </h1>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button className="grid h-10 w-10 place-items-center rounded-2xl border bg-card text-muted-foreground hover:text-foreground" aria-label="Search">
            <Search className="h-4 w-4" />
          </button>
          <button className="grid h-10 w-10 place-items-center rounded-2xl border bg-card text-muted-foreground hover:text-foreground" aria-label="Notifications">
            <Bell className="h-4 w-4" />
          </button>
          <div className="grid h-10 w-10 place-items-center rounded-2xl gradient-hero font-semibold text-white shadow-glow">
            {name?.[0]?.toUpperCase() ?? "A"}
          </div>
        </div>
      </div>

      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[2rem] border p-6 shadow-glow gradient-hero text-white sm:p-8"
      >
        <div className="absolute -right-10 -top-10 h-56 w-56 rounded-full bg-white/15 blur-2xl" aria-hidden />
        <div className="relative grid gap-6 md:grid-cols-[auto_1fr] md:items-center">
          <ProgressRing value={86} size={140} stroke={12} color="white">
            <div className="text-center">
              <div className="tabular text-4xl font-bold">86</div>
              <div className="text-[10px] font-medium uppercase tracking-widest opacity-80">Health</div>
            </div>
          </ProgressRing>
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest opacity-80">Today</div>
            <h2 className="mt-1 font-heading text-2xl font-bold sm:text-3xl">You're crushing it.</h2>
            <p className="mt-1 max-w-md text-sm opacity-90">
              "Take care of your body. It's the only place you have to live." Keep the streak going.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full bg-white/20 px-3 py-1 backdrop-blur">🔥 12-day streak</span>
              <span className="rounded-full bg-white/20 px-3 py-1 backdrop-blur">⭐ 1,240 XP</span>
              <span className="rounded-full bg-white/20 px-3 py-1 backdrop-blur">Lv 6</span>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Quick actions */}
      <section>
        <SectionHeader eyebrow="Quick actions" title="Log something" />
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <QuickActionCard to="/nutrition" label="Nutrition" hint="Log a meal" icon={Apple} accent="var(--color-success)" />
          <QuickActionCard to="/fitness" label="Fitness" hint="Start workout" icon={Dumbbell} accent="var(--color-primary)" />
          <QuickActionCard to="/sleep" label="Sleep" hint="Log rest" icon={Moon} accent="var(--color-info)" />
          <QuickActionCard to="/mental" label="Mind" hint="Meditate" icon={Brain} accent="var(--color-accent)" />
        </div>
      </section>

      {/* Rings */}
      <section>
        <SectionHeader eyebrow="Today's rings" title="Your progress" description="Close every ring to reach your daily goal." />
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { l: "Calories", v: 74, sub: "1,842 / 2,500", color: "var(--color-warning)" },
            { l: "Water", v: 62, sub: "1.9L / 3L", color: "var(--color-info)" },
            { l: "Sleep", v: 92, sub: "7h 40m", color: "var(--color-primary)" },
            { l: "Exercise", v: 50, sub: "30 / 60 min", color: "var(--color-success)" },
          ].map((r) => (
            <div key={r.l} className="flex flex-col items-center gap-2 rounded-3xl border bg-card p-5 shadow-soft">
              <ProgressRing value={r.v} label={r.l} sub={r.sub} color={r.color} />
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Flame} label="Calories out" value={<span>412</span>} hint="+18% vs yesterday" accent="var(--color-warning)" />
        <StatCard icon={Droplets} label="Hydration" value={<span>1.9L</span>} hint="63% of goal" accent="var(--color-info)" />
        <StatCard icon={Footprints} label="Steps" value={<span>8,942</span>} hint="Great pace" accent="var(--color-primary)" />
        <StatCard icon={Brain} label="Mood" value={<span>Calm</span>} hint="Logged 2h ago" accent="var(--color-accent)" />
      </section>

      {/* AI card + Checklist */}
      <section className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="relative overflow-hidden rounded-3xl border bg-card p-6 shadow-soft">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-30 blur-2xl gradient-hero" aria-hidden />
          <div className="flex items-start gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl gradient-hero text-white shadow-glow">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-semibold uppercase tracking-widest text-primary">Coach suggestion</div>
              <h3 className="mt-1 font-heading text-lg font-semibold">A 5-min mindful walk after lunch could help your energy dip.</h3>
              <p className="mt-1 text-sm text-muted-foreground">Based on your sleep last night and yesterday's afternoon mood, a short break outside can boost focus and steady your appetite.</p>
              <button className="mt-3 rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground shadow-soft">Add to today</button>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border bg-card p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-base font-semibold">Today's checklist</h3>
            <span className="tabular text-xs text-muted-foreground">{done}/{items.length}</span>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
            <motion.div className="h-full rounded-full gradient-hero" initial={{ width: 0 }} animate={{ width: `${pct}%` }} />
          </div>
          <ul className="mt-4 space-y-2">
            {items.map((i) => (
              <li key={i.id}>
                <button
                  onClick={() => toggle(i.id)}
                  className="flex w-full items-center gap-3 rounded-2xl px-2 py-2 text-left text-sm hover:bg-accent/40"
                >
                  <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border ${i.done ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>
                    {i.done ? <Check className="h-3 w-3" /> : <Circle className="h-2 w-2 opacity-0" />}
                  </span>
                  <span className={i.done ? "text-muted-foreground line-through" : "text-foreground"}>{i.title}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
