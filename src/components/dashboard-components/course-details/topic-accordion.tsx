"use client";

import { useState } from "react";
import { Inbox, Lock } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { ProgressBar } from "@/components/ui/progress-bar";
import { EmptyState } from "@/components/empty-states";
import { TopicCard } from "./topic-card";
import { Topic } from "@/types/topic";
import { useEnrollment } from "@/context/enrollment-context";
import { formatDuration } from "@/actions/use-course";

interface TopicAccordionProps {
  topics: Topic[];
  loading?: boolean;
  completedTopics: string[];
}

/** Curriculum: one hairline-divided list with per-topic completion state. */
export function TopicAccordion({
  topics,
  loading = false,
  completedTopics,
}: TopicAccordionProps) {
  // undefined = "follow the default"; once the learner toggles, their choice wins.
  const [expandedId, setExpandedId] = useState<string | null | undefined>(undefined);
  const { isEnrolled } = useEnrollment();

  const total = topics?.length ?? 0;
  const completedCount = topics?.filter((t) => completedTopics.includes(t.id)).length ?? 0;
  const totalMinutes = topics?.reduce((sum, t) => sum + (Number(t.estimated_time) || 0), 0) ?? 0;
  const pct = total ? Math.round((completedCount / total) * 100) : 0;
  const courseId = topics?.[0]?.course_id;
  const enrolled = Boolean(courseId && isEnrolled(courseId));
  const showLockNote = !loading && total > 0 && Boolean(courseId) && !enrolled;

  // "What next": the first topic they haven't finished (enrolled learners only).
  const nextTopic = enrolled ? topics.find((t) => !completedTopics.includes(t.id)) : undefined;
  const defaultId = nextTopic?.id ?? topics?.[0]?.id ?? null;
  const activeId = expandedId === undefined ? defaultId : expandedId;

  return (
    <section aria-labelledby="curriculum" className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <div className="space-y-1">
          <h2 id="curriculum" className="font-heading text-xl font-bold tracking-tight text-foreground">
            Course curriculum
          </h2>
          {total > 0 && (
            <p className="text-sm text-muted-foreground">
              {total} {total === 1 ? "topic" : "topics"} · {formatDuration(totalMinutes)} total
            </p>
          )}
        </div>

        {total > 0 && enrolled && (
          <div className="flex w-full items-center gap-3 sm:w-56">
            <ProgressBar value={pct} label="Topics completed" className="flex-1" />
            <span className="text-sm font-bold tabular-nums text-muted-foreground">
              {completedCount}/{total}
            </span>
          </div>
        )}
      </div>

      {showLockNote && (
        <div className="flex items-start gap-3 rounded-xl border bg-muted/40 p-4 text-[15px] text-muted-foreground">
          <Lock className="mt-0.5 size-4 shrink-0" aria-hidden />
          <p>Topics unlock when you enroll. Tap any topic to enroll and start.</p>
        </div>
      )}

      {loading ? (
        <div className="divide-y overflow-hidden rounded-2xl border bg-card shadow-card" aria-busy="true">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-4 p-5">
              <Skeleton className="size-10 shrink-0 rounded-full" />
              <div className="flex-1 space-y-2.5">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : total === 0 ? (
        <EmptyState
          icon={Inbox}
          title="No topics yet"
          description="Lessons for this course are on the way. Check back soon."
          className="py-12"
        />
      ) : (
        <ol className="divide-y overflow-hidden rounded-2xl border bg-card shadow-card">
          {topics.map((topic, index) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              topicNumber={index + 1}
              isNext={nextTopic?.id === topic.id}
              isExpanded={activeId === topic.id}
              isCompleted={completedTopics.includes(topic.id)}
              onToggle={() => setExpandedId(activeId === topic.id ? null : topic.id)}
            />
          ))}
        </ol>
      )}
    </section>
  );
}
