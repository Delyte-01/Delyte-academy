"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import { QuizAnalytics } from "@/types/progress";
import { TrendingUp, Trophy, FileCheck, Target } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  
} from "recharts";


interface QuizAnalyticsCardProps {
  data: QuizAnalytics;
}

const chartConfig: ChartConfig = {
  score: {
    label: "Score",
    color: "#10B981",
  },
};

export function QuizAnalyticsCard({ data }: QuizAnalyticsCardProps) {
  const stats = [
    {
      label: "Average Score",
      value: `${data.averageScore}%`,
      icon: TrendingUp,
      color: "text-emerald-600",
      bgColor: "bg-emerald-500/10",
    },
    {
      label: "Highest Score",
      value: `${data.highestScore}%`,
      icon: Trophy,
      color: "text-amber-600",
      bgColor: "bg-amber-500/10",
    },
    {
      label: "Quizzes Taken",
      value: `${data.quizzesTaken}`,
      icon: FileCheck,
      color: "text-blue-600",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Pass Rate",
      value: `${data.passRate}%`,
      icon: Target,
      color: "text-violet-600",
      bgColor: "bg-violet-500/10",
    },
  ];


  const scores = data.scoreTrend.map((d) => d.score);
  const minScore = Math.min(...scores);
  const maxScore = Math.max(...scores);


  

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-bold">
          Quiz Performance Analytics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="rounded-2xl border p-3">
                <div
                  className={`mb-2 flex h-9 w-9 items-center justify-center rounded-xl ${stat.bgColor}`}
                >
                  <Icon className={`h-4.5 w-4.5 ${stat.color}`} />
                </div>
                <p className="text-lg font-extrabold text-foreground">
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Chart */}
        <div>
          <p className="mb-2 text-xs font-medium text-muted-foreground">
            Score Trend Over Time
          </p>
          <ChartContainer config={chartConfig} className="h-48 w-full">
            <AreaChart
              data={data.scoreTrend}
              margin={{ left: -20, right: 8, top: 8, bottom: 0 }}
            >
              <defs>
                <linearGradient id="scoreFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="hsl(var(--border))"
              />
              <XAxis
                dataKey="date"
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11 }}
              />
              <YAxis
                domain={[
                  Math.max(0, minScore - 2),
                  Math.min(100, maxScore + 2),
                ]}
                tickLine={false}
                axisLine={false}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="score"
                stroke="#10B981"
                strokeWidth={2.5}
                fill="url(#scoreFill)"
                dot={{ fill: "#10B981", r: 3 }}
                activeDot={{ r: 5 }}
              />
            </AreaChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
