import { createFileRoute } from "@tanstack/react-router";
import { Brain } from "lucide-react";
import { PageSkeleton } from "@/components/health/PageSkeleton";
export const Route = createFileRoute("/_authenticated/mental")({
  head: () => ({ meta: [{ title: "Mental Wellness — Arogya" }, { name: "description", content: "Mood, meditation, journal and breathing." }] }),
  component: () => <PageSkeleton icon={Brain} title="Mental Wellness" description="Mood, meditation, journaling and breathwork — for a calmer mind." accent="var(--color-accent)" />,
});
