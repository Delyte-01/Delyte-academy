"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import { useAdminAnalytics } from "@/hooks/useAdminAnalytics";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts";



const chartConfig: ChartConfig = {
  enrollments: {
    label: "Enrollments",
    color: "#10B981",
  },
};

export function EnrollmentChart() {

const { enrollmentTrend} = useAdminAnalytics();

  return (
    <Card className="h-full overflow-hidden border-border/60">
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-1 xs:flex-row xs:items-center xs:justify-between">
          <CardTitle className="text-base font-bold">
            Enrollment Activity
          </CardTitle>
          <span className="text-xs text-muted-foreground">Last 7 days</span>
        </div>
      </CardHeader>
      <CardContent className="min-w-0 px-2 sm:px-4">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[220px] w-full min-w-0 sm:h-64"
        >
          <AreaChart
            data={enrollmentTrend}
            margin={{ left: 0, right: 8, top: 8, bottom: 0 }}
          >
            <defs>
              <linearGradient id="enrollFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="hsl(var(--border))"
            />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11 }}
              stroke="hsl(var(--muted-foreground))"
              interval="preserveStartEnd"
              minTickGap={16}
              padding={{ left: 8, right: 8 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11 }}
              stroke="hsl(var(--muted-foreground))"
              width={28}
              allowDecimals={false}
            />
            <ChartTooltip
              content={<ChartTooltipContent />}
              wrapperStyle={{ maxWidth: "calc(100vw - 32px)" }}
            />
            <Area
              type="monotone"
              dataKey="enrollments"
              stroke="#10B981"
              strokeWidth={2.5}
              fill="url(#enrollFill)"
              dot={{ fill: "#10B981", r: 3 }}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
