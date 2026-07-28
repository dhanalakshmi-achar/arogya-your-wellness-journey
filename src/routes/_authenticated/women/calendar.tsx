import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays } from "lucide-react";
import { PageHeader } from "@/components/health/PageHeader";
import { useApp } from "@/store/app";
import { cyclePhase, predictNextPeriod } from "@/lib/health";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/women/calendar")({
  component: CalendarPage,
});

function CalendarPage() {
  const cycles = useApp((s) => s.cycles);
  const profile = useApp((s) => s.profile);
  const [monthOffset, setMonthOffset] = useState(0);
  const today = new Date();
  const view = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
  const daysInMonth = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
  const firstDay = view.getDay();
  const last = cycles[cycles.length - 1];
  const lastStart = last ? new Date(last.startDate) : null;
  const next = lastStart ? predictNextPeriod(lastStart, profile.cycleLenDays) : null;

  const cells: Array<{ day: number; kind: "period" | "predicted" | "fertile" | "none"; phase?: string }> = [];
  for (let i = 0; i < firstDay; i++) cells.push({ day: 0, kind: "none" });
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(view.getFullYear(), view.getMonth(), d);
    let kind: "period" | "predicted" | "fertile" | "none" = "none";
    let phase: string | undefined;
    if (lastStart) {
      const diff = Math.floor((date.getTime() - lastStart.getTime()) / 86400000);
      const dayOfCycle = ((diff % profile.cycleLenDays) + profile.cycleLenDays) % profile.cycleLenDays + 1;
      phase = cyclePhase(dayOfCycle, profile.cycleLenDays);
      if (dayOfCycle <= profile.periodLenDays) kind = diff >= 0 && diff <= profile.periodLenDays ? "period" : "predicted";
      else if (phase === "Ovulation") kind = "fertile";
    }
    if (next && date.toDateString() === next.toDateString()) kind = "predicted";
    cells.push({ day: d, kind, phase });
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 md:px-8 md:py-10">
      <PageHeader icon={CalendarDays} title="Cycle Calendar" description="See phases, symptoms and predictions in one view." />

      <div className="rounded-3xl border bg-card p-6 shadow-soft">
        <div className="flex items-center justify-between">
          <button onClick={() => setMonthOffset((n) => n - 1)} className="rounded-2xl border px-3 py-1 text-sm">‹</button>
          <div className="font-heading text-lg font-semibold">{view.toLocaleString(undefined, { month: "long", year: "numeric" })}</div>
          <button onClick={() => setMonthOffset((n) => n + 1)} className="rounded-2xl border px-3 py-1 text-sm">›</button>
        </div>
        <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[10px] font-semibold uppercase text-muted-foreground">
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => <div key={i}>{d}</div>)}
        </div>
        <div className="mt-1 grid grid-cols-7 gap-1">
          {cells.map((c, i) => (
            <div
              key={i}
              title={c.phase}
              className={`aspect-square rounded-2xl text-center text-sm ${c.day === 0 ? "" : "border"} ${
                c.kind === "period" ? "border-primary bg-primary/20 text-primary font-semibold" :
                c.kind === "predicted" ? "border-primary/40 bg-primary/5 text-primary" :
                c.kind === "fertile" ? "border-info/40 bg-info/10" : "bg-background"
              } grid place-items-center`}
            >
              {c.day || ""}
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
          <Legend color="var(--color-primary)" label="Period" />
          <Legend color="color-mix(in oklab, var(--color-primary) 30%, transparent)" label="Predicted" />
          <Legend color="var(--color-info)" label="Fertile" />
        </div>
      </div>
    </div>
  );
}
function Legend({ color, label }: { color: string; label: string }) {
  return <span className="inline-flex items-center gap-1"><span className="h-3 w-3 rounded" style={{ background: color }} /> {label}</span>;
}
