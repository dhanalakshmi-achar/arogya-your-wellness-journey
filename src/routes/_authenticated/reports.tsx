import { createFileRoute } from "@tanstack/react-router";
import { BarChart3 } from "lucide-react";
import { PageSkeleton } from "@/components/health/PageSkeleton";
export const Route = createFileRoute("/_authenticated/reports")({
  head: () => ({ meta: [{ title: "Reports — Arogya" }, { name: "description", content: "Weekly and monthly health analytics." }] }),
  component: () => <PageSkeleton icon={BarChart3} title="Reports" description="Weekly & monthly analytics across all your pillars." />,
});
