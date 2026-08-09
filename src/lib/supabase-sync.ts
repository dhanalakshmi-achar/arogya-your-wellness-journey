/**
 * Supabase ↔ Zustand sync helpers.
 * These are fire-and-forget; local state is always source of truth.
 */

import { supabase } from "@/integrations/supabase/client";
import type { Profile, Targets } from "@/store/app";

// ─── Load profile from Supabase ──────────────────────────────────────────────

export async function loadProfileFromSupabase(
  updateProfile: (p: Partial<Profile>) => void,
  updateTargets: (t: Partial<Targets>) => void,
) {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return;

  const { data, error } = await supabase
    .from("profiles")
    .select("full_name, avatar_url, date_of_birth, height_cm, weight_kg, sex, goal, units")
    .eq("id", user.user.id)
    .single();

  if (error || !data) return;

  updateProfile({
    name: data.full_name ?? undefined,
    dob: data.date_of_birth ?? undefined,
    heightCm: data.height_cm ?? 170,
    weightKg: data.weight_kg ?? 65,
    sex: (data.sex as "female" | "male" | "other") ?? "female",
    goal: data.goal ?? "Feel my best",
    units: (data.units as "metric" | "imperial") ?? "metric",
  });
}

// ─── Sync daily health metrics to Supabase ───────────────────────────────────

export async function syncDailyMetrics(metrics: {
  calories_in: number;
  calories_out: number;
  water_ml: number;
  sleep_minutes: number;
  exercise_minutes: number;
  mood_score?: number | null;
}) {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return;

  const day = new Date().toISOString().slice(0, 10);

  await supabase.from("health_metrics").upsert(
    {
      user_id: user.user.id,
      day,
      ...metrics,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,day" },
  );
}

// ─── Sync XP and streak back to the profiles table ───────────────────────────

export async function syncXpStreak(xp: number, streak: number) {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return;

  await supabase
    .from("profiles")
    .update({ xp, streak, updated_at: new Date().toISOString() })
    .eq("id", user.user.id);
}
