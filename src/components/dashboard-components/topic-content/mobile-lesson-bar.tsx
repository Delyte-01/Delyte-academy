"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
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

/** Below xl: sticky bar so the next sensible action is always one thumb-tap away. */
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
    <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/90 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl xl:hidden">
      <div className="mx-auto flex max-w-xl items-center gap-4">
        <div className="min-w-0 flex-1 space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground">
            Topic {topicNumber} of {totalTopics}
          </p>
          <ProgressBar value={pct} size="sm" label="Position in course" />
        </div>

        {!isCompleted ? (
          <Button variant="brand" size="lg" className="shrink-0" onClick={onComplete} disabled={completing}>
            {completing ? "Saving…" : "Mark complete"}
          </Button>
        ) : nextTopic ? (
          <Button variant="brand" size="lg" className="shrink-0" asChild>
            <Link href={`/dashboard/topics/${nextTopic.id}`}>Next topic</Link>
          </Button>
        ) : (
          <Button variant="brand" size="lg" className="shrink-0" asChild>
            <Link href={`/dashboard/topics/${topic.id}/quiz`}>Take quiz</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
