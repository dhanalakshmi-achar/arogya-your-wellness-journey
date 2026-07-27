import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Flower2, Heart, CalendarDays, Droplet, Sparkles, Baby, Activity, Smile } from "lucide-react";
import { ProgressRing } from "@/components/health/ProgressRing";

export const Route = createFileRoute("/_authenticated/women/")({
  component: WomenHome,
});

const symptoms = ["Cramps", "Bloating", "Headache", "Tender", "Acne", "Fatigue"];
const phases = [
  { name: "Menstrual", days: "1–5", tint: "oklch(0.7 0.19 15)" },
  { name: "Follicular", days: "6–13", tint: "oklch(0.83 0.11 355)" },
  { name: "Ovulation", days: "14–16", tint: "oklch(0.75 0.16 15)" },
  { name: "Luteal", days: "17–28", tint: "oklch(0.66 0.22 0)" },
];

function WomenHome() {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-background text-foreground">
      <FloralBackdrop />

      <div className="relative mx-auto max-w-6xl space-y-8 px-4 py-8 md:px-8 md:py-12">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-primary">
              <Flower2 className="h-3 w-3" /> Women's Health
            </div>
            <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight sm:text-4xl">Bloom, gently.</h1>
            <p className="mt-1 max-w-xl text-sm text-muted-foreground">
              Understand your cycle, mood and body — with beautiful clarity.
            </p>
          </div>
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-glow">
            <Heart className="h-5 w-5" />
          </div>
        </div>

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-[2rem] border bg-card p-6 shadow-soft sm:p-8"
        >
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-40 blur-2xl gradient-hero" aria-hidden />
          <div className="relative grid gap-6 md:grid-cols-[auto_1fr] md:items-center">
            <ProgressRing value={45} size={160} stroke={14} color="var(--color-primary)">
              <div className="text-center">
                <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Day</div>
                <div className="tabular text-4xl font-bold text-primary">13</div>
                <div className="mt-0.5 text-[11px] text-muted-foreground">of 28</div>
              </div>
            </ProgressRing>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-widest text-primary/80">Current phase</div>
              <h2 className="mt-1 font-heading text-2xl font-bold sm:text-3xl">Follicular · high energy</h2>
              <p className="mt-1 max-w-md text-sm text-muted-foreground">
                Ovulation window opens in 2 days. A great time for creative work and strength training.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Pill label="Next period · Nov 12" />
                <Pill label="Fertile window · Nov 4" />
              </div>
            </div>
          </div>
        </motion.section>

        <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {phases.map((p) => (
            <div key={p.name} className="rounded-3xl border bg-card p-4 shadow-soft">
              <div className="grid h-9 w-9 place-items-center rounded-2xl" style={{ background: `color-mix(in oklab, ${p.tint} 20%, transparent)`, color: p.tint }}>
                <Droplet className="h-4 w-4" />
              </div>
              <div className="mt-3 font-heading text-sm font-semibold">{p.name}</div>
              <div className="text-xs text-muted-foreground">Days {p.days}</div>
            </div>
          ))}
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <FeatureCard to="/women/pregnancy" icon={Baby} title="Pregnancy tracker" desc="Weekly milestones, gentle guidance." />
          <FeatureCard to="/women/hormones" icon={Activity} title="Hormones" desc="Understand what's shifting." />
          <FeatureCard to="/women/insights" icon={Sparkles} title="Insights" desc="Patterns from your cycle." />
        </section>

        <section className="grid gap-4 lg:grid-cols-[2fr_1fr]">
          <div className="rounded-3xl border bg-card p-6 shadow-soft">
            <h3 className="font-heading text-lg font-semibold">How are you feeling today?</h3>
            <p className="mt-1 text-sm text-muted-foreground">Tap any symptoms you're noticing.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {symptoms.map((s) => (
                <button
                  key={s}
                  className="rounded-full border bg-background px-4 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="mt-6">
              <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Mood today</div>
              <div className="mt-2 flex items-center gap-2">
                {["😊", "😌", "😐", "😔", "😣"].map((m) => (
                  <button
                    key={m}
                    className="grid h-11 w-11 place-items-center rounded-2xl border bg-background text-xl transition-transform hover:-translate-y-0.5 hover:border-primary"
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
            <Link to="/women/calendar" className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-primary">
              <CalendarDays className="h-4 w-4" /> Open cycle calendar
            </Link>
          </div>

          <div className="rounded-3xl border bg-card p-5 shadow-soft">
            <div className="flex items-center gap-2 text-primary">
              <Smile className="h-4 w-4" />
              <span className="text-[11px] font-semibold uppercase tracking-widest">Gentle reminder</span>
            </div>
            <p className="mt-2 text-sm text-foreground">
              Iron drops during your period. Try leafy greens with citrus to help absorption.
            </p>
            <div className="mt-3 text-xs text-muted-foreground">Educational · not medical advice</div>
          </div>
        </section>
      </div>
    </div>
  );
}

function Pill({ label }: { label: string }) {
  return <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">{label}</span>;
}

function FeatureCard({ to, icon: Icon, title, desc }: { to: string; icon: typeof Baby; title: string; desc: string }) {
  return (
    <Link to={to} className="group rounded-3xl border bg-card p-5 shadow-soft transition-transform hover:-translate-y-0.5">
      <div className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/12 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div className="mt-3 font-heading text-base font-semibold">{title}</div>
      <div className="mt-1 text-sm text-muted-foreground">{desc}</div>
    </Link>
  );
}

function FloralBackdrop() {
  const flowers = [
    { cx: 80, cy: 60 }, { cx: 240, cy: 110 }, { cx: 900, cy: 80 }, { cx: 1180, cy: 160 },
  ];
  return (
    <svg aria-hidden viewBox="0 0 1440 380" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-[380px] w-full">
      <defs>
        <linearGradient id="wave" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.83 0.11 355)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="oklch(0.83 0.11 355)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M0,220 C240,300 480,120 720,180 C960,240 1200,120 1440,180 L1440,0 L0,0 Z" fill="url(#wave)" />
      {flowers.map((f, i) => (
        <g key={i} opacity={0.6}>
          {[0, 72, 144, 216, 288].map((r) => (
            <ellipse key={r} cx={f.cx} cy={f.cy} rx={9} ry={16} fill="oklch(0.86 0.09 355)" transform={`rotate(${r} ${f.cx} ${f.cy})`} />
          ))}
          <circle cx={f.cx} cy={f.cy} r={5} fill="oklch(0.83 0.14 60)" />
        </g>
      ))}
    </svg>
  );
}
