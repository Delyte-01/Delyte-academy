"use client";

import { useState } from "react";
import { BookOpen, CheckCircle2, ChevronDown, ChevronUp, ClipboardCheck, History } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { RecentActivityItem } from "@/services/dashboard";

const META = {
  enrollment: { icon: BookOpen, tone: "bg-info-soft text-info" },
  topic_completed: { icon: CheckCircle2, tone: "bg-success-soft text-success" },
  quiz_completed: { icon: ClipboardCheck, tone: "bg-primary-soft text-primary-soft-foreground" },
} as const;

const COLLAPSED = 5;

interface RecentActivityProps {
  activities: RecentActivityItem[];
  loading?: boolean;
}

/** Compact timeline of the student's real recent activity. */
export function RecentActivity({ activities, loading = false }: RecentActivityProps) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? activities : activities.slice(0, COLLAPSED);

  return (
    <section aria-labelledby="activity-title" className="rounded-2xl border bg-card p-5 shadow-card">
      <h2 id="activity-title" className="mb-4 font-heading text-lg font-bold tracking-tight text-foreground">
        Recent activity
      </h2>

      {loading ? (
        <div className="space-y-4" aria-busy="true">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="size-9 shrink-0 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : activities.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl bg-muted/50 px-4 py-8 text-center">
          <span className="flex size-10 items-center justify-center rounded-xl bg-card text-muted-foreground shadow-soft">
            <History className="size-5" aria-hidden />
          </span>
          <p className="text-sm text-muted-foreground">Nothing yet. Your progress will show up here.</p>
        </div>
      ) : (
        <>
          <ol className={cn(expanded && "max-h-[420px] overflow-y-auto pr-1")}>
            {visible.map((activity, i) => {
              const meta = META[activity.type] ?? META.enrollment;
              const Icon = meta.icon;
              return (
                <li key={activity.id} className="relative flex min-w-0 gap-3 pb-5 last:pb-0">
                  {i < visible.length - 1 && (
                    <span aria-hidden className="absolute bottom-0 left-[17px] top-10 w-px bg-border" />
                  )}
                  <span className={cn("relative z-10 flex size-9 shrink-0 items-center justify-center rounded-xl", meta.tone)}>
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="break-words text-[15px] font-semibold leading-snug text-foreground">
                      {activity.text}
                    </p>
                    <p className="break-words text-[13px] text-muted-foreground">{activity.course}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground/80">{activity.time}</p>
                  </div>
                </li>
              );
            })}
          </ol>

          {activities.length > COLLAPSED && (
            <Button
              variant="ghost"
              size="sm"
              className="mt-3 w-full text-muted-foreground"
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
            >
              {expanded ? (
                <>
                  Show less <ChevronUp />
                </>
              ) : (
                <>
                  View all {activities.length} <ChevronDown />
                </>
              )}
            </Button>
          )}
        </>
      )}
    </section>
  );
}
