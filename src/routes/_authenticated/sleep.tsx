import { createFileRoute } from "@tanstack/react-router";
import { Moon } from "lucide-react";
import { PageSkeleton } from "@/components/health/PageSkeleton";
export const Route = createFileRoute("/_authenticated/sleep")({
  head: () => ({ meta: [{ title: "Sleep — Arogya" }, { name: "description", content: "Sleep tracking and rest insights." }] }),
  component: () => <PageSkeleton icon={Moon} title="Sleep" description="Track your rest, understand cycles and wind down calmly." accent="var(--color-info)" />,
});
