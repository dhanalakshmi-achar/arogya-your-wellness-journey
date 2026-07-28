import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Users,
  Shield,
  Activity,
  TrendingUp,
  UserPlus,
  UserCheck,
  Clock,
  BarChart3,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/_authenticated/admin/")({
  head: () => ({
    meta: [{ title: "Super Admin — Arogya" }],
  }),
  component: AdminDashboard,
});

interface DashboardStats {
  totalUsers: number;
  adminUsers: number;
  recentSignups: number;
  activeToday: number;
}

function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    adminUsers: 0,
    recentSignups: 0,
    activeToday: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Get total profiles count
      const { count: totalUsers } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      // Get admin count
      const { count: adminUsers } = await supabase
        .from("user_roles")
        .select("*", { count: "exact", head: true })
        .eq("role", "admin");

      // Get recent signups (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const { count: recentSignups } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .gte("created_at", sevenDaysAgo.toISOString());

      // Get active today (users with health metrics today)
      const today = new Date().toISOString().split("T")[0];
      const { count: activeToday } = await supabase
        .from("health_metrics")
        .select("*", { count: "exact", head: true })
        .eq("day", today);

      setStats({
        totalUsers: totalUsers ?? 0,
        adminUsers: adminUsers ?? 0,
        recentSignups: recentSignups ?? 0,
        activeToday: activeToday ?? 0,
      });
    } catch (err) {
      toast.error("Failed to load dashboard stats");
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Admin Users",
      value: stats.adminUsers,
      icon: Shield,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      title: "New (7 days)",
      value: stats.recentSignups,
      icon: UserPlus,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      title: "Active Today",
      value: stats.activeToday,
      icon: Activity,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold tracking-tight">
          Super Admin Panel
        </h1>
        <p className="mt-1 text-muted-foreground">
          Manage users, roles, and monitor platform activity.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="rounded-2xl border shadow-soft">
            <CardContent className="flex items-center gap-4 p-5">
              <div
                className={`grid h-12 w-12 place-items-center rounded-2xl ${stat.bg}`}
              >
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold tabular-nums">
                  {loading ? "—" : stat.value}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link to="/admin/users">
          <Card className="cursor-pointer rounded-2xl border shadow-soft transition-all hover:shadow-md hover:-translate-y-0.5">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10">
                <UserCheck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold">Manage Users</p>
                <p className="text-sm text-muted-foreground">
                  View, edit roles, and manage accounts
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/admin/activity">
          <Card className="cursor-pointer rounded-2xl border shadow-soft transition-all hover:shadow-md hover:-translate-y-0.5">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-green-500/10">
                <BarChart3 className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="font-semibold">Activity Log</p>
                <p className="text-sm text-muted-foreground">
                  Monitor user signups and engagement
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/admin/health-overview">
          <Card className="cursor-pointer rounded-2xl border shadow-soft transition-all hover:shadow-md hover:-translate-y-0.5">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-orange-500/10">
                <TrendingUp className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="font-semibold">Health Overview</p>
                <p className="text-sm text-muted-foreground">
                  Platform-wide health metrics summary
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}