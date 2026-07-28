import { createFileRoute } from "@tanstack/react-router";
import { Apple, Plus, Trash2, Droplets, Minus } from "lucide-react";
import { PageHeader } from "@/components/health/PageHeader";
import { ProgressRing } from "@/components/health/ProgressRing";
import { useApp, type Meal } from "@/store/app";
import { useToday, useLastNDays } from "@/lib/derive";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { EmptyState } from "@/components/health/EmptyState";
import { Bar, BarChart, ResponsiveContainer, XAxis, Tooltip } from "recharts";

export const Route = createFileRoute("/_authenticated/nutrition")({
  head: () => ({ meta: [{ title: "Nutrition — Arogya" }, { name: "description", content: "Log meals and track macros." }] }),
  component: NutritionPage,
});

const FOOD_LIBRARY: Array<Omit<Meal, "id" | "date" | "time" | "type">> = [
  { name: "Oatmeal + berries", calories: 320, protein: 10, carbs: 55, fat: 7 },
  { name: "Chicken salad", calories: 450, protein: 40, carbs: 20, fat: 22 },
  { name: "Salmon + quinoa", calories: 580, protein: 42, carbs: 45, fat: 22 },
  { name: "Greek yogurt + honey", calories: 220, protein: 18, carbs: 24, fat: 5 },
  { name: "Avocado toast", calories: 380, protein: 12, carbs: 40, fat: 20 },
  { name: "Protein shake", calories: 180, protein: 25, carbs: 8, fat: 4 },
  { name: "Vegetable curry", calories: 420, protein: 15, carbs: 55, fat: 15 },
  { name: "Apple + peanut butter", calories: 250, protein: 6, carbs: 30, fat: 12 },
];

