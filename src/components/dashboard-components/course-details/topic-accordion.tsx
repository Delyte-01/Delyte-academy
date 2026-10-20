"use client";

import { useEffect, useState } from "react";
import { Inbox, Lock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { TopicCard } from "./topic-card";
import { Topic } from "@/types/topic";
import { useEnrollment } from "@/context/enrollment-context";
import { formatDuration } from "@/actions/use-course";

interface TopicAccordionProps {
  topics: Topic[];
  loading?: boolean;
  completedTopics: string[];
}

export function TopicAccordion({
  topics,
  loading = false,
  completedTopics,
}: TopicAccordionProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { isEnrolled } = useEnrollment();

  useEffect(() => {
    if (topics && topics.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setExpandedId(
        topics.find((t) => String(t.status) === "current")?.id ?? topics[0].id,
      );
    }
  }, [topics]);

  const total = topics?.length ?? 0;
  const completedCount =
    topics?.filter((t) => completedTopics.includes(t.id)).length ?? 0;
  const totalMinutes =
    topics?.reduce((sum, t) => sum + (Number(t.estimated_time) || 0), 0) ?? 0;
  const pct = total ? Math.round((completedCount / total) * 100) : 0;
  const courseId = topics?.[0]?.course_id;
  const showLockNote =
    !loading && total > 0 && courseId && !isEnrolled(courseId);

  return (
    <section aria-labelledby="curriculum" className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <div className="space-y-1">
          <h2 id="curriculum" className="text-xl font-semibold tracking-tight">
            Course curriculum
          </h2>
          {total > 0 && (
            <p className="text-sm text-muted-foreground">
              {total} {total === 1 ? "topic" : "topics"},{" "}
              {formatDuration(totalMinutes)} total
            </p>
          )}
        </div>

        {total > 0 && (
          <div className="flex w-full items-center gap-3 sm:w-auto">
            <div
              className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted sm:w-32 sm:flex-none"
              role="progressbar"
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Topics completed"
            >
              <div
                className="h-full rounded-full bg-emerald-500 transition-[width] duration-700 motion-reduce:transition-none"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-sm font-medium tabular-nums text-muted-foreground">
              {completedCount}/{total} done
            </span>
          </div>
        )}
      </div>

      {showLockNote && (
        <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-muted/40 p-3.5 text-sm text-muted-foreground">
          <Lock className="mt-0.5 size-4 shrink-0" />
          <p>
            Topics are locked until you enroll. Tap any topic to enroll and
            start.
          </p>
        </div>
      )}

      {loading ? (
        <ol className="space-y-4" aria-busy="true">
          {Array.from({ length: 4 }).map((_, i) => (
            <li key={i} className="flex gap-3 sm:gap-4">
              <Skeleton className="size-9 shrink-0 rounded-full" />
              <Skeleton className="h-28 flex-1 rounded-2xl" />
            </li>
          ))}
        </ol>
      ) : total === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-muted/20 p-10 text-center">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-muted">
            <Inbox className="size-6 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold">No topics yet</p>
            <p className="text-sm text-muted-foreground">
              Lessons for this course are on the way. Check back soon.
            </p>
          </div>
        </div>
      ) : (
        <ol>
          {topics.map((topic, index) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              topicNumber={index + 1}
              isLast={index === topics.length - 1}
              isExpanded={expandedId === topic.id}
              isCompleted={completedTopics.includes(topic.id)}
              onToggle={() =>
                setExpandedId((prev) => (prev === topic.id ? null : topic.id))
              }
            />
          ))}
        </ol>
      )}
    </section>
  );
}
