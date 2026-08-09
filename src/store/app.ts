import { create } from "zustand";
import { persist } from "zustand/middleware";

// ============================================================
// Types
// ============================================================
export type Meal = {
  id: string;
  date: string; // yyyy-mm-dd
  time: string; // HH:mm
  name: string;
  type: "breakfast" | "lunch" | "dinner" | "snack";
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export type WaterEntry = { id: string; date: string; ml: number; at: number };

export type Exercise = {
  id: string;
  name: string;
  sets: number;
  reps: number;
  duration?: number; // minutes
  done?: boolean;
};

export type Workout = {
  id: string;
  date: string;
  name: string;
  category: "Strength" | "Cardio" | "Mobility" | "Yoga" | "HIIT";
  exercises: Exercise[];
  duration: number; // minutes
  calories: number;
  completed: boolean;
};

export type SleepLog = {
  id: string;
  date: string; // date of wake
  bedtime: string; // HH:mm
  waketime: string;
  hours: number;
  quality: 1 | 2 | 3 | 4 | 5;
  interruptions: number;
  notes?: string;
};

export type MoodLog = {
  id: string;
  date: string;
  at: number;
  mood: 1 | 2 | 3 | 4 | 5; // 1 low, 5 great
  emoji: string;
  tags: string[];
  note?: string;
};

export type JournalEntry = {
  id: string;
  date: string;
  at: number;
  title: string;
  body: string;
  tags: string[];
};

export type MeditationSession = {
  id: string;
  date: string;
  minutes: number;
  kind: "Breathing" | "Meditation";
};

export type CycleLog = {
  id: string;
  startDate: string;
  endDate?: string;
  flow: "light" | "medium" | "heavy";
  symptoms: string[];
  mood?: 1 | 2 | 3 | 4 | 5;
  notes?: string;
};

export type ChecklistItem = {
  id: string;
  date: string;
  title: string;
  done: boolean;
};

export type ChatMessage = { id: string; role: "user" | "ai"; text: string; at: number };

export type Notification = {
  id: string;
  at: number;
  title: string;
  body: string;
  read: boolean;
  kind: "info" | "success" | "warning" | "reminder";
};

export type Badge = {
  id: string;
  name: string;
  desc: string;
  icon: string; // emoji
  unlockedAt?: number;
};

export type StepEntry = { id: string; date: string; steps: number; at: number };
export type WeightEntry = { id: string; date: string; weightKg: number; at: number };

export type Profile = {
  name: string;
  email?: string;
  avatar?: string; // data url
  sex: "female" | "male" | "other";
  dob?: string;
  heightCm: number;
  weightKg: number;
  goal: string;
  activity: 1.2 | 1.375 | 1.55 | 1.725 | 1.9;
  units: "metric" | "imperial";
  themeMode: "system" | "light" | "dark";
  cycleLenDays: number;
  periodLenDays: number;
  reminders: { nutrition: string; water: string; workout: string; sleep: string; meditation: string };
};

export type Targets = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  waterMl: number;
  sleepHours: number;
  exerciseMin: number;
  steps: number;
};

