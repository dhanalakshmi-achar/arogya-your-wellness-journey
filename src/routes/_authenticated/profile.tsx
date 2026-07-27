import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { LogOut, User as UserIcon } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { bmi, bmiCategory } from "@/lib/health";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({ meta: [{ title: "Profile — Arogya" }, { name: "description", content: "Manage your profile and preferences." }] }),
  component: Profile,
});

function Profile() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [height, setHeight] = useState<number | "">("");
  const [weight, setWeight] = useState<number | "">("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      setEmail(u.user.email ?? "");
      const { data: p } = await supabase.from("profiles").select("*").eq("id", u.user.id).maybeSingle();
      if (p) {
        setName((p.full_name as string) ?? "");
        setHeight((p.height_cm as number) ?? "");
        setWeight((p.weight_kg as number) ?? "");
      }
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      const { error } = await supabase.from("profiles").update({
        full_name: name,
        height_cm: height || null,
        weight_kg: weight || null,
      }).eq("id", u.user.id);
      if (error) throw error;
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save");
    } finally {
      setSaving(false);
    }
  };

  const signOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  const currentBmi = typeof height === "number" && typeof weight === "number" && height && weight ? bmi(weight, height) : null;

  return (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-6 md:px-8 md:py-10">
      <div className="flex items-center gap-4">
        <div className="grid h-16 w-16 place-items-center rounded-3xl gradient-hero text-2xl font-bold text-white shadow-glow">
          {(name || email)[0]?.toUpperCase() ?? <UserIcon className="h-6 w-6" />}
        </div>
        <div className="min-w-0">
          <h1 className="truncate font-heading text-2xl font-bold">{name || "Your profile"}</h1>
          <p className="truncate text-sm text-muted-foreground">{email}</p>
        </div>
      </div>

      <div className="rounded-3xl border bg-card p-6 shadow-soft">
        <h2 className="font-heading text-lg font-semibold">Personal details</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="n">Name</Label>
            <Input id="n" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 rounded-2xl" />
          </div>
          <div>
            <Label htmlFor="h">Height (cm)</Label>
            <Input id="h" type="number" value={height} onChange={(e) => setHeight(e.target.value ? Number(e.target.value) : "")} className="mt-1 rounded-2xl" />
          </div>
          <div>
            <Label htmlFor="w">Weight (kg)</Label>
            <Input id="w" type="number" value={weight} onChange={(e) => setWeight(e.target.value ? Number(e.target.value) : "")} className="mt-1 rounded-2xl" />
          </div>
        </div>
        {currentBmi && (
          <div className="mt-4 rounded-2xl bg-muted p-3 text-sm">
            <span className="text-muted-foreground">Your BMI:</span> <span className="tabular font-semibold">{currentBmi}</span> · <span className="text-primary">{bmiCategory(currentBmi)}</span>
          </div>
        )}
        <Button onClick={save} disabled={saving} className="mt-5 rounded-2xl shadow-glow">Save changes</Button>
      </div>

      <button onClick={signOut} className="flex w-full items-center justify-center gap-2 rounded-2xl border bg-card px-4 py-3 text-sm font-semibold text-destructive hover:bg-destructive/10">
        <LogOut className="h-4 w-4" /> Sign out
      </button>
    </div>
  );
}
