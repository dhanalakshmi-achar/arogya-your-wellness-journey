import type { LucideIcon } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

type Props = {
  to: string;
  label: string;
  hint?: string;
  icon: LucideIcon;
  accent?: string;
  className?: string;
};

export function QuickActionCard({ to, label, hint, icon: Icon, accent = "var(--color-primary)", className }: Props) {
  return (
    <Link
      to={to}
      className={cn(
        "group flex items-center gap-3 rounded-3xl border bg-card p-4 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-glow",
        className,
      )}
    >
      <div
        className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl"
        style={{ background: `color-mix(in oklab, ${accent} 18%, transparent)`, color: accent }}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold text-foreground">{label}</div>
        {hint && <div className="truncate text-xs text-muted-foreground">{hint}</div>}
      </div>
    </Link>
  );
}