// ============================================================
// Store
// ============================================================
type AppState = {
  hydrated: boolean;
  profile: Profile;
  targets: Targets;
  meals: Meal[];
  water: WaterEntry[];
  workouts: Workout[];
  workoutTemplates: Workout[];
  sleep: SleepLog[];
  moods: MoodLog[];
  journal: JournalEntry[];
  meditations: MeditationSession[];
  cycles: CycleLog[];
  cycleSymptomsToday: { date: string; symptoms: string[] };
  checklist: ChecklistItem[];
  chat: ChatMessage[];
  notifications: Notification[];
  badges: Badge[];
  xp: number;
  streaks: Record<string, { current: number; longest: number; lastDate: string }>;
  stepLog: StepEntry[];
  weightLog: WeightEntry[];
  // actions
  setHydrated: (b: boolean) => void;
  updateProfile: (p: Partial<Profile>) => void;
  updateTargets: (t: Partial<Targets>) => void;
  addMeal: (m: Omit<Meal, "id">) => void;
  updateMeal: (id: string, patch: Partial<Meal>) => void;
  removeMeal: (id: string) => void;
  addWater: (ml: number) => void;
  removeWater: (id: string) => void;
  addWorkout: (w: Omit<Workout, "id">) => string;
  updateWorkout: (id: string, patch: Partial<Workout>) => void;
  removeWorkout: (id: string) => void;
  toggleExercise: (workoutId: string, exId: string) => void;
  completeWorkout: (id: string) => void;
  saveTemplate: (w: Omit<Workout, "id">) => void;
  removeTemplate: (id: string) => void;
  addSleep: (s: Omit<SleepLog, "id">) => void;
  removeSleep: (id: string) => void;
  addMood: (m: Omit<MoodLog, "id">) => void;
  addJournal: (j: Omit<JournalEntry, "id">) => void;
  updateJournal: (id: string, patch: Partial<JournalEntry>) => void;
  removeJournal: (id: string) => void;
  addMeditation: (m: Omit<MeditationSession, "id">) => void;
  addCycle: (c: Omit<CycleLog, "id">) => void;
  updateCycle: (id: string, patch: Partial<CycleLog>) => void;
  removeCycle: (id: string) => void;
  toggleCycleSymptomToday: (s: string) => void;
  addChecklistItem: (title: string) => void;
  toggleChecklistItem: (id: string) => void;
  removeChecklistItem: (id: string) => void;
  seedChecklistIfEmpty: () => void;
  addChat: (m: Omit<ChatMessage, "id">) => void;
  clearChat: () => void;
  pushNotification: (n: Omit<Notification, "id" | "at" | "read">) => void;
  markNotificationRead: (id: string) => void;
  markAllRead: () => void;
  addXp: (amount: number, reason?: string) => void;
  bumpStreak: (key: string) => void;
  addSteps: (date: string, steps: number) => void;
  removeSteps: (id: string) => void;
  addWeight: (w: Omit<WeightEntry, "id">) => void;
  removeWeight: (id: string) => void;
  unlockBadge: (id: string, name: string, desc: string, icon: string) => void;
  reset: () => void;
  exportAll: () => string;
  importAll: (json: string) => boolean;
};

const today = () => new Date().toISOString().slice(0, 10);
const uid = () => Math.random().toString(36).slice(2, 10);

const defaultProfile: Profile = {
  name: "",
  sex: "female",
  heightCm: 170,
  weightKg: 65,
  goal: "Feel my best",
  activity: 1.375,
  units: "metric",
  themeMode: "system",
  cycleLenDays: 28,
  periodLenDays: 5,
  reminders: {
    nutrition: "08:00",
    water: "10:00",
    workout: "18:00",
    sleep: "22:30",
    meditation: "07:00",
  },
};

const defaultTargets: Targets = {
  calories: 2200,
  protein: 110,
  carbs: 260,
  fat: 70,
  waterMl: 2500,
  sleepHours: 8,
  exerciseMin: 45,
  steps: 8000,
};

