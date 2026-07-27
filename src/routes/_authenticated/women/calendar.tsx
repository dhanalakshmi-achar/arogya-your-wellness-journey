import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays } from "lucide-react";
import { PageSkeleton } from "@/components/health/PageSkeleton";
export const Route = createFileRoute("/_authenticated/women/calendar")({
  component: () => <PageSkeleton icon={CalendarDays} title="Cycle Calendar" description="See your phases, symptoms and predictions in one view." />,
});
