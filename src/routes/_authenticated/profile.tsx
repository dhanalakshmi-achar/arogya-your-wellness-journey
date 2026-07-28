import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LogOut, Download, Upload, RotateCcw } from "lucide-react";
import { useApp } from "@/store/app";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { bmi, bmiCategory } from "@/lib/health";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({ meta: [{ title: "Profile — Arogya" }, { name: "description", content: "Manage your profile and preferences." }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const profile = useApp((s) => s.profile);
  const targets = useApp((s) => s.targets);
  const update = useApp((s) => s.updateProfile);
  const updateT = useApp((s) => s.updateTargets);
  const exportAll = useApp((s) => s.exportAll);
  const importAll = useApp((s) => s.importAll);
  const reset = useApp((s) => s.reset);
  const fileRef = useRef<HTMLInputElement>(null);
  const nav = useNavigate();
  const qc = useQueryClient();

  const currentBmi = profile.heightCm && profile.weightKg ? bmi(profile.weightKg, profile.heightCm) : null;

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
          <div><Label>Goal</Label><Input value={profile.goal} onChange={(e) => update({ goal: e.target.value })} className="mt-1 rounded-2xl" /></div>
        </div>
        {currentBmi && (
          <div className="mt-4 rounded-2xl bg-muted p-3 text-sm">
            BMI: <span className="tabular font-semibold">{currentBmi}</span> · <span className="text-primary">{bmiCategory(currentBmi)}</span>
          </div>
        )}
      </div>

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

      <div className="rounded-3xl border bg-card p-6 shadow-soft">
        <h2 className="font-heading text-lg font-semibold">Data</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => { const blob = new Blob([exportAll()], { type: "application/json" }); const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "arogya-backup.json"; a.click(); }} className="rounded-2xl"><Download className="mr-1 h-4 w-4" /> Export</Button>
          <Button variant="outline" onClick={() => fileRef.current?.click()} className="rounded-2xl"><Upload className="mr-1 h-4 w-4" /> Import</Button>
          <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={(e) => e.target.files?.[0] && onImport(e.target.files[0])} />
          <Button variant="outline" onClick={() => { if (confirm("Reset all local data?")) { reset(); toast.success("Reset"); } }} className="rounded-2xl text-destructive"><RotateCcw className="mr-1 h-4 w-4" /> Reset</Button>
        </div>
      </div>

      <button onClick={signOut} className="flex w-full items-center justify-center gap-2 rounded-2xl border bg-card px-4 py-3 text-sm font-semibold text-destructive hover:bg-destructive/10">
        <LogOut className="h-4 w-4" /> Sign out
      </button>
    </div>
  );
}
