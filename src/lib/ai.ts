// import type { useApp as _useApp } from "@/store/app";

// type Store = ReturnType<typeof import("@/store/app").useApp.getState>;

// export function coachReply(text: string, s: Store): string {
//   const t = text.toLowerCase().trim();
//   const name = s.profile.name || "friend";
//   const day = new Date().toISOString().slice(0, 10);
//   const mealsToday = s.meals.filter((m) => m.date === day);
//   const water = s.water.filter((w) => w.date === day).reduce((a, b) => a + b.ml, 0);
//   const sleep = s.sleep.find((x) => x.date === day);
//   const workouts = s.workouts.filter((w) => w.date === day && w.completed);
//   const mood = s.moods.filter((m) => m.date === day).slice(-1)[0];

//   if (/summar(y|ize)|week|report/.test(t)) {
//     const last7Meals = s.meals.filter((m) => m.date >= daysAgo(6));
//     const avgCals = last7Meals.length ? Math.round(last7Meals.reduce((a, b) => a + b.calories, 0) / 7) : 0;
//     const avgSleep = avg(s.sleep.slice(-7).map((x) => x.hours));
//     const wCount = s.workouts.filter((w) => w.completed && w.date >= daysAgo(6)).length;
//     return `Here's your last 7 days, ${name}:
// • Nutrition: ~${avgCals} kcal/day avg (${last7Meals.length} meals logged).
// • Sleep: ${avgSleep.toFixed(1)} h avg.
// • Workouts: ${wCount} completed.
// • XP earned lifetime: ${s.xp}.
// Focus this week: ${wCount < 3 ? "add one more workout" : avgSleep < 7 ? "aim for +30 min sleep" : "keep the streak going!"}`;
//   }
//   if (/tired|energy|sleep/.test(t)) {
//     if (sleep && sleep.hours < 7) return `You slept ${sleep.hours}h last night — under your ${s.targets.sleepHours}h goal. Try a 10-min walk in daylight and skip caffeine after 2pm.`;
//     return `Energy dips often trace back to hydration and sleep. You're at ${water}ml water today (goal ${s.targets.waterMl}ml). Sip 300ml now and take 5 slow breaths.`;
//   }
//   if (/water|hydrat/.test(t)) {
//     return `You're at ${water} of ${s.targets.waterMl} ml today. ${water < s.targets.waterMl ? "Grab a glass — small sips, often." : "Nailed your hydration goal 💧"}`;
//   }
//   if (/meal|eat|food|calor/.test(t)) {
//     const kcal = mealsToday.reduce((a, b) => a + b.calories, 0);
//     return `You've logged ${mealsToday.length} meals for ${kcal} kcal (goal ${s.targets.calories}). ${kcal < s.targets.calories * 0.5 && new Date().getHours() > 14 ? "You're behind on fuel — a balanced snack helps focus." : "Nice steady pace."}`;
//   }
//   if (/mood|stress|anxiou|calm/.test(t)) {
//     if (mood && mood.mood <= 2) return `Sorry today feels heavy. Try 4-7-8 breathing (inhale 4, hold 7, exhale 8) for 3 rounds — I can open the breathing exercise for you.`;
//     return `Journaling a single line about what went well today boosts mood measurably. Want a prompt? "One small thing I appreciated today was…"`;
//   }
//   if (/workout|exercise|train|fitness/.test(t)) {
//     if (workouts.length === 0) return `No workout logged yet. A 20-min brisk walk counts — start a session from the Fitness tab.`;
//     return `${workouts.length} workout${workouts.length === 1 ? "" : "s"} done today · ${workouts.reduce((a, b) => a + b.calories, 0)} kcal out. Great work.`;
//   }
//   if (/cycle|period|menstru|women/.test(t)) {
//     const last = s.cycles.slice(-1)[0];
//     if (!last) return `Log your last period start in Women's Health and I can predict your next one.`;
//     const next = new Date(last.startDate);
//     next.setDate(next.getDate() + s.profile.cycleLenDays);
//     return `Based on your last cycle (${last.startDate}), next period is around ${next.toISOString().slice(0, 10)}.`;
//   }
//   if (/hello|hi|hey/.test(t)) return `Hey ${name}! How can I support you right now?`;
//   if (/thank/.test(t)) return `Anytime 💜`;

//   return `I hear you. Based on today: ${mealsToday.length} meals, ${water}ml water, ${sleep ? sleep.hours + "h sleep" : "no sleep logged"}, ${workouts.length} workout${workouts.length === 1 ? "" : "s"}. What would you like to focus on — nutrition, movement, sleep, or mind?`;
// }

