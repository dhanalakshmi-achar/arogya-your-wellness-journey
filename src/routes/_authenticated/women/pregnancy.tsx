import { createFileRoute } from "@tanstack/react-router";
import { Baby } from "lucide-react";
import { PageSkeleton } from "@/components/health/PageSkeleton";
export const Route = createFileRoute("/_authenticated/women/pregnancy")({
  component: () => <PageSkeleton icon={Baby} title="Pregnancy Tracker" description="Week-by-week milestones and gentle guidance." />,
});
