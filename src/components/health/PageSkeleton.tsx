import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

export function PageSkeleton({
  icon: Icon,
  title,
  description,
  accent = "var(--color-primary)",
  children,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  accent?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6 md:px-8 md:py-10">
      <motion.header
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[2rem] border bg-card p-6 shadow-soft sm:p-8"
      >
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-30 blur-2xl" style={{ background: accent }} aria-hidden />
        <div className="relative flex items-start gap-4">
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl shadow-glow" style={{ background: accent, color: "white" }}>
            <Icon className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
            <p className="mt-1 max-w-xl text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </motion.header>
      <section className="rounded-3xl border border-dashed bg-card/50 p-10 text-center">
        <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Coming soon</div>
        <h2 className="mt-2 font-heading text-xl font-semibold">This module is being crafted.</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          The foundations are in place. Full features roll out over the next sprints — meanwhile you can explore the dashboard and Women's Health.
        </p>
        {children}
      </section>
    </div>
  );
}