function NutritionPage() {
  const targets = useApp((s) => s.targets);
  const meals = useApp((s) => s.meals);
  const addMeal = useApp((s) => s.addMeal);
  const removeMeal = useApp((s) => s.removeMeal);
  const addWater = useApp((s) => s.addWater);
  const water = useApp((s) => s.water);
  const t = useToday();
  const last7 = useLastNDays(7);
  const today = new Date().toISOString().slice(0, 10);
  const todayWater = water.filter((w) => w.date === today);
  const glassMl = 250;

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 md:px-8 md:py-10">
      <PageHeader
        icon={Apple}
        title="Nutrition"
        description="Log meals, track macros and hit your daily goals."
        accent="var(--color-success)"
        actions={<AddMealDialog />}
      />

      <section className="grid gap-4 sm:grid-cols-4">
        {[
          { l: "Calories", v: t.totals.calories, g: targets.calories, unit: "kcal", c: "var(--color-warning)" },
          { l: "Protein", v: t.totals.protein, g: targets.protein, unit: "g", c: "var(--color-primary)" },
          { l: "Carbs", v: t.totals.carbs, g: targets.carbs, unit: "g", c: "var(--color-info)" },
          { l: "Fat", v: t.totals.fat, g: targets.fat, unit: "g", c: "var(--color-success)" },
        ].map((r) => (
          <div key={r.l} className="flex flex-col items-center rounded-3xl border bg-card p-4 shadow-soft">
            <ProgressRing value={r.g ? Math.min(100, (r.v / r.g) * 100) : 0} size={110} stroke={10} color={r.c}>
              <div className="text-center">
                <div className="tabular text-lg font-bold">{Math.round(r.v)}</div>
                <div className="text-[10px] text-muted-foreground">/ {r.g}{r.unit}</div>
              </div>
            </ProgressRing>
            <div className="mt-2 text-xs font-medium text-muted-foreground">{r.l}</div>
          </div>
        ))}
      </section>

      <section className="rounded-3xl border bg-card p-6 shadow-soft">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-info">
              <Droplets className="h-4 w-4" />
              <h3 className="font-heading text-lg font-semibold text-foreground">Water</h3>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{(t.water / 1000).toFixed(1)}L of {(targets.waterMl / 1000).toFixed(1)}L · {todayWater.length} glasses</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => todayWater[0] && useApp.getState().removeWater(todayWater[todayWater.length - 1].id)}
              className="grid h-10 w-10 place-items-center rounded-2xl border bg-background text-muted-foreground hover:text-foreground"
              aria-label="Remove glass"
            >
              <Minus className="h-4 w-4" />
            </button>
            <button
              onClick={() => addWater(glassMl)}
              className="rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-soft"
            >
              + {glassMl}ml
            </button>
          </div>
        </div>
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-info transition-all" style={{ width: `${Math.min(100, (t.water / targets.waterMl) * 100)}%`, background: "var(--color-info)" }} />
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-3xl border bg-card p-6 shadow-soft">
          <h3 className="font-heading text-lg font-semibold">Today's meals</h3>
          {t.meals.length === 0 ? (
            <div className="mt-4">
              <EmptyState icon={Apple} title="No meals yet" description="Tap Add meal to log your first entry." />
            </div>
          ) : (
            <ul className="mt-4 space-y-2">
              {t.meals.map((m) => (
                <li key={m.id} className="group flex items-center justify-between rounded-2xl border bg-background p-3">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold">{m.name}</div>
                    <div className="text-xs text-muted-foreground capitalize">{m.type} · {m.time} · {m.calories} kcal · P{m.protein} C{m.carbs} F{m.fat}</div>
                  </div>
                  <button onClick={() => { removeMeal(m.id); toast.success("Meal removed"); }} className="opacity-0 transition-opacity group-hover:opacity-100" aria-label="Delete">
                    <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-3xl border bg-card p-6 shadow-soft">
          <h3 className="font-heading text-lg font-semibold">Last 7 days</h3>
          <div className="mt-3 h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={last7}>
                <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                <Bar dataKey="cals" fill="var(--color-warning)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border bg-card p-6 shadow-soft">
        <h3 className="font-heading text-lg font-semibold">Meal history</h3>
        {meals.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">Meals you log will appear here.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {meals.slice().reverse().slice(0, 20).map((m) => (
              <li key={m.id} className="flex items-center justify-between rounded-2xl border bg-background p-3 text-sm">
                <div>
                  <span className="font-semibold">{m.name}</span>
                  <span className="ml-2 text-xs text-muted-foreground">{m.date} · {m.time}</span>
                </div>
                <span className="tabular text-xs text-muted-foreground">{m.calories} kcal</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function AddMealDialog() {
  const [open, setOpen] = useState(false);
  const addMeal = useApp((s) => s.addMeal);
  const [type, setType] = useState<Meal["type"]>("breakfast");
  const [name, setName] = useState("");
  const [calories, setCalories] = useState<number | "">("");
  const [protein, setProtein] = useState<number | "">("");
  const [carbs, setCarbs] = useState<number | "">("");
  const [fat, setFat] = useState<number | "">("");
  const [query, setQuery] = useState("");

  const submit = () => {
    if (!name.trim() || !calories) { toast.error("Name and calories are required"); return; }
    const now = new Date();
    addMeal({
      date: now.toISOString().slice(0, 10),
      time: now.toTimeString().slice(0, 5),
      name: name.trim(),
      type,
      calories: Number(calories) || 0,
      protein: Number(protein) || 0,
      carbs: Number(carbs) || 0,
      fat: Number(fat) || 0,
    });
    toast.success(`${name} added`);
    setName(""); setCalories(""); setProtein(""); setCarbs(""); setFat("");
    setOpen(false);
  };

  const pick = (f: typeof FOOD_LIBRARY[number]) => {
    setName(f.name); setCalories(f.calories); setProtein(f.protein); setCarbs(f.carbs); setFat(f.fat);
  };

  const filtered = FOOD_LIBRARY.filter((f) => f.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-2xl"><Plus className="mr-1 h-4 w-4" /> Add meal</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>Log a meal</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div className="grid grid-cols-4 gap-1 rounded-2xl bg-muted p-1">
            {(["breakfast", "lunch", "dinner", "snack"] as const).map((k) => (
              <button
                key={k}
                onClick={() => setType(k)}
                className={`rounded-xl px-2 py-1.5 text-xs font-medium capitalize ${type === k ? "bg-card shadow-soft text-foreground" : "text-muted-foreground"}`}
              >
                {k}
              </button>
            ))}
          </div>
          <div>
            <Label>Quick pick</Label>
            <Input placeholder="Search foods…" value={query} onChange={(e) => setQuery(e.target.value)} className="mt-1 rounded-2xl" />
            <div className="mt-2 flex flex-wrap gap-1">
              {filtered.slice(0, 6).map((f) => (
                <button key={f.name} onClick={() => pick(f)} className="rounded-full border bg-background px-3 py-1 text-xs hover:border-primary">
                  {f.name}
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label htmlFor="mn">Name</Label>
            <Input id="mn" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 rounded-2xl" />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[
              { l: "kcal", v: calories, s: setCalories },
              { l: "P", v: protein, s: setProtein },
              { l: "C", v: carbs, s: setCarbs },
              { l: "F", v: fat, s: setFat },
            ].map((f) => (
              <div key={f.l}>
                <Label className="text-xs">{f.l}</Label>
                <Input type="number" value={f.v} onChange={(e) => f.s(e.target.value ? Number(e.target.value) : "")} className="mt-1 rounded-2xl" />
              </div>
            ))}
          </div>
          <Button onClick={submit} className="w-full rounded-2xl">Save meal</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
