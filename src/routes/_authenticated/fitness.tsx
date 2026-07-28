import { createFileRoute } from "@tanstack/react-router";
import { Dumbbell, Play, Trash2, Check, Plus, X } from "lucide-react";
import { PageHeader } from "@/components/health/PageHeader";
import { useApp, type Workout, type Exercise } from "@/store/app";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { EmptyState } from "@/components/health/EmptyState";
import { useLastNDays } from "@/lib/derive";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";

export const Route = createFileRoute("/_authenticated/fitness")({
  head: () => ({ meta: [{ title: "Fitness — Arogya" }, { name: "description", content: "Workouts, activity and recovery." }] }),
  component: FitnessPage,
});

const uid = () => Math.random().toString(36).slice(2, 10);

function FitnessPage() {
  const templates = useApp((s) => s.workoutTemplates);
  const workouts = useApp((s) => s.workouts);
  const addWorkout = useApp((s) => s.addWorkout);
  const [active, setActive] = useState<string | null>(null);
  const last7 = useLastNDays(7);
  const today = new Date().toISOString().slice(0, 10);

  const startFromTemplate = (tpl: Workout) => {
    const id = addWorkout({
      ...tpl,
      date: today,
      completed: false,
      exercises: tpl.exercises.map((e) => ({ ...e, id: uid(), done: false })),
    });
    setActive(id);
  };

  const activeWorkout = workouts.find((w) => w.id === active);

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 md:px-8 md:py-10">
      <PageHeader
        icon={Dumbbell}
        title="Fitness"
        description="Workouts, activity and recovery — tailored to your goals."
        accent="var(--color-primary)"
        actions={<NewWorkoutDialog />}
      />

      {activeWorkout && <ActiveSession workout={activeWorkout} onClose={() => setActive(null)} />}

      <section>
        <h3 className="font-heading text-lg font-semibold">Templates</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((tpl) => (
            <div key={tpl.id} className="rounded-3xl border bg-card p-5 shadow-soft">
              <div className="text-[11px] font-semibold uppercase tracking-widest text-primary">{tpl.category}</div>
              <h4 className="mt-1 font-heading text-lg font-semibold">{tpl.name}</h4>
              <p className="mt-1 text-xs text-muted-foreground">{tpl.exercises.length} exercises · ~{tpl.duration} min · {tpl.calories} kcal</p>
              <ul className="mt-3 space-y-1 text-sm">
                {tpl.exercises.map((e) => (
                  <li key={e.id} className="text-muted-foreground">• {e.name} · {e.sets}×{e.reps}{e.duration ? ` · ${e.duration}min` : ""}</li>
                ))}
              </ul>
              <div className="mt-4 flex gap-2">
                <Button onClick={() => startFromTemplate(tpl)} className="flex-1 rounded-2xl"><Play className="mr-1 h-4 w-4" /> Start</Button>
                <button onClick={() => { useApp.getState().removeTemplate(tpl.id); toast.success("Template removed"); }} className="grid h-10 w-10 place-items-center rounded-2xl border" aria-label="Delete">
                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border bg-card p-6 shadow-soft">
        <h3 className="font-heading text-lg font-semibold">Weekly minutes</h3>
        <div className="mt-3 h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={last7}>
              <XAxis dataKey="day" tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
              <Bar dataKey="ex" fill="var(--color-primary)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section>
        <h3 className="font-heading text-lg font-semibold">History</h3>
        {workouts.length === 0 ? (
          <div className="mt-3"><EmptyState icon={Dumbbell} title="No workouts yet" description="Start one from a template above." /></div>
        ) : (
          <ul className="mt-3 space-y-2">
            {workouts.slice().reverse().map((w) => (
              <li key={w.id} className="flex items-center justify-between rounded-2xl border bg-card p-3 text-sm">
                <div>
                  <div className="font-semibold">{w.name} <span className={`ml-2 rounded-full px-2 py-0.5 text-[10px] ${w.completed ? "bg-success/15 text-success" : "bg-muted"}`}>{w.completed ? "Done" : "In progress"}</span></div>
                  <div className="text-xs text-muted-foreground">{w.date} · {w.category} · {w.duration}min · {w.calories}kcal</div>
                </div>
                <div className="flex gap-1">
                  {!w.completed && <button onClick={() => setActive(w.id)} className="rounded-full bg-primary px-3 py-1 text-xs text-primary-foreground">Resume</button>}
                  <button onClick={() => useApp.getState().removeWorkout(w.id)} aria-label="Delete" className="grid h-8 w-8 place-items-center rounded-full border">
                    <Trash2 className="h-3 w-3 text-muted-foreground" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function ActiveSession({ workout, onClose }: { workout: Workout; onClose: () => void }) {
  const toggleEx = useApp((s) => s.toggleExercise);
  const complete = useApp((s) => s.completeWorkout);
  const done = workout.exercises.filter((e) => e.done).length;
  const pct = workout.exercises.length ? (done / workout.exercises.length) * 100 : 0;

  return (
    <section className="rounded-3xl border-2 border-primary bg-card p-6 shadow-glow">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-widest text-primary">Active session</div>
          <h3 className="font-heading text-xl font-semibold">{workout.name}</h3>
        </div>
        <button onClick={onClose} aria-label="Close" className="grid h-9 w-9 place-items-center rounded-2xl border"><X className="h-4 w-4" /></button>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
        <div className="h-full gradient-hero transition-all" style={{ width: `${pct}%` }} />
      </div>
      <ul className="mt-4 space-y-2">
        {workout.exercises.map((e) => (
          <li key={e.id}>
            <button
              onClick={() => toggleEx(workout.id, e.id)}
              className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left text-sm transition-colors ${e.done ? "border-success bg-success/5" : ""}`}
            >
              <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border ${e.done ? "border-success bg-success text-white" : "border-border"}`}>
                {e.done && <Check className="h-3 w-3" />}
              </span>
              <span className="flex-1">{e.name}</span>
              <span className="text-xs text-muted-foreground">{e.sets}×{e.reps}{e.duration ? ` · ${e.duration}min` : ""}</span>
            </button>
          </li>
        ))}
      </ul>
      <Button
        onClick={() => { complete(workout.id); toast.success(`+25 XP · ${workout.name} complete`); onClose(); }}
        disabled={done < workout.exercises.length}
        className="mt-4 w-full rounded-2xl shadow-glow"
      >
        Complete workout
      </Button>
    </section>
  );
}

function NewWorkoutDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState<Workout["category"]>("Strength");
  const [duration, setDuration] = useState<number | "">(30);
  const [calories, setCalories] = useState<number | "">(250);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [exName, setExName] = useState("");
  const [sets, setSets] = useState<number | "">(3);
  const [reps, setReps] = useState<number | "">(10);
  const saveTpl = useApp((s) => s.saveTemplate);

  const addEx = () => {
    if (!exName.trim()) return;
    setExercises([...exercises, { id: uid(), name: exName, sets: Number(sets) || 1, reps: Number(reps) || 1 }]);
    setExName("");
  };
  const submit = () => {
    if (!name.trim() || exercises.length === 0) { toast.error("Add a name and at least one exercise"); return; }
    saveTpl({ date: "", name, category, duration: Number(duration) || 30, calories: Number(calories) || 200, completed: false, exercises });
    toast.success("Template saved");
    setName(""); setExercises([]); setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-2xl"><Plus className="mr-1 h-4 w-4" /> New template</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>Create workout template</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div>
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 rounded-2xl" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>Category</Label>
              <select value={category} onChange={(e) => setCategory(e.target.value as Workout["category"])} className="mt-1 w-full rounded-2xl border bg-background px-3 py-2 text-sm">
                {(["Strength", "Cardio", "Mobility", "Yoga", "HIIT"] as const).map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <Label>Duration (min)</Label>
              <Input type="number" value={duration} onChange={(e) => setDuration(e.target.value ? Number(e.target.value) : "")} className="mt-1 rounded-2xl" />
            </div>
          </div>
          <div>
            <Label>Est. calories</Label>
            <Input type="number" value={calories} onChange={(e) => setCalories(e.target.value ? Number(e.target.value) : "")} className="mt-1 rounded-2xl" />
          </div>
          <div className="rounded-2xl border p-3">
            <Label>Exercises</Label>
            <ul className="mt-2 space-y-1 text-sm">
              {exercises.map((e) => (
                <li key={e.id} className="flex items-center justify-between">
                  <span>{e.name} · {e.sets}×{e.reps}</span>
                  <button onClick={() => setExercises(exercises.filter((x) => x.id !== e.id))} aria-label="Remove"><X className="h-3 w-3 text-muted-foreground" /></button>
                </li>
              ))}
              {exercises.length === 0 && <li className="text-xs text-muted-foreground">No exercises yet.</li>}
            </ul>
            <div className="mt-3 grid grid-cols-[1fr_auto_auto_auto] gap-1">
              <Input placeholder="Exercise" value={exName} onChange={(e) => setExName(e.target.value)} className="rounded-2xl" />
              <Input type="number" value={sets} onChange={(e) => setSets(e.target.value ? Number(e.target.value) : "")} className="w-14 rounded-2xl" />
              <Input type="number" value={reps} onChange={(e) => setReps(e.target.value ? Number(e.target.value) : "")} className="w-14 rounded-2xl" />
              <Button onClick={addEx} size="icon" className="rounded-2xl"><Plus className="h-4 w-4" /></Button>
            </div>
          </div>
          <Button onClick={submit} className="w-full rounded-2xl">Save template</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
