import { createFileRoute } from "@tanstack/react-router";
import { Apple } from "lucide-react";
import { PageSkeleton } from "@/components/health/PageSkeleton";
export const Route = createFileRoute("/_authenticated/nutrition")({
  head: () => ({ meta: [{ title: "Nutrition — Arogya" }, { name: "description", content: "Log meals and track macros." }] }),
  component: () => <PageSkeleton icon={Apple} title="Nutrition" description="Log meals, track macros and hit your daily goals." accent="var(--color-success)" />,
});
