"use client";

import { useEffect, useState } from "react";
import { ListChecks, Inbox } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { TopicCard } from "./topic-card";
import { Topic } from "@/types/topic";
import { useEnrollment } from "@/hooks/useEnrollment";
import { useAuth } from "@/hooks/useAuth";


interface TopicAccordionProps {
  topics: Topic[];
  loading?: boolean;
  completedTopics: string[];
  
}

export function TopicAccordion({
  completedTopics,
  topics,
  loading = false,
  
}: TopicAccordionProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { user } = useAuth();
  const {
    refresh: refreshEnrollments,
  } = useEnrollment(user?.id); // Add this line to use the isEnrolled function




  useEffect(() => {
    if (topics && topics.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setExpandedId(
        topics.find((t) => String(t.status) === "current")?.id ?? topics[0].id,
      );
    }
  }, [topics]);

  const completedCount =
    topics?.filter((t) => String(t.status) === "completed").length ?? 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
            <ListChecks className="h-5 w-5 text-primary" />
            Course Topics
          </h2>
          <Badge variant="outline" className="text-xs font-medium">
            {topics?.length ?? 0} {topics?.length === 1 ? "topic" : "topics"}
          </Badge>
        </div>
        {topics && topics.length > 0 && (
          <span className="text-xs font-medium text-muted-foreground">
            {completedCount}/{topics.length} completed
          </span>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      ) : !topics || topics.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-muted-foreground/25 bg-muted/20 p-10 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
            <Inbox className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-sm font-semibold text-foreground">
            No topics available yet
          </p>
          <p className="text-xs text-muted-foreground">
            Check back soon — new lessons are on the way.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {topics.map((topic, index) => (
            <TopicCard
              key={topic.id}
              topic={topic}
              topicNumber={index + 1}
              isExpanded={expandedId === topic.id}
              isCompleted={completedTopics.includes(topic.id)}
              refreshEnrollments={refreshEnrollments}
              onToggle={() => {
                setExpandedId((prev) => (prev === topic.id ? null : topic.id));
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
