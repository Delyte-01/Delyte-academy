"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { FileCheck, Target, TrendingUp, Trophy } from "lucide-react";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { EmptyState } from "@/components/empty-states";
import { QuizAnalytics } from "@/types/progress";
import { Panel } from "./panel";

const chartConfig: ChartConfig = {
  score: { label: "Score", color: "var(--chart-1)" },
};

export function QuizAnalyticsCard({ data }: { data: QuizAnalytics }) {
  const stats = [
    { label: "Average score", value: `${data.averageScore}%`, icon: TrendingUp, tone: "bg-success-soft text-success" },
    { label: "Highest score", value: `${data.highestScore}%`, icon: Trophy, tone: "bg-warning-soft text-warning" },
    { label: "Quizzes taken", value: `${data.quizzesTaken}`, icon: FileCheck, tone: "bg-info-soft text-info" },
    { label: "Pass rate", value: `${data.passRate}%`, icon: Target, tone: "bg-primary-soft text-primary-soft-foreground" },
  ];

  const scores = data.scoreTrend.map((d) => d.score);
  const hasData = scores.length > 0;
  const minScore = hasData ? Math.min(...scores) : 0;
  const maxScore = hasData ? Math.max(...scores) : 100;

  return (
    <Panel title="Quiz performance" description="How your scores are trending">
      {!hasData ? (
        <EmptyState
          icon={FileCheck}
          title="No quiz attempts yet"
          description="Finish a quiz and your score trend will appear here."
          className="py-10"
        />
      ) : (
        <div className="space-y-6">
          <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {stats.map(({ label, value, icon: Icon, tone }) => (
              <div key={label} className="rounded-xl border p-4">
                <span className={`mb-3 flex size-9 items-center justify-center rounded-lg ${tone}`}>
                  <Icon className="size-[18px]" aria-hidden />
                </span>
                <dd className="font-heading text-2xl font-extrabold tabular-nums tracking-tight">{value}</dd>
                <dt className="text-[13px] text-muted-foreground">{label}</dt>
              </div>
            ))}
          </dl>

          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Score over time
            </p>
            <ChartContainer config={chartConfig} className="h-52 w-full">
              <AreaChart data={data.scoreTrend} margin={{ left: -20, right: 8, top: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-score)" stopOpacity={0.28} />
                    <stop offset="100%" stopColor="var(--color-score)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                  }
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  domain={[Math.max(0, minScore - 5), Math.min(100, maxScore + 5)]}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="var(--color-score)"
                  strokeWidth={2.5}
                  fill="url(#scoreFill)"
                  dot={{ fill: "var(--color-score)", r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </AreaChart>
            </ChartContainer>
          </div>
        </div>
      )}
    </Panel>
  );
}
