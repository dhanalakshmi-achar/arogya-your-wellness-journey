import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  TrendingUp,
  Droplets,
  Flame,
  Moon,
  Dumbbell,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/_authenticated/admin/health-overview")({
  head: () => ({
    meta: [{ title: "Health Overview — Admin — Arogya" }],
  }),
  component: AdminHealthOverview,
});

interface HealthAggregates {
  totalEntries: number;
  avgCaloriesIn: number;
  avgWaterMl: number;
  avgSleepMinutes: number;
  avgExerciseMinutes: number;
}

function AdminHealthOverview() {
  const [data, setData] = useState<HealthAggregates>({
    totalEntries: 0,
    avgCaloriesIn: 0,
    avgWaterMl: 0,
    avgSleepMinutes: 0,
    avgExerciseMinutes: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHealthData();
  }, []);

  const fetchHealthData = async () => {
    try {
      const { data: metrics, error } = await supabase
        .from("health_metrics")
        .select("calories_in, water_ml, sleep_minutes, exercise_minutes")
        .order("created_at", { ascending: false })
        .limit(500);

      if (error) throw error;

      if (metrics && metrics.length > 0) {
        const totalEntries = metrics.length;
        const avgCaloriesIn = Math.round(
          metrics.reduce((sum, m) => sum + m.calories_in, 0) / totalEntries
        );
        const avgWaterMl = Math.round(
          metrics.reduce((sum, m) => sum + m.water_ml, 0) / totalEntries
        );
        const avgSleepMinutes = Math.round(
          metrics.reduce((sum, m) => sum + m.sleep_minutes, 0) / totalEntries
        );
        const avgExerciseMinutes = Math.round(
          metrics.reduce((sum, m) => sum + m.exercise_minutes, 0) / totalEntries
        );

        setData({
          totalEntries,
          avgCaloriesIn,
          avgWaterMl,
          avgSleepMinutes,
          avgExerciseMinutes,
        });
      }
    } catch (err) {
      toast.error("Failed to load health overview");
    } finally {
      setLoading(false);
    }
  };

  const formatMinutes = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  const cards = [
    {
      title: "Avg. Calories In",
      value: loading ? "—" : `${data.avgCaloriesIn} kcal`,
      icon: Flame,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
    {
      title: "Avg. Water Intake",
      value: loading ? "—" : `${(data.avgWaterMl / 1000).toFixed(1)}L`,
      icon: Droplets,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Avg. Sleep",
      value: loading ? "—" : formatMinutes(data.avgSleepMinutes),
      icon: Moon,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
    },
    {
      title: "Avg. Exercise",
      value: loading ? "—" : formatMinutes(data.avgExerciseMinutes),
      icon: Dumbbell,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold tracking-tight">
          Health Overview
        </h1>
        <p className="text-sm text-muted-foreground">
          Platform-wide aggregated health metrics ({data.totalEntries} entries)
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.title} className="rounded-2xl border shadow-soft">
            <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
              <div
                className={`grid h-14 w-14 place-items-center rounded-2xl ${card.bg}`}
              >
                <card.icon className={`h-6 w-6 ${card.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{card.value}</p>
                <p className="text-sm text-muted-foreground">{card.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-8 rounded-2xl border shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            These averages are computed from the most recent {data.totalEntries}{" "}
            health metric entries across all users. Use this data to understand
            overall platform health trends and identify areas where users might
            need more support or engagement.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}