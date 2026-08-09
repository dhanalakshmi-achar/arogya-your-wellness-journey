import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LogOut, Download, Upload, RotateCcw, Sun, Moon, Monitor, Scale, Plus, Trash2 } from "lucide-react";
import { useApp, type WeightEntry } from "@/store/app";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { bmi, bmiCategory, bmr, tdee } from "@/lib/health";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({ meta: [{ title: "Profile — Arogya" }, { name: "description", content: "Manage your profile and preferences." }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const profile = useApp((s) => s.profile);
  const targets = useApp((s) => s.targets);
  const weightLog = useApp((s) => s.weightLog);
  const addWeight = useApp((s) => s.addWeight);
  const removeWeight = useApp((s) => s.removeWeight);
  const update = useApp((s) => s.updateProfile);
  const updateT = useApp((s) => s.updateTargets);
  const exportAll = useApp((s) => s.exportAll);
  const importAll = useApp((s) => s.importAll);
  const reset = useApp((s) => s.reset);
  const fileRef = useRef<HTMLInputElement>(null);
  const nav = useNavigate();
  const qc = useQueryClient();
  const [newWeight, setNewWeight] = useState<number | "">("");

  const currentBmi = profile.heightCm && profile.weightKg ? bmi(profile.weightKg, profile.heightCm) : null;

  const age = profile.dob
    ? Math.floor((Date.now() - new Date(profile.dob).getTime()) / (365.25 * 86400000))
    : 30;

  const canShowBmrTdee = !!(profile.heightCm && profile.weightKg && profile.sex !== "other");
  const currentBmr = canShowBmrTdee
    ? bmr(profile.weightKg, profile.heightCm, age, profile.sex as "female" | "male")
    : null;
  const currentTdee = currentBmr != null ? tdee(currentBmr, profile.activity) : null;

  const onAvatar = (f: File) => {
    const reader = new FileReader();
    reader.onload = () => update({ avatar: reader.result as string });
    reader.readAsDataURL(f);
  };

  const onImport = (f: File) => {
    const reader = new FileReader();
    reader.onload = () => { const ok = importAll(String(reader.result)); toast[ok ? "success" : "error"](ok ? "Imported" : "Invalid file"); };
    reader.readAsText(f);
  };

  const signOut = async () => {
    await qc.cancelQueries(); qc.clear();
    await supabase.auth.signOut();
    nav({ to: "/auth", replace: true });
  };

  const themeModes = [
    { value: "system", label: "System", icon: Monitor },
    { value: "light",  label: "Light",  icon: Sun },
    { value: "dark",   label: "Dark",   icon: Moon },
  ] as const;

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-6 md:px-8 md:py-10">
      <div className="flex items-center gap-4">
        {profile.avatar ? (
          <img src={profile.avatar} alt="avatar" className="h-16 w-16 rounded-3xl object-cover" />
        ) : (
          <div className="grid h-16 w-16 place-items-center rounded-3xl gradient-hero text-2xl font-bold text-white shadow-glow">
            {profile.name?.[0]?.toUpperCase() ?? "A"}
          </div>
        )}
        <div className="min-w-0">
          <h1 className="truncate font-heading text-2xl font-bold">{profile.name || "Your profile"}</h1>
          <label className="cursor-pointer text-xs text-primary">
            Change avatar
            <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && onAvatar(e.target.files[0])} />
          </label>
        </div>
      </div>

      {/* Personal details */}
      <div className="rounded-3xl border bg-card p-6 shadow-soft">
        <h2 className="font-heading text-lg font-semibold">Personal details</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2"><Label>Name</Label><Input value={profile.name} onChange={(e) => update({ name: e.target.value })} className="mt-1 rounded-2xl" /></div>
          <div><Label>Height (cm)</Label><Input type="number" value={profile.heightCm} onChange={(e) => update({ heightCm: Number(e.target.value) })} className="mt-1 rounded-2xl" /></div>
          <div><Label>Weight (kg)</Label><Input type="number" value={profile.weightKg} onChange={(e) => update({ weightKg: Number(e.target.value) })} className="mt-1 rounded-2xl" /></div>
          <div>
            <Label>Sex</Label>
            <select value={profile.sex} onChange={(e) => update({ sex: e.target.value as any })} className="mt-1 w-full rounded-2xl border bg-background px-3 py-2 text-sm">
              <option value="female">Female</option><option value="male">Male</option><option value="other">Other</option>
            </select>
          </div>
          <div>
            <Label>Date of birth</Label>
            <Input type="date" value={profile.dob ?? ""} onChange={(e) => update({ dob: e.target.value || undefined })} className="mt-1 rounded-2xl" />
          </div>
          <div>
            <Label>Activity level</Label>
            <select value={profile.activity} onChange={(e) => update({ activity: Number(e.target.value) as any })} className="mt-1 w-full rounded-2xl border bg-background px-3 py-2 text-sm">
              <option value="1.2">Sedentary</option>
              <option value="1.375">Lightly active</option>
              <option value="1.55">Moderately active</option>
              <option value="1.725">Very active</option>
              <option value="1.9">Extra active</option>
            </select>
          </div>
          <div><Label>Goal</Label><Input value={profile.goal} onChange={(e) => update({ goal: e.target.value })} className="mt-1 rounded-2xl" /></div>
        </div>

        {currentBmi && (
          <div className="mt-4 rounded-2xl bg-muted p-3 text-sm">
            BMI: <span className="tabular font-semibold">{currentBmi}</span> · <span className="text-primary">{bmiCategory(currentBmi)}</span>
          </div>
        )}

        {currentBmr != null && currentTdee != null && (
          <div className="mt-2 grid grid-cols-2 gap-2">
            <div className="rounded-2xl bg-muted p-3 text-sm">
              <span className="text-muted-foreground">BMR</span>
              <p className="mt-0.5 font-semibold tabular-nums">{currentBmr} <span className="font-normal text-muted-foreground">kcal/day</span></p>
            </div>
            <div className="rounded-2xl bg-muted p-3 text-sm">
              <span className="text-muted-foreground">TDEE</span>
              <p className="mt-0.5 font-semibold tabular-nums text-primary">{currentTdee} <span className="font-normal text-muted-foreground">kcal/day</span></p>
            </div>
          </div>
        )}
      </div>

      {/* Daily targets */}
      <div className="rounded-3xl border bg-card p-6 shadow-soft">
        <h2 className="font-heading text-lg font-semibold">Daily targets</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {([
            ["Calories", "calories"], ["Protein g", "protein"], ["Water ml", "waterMl"], ["Sleep h", "sleepHours"], ["Exercise min", "exerciseMin"], ["Steps", "steps"],
          ] as const).map(([l, k]) => (
            <div key={k}>
              <Label className="text-xs">{l}</Label>
              <Input type="number" value={(targets as any)[k]} onChange={(e) => updateT({ [k]: Number(e.target.value) } as any)} className="mt-1 rounded-2xl" />
            </div>
          ))}
        </div>
      </div>

      {/* Appearance */}
      <div className="rounded-3xl border bg-card p-6 shadow-soft">
        <h2 className="font-heading text-lg font-semibold">Appearance</h2>
        <p className="mt-1 text-sm text-muted-foreground">Choose how Arogya looks on this device.</p>
        <div className="mt-4 flex gap-2">
          {themeModes.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => update({ themeMode: value })}
              className={[
                "flex flex-1 items-center justify-center gap-2 rounded-2xl border px-3 py-2.5 text-sm font-medium transition-colors",
                profile.themeMode === value
                  ? "border-primary bg-primary/10 text-primary"
                  : "bg-background text-muted-foreground hover:bg-muted",
              ].join(" ")}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Reminders */}
      <div className="rounded-3xl border bg-card p-6 shadow-soft">
        <h2 className="font-heading text-lg font-semibold">Reminders</h2>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {(["nutrition", "water", "workout", "sleep", "meditation"] as const).map((k) => (
            <div key={k}>
              <Label className="text-xs capitalize">{k}</Label>
              <Input type="time" value={profile.reminders[k]} onChange={(e) => update({ reminders: { ...profile.reminders, [k]: e.target.value } })} className="mt-1 rounded-2xl" />
            </div>
          ))}
        </div>
      </div>

      {/* Data */}
      <div className="rounded-3xl border bg-card p-6 shadow-soft">
        <h2 className="font-heading text-lg font-semibold">Data</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => { const blob = new Blob([exportAll()], { type: "application/json" }); const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "arogya-backup.json"; a.click(); }} className="rounded-2xl"><Download className="mr-1 h-4 w-4" /> Export</Button>
          <Button variant="outline" onClick={() => fileRef.current?.click()} className="rounded-2xl"><Upload className="mr-1 h-4 w-4" /> Import</Button>
          <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={(e) => e.target.files?.[0] && onImport(e.target.files[0])} />
          <Button variant="outline" onClick={() => { if (confirm("Reset all local data?")) { reset(); toast.success("Reset"); } }} className="rounded-2xl text-destructive"><RotateCcw className="mr-1 h-4 w-4" /> Reset</Button>
        </div>
      </div>

      {/* Weight history */}
      <div className="rounded-3xl border bg-card p-6 shadow-soft">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-primary" />
            <h2 className="font-heading text-lg font-semibold">Weight history</h2>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!newWeight) return;
              addWeight({ date: new Date().toISOString().slice(0, 10), weightKg: Number(newWeight), at: Date.now() });
              update({ weightKg: Number(newWeight) });
              toast.success(`Weight logged: ${newWeight}kg`);
              setNewWeight("");
            }}
            className="flex items-center gap-2"
          >
            <Input
              type="number"
              placeholder="kg"
              step="0.1"
              value={newWeight}
              onChange={(e) => setNewWeight(e.target.value ? Number(e.target.value) : "")}
              className="w-20 rounded-2xl"
            />
            <Button type="submit" size="sm" className="rounded-2xl"><Plus className="h-4 w-4" /></Button>
          </form>
        </div>
        {weightLog.length > 1 && (
          <div className="mt-4 h-32">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weightLog.slice(-30).map((w) => ({ day: w.date.slice(5), kg: w.weightKg }))}>
                <XAxis dataKey="day" tick={{ fontSize: 9 }} />
                <YAxis domain={["auto", "auto"]} hide />
                <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                <Line dataKey="kg" stroke="var(--color-primary)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
        {weightLog.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">Log your weight above to track changes over time.</p>
        ) : (
          <ul className="mt-3 space-y-1 max-h-36 overflow-y-auto">
            {weightLog.slice().reverse().slice(0, 10).map((w) => (
              <li key={w.id} className="group flex items-center justify-between rounded-xl border bg-background px-3 py-1.5 text-sm">
                <span>{w.date}</span>
                <span className="flex items-center gap-3">
                  <span className="tabular font-semibold">{w.weightKg} kg</span>
                  <button onClick={() => removeWeight(w.id)} className="opacity-0 group-hover:opacity-100" aria-label="Delete">
                    <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                  </button>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button onClick={signOut} className="flex w-full items-center justify-center gap-2 rounded-2xl border bg-card px-4 py-3 text-sm font-semibold text-destructive hover:bg-destructive/10">
        <LogOut className="h-4 w-4" /> Sign out
      </button>
    </div>
  );
}
