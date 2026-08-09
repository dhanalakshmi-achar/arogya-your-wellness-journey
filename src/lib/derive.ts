// import { useApp } from "@/store/app";
// import { healthScore } from "@/lib/health";

// export const todayStr = () => new Date().toISOString().slice(0, 10);
// export const daysAgo = (n: number) => {
//   const d = new Date();
//   d.setDate(d.getDate() - n);
//   return d.toISOString().slice(0, 10);
// };

// export function useToday() {
//   const day = todayStr();
//   return useApp((s) => {
//     const meals = s.meals.filter((m) => m.date === day);
//     const water = s.water.filter((w) => w.date === day).reduce((a, b) => a + b.ml, 0);
//     const workouts = s.workouts.filter((w) => w.date === day && w.completed);
//     const exerciseMin = workouts.reduce((a, b) => a + b.duration, 0);
//     const caloriesOut = workouts.reduce((a, b) => a + b.calories, 0);
//     const sleep = s.sleep.find((x) => x.date === day);
//     const mood = s.moods.filter((m) => m.date === day).slice(-1)[0];
//     const totals = meals.reduce(
//       (acc, m) => ({
//         calories: acc.calories + m.calories,
//         protein: acc.protein + m.protein,
//         carbs: acc.carbs + m.carbs,
//         fat: acc.fat + m.fat,
//       }),
//       { calories: 0, protein: 0, carbs: 0, fat: 0 },
//     );
//     const score = healthScore({
//       water,
//       waterGoal: s.targets.waterMl,
//       sleep: sleep?.hours ?? 0,
//       sleepGoal: s.targets.sleepHours,
//       exercise: exerciseMin,
//       exerciseGoal: s.targets.exerciseMin,
//       calorieRatio: s.targets.calories ? totals.calories / s.targets.calories : 0,
//     });
//     return { meals, water, workouts, exerciseMin, caloriesOut, sleep, mood, totals, score };
//   });
// }

// export function useLastNDays(n: number) {
//   return useApp((s) => {
//     const days: string[] = [];
//     for (let i = n - 1; i >= 0; i--) days.push(daysAgo(i));
//     return days.map((d) => {
//       const cals = s.meals.filter((m) => m.date === d).reduce((a, b) => a + b.calories, 0);
//       const water = s.water.filter((w) => w.date === d).reduce((a, b) => a + b.ml, 0);
//       const sleep = s.sleep.find((x) => x.date === d)?.hours ?? 0;
//       const ex = s.workouts.filter((w) => w.date === d && w.completed).reduce((a, b) => a + b.duration, 0);
//       const mood = s.moods.filter((m) => m.date === d).slice(-1)[0]?.mood ?? 0;
//       return { day: d.slice(5), cals, water: Math.round(water / 100) / 10, sleep, ex, mood };
//     });
//   });
// }

// export function sleepScore(hours: number, quality: number, goal = 8) {
//   const dur = Math.min(1, hours / goal);
//   const q = quality / 5;
//   return Math.round((dur * 0.7 + q * 0.3) * 100);
// }

import { useMemo } from "react";
import { useApp } from "@/store/app";
import { healthScore } from "@/lib/health";

export const todayStr = () => new Date().toISOString().slice(0, 10);

export const daysAgo = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
};

export function useToday() {
  const day = todayStr();

  const meals = useApp((s) => s.meals);
  const waterEntries = useApp((s) => s.water);
  const workouts = useApp((s) => s.workouts);
  const sleepLogs = useApp((s) => s.sleep);
  const moods = useApp((s) => s.moods);
  const targets = useApp((s) => s.targets);

  return useMemo(() => {
    const todayMeals = meals.filter((m) => m.date === day);

    const todayWater = waterEntries
      .filter((w) => w.date === day)
      .reduce((a, b) => a + b.ml, 0);

    const todayWorkouts = workouts.filter(
      (w) => w.date === day && w.completed
    );

    const exerciseMin = todayWorkouts.reduce(
      (a, b) => a + b.duration,
      0
    );

    const caloriesOut = todayWorkouts.reduce(
      (a, b) => a + b.calories,
      0
    );

    const sleep = sleepLogs.find((x) => x.date === day);

    const mood = moods.filter((m) => m.date === day).at(-1);

    const totals = todayMeals.reduce(
      (acc, m) => ({
        calories: acc.calories + m.calories,
        protein: acc.protein + m.protein,
        carbs: acc.carbs + m.carbs,
        fat: acc.fat + m.fat,
      }),
      {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
      }
    );

    const score = healthScore({
      water: todayWater,
      waterGoal: targets.waterMl,
      sleep: sleep?.hours ?? 0,
      sleepGoal: targets.sleepHours,
      exercise: exerciseMin,
      exerciseGoal: targets.exerciseMin,
      calorieRatio:
        targets.calories === 0
          ? 0
          : totals.calories / targets.calories,
    });

    return {
      meals: todayMeals,
      water: todayWater,
      workouts: todayWorkouts,
      exerciseMin,
      caloriesOut,
      sleep,
      mood,
      totals,
      score,
    };
  }, [
    day,
    meals,
    waterEntries,
    workouts,
    sleepLogs,
    moods,
    targets,
  ]);
}

export function useLastNDays(n: number) {
  const meals = useApp((s) => s.meals);
  const waterEntries = useApp((s) => s.water);
  const workouts = useApp((s) => s.workouts);
  const sleepLogs = useApp((s) => s.sleep);
  const moods = useApp((s) => s.moods);

  return useMemo(() => {
    const days: string[] = [];

    for (let i = n - 1; i >= 0; i--) {
      days.push(daysAgo(i));
    }

    return days.map((d) => {
      const cals = meals
        .filter((m) => m.date === d)
        .reduce((a, b) => a + b.calories, 0);

      const water = waterEntries
        .filter((w) => w.date === d)
        .reduce((a, b) => a + b.ml, 0);

      const sleep =
        sleepLogs.find((x) => x.date === d)?.hours ?? 0;

      const ex = workouts
        .filter((w) => w.date === d && w.completed)
        .reduce((a, b) => a + b.duration, 0);

      const mood =
        moods.filter((m) => m.date === d).at(-1)?.mood ?? 0;

      return {
        day: d.slice(5),
        cals,
        water: Math.round(water / 100) / 10,
        sleep,
        ex,
        mood,
      };
    });
  }, [n, meals, waterEntries, workouts, sleepLogs, moods]);
}

export function sleepScore(
  hours: number,
  quality: number,
  goal = 8
) {
  const dur = Math.min(1, hours / goal);
  const q = quality / 5;
  return Math.round((dur * 0.7 + q * 0.3) * 100);
}