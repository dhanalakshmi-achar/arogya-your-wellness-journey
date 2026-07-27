import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Sparkles } from "lucide-react";

export const Route = createFileRoute("/_authenticated/onboarding")({
  head: () => ({ meta: [{ title: "Welcome to Arogya — Set up your profile" }] }),
  component: Onboarding,
});

type Sex = "female" | "male" | "other";

function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [sex, setSex] = useState<Sex>("female");
  const [dob, setDob] = useState("");
  const [heightCm, setHeightCm] = useState<number | "">(170);
  const [weightKg, setWeightKg] = useState<number | "">(65);
  const [goal, setGoal] = useState("Feel my best");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const meta = data.user?.user_metadata;
      if (meta?.full_name && !name) setName(meta.full_name);
    });
  }, [name]);

  const next = () => setStep((s) => Math.min(3, s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));

  const finish = async () => {
    setLoading(true);
    try {
      const { data: userRes } = await supabase.auth.getUser();
      if (!userRes.user) throw new Error("Not signed in");
      const { error } = await supabase.from("profiles").upsert({
        id: userRes.user.id,
        full_name: name,
        sex,
        date_of_birth: dob || null,
        height_cm: heightCm || null,
        weight_kg: weightKg || null,
        goal,
        onboarded: true,
      });
      if (error) throw error;
      toast.success("You're all set!");
      navigate({ to: "/dashboard" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg px-5 py-10">
      <div className="mb-6 flex items-center gap-2 text-primary">
        <Sparkles className="h-4 w-4" />
        <span className="text-xs font-semibold uppercase tracking-widest">Step {step + 1} of 4</span>
      </div>
      <div className="mb-6 h-2 overflow-hidden rounded-full bg-muted">
        <motion.div className="h-full rounded-full gradient-hero" initial={{ width: 0 }} animate={{ width: `${((step + 1) / 4) * 100}%` }} />
      </div>

      <motion.div key={step} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="rounded-3xl border bg-card p-6 shadow-soft">
        {step === 0 && (
          <>
            <h1 className="font-heading text-2xl font-bold">What should we call you?</h1>
            <p className="mt-1 text-sm text-muted-foreground">We'll keep it friendly.</p>
            <Label htmlFor="n" className="mt-5 block">Name</Label>
            <Input id="n" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 rounded-2xl" />
          </>
        )}
        {step === 1 && (
          <>
            <h1 className="font-heading text-2xl font-bold">Tell us about you</h1>
            <p className="mt-1 text-sm text-muted-foreground">This tailors your dashboard.</p>
            <div className="mt-5 grid gap-4">
              <div>
                <Label>I identify as</Label>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {(["female", "male", "other"] as Sex[]).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSex(s)}
                      className={`rounded-2xl border px-3 py-2 text-sm capitalize transition-colors ${sex === s ? "border-primary bg-primary/10 text-primary" : "text-muted-foreground"}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="dob">Date of birth</Label>
                <Input id="dob" type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="mt-1 rounded-2xl" />
              </div>
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <h1 className="font-heading text-2xl font-bold">Your body basics</h1>
            <p className="mt-1 text-sm text-muted-foreground">Used to personalise targets.</p>
            <div className="mt-5 grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="h">Height (cm)</Label>
                <Input id="h" type="number" value={heightCm} onChange={(e) => setHeightCm(e.target.value ? Number(e.target.value) : "")} className="mt-1 rounded-2xl" />
              </div>
              <div>
                <Label htmlFor="w">Weight (kg)</Label>
                <Input id="w" type="number" value={weightKg} onChange={(e) => setWeightKg(e.target.value ? Number(e.target.value) : "")} className="mt-1 rounded-2xl" />
              </div>
            </div>
          </>
        )}
        {step === 3 && (
          <>
            <h1 className="font-heading text-2xl font-bold">What's your main goal?</h1>
            <div className="mt-5 grid gap-2">
              {["Feel my best", "Lose weight", "Build strength", "Sleep better", "Manage stress"].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGoal(g)}
                  className={`rounded-2xl border px-4 py-3 text-left text-sm transition-colors ${goal === g ? "border-primary bg-primary/10 text-primary" : "text-muted-foreground"}`}
                >
                  {g}
                </button>
              ))}
            </div>
          </>
        )}

        <div className="mt-7 flex justify-between">
          <Button variant="ghost" onClick={back} disabled={step === 0}>Back</Button>
          {step < 3 ? (
            <Button onClick={next} className="rounded-2xl">Continue <ArrowRight className="ml-1 h-4 w-4" /></Button>
          ) : (
            <Button onClick={finish} disabled={loading} className="rounded-2xl shadow-glow">Finish</Button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