// const daysAgo = (n: number) => {
//   const d = new Date();
//   d.setDate(d.getDate() - n);
//   return d.toISOString().slice(0, 10);
// };
// const avg = (a: number[]) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0);
// export type _Unused = typeof _useApp;


import type { useApp as _useApp } from "@/store/app";
import { createServerFn } from "@tanstack/react-start";
import Groq from "groq-sdk";

type Store = ReturnType<typeof import("@/store/app").useApp.getState>;

// ─── SERVER FUNCTION (runs only on server, API key never leaks) ───
const getGroqReply = createServerFn({ method: "POST" }).handler(
  async ({
    data,
  }: {
    data: {
      message: string;
      context: string;
      history: Array<{ role: "user" | "ai"; text: string }>;
    };
  }) => {
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const { message, context, history } = data;

    const systemPrompt = `You are **Arogya AI Coach** — a warm, knowledgeable, and encouraging wellness companion inside the Arogya app.

Personality:
- Speak like a supportive friend, not a robot
- Use encouraging, positive language
- Ask follow-up questions to understand better
- Keep responses concise (2-4 short paragraphs)
- Use emojis sparingly for warmth

Expertise:
- Nutrition, fitness, sleep, mental wellness, mindfulness, habit building, women's health

Rules:
- NEVER diagnose medical conditions
- ALWAYS suggest consulting a doctor for serious concerns
- Use the user's real data below to personalize every response
- If behind on goals, gently nudge; if doing well, celebrate

${context}`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...history.map((m) => ({
        role: m.role === "ai" ? "assistant" : "user",
        content: m.text,
      })),
      { role: "user", content: message },
    ];

    const completion = await groq.chat.completions.create({
      messages,
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 1024,
    });

    return (
      completion.choices[0]?.message?.content ||
      "I apologize, I could not process that. Please try again."
    );
  }
);

// ─── CLIENT FUNCTION (called from your React component) ───
export async function coachReply(
  text: string,
  s: Store,
  history: Array<{ role: "user" | "ai"; text: string }>
): Promise<string> {
  const t = text.toLowerCase().trim();

  // Quick offline responses (no API call needed)
  if (/hello|hi|hey/.test(t))
    return `Hey ${s.profile.name || "friend"}! How can I support you right now?`;
  if (/thank/.test(t)) return `Anytime 💜`;

  // Build rich wellness context from store
  const context = buildContext(s);

  try {
    const reply = await getGroqReply({
      data: {
        message: text,
        context,
        history: history.slice(-10),
      },
    });
    return reply;
  } catch (err) {
    console.error("Groq error:", err);
    return coachReplyFallback(text, s);
  }
}

function buildContext(s: Store): string {
  const name = s.profile.name || "friend";
  const day = new Date().toISOString().slice(0, 10);
  const mealsToday = s.meals.filter((m) => m.date === day);
  const water = s.water
    .filter((w) => w.date === day)
    .reduce((a, b) => a + b.ml, 0);
  const sleep = s.sleep.find((x) => x.date === day);
  const workouts = s.workouts.filter((w) => w.date === day && w.completed);
  const mood = s.moods.filter((m) => m.date === day).slice(-1)[0];
  const last7Meals = s.meals.filter((m) => m.date >= daysAgo(6));
  const avgCals = last7Meals.length
    ? Math.round(last7Meals.reduce((a, b) => a + b.calories, 0) / 7)
    : 0;
  const avgSleep = avg(s.sleep.slice(-7).map((x) => x.hours));
  const wCount = s.workouts.filter(
    (w) => w.completed && w.date >= daysAgo(6)
  ).length;
  const lastCycle = s.cycles.slice(-1)[0];

  return `
User: ${name}
Age: ${s.profile.age || "Not set"}
Goals: ${s.profile.goals?.join(", ") || "Not set"}
Diet: ${s.profile.dietaryPreference || "Not set"}
Activity: ${s.profile.activityLevel || "Not set"}
Cycle Length: ${s.profile.cycleLenDays || "Not set"} days

TODAY (${day}):
- Meals: ${mealsToday.length} logged, ${mealsToday.reduce((a, b) => a + b.calories, 0)} kcal (goal ${s.targets.calories})
- Water: ${water}ml / ${s.targets.waterMl}ml
- Sleep: ${sleep ? sleep.hours + "h" : "Not logged"} / ${s.targets.sleepHours}h goal
- Workouts: ${workouts.length} completed
- Mood: ${mood ? mood.mood + "/5" : "Not logged"}

LAST 7 DAYS:
- Avg calories: ~${avgCals} kcal/day
- Avg sleep: ${avgSleep.toFixed(1)}h
- Workouts: ${wCount}
- Lifetime XP: ${s.xp}

LAST CYCLE: ${lastCycle ? `started ${lastCycle.startDate}` : "Not logged"}
`;
}

