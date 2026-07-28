import { createFileRoute } from "@tanstack/react-router";
import { Moon, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/health/PageHeader";
import { useApp, type SleepLog } from "@/store/app";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { EmptyState } from "@/components/health/EmptyState";
import { sleepScore, useLastNDays } from "@/lib/derive";
import { Area, AreaChart, ResponsiveContainer, XAxis, Tooltip, YAxis } from "recharts";
import { ProgressRing } from "@/components/health/ProgressRing";

export const Route = createFileRoute("/_authenticated/sleep")({
  head: () => ({ meta: [{ title: "Sleep — Arogya" }, { name: "description", content: "Sleep tracking and rest insights." }] }),
  component: SleepPage,
});

function SleepPage() {
  const logs = useApp((s) => s.sleep);
  const targets = useApp((s) => s.targets);
  const remove = useApp((s) => s.removeSleep);
  const last7 = useLastNDays(7);
  const latest = logs[logs.length - 1];
  const score = latest ? sleepScore(latest.hours, latest.quality, targets.sleepHours) : 0;
  const avg7 = logs.slice(-7).reduce((a, b) => a + b.hours, 0) / Math.max(1, logs.slice(-7).length);

  const rec = !latest
    ? "Log your first night to unlock recommendations."
    : latest.hours < targets.sleepHours - 1
      ? "Try shifting bedtime 20 min earlier tonight; dim screens 1h before."
      : latest.quality <= 2
        ? "Quality was low — a warm shower and no caffeine after 2pm can help."
        : "Great rhythm — keep bedtime consistent within a 30-min window.";

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 md:px-8 md:py-10">
      <PageHeader
        icon={Moon}
        title="Sleep"
        description="Track your rest, understand cycles and wind down calmly."
        accent="var(--color-info)"
        actions={<AddSleepDialog />}
      />

      <section className="grid gap-4 md:grid-cols-[auto_1fr]">
        <div className="flex flex-col items-center rounded-3xl border bg-card p-6 shadow-soft">
          <ProgressRing value={score} size={140} stroke={12} color="var(--color-info)">
            <div className="text-center">
              <div className="tabular text-3xl font-bold">{score}</div>
              <div className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Score</div>
            </div>
          </ProgressRing>
          <div className="mt-3 text-sm text-muted-foreground">7-day avg: <span className="tabular font-semibold text-foreground">{avg7.toFixed(1)}h</span></div>
        </div>
        <div className="rounded-3xl border bg-card p-6 shadow-soft">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-primary">Recommendation</div>
          <p className="mt-1 font-heading text-lg font-semibold">{rec}</p>
          <div className="mt-4 h-40">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={last7}>
                <defs>
                  <linearGradient id="sleepG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-info)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--color-info)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                <YAxis hide domain={[0, 12]} />
                <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                <Area dataKey="sleep" stroke="var(--color-info)" strokeWidth={2} fill="url(#sleepG)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section>
        <h3 className="font-heading text-lg font-semibold">History</h3>
        {logs.length === 0 ? (
          <div className="mt-3"><EmptyState icon={Moon} title="No sleep logged" description="Add your first night." /></div>
        ) : (
          <ul className="mt-3 space-y-2">
            {logs.slice().reverse().map((l) => (
              <li key={l.id} className="flex items-center justify-between rounded-2xl border bg-card p-3 text-sm">
                <div>
                  <div className="font-semibold">{l.date} · {l.hours}h</div>
                  <div className="text-xs text-muted-foreground">{l.bedtime} → {l.waketime} · quality {"★".repeat(l.quality)} · {l.interruptions} interruptions</div>
                </div>
                <button onClick={() => remove(l.id)} className="grid h-8 w-8 place-items-center rounded-full border" aria-label="Delete">
                  <Trash2 className="h-3 w-3 text-muted-foreground" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function AddSleepDialog() {
  const [open, setOpen] = useState(false);
  const add = useApp((s) => s.addSleep);
  const [bedtime, setBedtime] = useState("22:30");
  const [waketime, setWaketime] = useState("06:30");
  const [quality, setQuality] = useState<SleepLog["quality"]>(4);
  const [interruptions, setInter] = useState<number | "">(0);
  const [notes, setNotes] = useState("");

  const hoursCalc = () => {
    const [bh, bm] = bedtime.split(":").map(Number);
    const [wh, wm] = waketime.split(":").map(Number);
    let mins = wh * 60 + wm - (bh * 60 + bm);
    if (mins < 0) mins += 24 * 60;
    return +(mins / 60).toFixed(1);
  };

  const submit = () => {
    const hours = hoursCalc();
    if (hours <= 0) { toast.error("Invalid times"); return; }
    add({
      date: new Date().toISOString().slice(0, 10),
      bedtime, waketime, hours, quality,
      interruptions: Number(interruptions) || 0,
      notes,
    });
    toast.success(`Logged ${hours}h · +10 XP`);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-2xl"><Plus className="mr-1 h-4 w-4" /> Log sleep</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>Log last night</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>Bedtime</Label>
              <Input type="time" value={bedtime} onChange={(e) => setBedtime(e.target.value)} className="mt-1 rounded-2xl" />
            </div>
            <div>
              <Label>Wake time</Label>
              <Input type="time" value={waketime} onChange={(e) => setWaketime(e.target.value)} className="mt-1 rounded-2xl" />
            </div>
          </div>
          <div className="rounded-2xl bg-muted p-3 text-sm text-muted-foreground">Total: <span className="tabular font-semibold text-foreground">{hoursCalc()}h</span></div>
          <div>
            <Label>Quality</Label>
            <div className="mt-1 flex gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} onClick={() => setQuality(n as SleepLog["quality"])} className={`flex-1 rounded-2xl border py-2 text-sm ${quality === n ? "border-primary bg-primary/10 text-primary" : "text-muted-foreground"}`}>
                  {"★".repeat(n)}
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label>Interruptions</Label>
            <Input type="number" value={interruptions} onChange={(e) => setInter(e.target.value ? Number(e.target.value) : "")} className="mt-1 rounded-2xl" />
          </div>
          <div>
            <Label>Notes</Label>
            <Input value={notes} onChange={(e) => setNotes(e.target.value)} className="mt-1 rounded-2xl" />
          </div>
          <Button onClick={submit} className="w-full rounded-2xl">Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
