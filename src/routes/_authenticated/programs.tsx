import { createFileRoute } from "@tanstack/react-router";
import {
  Trophy,
  Zap,
  Flame,
  Moon,
  Brain,
  Apple,
  Dumbbell,
  CheckCircle2,
  PlayCircle,
  type LucideIcon,
} from "lucide-react";
import { PageHeader } from "@/components/health/PageHeader";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useApp } from "@/store/app";

export const Route = createFileRoute("/_authenticated/programs")({
  head: () => ({
    meta: [
      { title: "Programs — Arogya" },
      {
        name: "description",
        content: "Guided wellness programs and challenges.",
      },
    ],
  }),
  component: ProgramsPage,
});

type Program = {
  id: string;
  name: string;
  desc: string;
  days: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  category: string;
  icon: LucideIcon;
  color: string;
  tasks: string[];
  xp: number;
};

const PROGRAMS: Program[] = [
  {
    id: "hydration-7",
    name: "7-Day Hydration Challenge",
    desc: "Build the habit of drinking 2.5L of water every day for a full week.",
    days: 7,
    difficulty: "Beginner",
    category: "Nutrition",
    icon: Apple,
    color: "var(--color-info)",
    tasks: [
      "Drink 2.5L water daily",
      "Log each glass in the app",
      "Avoid sugary drinks",
      "Morning glass within 10 min of waking",
    ],
    xp: 100,
  },
  {
    id: "morning-ritual-7",
    name: "7-Day Morning Ritual",
    desc: "Start every morning with 10 minutes of meditation followed by a gentle stretch.",
    days: 7,
    difficulty: "Beginner",
    category: "Mental",
    icon: Brain,
    color: "var(--color-accent)",
    tasks: [
      "10-min meditation (use Breathing tool)",
      "5-min gentle stretch",
      "Log mood before and after",
      "No phone for first 30 min",
    ],
    xp: 120,
  },
  {
    id: "sleep-reset-14",
    name: "14-Day Sleep Reset",
    desc: "Fix your sleep schedule and improve rest quality in two weeks.",
    days: 14,
    difficulty: "Intermediate",
    category: "Sleep",
    icon: Moon,
    color: "var(--color-primary)",
    tasks: [
      "Fixed bedtime within 30-min window",
      "No screens 1h before bed",
      "Log sleep quality daily",
      "Aim for 7–9 hours nightly",
    ],
    xp: 200,
  },
  {
    id: "movement-21",
    name: "21-Day Movement Challenge",
    desc: "30 minutes of intentional movement every single day for 3 weeks.",
    days: 21,
    difficulty: "Intermediate",
    category: "Fitness",
    icon: Dumbbell,
    color: "var(--color-primary)",
    tasks: [
      "30 min exercise daily",
      "Mix cardio and strength",
      "Log every workout",
      "Rest days count as walks",
    ],
    xp: 350,
  },
  {
    id: "mindful-eating-28",
    name: "28-Day Mindful Eating",
    desc: "Log every meal and make conscious food choices for a full month.",
    days: 28,
    difficulty: "Intermediate",
    category: "Nutrition",
    icon: Apple,
    color: "var(--color-success)",
    tasks: [
      "Log all meals daily",
      "Hit protein goal each day",
      "No processed snacks",
      "Eat without screens",
    ],
    xp: 420,
  },
  {
    id: "strength-30",
    name: "30-Day Strength Builder",
    desc: "Progressive strength training 5x per week to build real muscle and confidence.",
    days: 30,
    difficulty: "Advanced",
    category: "Fitness",
    icon: Flame,
    color: "var(--color-warning)",
    tasks: [
      "5 strength sessions/week",
      "Progressive overload each week",
      "Log all workouts with weights",
      "Rest 2 days per week",
    ],
    xp: 600,
  },
  {
    id: "stress-detox-7",
    name: "7-Day Stress Detox",
    desc: "Reduce stress through daily journaling, breathwork, and mood tracking.",
    days: 7,
    difficulty: "Beginner",
    category: "Mental",
    icon: Brain,
    color: "var(--color-accent)",
    tasks: [
      "Daily journal entry",
      "One box breathing session",
      "Log mood twice daily",
      "Gratitude list at bedtime",
    ],
    xp: 110,
  },
  {
    id: "holistic-21",
    name: "21-Day Holistic Wellness",
    desc: "Engage all six pillars — nutrition, fitness, sleep, and mental health — for a full transformation.",
    days: 21,
    difficulty: "Intermediate",
    category: "All-in-One",
    icon: Zap,
    color: "var(--color-primary)",
    tasks: [
      "Log every meal",
      "Exercise 4x/week",
      "7–9h sleep nightly",
      "Daily mood check-in",
      "2.5L water daily",
    ],
    xp: 500,
  },
];