// ─── FALLBACK: your original rule-based logic ───
function coachReplyFallback(text: string, s: Store): string {
  const t = text.toLowerCase().trim();
  const name = s.profile.name || "friend";
  const day = new Date().toISOString().slice(0, 10);
  const mealsToday = s.meals.filter((m) => m.date === day);
  const water = s.water
    .filter((w) => w.date === day)
    .reduce((a, b) => a + b.ml, 0);
  const sleep = s.sleep.find((x) => x.date === day);
  const workouts = s.workouts.filter((w) => w.date === day && w.completed);
  const mood = s.moods.filter((m) => m.date === day).slice(-1)[0];

  if (/summar(y|ize)|week|report/.test(t)) {
    const last7Meals = s.meals.filter((m) => m.date >= daysAgo(6));
    const avgCals = last7Meals.length
      ? Math.round(last7Meals.reduce((a, b) => a + b.calories, 0) / 7)
      : 0;
    const avgSleep = avg(s.sleep.slice(-7).map((x) => x.hours));
    const wCount = s.workouts.filter(
      (w) => w.completed && w.date >= daysAgo(6)
    ).length;
    return `Here's your last 7 days, ${name}:
• Nutrition: ~${avgCals} kcal/day avg (${last7Meals.length} meals logged).
• Sleep: ${avgSleep.toFixed(1)} h avg.
• Workouts: ${wCount} completed.
• XP earned lifetime: ${s.xp}.
Focus this week: ${wCount < 3 ? "add one more workout" : avgSleep < 7 ? "aim for +30 min sleep" : "keep the streak going!"}`;
  }
  if (/tired|energy|sleep/.test(t)) {
    if (sleep && sleep.hours < 7)
      return `You slept ${sleep.hours}h last night — under your ${s.targets.sleepHours}h goal. Try a 10-min walk in daylight and skip caffeine after 2pm.`;
    return `Energy dips often trace back to hydration and sleep. You're at ${water}ml water today (goal ${s.targets.waterMl}ml). Sip 300ml now and take 5 slow breaths.`;
  }
  if (/water|hydrat/.test(t)) {
    return `You're at ${water} of ${s.targets.waterMl} ml today. ${water < s.targets.waterMl ? "Grab a glass — small sips, often." : "Nailed your hydration goal 💧"}`;
  }
  if (/meal|eat|food|calor/.test(t)) {
    const kcal = mealsToday.reduce((a, b) => a + b.calories, 0);
    return `You've logged ${mealsToday.length} meals for ${kcal} kcal (goal ${s.targets.calories}). ${kcal < s.targets.calories * 0.5 && new Date().getHours() > 14 ? "You're behind on fuel — a balanced snack helps focus." : "Nice steady pace."}`;
  }
  if (/mood|stress|anxiou|calm/.test(t)) {
    if (mood && mood.mood <= 2)
      return `Sorry today feels heavy. Try 4-7-8 breathing (inhale 4, hold 7, exhale 8) for 3 rounds — I can open the breathing exercise for you.`;
    return `Journaling a single line about what went well today boosts mood measurably. Want a prompt? "One small thing I appreciated today was…"`;
  }
  if (/workout|exercise|train|fitness/.test(t)) {
    if (workouts.length === 0)
      return `No workout logged yet. A 20-min brisk walk counts — start a session from the Fitness tab.`;
    return `${workouts.length} workout${workouts.length === 1 ? "" : "s"} done today · ${workouts.reduce((a, b) => a + b.calories, 0)} kcal out. Great work.`;
  }
  if (/cycle|period|menstru|women/.test(t)) {
    const last = s.cycles.slice(-1)[0];
    if (!last)
      return `Log your last period start in Women's Health and I can predict your next one.`;
    const next = new Date(last.startDate);
    next.setDate(next.getDate() + s.profile.cycleLenDays);
    return `Based on your last cycle (${last.startDate}), next period is around ${next.toISOString().slice(0, 10)}.`;
  }

  return `I hear you. Based on today: ${mealsToday.length} meals, ${water}ml water, ${sleep ? sleep.hours + "h sleep" : "no sleep logged"}, ${workouts.length} workout${workouts.length === 1 ? "" : "s"}. What would you like to focus on — nutrition, movement, sleep, or mind?`;
}

const daysAgo = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
};
const avg = (a: number[]) =>
  a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0;
export type _Unused = typeof _useApp;