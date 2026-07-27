import type { ReactNode } from "react";
import { SideNav } from "./SideNav";
import { BottomNav } from "./BottomNav";
import { FloatingAIButton } from "./FloatingAIButton";

export function AppShell({ children, theme }: { children: ReactNode; theme?: "women" }) {
  return (
    <div data-theme={theme} className="flex min-h-dvh w-full bg-background text-foreground">
      <SideNav />
      <main className="flex-1 pb-24 md:pb-8">{children}</main>
      <BottomNav />
      <FloatingAIButton />
    </div>
  );
}
