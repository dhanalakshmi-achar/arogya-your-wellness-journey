import { createFileRoute } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { PageHeader } from "@/components/health/PageHeader";
import { useApp } from "@/store/app";

export const Route = createFileRoute("/_authenticated/women/insights")({
  component: Insights,
});

function Insights() {
  const cycles = useApp((s) => s.cycles);
  const allMoods = useApp((s) => s.moods);
const moods = allMoods.filter((m) => m.tags.includes("cycle"));
  const avgMood = moods.length ? (moods.reduce((a, b) => a + b.mood, 0) / moods.length).toFixed(1) : "—";
  const commonSyms: Record<string, number> = {};
  cycles.forEach((c) => c.symptoms.forEach((s) => { commonSyms[s] = (commonSyms[s] || 0) + 1; }));
  const top = Object.entries(commonSyms).sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 md:px-8 md:py-10">
      <PageHeader icon={Sparkles} title="Insights" description="Patterns from your cycle, energy and mood." />
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border bg-card p-6 shadow-soft">
          <h3 className="font-heading text-lg font-semibold">Average cycle mood</h3>
          <div className="mt-2 tabular text-4xl font-bold text-primary">{avgMood}</div>
          <p className="mt-1 text-xs text-muted-foreground">{moods.length} mood entries tagged with cycle</p>
        </div>
        <div className="rounded-3xl border bg-card p-6 shadow-soft">
          <h3 className="font-heading text-lg font-semibold">Common symptoms</h3>
          {top.length === 0 ? <p className="mt-2 text-sm text-muted-foreground">Log a few cycles to see patterns.</p> : (
            <ul className="mt-3 space-y-2 text-sm">
              {top.map(([s, n]) => (
                <li key={s} className="flex items-center justify-between">
                  <span>{s}</span>
                  <span className="tabular font-semibold">{n}×</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
