import { createFileRoute } from "@tanstack/react-router";
import { Brain, Plus, Trash2, Wind, Play, Pause } from "lucide-react";
import { PageHeader } from "@/components/health/PageHeader";
import { useApp, type MoodLog } from "@/store/app";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useLastNDays } from "@/lib/derive";
import { EmptyState } from "@/components/health/EmptyState";

export const Route = createFileRoute("/_authenticated/mental")({
  head: () => ({ meta: [{ title: "Mental Wellness — Arogya" }, { name: "description", content: "Mood, meditation, journal and breathing." }] }),
  component: MentalPage,
});

const EMOJIS: Array<{ e: string; m: MoodLog["mood"]; label: string }> = [
  { e: "😄", m: 5, label: "Great" },
  { e: "🙂", m: 4, label: "Good" },
  { e: "😐", m: 3, label: "Okay" },
  { e: "😔", m: 2, label: "Low" },
  { e: "😣", m: 1, label: "Hard" },
];

const TAG_OPTIONS = ["Calm", "Stressed", "Grateful", "Anxious", "Focused", "Tired", "Happy", "Sad"];

function MentalPage() {
  const addMood = useApp((s) => s.addMood);
  const moods = useApp((s) => s.moods);
  const journal = useApp((s) => s.journal);
  const removeJ = useApp((s) => s.removeJournal);
  const [tags, setTags] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const last7 = useLastNDays(7);
  const [query, setQuery] = useState("");

  const submitMood = (e: MoodLog["mood"], emoji: string) => {
    addMood({
      date: new Date().toISOString().slice(0, 10),
      at: Date.now(),
      mood: e,
      emoji,
      tags,
      note: note || undefined,
    });
    toast.success("Mood logged · +5 XP");
    setTags([]); setNote("");
  };

  const filteredJ = journal.filter((j) => (j.title + j.body + j.tags.join(" ")).toLowerCase().includes(query.toLowerCase())).reverse();

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 md:px-8 md:py-10">
      <PageHeader
        icon={Brain}
        title="Mental Wellness"
        description="Mood, meditation, journaling and breathwork — for a calmer mind."
        accent="var(--color-accent)"
        actions={<JournalDialog />}
      />

      <section className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-3xl border bg-card p-6 shadow-soft">
          <h3 className="font-heading text-lg font-semibold">How are you feeling right now?</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {EMOJIS.map((x) => (
              <button
                key={x.m}
                onClick={() => submitMood(x.m, x.e)}
                className="flex items-center gap-2 rounded-2xl border bg-background px-4 py-2 text-sm transition-transform hover:-translate-y-0.5 hover:border-primary"
              >
                <span className="text-xl">{x.e}</span>
                <span>{x.label}</span>
              </button>
            ))}
          </div>
          <div className="mt-4">
            <Label className="text-xs">Tags</Label>
            <div className="mt-1 flex flex-wrap gap-1">
              {TAG_OPTIONS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTags((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t])}
                  className={`rounded-full border px-3 py-1 text-xs ${tags.includes(t) ? "border-primary bg-primary/10 text-primary" : "text-muted-foreground"}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <Input placeholder="Add a note (optional)" value={note} onChange={(e) => setNote(e.target.value)} className="mt-3 rounded-2xl" />
        </div>

        <div className="rounded-3xl border bg-card p-6 shadow-soft">
          <h3 className="font-heading text-lg font-semibold">7-day mood</h3>
          <div className="mt-3 h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={last7}>
                <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                <YAxis hide domain={[0, 5]} />
                <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                <Bar dataKey="mood" fill="var(--color-accent)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">{moods.length} check-ins total</p>
        </div>
      </section>

      <BreathingCard />

      <section>
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-lg font-semibold">Journal</h3>
          <Input placeholder="Search entries…" value={query} onChange={(e) => setQuery(e.target.value)} className="max-w-xs rounded-2xl" />
        </div>
        {filteredJ.length === 0 ? (
          <div className="mt-3"><EmptyState icon={Brain} title="Nothing here yet" description="Journaling one line boosts mood measurably." /></div>
        ) : (
          <ul className="mt-3 space-y-2">
            {filteredJ.map((j) => (
              <li key={j.id} className="rounded-2xl border bg-card p-4 shadow-soft">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold">{j.title || "Untitled"}</div>
                  <button onClick={() => removeJ(j.id)} aria-label="Delete"><Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" /></button>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{j.date} · {new Date(j.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
                <p className="mt-2 text-sm text-foreground whitespace-pre-wrap">{j.body}</p>
                {j.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {j.tags.map((t) => <span key={t} className="rounded-full bg-muted px-2 py-0.5 text-[10px]">{t}</span>)}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function BreathingCard() {
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState<"Inhale" | "Hold" | "Exhale" | "Hold ">("Inhale");
  const [count, setCount] = useState(4);
  const [elapsed, setElapsed] = useState(0);
  const addMed = useApp((s) => s.addMeditation);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    const phases: Array<[typeof phase, number]> = [["Inhale", 4], ["Hold", 4], ["Exhale", 4], ["Hold ", 4]];
    let i = 0;
    let sec = phases[0][1];
    setPhase(phases[0][0]); setCount(sec);
    timer.current = window.setInterval(() => {
      sec -= 1;
      setElapsed((e) => e + 1);
      if (sec <= 0) {
        i = (i + 1) % phases.length;
        sec = phases[i][1];
        setPhase(phases[i][0]);
      }
      setCount(sec);
    }, 1000);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [running]);

  const stop = () => {
    setRunning(false);
    if (elapsed >= 30) {
      const minutes = Math.max(1, Math.round(elapsed / 60));
      addMed({ date: new Date().toISOString().slice(0, 10), minutes, kind: "Breathing" });
      toast.success(`${minutes} min breathing logged · +${minutes} XP`);
    }
    setElapsed(0);
  };

  return (
    <section className="rounded-3xl border bg-card p-6 shadow-soft">
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-accent/40 text-accent-foreground"><Wind className="h-5 w-5" /></div>
        <div>
          <h3 className="font-heading text-lg font-semibold">Box breathing</h3>
          <p className="text-xs text-muted-foreground">4-4-4-4 · inhale, hold, exhale, hold</p>
        </div>
      </div>
      <div className="mt-6 grid place-items-center">
        <motion.div
          className="grid h-40 w-40 place-items-center rounded-full gradient-hero text-white shadow-glow"
          animate={{ scale: running ? (phase === "Inhale" ? 1.15 : phase === "Exhale" ? 0.85 : 1) : 1 }}
          transition={{ duration: 4, ease: "easeInOut" }}
        >
          <div className="text-center">
            <div className="text-sm font-semibold uppercase tracking-widest opacity-80">{phase}</div>
            <div className="tabular text-4xl font-bold">{count}</div>
          </div>
        </motion.div>
      </div>
      <div className="mt-4 flex items-center justify-center gap-2">
        {!running ? (
          <Button onClick={() => setRunning(true)} className="rounded-2xl"><Play className="mr-1 h-4 w-4" /> Start</Button>
        ) : (
          <Button onClick={stop} variant="outline" className="rounded-2xl"><Pause className="mr-1 h-4 w-4" /> Stop ({elapsed}s)</Button>
        )}
      </div>
    </section>
  );
}

function JournalDialog() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const add = useApp((s) => s.addJournal);
  const submit = () => {
    if (!body.trim()) { toast.error("Write something first"); return; }
    add({
      date: new Date().toISOString().slice(0, 10),
      at: Date.now(),
      title,
      body,
      tags: tags.split(",").map((s) => s.trim()).filter(Boolean),
    });
    toast.success("Entry saved · +8 XP");
    setTitle(""); setBody(""); setTags("");
    setOpen(false);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button className="rounded-2xl"><Plus className="mr-1 h-4 w-4" /> Journal</Button></DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>New journal entry</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div><Label>Title</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 rounded-2xl" /></div>
          <div><Label>Body</Label><Textarea value={body} onChange={(e) => setBody(e.target.value)} rows={5} className="mt-1 rounded-2xl" /></div>
          <div><Label>Tags (comma-separated)</Label><Input value={tags} onChange={(e) => setTags(e.target.value)} className="mt-1 rounded-2xl" /></div>
          <Button onClick={submit} className="w-full rounded-2xl">Save entry</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
