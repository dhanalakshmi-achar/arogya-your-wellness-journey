import { Bell, CheckCheck } from "lucide-react";
import { useState } from "react";
import { useApp } from "@/store/app";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const items = useApp((s) => s.notifications);
  const markRead = useApp((s) => s.markNotificationRead);
  const markAll = useApp((s) => s.markAllRead);
  const unread = items.filter((n) => !n.read).length;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          className="relative grid h-10 w-10 place-items-center rounded-2xl border bg-card text-muted-foreground hover:text-foreground"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          {unread > 0 && (
            <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
              {unread}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            Notifications
            {items.length > 0 && (
              <button
                onClick={markAll}
                className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                <CheckCheck className="h-3 w-3" /> Mark all read
              </button>
            )}
          </SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-2 overflow-y-auto pr-1">
          {items.length === 0 && (
            <p className="rounded-2xl border border-dashed bg-card/50 p-6 text-center text-sm text-muted-foreground">
              You're all caught up. Reminders and badge unlocks will show up here.
            </p>
          )}
          {items.map((n) => (
            <button
              key={n.id}
              onClick={() => markRead(n.id)}
              className={`w-full rounded-2xl border p-3 text-left text-sm transition-colors ${n.read ? "bg-card" : "border-primary/40 bg-primary/5"}`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="font-semibold">{n.title}</div>
                <div className="text-[10px] text-muted-foreground">{new Date(n.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
              </div>
              <div className="mt-1 text-muted-foreground">{n.body}</div>
            </button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
