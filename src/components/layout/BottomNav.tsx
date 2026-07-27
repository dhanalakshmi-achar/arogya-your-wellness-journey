import { Link, useRouterState } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { BOTTOM_NAV } from "@/constants/nav";

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/85 backdrop-blur-xl md:hidden">
      <ul className="mx-auto flex max-w-lg items-stretch justify-around px-2 py-2">
        {BOTTOM_NAV.map((item) => {
          const active = pathname.startsWith(item.to);
          const Icon = item.icon;
          return (
            <li key={item.to} className="flex-1">
              <Link
                to={item.to}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-2xl px-2 py-1.5 text-[11px] font-medium transition-colors",
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <span className={cn("grid h-9 w-9 place-items-center rounded-2xl transition-colors", active && "bg-primary/15")}>
                  <Icon className="h-5 w-5" />
                </span>
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