export const useApp = create<AppState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      profile: defaultProfile,
      targets: defaultTargets,
      meals: [],
      water: [],
      workouts: [],
      workoutTemplates: [
        {
          id: "tpl-1",
          date: "",
          name: "Full body strength",
          category: "Strength",
          duration: 40,
          calories: 320,
          completed: false,
          exercises: [
            { id: uid(), name: "Squat", sets: 4, reps: 8 },
            { id: uid(), name: "Bench press", sets: 4, reps: 8 },
            { id: uid(), name: "Row", sets: 3, reps: 10 },
            { id: uid(), name: "Plank", sets: 3, reps: 1, duration: 1 },
          ],
        },
        {
          id: "tpl-2",
          date: "",
          name: "Morning cardio",
          category: "Cardio",
          duration: 30,
          calories: 280,
          completed: false,
          exercises: [
            { id: uid(), name: "Jog", sets: 1, reps: 1, duration: 25 },
            { id: uid(), name: "Cooldown walk", sets: 1, reps: 1, duration: 5 },
          ],
        },
      ],
      sleep: [],
      moods: [],
      journal: [],
      meditations: [],
      cycles: [],
      cycleSymptomsToday: { date: today(), symptoms: [] },
      checklist: [],
      chat: [
        {
          id: uid(),
          role: "ai",
          text: "Hi 👋 I'm your Arogya coach. Ask me about your day — try 'summarize my week' or 'suggest something now'.",
          at: Date.now(),
        },
      ],
      notifications: [],
      badges: [],
      xp: 0,
      streaks: {},
      stepLog: [],
      weightLog: [],

      setHydrated: (b) => set({ hydrated: b }),
      updateProfile: (p) => set({ profile: { ...get().profile, ...p } }),
      updateTargets: (t) => set({ targets: { ...get().targets, ...t } }),

      addMeal: (m) => {
        set({ meals: [...get().meals, { ...m, id: uid() }] });
        get().addXp(5, "meal logged");
        get().bumpStreak("nutrition");
      },
      updateMeal: (id, patch) =>
        set({ meals: get().meals.map((x) => (x.id === id ? { ...x, ...patch } : x)) }),
      removeMeal: (id) => set({ meals: get().meals.filter((x) => x.id !== id) }),

      addWater: (ml) => {
        set({ water: [...get().water, { id: uid(), ml, date: today(), at: Date.now() }] });
        get().addXp(1, "water logged");
      },
      removeWater: (id) => set({ water: get().water.filter((x) => x.id !== id) }),

      addWorkout: (w) => {
        const id = uid();
        set({ workouts: [...get().workouts, { ...w, id }] });
        return id;
      },
      updateWorkout: (id, patch) =>
        set({ workouts: get().workouts.map((x) => (x.id === id ? { ...x, ...patch } : x)) }),
      removeWorkout: (id) => set({ workouts: get().workouts.filter((x) => x.id !== id) }),
      toggleExercise: (workoutId, exId) =>
        set({
          workouts: get().workouts.map((w) =>
            w.id === workoutId
              ? { ...w, exercises: w.exercises.map((e) => (e.id === exId ? { ...e, done: !e.done } : e)) }
              : w,
          ),
        }),
      completeWorkout: (id) => {
        set({ workouts: get().workouts.map((x) => (x.id === id ? { ...x, completed: true } : x)) });
        get().addXp(25, "workout complete");
        get().bumpStreak("fitness");
      },
      saveTemplate: (w) =>
        set({ workoutTemplates: [...get().workoutTemplates, { ...w, id: uid() }] }),
      removeTemplate: (id) =>
        set({ workoutTemplates: get().workoutTemplates.filter((x) => x.id !== id) }),

      addSleep: (s) => {
        set({ sleep: [...get().sleep, { ...s, id: uid() }] });
        get().addXp(10, "sleep logged");
        get().bumpStreak("sleep");
      },
      removeSleep: (id) => set({ sleep: get().sleep.filter((x) => x.id !== id) }),

      addMood: (m) => {
        set({ moods: [...get().moods, { ...m, id: uid() }] });
        get().addXp(5, "mood logged");
        get().bumpStreak("mental");
      },
      addJournal: (j) => {
        set({ journal: [...get().journal, { ...j, id: uid() }] });
        get().addXp(8, "journal entry");
        get().bumpStreak("mental");
      },
      updateJournal: (id, patch) =>
        set({ journal: get().journal.map((x) => (x.id === id ? { ...x, ...patch } : x)) }),
      removeJournal: (id) => set({ journal: get().journal.filter((x) => x.id !== id) }),
      addMeditation: (m) => {
        set({ meditations: [...get().meditations, { ...m, id: uid() }] });
        get().addXp(m.minutes, "meditation");
        get().bumpStreak("mental");
      },

      addCycle: (c) => {
        set({ cycles: [...get().cycles, { ...c, id: uid() }] });
        get().addXp(6, "cycle logged");
      },
      updateCycle: (id, patch) =>
        set({ cycles: get().cycles.map((x) => (x.id === id ? { ...x, ...patch } : x)) }),
      removeCycle: (id) => set({ cycles: get().cycles.filter((x) => x.id !== id) }),
      toggleCycleSymptomToday: (s) => {
        const cur = get().cycleSymptomsToday;
        const day = today();
        const list = cur.date === day ? cur.symptoms : [];
        set({
          cycleSymptomsToday: {
            date: day,
            symptoms: list.includes(s) ? list.filter((x) => x !== s) : [...list, s],
          },
        });
      },

      addChecklistItem: (title) =>
        set({ checklist: [...get().checklist, { id: uid(), title, done: false, date: today() }] }),
      toggleChecklistItem: (id) => {
        set({
          checklist: get().checklist.map((x) => (x.id === id ? { ...x, done: !x.done } : x)),
        });
        const item = get().checklist.find((x) => x.id === id);
        if (item && !item.done) get().addXp(3, "checklist");
      },
      removeChecklistItem: (id) => set({ checklist: get().checklist.filter((x) => x.id !== id) }),
      seedChecklistIfEmpty: () => {
        const day = today();
        const has = get().checklist.some((x) => x.date === day);
        if (!has) {
          const seeded: ChecklistItem[] = [
            { id: uid(), title: "Drink 500ml water", done: false, date: day },
            { id: uid(), title: "10-min stretch", done: false, date: day },
            { id: uid(), title: "Log breakfast", done: false, date: day },
            { id: uid(), title: "Evening reflection", done: false, date: day },
          ];
          set({ checklist: [...get().checklist, ...seeded] });
        }
      },

      addChat: (m) => set({ chat: [...get().chat, { ...m, id: uid() }] }),
      clearChat: () =>
        set({
          chat: [
            {
              id: uid(),
              role: "ai",
              text: "New chat started — how can I help today?",
              at: Date.now(),
            },
          ],
        }),

      pushNotification: (n) =>
        set({
          notifications: [
            { ...n, id: uid(), at: Date.now(), read: false },
            ...get().notifications,
          ].slice(0, 40),
        }),
      markNotificationRead: (id) =>
        set({
          notifications: get().notifications.map((x) => (x.id === id ? { ...x, read: true } : x)),
        }),
      markAllRead: () =>
        set({ notifications: get().notifications.map((x) => ({ ...x, read: true })) }),

      addSteps: (date, steps) => {
        const { stepLog } = get();
        const existing = stepLog.find((s) => s.date === date);
        if (existing) {
          set({ stepLog: stepLog.map((s) => s.date === date ? { ...s, steps, at: Date.now() } : s) });
        } else {
          set({ stepLog: [...stepLog, { id: uid(), date, steps, at: Date.now() }] });
        }
        get().addXp(Math.floor(steps / 1000), "steps");
      },
      removeSteps: (id) => set({ stepLog: get().stepLog.filter((s) => s.id !== id) }),
      addWeight: (w) => set({ weightLog: [...get().weightLog, { ...w, id: uid() }] }),
      removeWeight: (id) => set({ weightLog: get().weightLog.filter((x) => x.id !== id) }),

      addXp: (amount) => set({ xp: get().xp + amount }),
      bumpStreak: (key) => {
        const s = get().streaks[key] ?? { current: 0, longest: 0, lastDate: "" };
        const day = today();
        if (s.lastDate === day) return;
        const y = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
        const current = s.lastDate === y ? s.current + 1 : 1;
        const longest = Math.max(s.longest, current);
        set({ streaks: { ...get().streaks, [key]: { current, longest, lastDate: day } } });
      },
      unlockBadge: (id, name, desc, icon) => {
        const badges = get().badges;
        if (badges.some((b) => b.id === id && b.unlockedAt)) return;
        const rest = badges.filter((b) => b.id !== id);
        set({ badges: [...rest, { id, name, desc, icon, unlockedAt: Date.now() }] });
        get().pushNotification({
          title: `Badge unlocked · ${name}`,
          body: desc,
          kind: "success",
        });
      },

      reset: () =>
        set({
          meals: [],
          water: [],
          workouts: [],
          sleep: [],
          moods: [],
          journal: [],
          meditations: [],
          cycles: [],
          checklist: [],
          notifications: [],
          badges: [],
          xp: 0,
          streaks: {},
          stepLog: [],
          weightLog: [],
          chat: [
            {
              id: uid(),
              role: "ai",
              text: "Fresh start — I'm here whenever you need me.",
              at: Date.now(),
            },
          ],
        }),
      exportAll: () => JSON.stringify(get(), null, 2),
      importAll: (json) => {
        try {
          const data = JSON.parse(json);
          set({ ...get(), ...data });
          return true;
        } catch {
          return false;
        }
      },
    }),
    {
      name: "arogya:v1",
      onRehydrateStorage: () => (state) => state?.setHydrated(true),
    },
  ),
);
