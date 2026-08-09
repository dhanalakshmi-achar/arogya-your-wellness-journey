import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, Download } from "lucide-react";
import { PageHeader } from "@/components/health/PageHeader";
import { useApp } from "@/store/app";
import { useLastNDays } from "@/lib/derive";
import { Area, AreaChart, Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/reports")({
  head: () => ({ meta: [{ title: "Reports — Arogya" }, { name: "description", content: "Weekly and monthly health analytics." }] }),
  component: ReportsPage,
});

function ReportsPage() {
  const last7 = useLastNDays(7);
  const last30 = useLastNDays(30);
  const meals = useApp((s) => s.meals);
const workouts = useApp((s) => s.workouts);

const completedWorkouts = workouts.filter((w) => w.completed);
  // const workouts = useApp((s) => s.workouts.filter((w) => w.completed));
  const sleep = useApp((s) => s.sleep);
  const exportAll = useApp((s) => s.exportAll);

  const download = (kind: "json" | "csv") => {
    if (kind === "json") {
      const blob = new Blob([exportAll()], { type: "application/json" });
      trigger(blob, "arogya-data.json");
    } else {
      const rows = ["date,type,name,value", ...meals.map((m) => `${m.date},meal,${m.name},${m.calories}`),...completedWorkouts.map((w) => `${w.date},workout,${w.name},${w.calories}`), ...sleep.map((s) => `${s.date},sleep,${s.hours}h,${s.quality}`)];
      trigger(new Blob([rows.join("\n")], { type: "text/csv" }), "arogya-data.csv");
    }
    toast.success(`Exported ${kind.toUpperCase()}`);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 md:px-8 md:py-10">
      <PageHeader
        icon={BarChart3}
        title="Reports"
        description="Weekly & monthly analytics across all your pillars."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => download("csv")} className="rounded-2xl"><Download className="mr-1 h-4 w-4" /> CSV</Button>
            <Button onClick={() => download("json")} className="rounded-2xl"><Download className="mr-1 h-4 w-4" /> JSON</Button>
          </div>
        }
      />
      <div className="grid gap-4 md:grid-cols-3">
        <Stat label="Meals (30d)" value={meals.filter((m) => m.date >= last30[0].day.padStart(5, "0") ? true : true).length} />
<Stat label="Workouts (30d)" value={completedWorkouts.length} />
        {/* <Stat label="Workouts (30d)" value={workouts.length} /> */}
        <Stat label="Sleep logs (30d)" value={sleep.length} />
      </div>

      <ChartCard title="Calories · 7 days"><BarChart data={last7}><XAxis dataKey="day" tick={{ fontSize: 10 }} /><Tooltip /><Bar dataKey="cals" fill="var(--color-warning)" radius={[8, 8, 0, 0]} /></BarChart></ChartCard>
      <ChartCard title="Sleep hours · 30 days"><AreaChart data={last30}><defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--color-info)" stopOpacity={0.5} /><stop offset="100%" stopColor="var(--color-info)" stopOpacity={0} /></linearGradient></defs><XAxis dataKey="day" tick={{ fontSize: 9 }} /><YAxis hide /><Tooltip /><Area dataKey="sleep" stroke="var(--color-info)" fill="url(#sg)" /></AreaChart></ChartCard>
      <ChartCard title="Exercise minutes · 30 days"><LineChart data={last30}><XAxis dataKey="day" tick={{ fontSize: 9 }} /><YAxis hide /><Tooltip /><Line dataKey="ex" stroke="var(--color-primary)" strokeWidth={2} dot={false} /></LineChart></ChartCard>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactElement }) {
  return (
    <div className="rounded-3xl border bg-card p-6 shadow-soft">
      <h3 className="font-heading text-base font-semibold">{title}</h3>
      <div className="mt-3 h-52"><ResponsiveContainer width="100%" height="100%">{children}</ResponsiveContainer></div>
    </div>
  );
}
function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-3xl border bg-card p-5 shadow-soft">
      <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-2 tabular text-3xl font-bold">{value}</div>
    </div>
  );
}
function trigger(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}
