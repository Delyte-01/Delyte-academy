"use client";

import Link from "next/link";
import { AlertTriangle, CheckCircle2, ChevronRight, FileEdit, FileQuestion, FileText, type LucideIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useAdminAttention, type AttentionGroup } from "@/hooks/useAdminAttention";

const META: Record<AttentionGroup["id"], { icon: LucideIcon; tone: string }> = {
  "draft-courses": { icon: FileEdit, tone: "bg-warning-soft text-warning" },
  "empty-quizzes": { icon: FileQuestion, tone: "bg-destructive/10 text-destructive" },
  "empty-topics": { icon: FileText, tone: "bg-info-soft text-info" },
};

/** Real content-health checks (draft courses, empty quizzes, empty topics). Replaces the old hard-coded list. */
export function NeedsAttention() {
  const { groups, loading } = useAdminAttention();
  const open = groups.filter((g) => g.count > 0);
  const failed = groups.filter((g) => g.failed);

  return (
    <section className="rounded-xl border bg-card p-5 shadow-card" aria-labelledby="attention-title">
      <div className="mb-4 flex items-center gap-2">
        <AlertTriangle className="size-5 text-warning" aria-hidden />
        <h2 id="attention-title" className="font-heading text-lg font-bold tracking-tight">
          Needs attention
        </h2>
      </div>

      {loading ? (
        <div className="space-y-3" role="status" aria-label="Checking content">
          <Skeleton className="h-16 rounded-xl" />
          <Skeleton className="h-16 rounded-xl" />
        </div>
      ) : open.length === 0 ? (
        <div className="flex items-start gap-3 rounded-xl bg-success-soft p-4">
          <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success" aria-hidden />
          <div>
            <p className="text-sm font-bold text-foreground">
              {failed.length === groups.length && groups.length > 0 ? "Couldn’t run the checks" : "Everything looks in order"}
            </p>
            <p className="text-[13px] text-muted-foreground">
              {failed.length === groups.length && groups.length > 0
                ? "The content checks failed to load. Refresh to try again."
                : "No draft courses, empty quizzes or empty topics."}
            </p>
          </div>
        </div>
      ) : (
        <ul className="space-y-3">
          {open.map((group) => {
            const { icon: Icon, tone } = META[group.id];
            return (
              <li key={group.id} className="rounded-xl border p-3.5">
                <div className="flex items-center gap-3">
                  <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-xl", tone)}>
                    <Icon className="size-[18px]" aria-hidden />
                  </span>
                  <p className="min-w-0 flex-1 text-sm font-bold text-foreground">{group.label}</p>
                  <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-bold tabular-nums text-foreground">
                    {group.count}
                  </span>
                </div>
                <ul className="mt-2.5 space-y-0.5 pl-12">
                  {group.entries.map((entry) => (
                    <li key={entry.id}>
                      <Link
                        href={entry.href}
                        className="group flex min-h-9 items-center justify-between gap-2 rounded-lg px-2 text-[13px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      >
                        <span className="truncate">{entry.title}</span>
                        <ChevronRight className="size-3.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" aria-hidden />
                      </Link>
                    </li>
                  ))}
                  {group.count > group.entries.length && (
                    <li className="px-2 pt-1 text-xs text-muted-foreground">+ {group.count - group.entries.length} more</li>
                  )}
                </ul>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
