import { createFileRoute } from "@tanstack/react-router";
import { Activity } from "lucide-react";
import { PageHeader } from "@/components/health/PageHeader";
import { useApp } from "@/store/app";
import { cyclePhase } from "@/lib/health";

export const Route = createFileRoute("/_authenticated/women/hormones")({
  component: Hormones,
});

const HORMONES = [
  { name: "Estrogen", peak: "Ovulation", role: "Boosts energy and libido; peaks mid-cycle." },
  { name: "Progesterone", peak: "Luteal", role: "Calming; rises after ovulation, supports sleep." },
  { name: "Testosterone", peak: "Ovulation", role: "Small peak — supports drive and focus." },
  { name: "FSH", peak: "Follicular", role: "Kickstarts follicle growth early in cycle." },
];

function Hormones() {
  const cycles = useApp((s) => s.cycles);
  const profile = useApp((s) => s.profile);
  const last = cycles[cycles.length - 1];
  const dayOfCycle = last ? Math.min(profile.cycleLenDays, Math.floor((Date.now() - new Date(last.startDate).getTime()) / 86400000) + 1) : 1;
  const phase = cyclePhase(dayOfCycle, profile.cycleLenDays);

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 md:px-8 md:py-10">
      <PageHeader icon={Activity} title="Hormones" description="Estrogen, progesterone and how they shift across your cycle." />
      <div className="rounded-3xl border bg-card p-6 shadow-soft">
        <div className="text-[11px] font-semibold uppercase tracking-widest text-primary">Right now</div>
        <div className="mt-1 font-heading text-2xl font-bold">{phase} phase · day {dayOfCycle}</div>
      </div>
      <ul className="space-y-3">
        {HORMONES.map((h) => (
          <li key={h.name} className={`rounded-3xl border p-5 shadow-soft ${h.peak === phase ? "border-primary bg-primary/5" : "bg-card"}`}>
            <div className="flex items-center justify-between">
              <span className="font-heading text-lg font-semibold">{h.name}</span>
              <span className="rounded-full bg-muted px-2 py-0.5 text-[10px]">Peaks · {h.peak}</span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{h.role}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
