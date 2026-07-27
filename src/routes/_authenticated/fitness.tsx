import { createFileRoute } from "@tanstack/react-router";
import { Dumbbell } from "lucide-react";
import { PageSkeleton } from "@/components/health/PageSkeleton";
export const Route = createFileRoute("/_authenticated/fitness")({
  head: () => ({ meta: [{ title: "Fitness — Arogya" }, { name: "description", content: "Workouts, activity and recovery." }] }),
  component: () => <PageSkeleton icon={Dumbbell} title="Fitness" description="Workouts, steps and recovery — tailored to your goals." accent="var(--color-primary)" />,
});