const diffColor: Record<Program["difficulty"], string> = {
  Beginner: "bg-success/15 text-success",
  Intermediate: "bg-warning/15 text-warning",
  Advanced: "bg-destructive/15 text-destructive",
};

function ProgramsPage() {
  const [active, setActive] = useState<Record<string, "active" | "done">>({});
  const addXp = useApp((s) => s.addXp);
  const pushNotification = useApp((s) => s.pushNotification);

  const start = (p: Program) => {
    setActive((prev) => ({ ...prev, [p.id]: "active" }));
    addXp(10, "program started");
    pushNotification({
      title: `Program started · ${p.name}`,
      body: `${p.days} days · ${p.xp} XP on completion`,
      kind: "info",
    });
    toast.success(`${p.name} started! +10 XP`);
  };

  const complete = (p: Program) => {
    setActive((prev) => ({ ...prev, [p.id]: "done" }));
    addXp(p.xp, "program completed");
    pushNotification({
      title: `Program complete! · ${p.name}`,
      body: `You earned ${p.xp} XP!`,
      kind: "success",
    });
    toast.success(`${p.name} complete! +${p.xp} XP 🎉`);
  };

  const [filter, setFilter] = useState("All");
  const FILTERS = ["All", "Fitness", "Nutrition", "Mental", "Sleep", "All-in-One"];
  const filtered =
    filter === "All" ? PROGRAMS : PROGRAMS.filter((p) => p.category === filter);

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 md:px-8 md:py-10">
      <PageHeader
        icon={Trophy}
        title="Programs"
        description="Guided multi-day wellness challenges to build lasting habits."
        accent="var(--color-warning)"
      />

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
              filter === f
                ? "border-primary bg-primary/10 text-primary"
                : "text-muted-foreground hover:border-primary hover:text-primary"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => {
          const status = active[p.id];
          const Icon = p.icon;
          return (
            <div
              key={p.id}
              className={`relative overflow-hidden rounded-3xl border bg-card p-6 shadow-soft transition-transform hover:-translate-y-0.5 ${
                status === "active" ? "border-primary/40" : ""
              }`}
            >
              {status === "done" && (
                <div className="absolute right-4 top-4 text-success">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
              )}
              <div className="flex items-center gap-3">
                <div
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl"
                  style={{
                    background: `color-mix(in oklab, ${p.color} 18%, transparent)`,
                    color: p.color,
                  }}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${diffColor[p.difficulty]}`}
                    >
                      {p.difficulty}
                    </span>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                      {p.category}
                    </span>
                  </div>
                </div>
              </div>
              <h3 className="mt-3 font-heading text-base font-semibold">
                {p.name}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
              <div className="mt-3 flex flex-wrap gap-1">
                <span className="rounded-full bg-muted px-2 py-0.5 text-[10px]">
                  📅 {p.days} days
                </span>
                <span className="rounded-full bg-muted px-2 py-0.5 text-[10px]">
                  ⭐ {p.xp} XP
                </span>
              </div>
              <ul className="mt-3 space-y-0.5">
                {p.tasks.map((t) => (
                  <li
                    key={t}
                    className="flex items-start gap-1.5 text-xs text-muted-foreground"
                  >
                    <span className="mt-0.5 text-primary">•</span> {t}
                  </li>
                ))}
              </ul>
              <div className="mt-4">
                {!status && (
                  <Button
                    onClick={() => start(p)}
                    className="w-full rounded-2xl shadow-glow"
                  >
                    <PlayCircle className="mr-1 h-4 w-4" /> Start Program
                  </Button>
                )}
                {status === "active" && (
                  <div className="space-y-2">
                    <div className="rounded-2xl bg-primary/10 px-3 py-2 text-center text-xs font-semibold text-primary">
                      In Progress
                    </div>
                    <Button
                      onClick={() => complete(p)}
                      variant="outline"
                      className="w-full rounded-2xl"
                    >
                      <CheckCircle2 className="mr-1 h-4 w-4" /> Mark Complete
                    </Button>
                  </div>
                )}
                {status === "done" && (
                  <div className="rounded-2xl bg-success/10 px-3 py-2 text-center text-xs font-semibold text-success">
                    Completed ✓
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
