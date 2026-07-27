// Pure health/wellness algorithms. No side effects.

export const bmi = (kg: number, cm: number) => +(kg / Math.pow(cm / 100, 2)).toFixed(1);

export const bmiCategory = (value: number) =>
  value < 18.5 ? "Underweight" : value < 25 ? "Healthy" : value < 30 ? "Overweight" : "Obese";

export const bmr = (kg: number, cm: number, age: number, sex: "female" | "male") =>
  Math.round(10 * kg + 6.25 * cm - 5 * age + (sex === "male" ? 5 : -161));

export const tdee = (basal: number, activity: 1.2 | 1.375 | 1.55 | 1.725 | 1.9) =>
  Math.round(basal * activity);

export const waterTargetMl = (kg: number) => Math.round(kg * 33);

export const healthScore = (m: {
  water: number;
  waterGoal: number;
  sleep: number;
  sleepGoal: number;
  exercise: number;
  exerciseGoal: number;
  calorieRatio: number; // 0..1 of daily goal met
}) => {
  const w = Math.min(1, m.water / m.waterGoal) * 25;
  const s = Math.min(1, m.sleep / m.sleepGoal) * 30;
  const e = Math.min(1, m.exercise / m.exerciseGoal) * 25;
  const c = Math.min(1, m.calorieRatio) * 20;
  return Math.round(w + s + e + c);
};

export const xpForLevel = (level: number) => Math.round(80 * Math.pow(level, 1.35));

export const levelFromXp = (xp: number) => {
  let lvl = 1;
  while (xp >= xpForLevel(lvl)) {
    xp -= xpForLevel(lvl);
    lvl += 1;
  }
  return { level: lvl, remainder: xp, next: xpForLevel(lvl) };
};

export const predictNextPeriod = (lastStart: Date, avgCycle = 28) => {
  const next = new Date(lastStart);
  next.setDate(next.getDate() + avgCycle);
  return next;
};

export const cyclePhase = (dayOfCycle: number, cycleLen = 28) => {
  if (dayOfCycle <= 5) return "Menstrual";
  if (dayOfCycle <= Math.round(cycleLen / 2) - 2) return "Follicular";
  if (dayOfCycle <= Math.round(cycleLen / 2) + 2) return "Ovulation";
  return "Luteal";
};

export const greeting = (d = new Date()) => {
  const h = d.getHours();
  if (h < 5) return "Good night";
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};
