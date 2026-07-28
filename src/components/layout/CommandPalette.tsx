import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { PRIMARY_NAV } from "@/constants/nav";
import { useApp } from "@/store/app";
import { Search } from "lucide-react";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const meals = useApp((s) => s.meals);
  const journal = useApp((s) => s.journal);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const go = (to: string) => {
    setOpen(false);
    navigate({ to });
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="grid h-10 w-10 place-items-center rounded-2xl border bg-card text-muted-foreground hover:text-foreground"
        aria-label="Search"
      >
        <Search className="h-4 w-4" />
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search pages, meals, journal…" />
        <CommandList>
          <CommandEmpty>No results.</CommandEmpty>
          <CommandGroup heading="Pages">
            {PRIMARY_NAV.map((n) => (
              <CommandItem key={n.to} onSelect={() => go(n.to)}>
                <n.icon className="mr-2 h-4 w-4" /> {n.label}
              </CommandItem>
            ))}
          </CommandGroup>
          {meals.length > 0 && (
            <CommandGroup heading="Meals">
              {meals.slice(-8).reverse().map((m) => (
                <CommandItem key={m.id} onSelect={() => go("/nutrition")}>
                  {m.name} · {m.calories} kcal
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          {journal.length > 0 && (
            <CommandGroup heading="Journal">
              {journal.slice(-6).reverse().map((j) => (
                <CommandItem key={j.id} onSelect={() => go("/mental")}>
                  {j.title || j.body.slice(0, 40)}
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
