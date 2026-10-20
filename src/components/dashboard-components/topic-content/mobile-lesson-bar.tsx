"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Topic } from "@/types/topic";

interface Props {
  topic: Topic;
  nextTopic: Topic | null;
  topicNumber: number;
  totalTopics: number;
  isCompleted: boolean;
  completing: boolean;
  onComplete: () => void;
}

const cta = "shrink-0 bg-emerald-600 text-white hover:bg-emerald-500";

/** Mobile-only sticky bar: the next sensible action is always one tap away. */
export function MobileLessonBar({
  topic,
  nextTopic,
  topicNumber,
  totalTopics,
  isCompleted,
  completing,
  onComplete,
}: Props) {
  const pct = totalTopics ? Math.round((topicNumber / totalTopics) * 100) : 0;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background/90 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur lg:hidden">
      <div className="mx-auto flex max-w-xl items-center gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-muted-foreground">
            Topic {topicNumber} of {totalTopics}
          </p>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-emerald-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {!isCompleted ? (
          <Button
            size="lg"
            className={cta}
            onClick={onComplete}
            disabled={completing}
          >
            {completing ? "Saving…" : "Mark complete"}
          </Button>
        ) : nextTopic ? (
          <Button size="lg" className={cta} asChild>
            <Link href={`/dashboard/topics/${nextTopic.id}`}>Next topic</Link>
          </Button>
        ) : (
          <Button size="lg" className={cta} asChild>
            <Link href={`/dashboard/topics/${topic.id}/quiz`}>Take quiz</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
