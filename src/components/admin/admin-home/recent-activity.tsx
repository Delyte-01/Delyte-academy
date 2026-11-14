"use client";

import { useState } from "react";
import { Award, CheckCircle2, ChevronDown, ChevronUp, FileCheck, UserPlus, type LucideIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAdminAnalytics } from "@/hooks/useAdminAnalytics";
import { cn } from "@/lib/utils";
import type { StudentActivity } from "./dashboard-data";

const TYPE: Record<StudentActivity["type"], { icon: LucideIcon; tone: string }> = {
  enrolled: { icon: UserPlus, tone: "bg-info-soft text-info" },
  quiz: { icon: FileCheck, tone: "bg-warning-soft text-warning" },
  topic: { icon: CheckCircle2, tone: "bg-success-soft text-success" },
  finished: { icon: Award, tone: "bg-primary-soft text-primary-soft-foreground" },
};

const COLLAPSED = 6;

export function RecentActivity() {
  const { recentActivity } = useAdminAnalytics();
  const [expanded, setExpanded] = useState(false);

  const visible = expanded ? recentActivity : recentActivity.slice(0, COLLAPSED);
  const hidden = recentActivity.length - COLLAPSED;

  return (
    <section className="rounded-xl border bg-card p-5 shadow-card" aria-labelledby="activity-title">
      <h2 id="activity-title" className="mb-3 font-heading text-lg font-bold tracking-tight">
        Recent student activity
      </h2>

      {recentActivity.length === 0 ? (
        <p className="rounded-xl border border-dashed px-4 py-10 text-center text-[15px] text-muted-foreground">
          No student activity yet. It will appear here as learners enroll and complete work.
        </p>
      ) : (
        <>
          <ul className={cn("-mx-2 space-y-0.5", expanded && "max-h-[420px] overflow-y-auto pr-1")}>
            {visible.map((a) => {
              const { icon: Icon, tone } = TYPE[a.type];
              return (
                <li key={a.id} className="flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-muted/60">
                  <Avatar className="size-9 shrink-0">
                    <AvatarFallback className="bg-primary-soft text-[11px] font-bold text-primary-soft-foreground">
                      {a.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-foreground">{a.name}</p>
                    <p className="truncate text-[13px] text-muted-foreground">
                      {a.action} · <span className="font-semibold text-foreground/80">{a.course}</span>
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1 sm:flex-row sm:items-center sm:gap-3">
                    <span className="text-xs text-muted-foreground">{a.time}</span>
                    <span className={cn("flex size-8 items-center justify-center rounded-lg", tone)}>
                      <Icon className="size-4" aria-hidden />
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
          {hidden > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 w-full"
              aria-expanded={expanded}
              onClick={() => setExpanded((v) => !v)}
            >
              {expanded ? (
                <>
                  Show less <ChevronUp aria-hidden />
                </>
              ) : (
                <>
                  Show {hidden} more <ChevronDown aria-hidden />
                </>
              )}
            </Button>
          )}
        </>
      )}
    </section>
  );
}
