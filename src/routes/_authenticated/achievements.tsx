import { createFileRoute } from "@tanstack/react-router";
import { Trophy } from "lucide-react";
import { PageSkeleton } from "@/components/health/PageSkeleton";
export const Route = createFileRoute("/_authenticated/achievements")({
  head: () => ({ meta: [{ title: "Achievements — Arogya" }, { name: "description", content: "XP, streaks and badges." }] }),
  component: () => <PageSkeleton icon={Trophy} title="Achievements" description="XP, streaks, badges and daily challenges." accent="var(--color-warning)" />,
});
