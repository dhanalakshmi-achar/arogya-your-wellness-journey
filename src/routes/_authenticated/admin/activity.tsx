import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Clock, UserPlus, Activity, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_authenticated/admin/activity")({
  head: () => ({
    meta: [{ title: "Activity Log — Admin — Arogya" }],
  }),
  component: AdminActivity,
});

interface ActivityItem {
  id: string;
  full_name: string | null;
  created_at: string;
  onboarded: boolean;
}

function AdminActivity() {
  const [recentUsers, setRecentUsers] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivity();
  }, []);

  const fetchActivity = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, created_at, onboarded")
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) throw error;
      setRecentUsers(data ?? []);
    } catch (err) {
      toast.error("Failed to load activity");
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (dateStr: string) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold tracking-tight">
          Activity Log
        </h1>
        <p className="text-sm text-muted-foreground">
          Recent user signups and onboarding status
        </p>
      </div>

      <Card className="rounded-2xl border shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="h-5 w-5 text-primary" />
            Recent Signups
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="py-8 text-center text-muted-foreground">Loading...</p>
          ) : recentUsers.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">
              No activity yet
            </p>
          ) : (
            <div className="space-y-3">
              {recentUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between rounded-xl border p-3 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-full bg-green-500/10">
                      <UserPlus className="h-4 w-4 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {user.full_name || "Unnamed User"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Signed up {getTimeAgo(user.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {user.onboarded ? (
                      <Badge className="bg-green-500/10 text-green-600 border-green-200">
                        Onboarded
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Pending</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}