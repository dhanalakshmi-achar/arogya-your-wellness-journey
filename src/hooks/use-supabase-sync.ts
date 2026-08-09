/**
 * Hook that:
 * 1. Loads the Supabase profile into local state once on mount.
 * 2. Debounces and syncs daily health metrics to `health_metrics`.
 * 3. Periodically syncs XP/streak to `profiles`.
 */

import { useEffect, useRef } from "react";
import { useApp } from "@/store/app";
import { loadProfileFromSupabase, syncDailyMetrics, syncXpStreak } from "@/lib/supabase-sync";

export function useSupabaseSync() {
  const updateProfile = useApp((s) => s.updateProfile);
  const updateTargets = useApp((s) => s.updateTargets);
  const meals = useApp((s) => s.meals);
  const water = useApp((s) => s.water);
  const sleep = useApp((s) => s.sleep);
  const workouts = useApp((s) => s.workouts);
  const moods = useApp((s) => s.moods);
  const xp = useApp((s) => s.xp);
  const streaks = useApp((s) => s.streaks);
  const profileLoaded = useRef(false);

  // Load profile once on mount
  useEffect(() => {
    if (profileLoaded.current) return;
    profileLoaded.current = true;
    loadProfileFromSupabase(updateProfile, updateTargets).catch(() => {
      // Silently fail — local state is the fallback
    });
  }, [updateProfile, updateTargets]);

  // Sync XP/streak to Supabase when they change (debounced 5s)
  const xpSyncTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (xpSyncTimer.current) clearTimeout(xpSyncTimer.current);
    xpSyncTimer.current = setTimeout(() => {
      const bestStreak = Math.max(0, ...Object.values(streaks).map((s) => s.current));
      syncXpStreak(xp, bestStreak).catch(() => {});
    }, 5000);
    return () => { if (xpSyncTimer.current) clearTimeout(xpSyncTimer.current); };
  }, [xp, streaks]);

  // Sync daily health metrics (debounced 3s)
  const metricsSyncTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (metricsSyncTimer.current) clearTimeout(metricsSyncTimer.current);
    metricsSyncTimer.current = setTimeout(() => {
      const today = new Date().toISOString().slice(0, 10);
      const todayMeals = meals.filter((m) => m.date === today);
      const todayWater = water.filter((w) => w.date === today).reduce((a, b) => a + b.ml, 0);
      const todaySleep = sleep.find((s) => s.date === today);
      const todayWorkouts = workouts.filter((w) => w.date === today && w.completed);
      const todayMood = moods.filter((m) => m.date === today).slice(-1)[0];

      const calories_in = todayMeals.reduce((a, m) => a + m.calories, 0);
      const calories_out = todayWorkouts.reduce((a, w) => a + w.calories, 0);
      const sleep_minutes = todaySleep ? Math.round(todaySleep.hours * 60) : 0;
      const exercise_minutes = todayWorkouts.reduce((a, w) => a + w.duration, 0);

      syncDailyMetrics({
        calories_in,
        calories_out,
        water_ml: todayWater,
        sleep_minutes,
        exercise_minutes,
        mood_score: todayMood?.mood ?? null,
      }).catch(() => {});
    }, 3000);

    return () => { if (metricsSyncTimer.current) clearTimeout(metricsSyncTimer.current); };
  }, [meals, water, sleep, workouts, moods]);
}
