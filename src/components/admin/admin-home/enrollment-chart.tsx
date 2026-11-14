"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { useAdminAnalytics } from "@/hooks/useAdminAnalytics";

const chartConfig: ChartConfig = {
  enrollments: { label: "Enrollments", color: "var(--chart-1)" },
};

export function EnrollmentChart() {
  const { enrollmentTrend } = useAdminAnalytics();
  const total = enrollmentTrend.reduce((sum, d) => sum + d.enrollments, 0);

  return (
    <section className="overflow-hidden rounded-xl border bg-card p-5 shadow-card" aria-labelledby="enroll-title">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 id="enroll-title" className="font-heading text-lg font-bold tracking-tight">
            Enrollment activity
          </h2>
          <p className="text-[13px] text-muted-foreground">New enrollments, last 7 days</p>
        </div>
        <p className="font-heading text-2xl font-extrabold tabular-nums text-foreground">
          {total.toLocaleString()}
          <span className="ml-1.5 text-sm font-semibold text-muted-foreground">this week</span>
        </p>
      </div>

      <ChartContainer config={chartConfig} className="aspect-auto h-[220px] w-full min-w-0 sm:h-64">
        <AreaChart data={enrollmentTrend} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
          <defs>
            <linearGradient id="enrollFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.3} />
              <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
          <XAxis
            dataKey="day"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
            interval="preserveStartEnd"
            minTickGap={16}
            padding={{ left: 8, right: 8 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
            width={28}
            allowDecimals={false}
          />
          <ChartTooltip content={<ChartTooltipContent />} wrapperStyle={{ maxWidth: "calc(100vw - 32px)" }} />
          <Area
            type="monotone"
            dataKey="enrollments"
            stroke="var(--chart-1)"
            strokeWidth={2.5}
            fill="url(#enrollFill)"
            dot={{ fill: "var(--chart-1)", r: 3 }}
            activeDot={{ r: 5 }}
          />
        </AreaChart>
      </ChartContainer>
    </section>
  );
}
