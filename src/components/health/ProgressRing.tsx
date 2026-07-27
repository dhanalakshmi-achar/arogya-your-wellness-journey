import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  value: number; // 0..100
  size?: number;
  stroke?: number;
  label?: string;
  sub?: ReactNode;
  color?: string; // css color
  className?: string;
  children?: ReactNode;
};

export function ProgressRing({
  value,
  size = 120,
  stroke = 10,
  label,
  sub,
  color = "var(--color-primary)",
  className,
  children,
}: Props) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, value));
  const offset = c - (pct / 100) * c;

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="var(--color-muted)"
          strokeWidth={stroke}
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {children ?? (
          <>
            <span className="tabular text-2xl font-semibold text-foreground">{Math.round(pct)}%</span>
            {label && <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</span>}
            {sub && <span className="mt-0.5 text-xs text-muted-foreground">{sub}</span>}
          </>
        )}
      </div>
    </div>
  );
}
