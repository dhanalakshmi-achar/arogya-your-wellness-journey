import { createFileRoute } from "@tanstack/react-router";
import { Activity } from "lucide-react";
import { PageSkeleton } from "@/components/health/PageSkeleton";
export const Route = createFileRoute("/_authenticated/women/hormones")({
  component: () => <PageSkeleton icon={Activity} title="Hormones" description="Estrogen, progesterone and how they shift across your cycle." />,
});
