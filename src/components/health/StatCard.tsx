import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type StatCardProps = {
  icon?: LucideIcon;
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  accent?: string;
  className?: string;
};

export function StatCard({ icon: Icon, label, value, hint, accent = "var(--color-primary)", className }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "group relative overflow-hidden rounded-3xl border bg-card p-5 shadow-soft transition-transform hover:-translate-y-1",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-30 blur-2xl transition-opacity group-hover:opacity-60"
        style={{ background: accent }}
      />
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
        {Icon && (
          <div className="grid h-9 w-9 place-items-center rounded-2xl" style={{ background: `color-mix(in oklab, ${accent} 18%, transparent)`, color: accent }}>
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>
      <div className="mt-3 tabular text-3xl font-semibold text-foreground">{value}</div>
      {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
    </motion.div>
  );
}
