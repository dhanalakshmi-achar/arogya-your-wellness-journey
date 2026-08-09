import { useEffect } from "react";
import { useApp } from "@/store/app";

export function useTheme() {
  const themeMode = useApp((s) => s.profile.themeMode);

  useEffect(() => {
    const root = document.documentElement;
    const apply = (dark: boolean) => root.classList.toggle("dark", dark);

    if (themeMode === "dark") { apply(true); return; }
    if (themeMode === "light") { apply(false); return; }

    // system
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    apply(mq.matches);
    const handler = (e: MediaQueryListEvent) => apply(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [themeMode]);
}
