import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";

// Own AppShell instance so the pink theme wraps every child.
export const Route = createFileRoute("/_authenticated/women")({
  head: () => ({
    meta: [
      { title: "Women's Health — Arogya" },
      { name: "description", content: "Cycle, pregnancy, hormones, mood and symptom insights — in one calm, elegant space." },
      { property: "og:title", content: "Women's Health — Arogya" },
      { property: "og:description", content: "Track your cycle, hormones and wellbeing beautifully." },
    ],
  }),
  component: () => (
    <div data-theme="women" className="-mx-4 -my-6 md:-mx-8 md:-my-10">
      <Outlet />
    </div>
  ),
});
