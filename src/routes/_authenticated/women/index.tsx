import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Flower2, Heart, CalendarDays, Droplet, Sparkles, Baby, Activity, Plus } from "lucide-react";
import { ProgressRing } from "@/components/health/ProgressRing";
import { useApp } from "@/store/app";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { cyclePhase, predictNextPeriod } from "@/lib/health";

export const Route = createFileRoute("/_authenticated/women/")({
  component: WomenHome,
});

const symptoms = ["Cramps", "Bloating", "Headache", "Tender", "Acne", "Fatigue"];

function WomenHome() {
  const cycles = useApp((s) => s.cycles);
  const profile = useApp((s) => s.profile);
  const symsToday = useApp((s) => s.cycleSymptomsToday);
  const toggleSym = useApp((s) => s.toggleCycleSymptomToday);
  const addMood = useApp((s) => s.addMood);

  const last = cycles[cycles.length - 1];
  const lastStart = last ? new Date(last.startDate) : null;
  const dayOfCycle = lastStart ? Math.min(profile.cycleLenDays, Math.floor((Date.now() - lastStart.getTime()) / 86400000) + 1) : 1;
  const phase = cyclePhase(dayOfCycle, profile.cycleLenDays);
  const nextPeriod = lastStart ? predictNextPeriod(lastStart, profile.cycleLenDays) : null;
  const fertile = lastStart ? new Date(lastStart.getTime() + (profile.cycleLenDays - 14) * 86400000) : null;

  const logMood = (emoji: string, mood: 1 | 2 | 3 | 4 | 5) => {
    addMood({ date: new Date().toISOString().slice(0, 10), at: Date.now(), mood, emoji, tags: ["cycle"] });
    toast.success("Mood logged");
  };

  return (
    <div className="relative min-h-dvh overflow-hidden bg-background text-foreground">
      <div className="relative mx-auto max-w-6xl space-y-8 px-4 py-8 md:px-8 md:py-12">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-primary">
              <Flower2 className="h-3 w-3" /> Women's Health
            </div>
            <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight sm:text-4xl">Bloom, gently.</h1>
            <p className="mt-1 max-w-xl text-sm text-muted-foreground">Understand your cycle, mood and body — with beautiful clarity.</p>
          </div>
          <LogCycleDialog />
        </div>

        <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="relative overflow-hidden rounded-[2rem] border bg-card p-6 shadow-soft sm:p-8">
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-40 blur-2xl gradient-hero" aria-hidden />
          <div className="relative grid gap-6 md:grid-cols-[auto_1fr] md:items-center">
            <ProgressRing value={(dayOfCycle / profile.cycleLenDays) * 100} size={160} stroke={14} color="var(--color-primary)">
              <div className="text-center">
                <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Day</div>
                <div className="tabular text-4xl font-bold text-primary">{dayOfCycle}</div>
                <div className="mt-0.5 text-[11px] text-muted-foreground">of {profile.cycleLenDays}</div>
              </div>
            </ProgressRing>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-widest text-primary/80">Current phase</div>
              <h2 className="mt-1 font-heading text-2xl font-bold sm:text-3xl">{phase}</h2>
              <p className="mt-1 max-w-md text-sm text-muted-foreground">
                {last ? `Last period: ${last.startDate}` : "Log your last period to unlock predictions."}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {nextPeriod && <Pill label={`Next · ${nextPeriod.toISOString().slice(0, 10)}`} />}
                {fertile && <Pill label={`Fertile · ${fertile.toISOString().slice(0, 10)}`} />}
              </div>
            </div>
          </div>
        </motion.section>

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
              {symptoms.map((s) => {
                const active = symsToday.symptoms.includes(s);
                return (
                  <button
                    key={s}
                    onClick={() => toggleSym(s)}
                    className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${active ? "border-primary bg-primary/10 text-primary" : "bg-background text-muted-foreground hover:border-primary hover:text-primary"}`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
            <div className="mt-6">
              <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Mood today</div>
              <div className="mt-2 flex items-center gap-2">
                {[["😊", 5], ["😌", 4], ["😐", 3], ["😔", 2], ["😣", 1]].map(([e, v]) => (
                  <button
                    key={e as string}
                    onClick={() => logMood(e as string, v as 1 | 2 | 3 | 4 | 5)}
                    className="grid h-11 w-11 place-items-center rounded-2xl border bg-background text-xl transition-transform hover:-translate-y-0.5 hover:border-primary"
                  >
                    {e}
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
              <Droplet className="h-4 w-4" />
              <span className="text-[11px] font-semibold uppercase tracking-widest">Gentle reminder</span>
            </div>
            <p className="mt-2 text-sm text-foreground">
              {phase === "Menstrual" ? "Iron drops during your period. Try leafy greens with citrus." : phase === "Follicular" ? "Energy rises — great time for strength training." : phase === "Ovulation" ? "Peak energy & focus. Prioritise creative work." : "Wind down — extra sleep helps your luteal phase."}
            </p>
            <div className="mt-3 text-xs text-muted-foreground">Educational · not medical advice</div>
          </div>
        </section>
      </div>
    </div>
  );
}

function LogCycleDialog() {
  const [open, setOpen] = useState(false);
  const [startDate, setStart] = useState(new Date().toISOString().slice(0, 10));
  const [flow, setFlow] = useState<"light" | "medium" | "heavy">("medium");
  const add = useApp((s) => s.addCycle);
  const symsToday = useApp((s) => s.cycleSymptomsToday);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button className="rounded-2xl"><Plus className="mr-1 h-4 w-4" /> Log period</Button></DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>Log period start</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div><Label>Start date</Label><Input type="date" value={startDate} onChange={(e) => setStart(e.target.value)} className="mt-1 rounded-2xl" /></div>
          <div>
            <Label>Flow</Label>
            <div className="mt-1 grid grid-cols-3 gap-1">
              {(["light", "medium", "heavy"] as const).map((f) => (
                <button key={f} onClick={() => setFlow(f)} className={`rounded-2xl border py-2 text-sm capitalize ${flow === f ? "border-primary bg-primary/10 text-primary" : "text-muted-foreground"}`}>{f}</button>
              ))}
            </div>
          </div>
          <Button onClick={() => { add({ startDate, flow, symptoms: symsToday.symptoms }); toast.success("Cycle logged"); setOpen(false); }} className="w-full rounded-2xl">Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Pill({ label }: { label: string }) { return <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">{label}</span>; }
function FeatureCard({ to, icon: Icon, title, desc }: { to: string; icon: any; title: string; desc: string }) {
  return (
    <Link to={to} className="group rounded-3xl border bg-card p-5 shadow-soft transition-transform hover:-translate-y-0.5">
      <div className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/12 text-primary"><Icon className="h-5 w-5" /></div>
      <div className="mt-3 font-heading text-base font-semibold">{title}</div>
      <div className="mt-1 text-sm text-muted-foreground">{desc}</div>
    </Link>
  );
}
