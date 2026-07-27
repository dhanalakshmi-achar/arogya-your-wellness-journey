import { createFileRoute } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { PageSkeleton } from "@/components/health/PageSkeleton";
export const Route = createFileRoute("/_authenticated/women/insights")({
  component: () => <PageSkeleton icon={Sparkles} title="Insights" description="Patterns from your cycle, energy and mood." />,
});
