"use client";

import { useId } from "react";
import Link from "next/link";
import {
  BookOpen,
  Check,
  ChevronDown,
  ClipboardCheck,
  Clock,
  Lock,
  Play,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DifficultyLevel, Topic } from "@/types/topic";
import { useEnrollment } from "@/context/enrollment-context";

interface TopicCardProps {
  topic: Topic;
  topicNumber: number;
  isExpanded: boolean;
  isCompleted: boolean;
  /** The first topic the learner hasn't finished (only when enrolled). */
  isNext: boolean;
  onToggle: () => void;
}

const difficultyVariant: Record<DifficultyLevel, "success" | "warning" | "danger"> = {
  beginner: "success",
  intermediate: "warning",
  advanced: "danger",
};

/** One row of the curriculum list. Unlocks the course on tap when not enrolled. */
export function TopicCard({
  topic,
  topicNumber,
  isExpanded,
  isCompleted,
  isNext,
  onToggle,
}: TopicCardProps) {
  const { isEnrolled, enroll } = useEnrollment();
  const uid = useId();
  const headerId = `${uid}-header`;
  const panelId = `${uid}-panel`;

  const locked = !isEnrolled(topic.course_id);
  const open = isExpanded && !locked;

  // The enrollment context updates immediately, so no manual refresh is needed.
  const unlock = async () => {
    const request = enroll(topic.course_id);
    toast.promise(request, {
      loading: "Enrolling you in this course…",
      success: "You're enrolled. All topics are unlocked.",
      error: "Couldn't enroll. Try again.",
    });
    try {
      await request;
      return true;
    } catch {
      return false;
    }
  };

  const handleToggle = async () => {
    if (locked) {
      if (await unlock()) onToggle();
      return;
    }
    onToggle();
  };

  const node = isCompleted
    ? { icon: <Check className="size-4" strokeWidth={3} />, cls: "bg-success text-primary-foreground" }
    : locked
      ? { icon: <Lock className="size-4" />, cls: "bg-muted text-muted-foreground" }
      : isNext
        ? { icon: <Play className="size-4 fill-current" />, cls: "bg-brand-gradient shadow-brand" }
        : { icon: <span className="tabular-nums">{topicNumber}</span>, cls: "bg-muted text-foreground" };

  return (
    <li className={cn("transition-colors", open && "bg-primary-soft/30")}>
      <button
        type="button"
        id={headerId}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={handleToggle}
        className="flex min-h-[76px] w-full cursor-pointer items-start gap-4 p-4 text-left outline-none transition-colors hover:bg-muted/40 focus-visible:ring-[3px] focus-visible:ring-inset focus-visible:ring-ring/40 sm:p-5"
      >
        <span
          aria-hidden
          className={cn(
            "mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold",
            node.cls,
          )}
        >
          {node.icon}
        </span>

        <span className="min-w-0 flex-1 space-y-1.5">
          <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
            <Badge variant={difficultyVariant[topic.difficulty] ?? "muted"} size="sm" className="capitalize">
              {topic.difficulty}
            </Badge>
            <span className="inline-flex items-center gap-1 text-[13px] text-muted-foreground">
              <Clock className="size-3.5" aria-hidden />
              {topic.estimated_time} min read
            </span>
            {isNext && !isCompleted && (
              <Badge variant="brand" size="sm">
                Up next
              </Badge>
            )}
            {isCompleted && (
              <Badge variant="success" size="sm">
                Done
              </Badge>
            )}
          </span>

          <span className="block text-base font-bold capitalize leading-snug text-foreground">
            {topic.title}
          </span>
          <span
            className={cn(
              "block text-[15px] leading-relaxed text-muted-foreground",
              !open && "line-clamp-2",
            )}
          >
            {topic.description}
          </span>
        </span>

        {locked ? (
          <Lock className="mt-2 size-4 shrink-0 text-muted-foreground" aria-label="Locked" />
        ) : (
          <ChevronDown
            aria-hidden
            className={cn(
              "mt-2 size-5 shrink-0 text-muted-foreground transition-transform duration-300 motion-reduce:transition-none",
              open && "rotate-180",
            )}
          />
        )}
      </button>

      {/* Height animation without measuring */}
      <div
        id={panelId}
        role="region"
        aria-labelledby={headerId}
        className={cn(
          "grid transition-[grid-template-rows,visibility] duration-300 ease-out motion-reduce:transition-none",
          open ? "visible grid-rows-[1fr]" : "invisible grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-2 px-4 pb-5 pl-4 sm:flex-row sm:px-5 sm:pb-5 sm:pl-[76px]">
            <Button asChild variant={isNext ? "brand" : "default"} className="w-full sm:w-auto">
              <Link href={`/dashboard/topics/${topic.id}`}>
                <BookOpen />
                {isCompleted ? "Review lesson" : "Read lesson"}
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link href={`/dashboard/topics/${topic.id}/quiz`}>
                <ClipboardCheck />
                Take quiz
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </li>
  );
}
