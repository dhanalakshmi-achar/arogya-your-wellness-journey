import { Link, useRouterState } from "@tanstack/react-router";
import {LogOut, Shield } from "lucide-react";
import { PRIMARY_NAV } from "@/constants/nav";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useIsAdmin } from "@/hooks/use-admin";

export function SideNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const qc = useQueryClient();
  const navigate = useNavigate();
  const { isAdmin } = useIsAdmin();

  const signOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  return (
    <aside className="hidden md:sticky md:top-0 md:flex md:h-dvh md:w-64 md:flex-col md:border-r md:bg-sidebar md:px-4 md:py-6">
      <Link to="/dashboard" className="flex items-center gap-2 px-2">
       <div className="grid h-10 w-10 place-items-center overflow-hidden rounded-2xl">
  <img
    src="public/arogya.png"
    alt="Arogya Logo"
    className="h-full w-full object-contain"
  />
</div>
        <div>
          <div className="font-heading text-lg font-bold tracking-tight">Arogya</div>
          <div className="-mt-1 text-[11px] text-muted-foreground">Holistic health</div>
        </div>
      </Link>
      <nav className="mt-6 flex-1 space-y-1">
        {PRIMARY_NAV.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.to || (item.to !== "/dashboard" && pathname.startsWith(item.to));
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-primary/12 text-primary"
                  : "text-muted-foreground hover:bg-accent/40 hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
        {isAdmin && (
          <Link
            to="/admin"
            className={cn(
              "flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium transition-colors",
              pathname.startsWith("/admin")
                ? "bg-purple-500/12 text-purple-600"
                : "text-muted-foreground hover:bg-accent/40 hover:text-foreground",
            )}
          >
            <Shield className="h-4 w-4" />
            Admin Panel
          </Link>
        )}
      </nav>
      <button
        onClick={signOut}
        className="mt-auto flex items-center gap-2 rounded-2xl px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
      >
        <LogOut className="h-4 w-4" />
        Sign out
      </button>
    </aside>
  );
}
