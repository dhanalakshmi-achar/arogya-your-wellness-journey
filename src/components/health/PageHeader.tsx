import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function PageHeader({
  icon: Icon,
  title,
  description,
  accent = "var(--color-primary)",
  actions,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  accent?: string;
  actions?: ReactNode;
}) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-[2rem] border bg-card p-6 shadow-soft sm:p-8"
    >
      <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-30 blur-2xl" style={{ background: accent }} aria-hidden />
      <div className="relative flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl shadow-glow" style={{ background: accent, color: "white" }}>
            <Icon className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
            <p className="mt-1 max-w-xl text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
      </div>
    </motion.header>
  );
}
