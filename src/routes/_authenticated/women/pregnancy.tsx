import { createFileRoute } from "@tanstack/react-router";
import { Baby } from "lucide-react";
import { PageHeader } from "@/components/health/PageHeader";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_authenticated/women/pregnancy")({
  component: Pregnancy,
});

const MILESTONES = [
  [4, "Your baby is the size of a poppy seed."],
  [8, "Tiny fingers and toes are forming."],
  [12, "End of first trimester — energy often returns."],
  [16, "You may feel first flutters."],
  [20, "Halfway there! Anatomy scan around now."],
  [24, "Baby can hear your voice."],
  [28, "Third trimester begins."],
  [32, "Baby is putting on weight quickly."],
  [37, "Full term — baby can arrive any time now."],
] as const;

function Pregnancy() {
  const [lmp, setLmp] = useState("");
  const week = lmp ? Math.floor((Date.now() - new Date(lmp).getTime()) / (7 * 86400000)) : 0;
  const due = lmp ? new Date(new Date(lmp).getTime() + 280 * 86400000).toISOString().slice(0, 10) : "";
  const current = MILESTONES.filter(([w]) => w <= week).slice(-1)[0];

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 md:px-8 md:py-10">
      <PageHeader icon={Baby} title="Pregnancy Tracker" description="Week-by-week milestones and gentle guidance." />
      <div className="rounded-3xl border bg-card p-6 shadow-soft">
        <Label>Last menstrual period</Label>
        <Input type="date" value={lmp} onChange={(e) => setLmp(e.target.value)} className="mt-1 max-w-xs rounded-2xl" />
        {lmp && (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-muted p-4">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Current week</div>
              <div className="mt-1 tabular text-3xl font-bold">{Math.max(0, week)}</div>
            </div>
            <div className="rounded-2xl bg-muted p-4">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Estimated due date</div>
              <div className="mt-1 text-lg font-semibold">{due}</div>
            </div>
          </div>
        )}
        {current && (
          <div className="mt-4 rounded-2xl border border-primary/40 bg-primary/5 p-4 text-sm">
            <strong>Week {current[0]}:</strong> {current[1]}
          </div>
        )}
      </div>
      <ul className="space-y-2">
        {MILESTONES.map(([w, text]) => (
          <li key={w} className={`rounded-2xl border p-3 text-sm ${w <= week ? "bg-card" : "bg-muted/40 text-muted-foreground"}`}>
            <span className="font-semibold">Week {w}:</span> {text}
          </li>
        ))}
      </ul>
    </div>
  );
}
