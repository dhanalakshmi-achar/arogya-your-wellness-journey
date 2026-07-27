import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Heart, Sparkles, Apple, Dumbbell, Moon, Brain, Flower2, ArrowRight, Check } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Arogya — Your calm, AI-powered health companion" },
      { name: "description", content: "Track nutrition, fitness, sleep, mood and women's health in one beautifully simple app." },
      { property: "og:title", content: "Arogya — Holistic health, made joyful" },
      { property: "og:description", content: "One app for body, mind, and cycle — guided by an AI coach that actually helps." },
    ],
  }),
  component: Landing,
});

const pillars = [
  { icon: Apple, label: "Nutrition", tint: "var(--color-success)" },
  { icon: Dumbbell, label: "Fitness", tint: "var(--color-primary)" },
  { icon: Moon, label: "Sleep", tint: "var(--color-info)" },
  { icon: Brain, label: "Mental", tint: "var(--color-accent)" },
  { icon: Flower2, label: "Women's", tint: "oklch(0.66 0.22 0)" },
  { icon: Sparkles, label: "AI Coach", tint: "var(--color-warning)" },
];

function Landing() {
  return (
    <div className="min-h-dvh bg-background">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-10 w-10 place-items-center rounded-2xl gradient-hero text-white shadow-glow">
            <Heart className="h-5 w-5" />
          </div>
          <span className="font-heading text-xl font-bold tracking-tight">Arogya</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link to="/auth" className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
            Sign in
          </Link>
          <Link to="/auth" search={{ mode: "signup" as const }} className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-soft hover:opacity-90">
            Get started
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-5 pt-6 pb-20 sm:pt-16">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-soft">
              <Sparkles className="h-3.5 w-3.5 text-primary" /> Now in beta
            </div>
            <h1 className="mt-4 font-heading text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
              Your calm, <span className="text-gradient">AI-powered</span> health companion.
            </h1>
            <p className="mt-4 max-w-lg text-base text-muted-foreground sm:text-lg">
              Arogya blends nutrition, fitness, sleep, mental wellness and women's health into one warm, beautiful place —
              guided by an AI coach that actually helps you show up.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/auth"
                search={{ mode: "signup" as const }}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:scale-105"
              >
                Start free <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/auth" className="inline-flex items-center gap-2 rounded-full border bg-card px-6 py-3 text-sm font-semibold shadow-soft">
                I already have an account
              </Link>
            </div>
            <ul className="mt-6 grid gap-2 text-sm text-muted-foreground">
              {["No ads. No spam.", "Private by default.", "Free forever plan."].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-success" /> {t}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }}>
            <div className="relative mx-auto max-w-md">
              <div className="absolute -inset-8 -z-10 rounded-[3rem] blur-3xl opacity-60 gradient-hero" />
              <div className="rounded-[2rem] border bg-card p-6 shadow-glow">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-muted-foreground">Today</div>
                    <div className="font-heading text-2xl font-bold">Feeling great</div>
                  </div>
                  <div className="grid h-12 w-12 place-items-center rounded-2xl gradient-hero text-white">
                    <Heart className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-4 rounded-2xl gradient-card p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Health score</span>
                    <span className="tabular text-3xl font-bold text-primary">86</span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                    <motion.div initial={{ width: 0 }} animate={{ width: "86%" }} transition={{ duration: 1.2 }} className="h-full rounded-full gradient-hero" />
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {[
                    { l: "Calories", v: "1,842" },
                    { l: "Water", v: "1.9L" },
                    { l: "Sleep", v: "7h 40m" },
                  ].map((s) => (
                    <div key={s.l} className="rounded-2xl border bg-background p-3 text-center">
                      <div className="tabular text-sm font-semibold">{s.v}</div>
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-24">
          <div className="text-center">
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary/80">Six pillars, one app</div>
            <h2 className="mt-2 font-heading text-3xl font-bold tracking-tight sm:text-4xl">Everything your body & mind need.</h2>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
            {pillars.map((p, i) => (
              <motion.div
                key={p.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex flex-col items-center gap-2 rounded-3xl border bg-card p-5 shadow-soft"
              >
                <div className="grid h-12 w-12 place-items-center rounded-2xl" style={{ background: `color-mix(in oklab, ${p.tint} 18%, transparent)`, color: p.tint }}>
                  <p.icon className="h-5 w-5" />
                </div>
                <div className="text-sm font-semibold">{p.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-5 py-6 text-xs text-muted-foreground sm:flex-row">
          <div>© {new Date().getFullYear()} Arogya. Made with care.</div>
          <div>Not a medical device. Consult a professional for advice.</div>
        </div>
      </footer>
    </div>
  );
}
