"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  ArrowUpRight,
  UserPlus,
  FileCheck,
  CheckCircle2,
  Award,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { StudentActivity } from "./dashboard-data";
import { useAdminAnalytics } from "@/hooks/useAdminAnalytics";



const typeConfig: Record<
  StudentActivity["type"],
  { icon: LucideIcon; color: string; bgColor: string }
> = {
  enrolled: {
    icon: UserPlus,
    color: "text-blue-600",
    bgColor: "bg-blue-500/10",
  },
  quiz: {
    icon: FileCheck,
    color: "text-amber-600",
    bgColor: "bg-amber-500/10",
  },
  topic: {
    icon: CheckCircle2,
    color: "text-emerald-600",
    bgColor: "bg-emerald-500/10",
  },
  finished: {
    icon: Award,
    color: "text-violet-600",
    bgColor: "bg-violet-500/10",
  },
};

const COLLAPSED_COUNT = 6;

export function RecentActivity() {
  const { recentActivity } = useAdminAnalytics();

  const [expanded, setExpanded] = useState(false);

  const hasMore = recentActivity.length > COLLAPSED_COUNT;
  const visibleActivities = expanded
    ? recentActivity
    : recentActivity.slice(0, COLLAPSED_COUNT);

  return (
    <Card className="h-full border-border/60">
      <CardHeader className="flex flex-row items-center justify-between gap-2 pb-4">
        <CardTitle className="text-base font-bold">
          Recent Student Activity
        </CardTitle>
        <Button variant="ghost" size="sm" className="flex-shrink-0 text-xs">
          View all
          <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
        </Button>
      </CardHeader>

      <CardContent className="space-y-1 px-2 sm:px-4">
        {recentActivity.length === 0 ? (
          <p className="px-2 py-6 text-center text-sm text-muted-foreground">
            No recent activity yet.
          </p>
        ) : (
          <>
            <div
              className={
                expanded
                  ? "max-h-[420px] space-y-1 overflow-y-auto pr-1"
                  : "space-y-1"
              }
            >
              {visibleActivities.map((activity) => {
                const config = typeConfig[activity.type];
                const Icon = config.icon;
                return (
                  <div
                    key={activity.id}
                    className="flex items-center gap-2 rounded-2xl p-2.5 transition-colors hover:bg-muted/40 sm:gap-3 sm:p-3"
                  >
                    <Avatar className="h-8 w-8 flex-shrink-0 sm:h-9 sm:w-9">
                      <AvatarFallback className="bg-primary/10 text-[10px] font-bold text-primary sm:text-[11px]">
                        {activity.initials}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {activity.name}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {activity.action} ·{" "}
                        <span className="font-medium">{activity.course}</span>
                      </p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground sm:hidden">
                        {activity.time}
                      </p>
                    </div>

                    <div className="flex flex-shrink-0 flex-col items-center gap-1 sm:flex-row sm:gap-2">
                      <div
                        className={`flex h-7 w-7 items-center justify-center rounded-lg sm:h-8 sm:w-8 ${config.bgColor}`}
                      >
                        <Icon
                          className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${config.color}`}
                        />
                      </div>
                      <span className="hidden text-xs text-muted-foreground sm:block">
                        {activity.time}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {expanded && (
              <div className="pointer-events-none sticky bottom-0 left-0 h-6 w-full bg-gradient-to-t from-background to-transparent" />
            )}

            {hasMore && (
              <Button
                variant="ghost"
                size="sm"
                className="mt-1 w-full text-xs text-muted-foreground"
                onClick={() => setExpanded((v) => !v)}
              >
                {expanded ? (
                  <>
                    Show less
                    <ChevronUp className="ml-1 h-3.5 w-3.5" />
                  </>
                ) : (
                  <>
                    Show {recentActivity.length - COLLAPSED_COUNT} more
                    <ChevronDown className="ml-1 h-3.5 w-3.5" />
                  </>
                )}
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
