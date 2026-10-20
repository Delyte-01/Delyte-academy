"use client";

import { useId } from "react";
import { useRouter } from "next/navigation";
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
import { cn } from "@/lib/utils";
import { DifficultyLevel, Topic } from "@/types/topic";
import { useEnrollment } from "@/context/enrollment-context";

interface TopicCardProps {
  topic: Topic;
  topicNumber: number;
  isExpanded: boolean;
  isCompleted: boolean;
  isLast: boolean;
  onToggle: () => void;
}

const difficultyStyles: Record<DifficultyLevel, string> = {
  beginner:
    "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  intermediate:
    "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400",
  advanced:
    "border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-400",
};

export function TopicCard({
  topic,
  topicNumber,
  isExpanded,
  isCompleted,
  isLast,
  onToggle,
}: TopicCardProps) {
  const router = useRouter();
  const { isEnrolled, enroll } = useEnrollment();
  const uid = useId();
  const headerId = `${uid}-header`;
  const panelId = `${uid}-panel`;

  const locked = !isEnrolled(topic.course_id);
  const isCurrent = String(topic.status ?? "") === "current";
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
    ? {
        icon: <Check className="size-4" strokeWidth={3} />,
        cls: "bg-emerald-500 text-white",
      }
    : locked
      ? {
          icon: <Lock className="size-4" />,
          cls: "bg-muted text-muted-foreground",
        }
      : isCurrent
        ? {
            icon: <Play className="size-4 fill-current" />,
            cls: "bg-emerald-600 text-white shadow-[0_0_0_4px] shadow-emerald-500/20",
          }
        : {
            icon: <span className="tabular-nums">{topicNumber}</span>,
            cls: "bg-muted text-foreground",
          };

  return (
    <li className="relative flex gap-3 sm:gap-4">
      {/* Timeline rail */}
      <div className="flex flex-col items-center">
        <span
          className={cn(
            "z-10 flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold ring-4 ring-background transition-colors",
            node.cls,
          )}
          aria-hidden
        >
          {node.icon}
        </span>
        {!isLast && (
          <span
            className={cn(
              "mt-1 w-px flex-1",
              isCompleted ? "bg-emerald-500/40" : "bg-border",
            )}
            aria-hidden
          />
        )}
      </div>

      <div
        className={cn(
          "mb-4 min-w-0 flex-1 rounded-2xl border bg-card transition-[box-shadow,border-color] duration-300",
          open ? "border-emerald-500/30 shadow-sm" : "border-border/60",
          locked && "bg-muted/30",
        )}
      >
        <button
          type="button"
          id={headerId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={handleToggle}
          className="flex w-full cursor-pointer items-start gap-3 rounded-2xl p-4 text-left transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 sm:p-5"
        >
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
              <Badge
                variant="outline"
                className={cn("capitalize", difficultyStyles[topic.difficulty])}
              >
                {topic.difficulty}
              </Badge>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="size-3" />
                {topic.estimated_time} min read
              </span>
              {isCurrent && !isCompleted && (
                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                  In progress
                </span>
              )}
            </div>

            <h3 className="text-base font-semibold capitalize leading-snug text-foreground">
              {topic.title}
            </h3>
            <p
              className={cn(
                "text-sm leading-relaxed text-muted-foreground",
                !open && "line-clamp-2",
              )}
            >
              {topic.description}
            </p>
          </div>

          {locked ? (
            <Lock
              className="mt-1 size-4 shrink-0 text-muted-foreground"
              aria-label="Locked"
            />
          ) : (
            <ChevronDown
              aria-hidden
              className={cn(
                "mt-1 size-5 shrink-0 text-muted-foreground transition-transform duration-300 motion-reduce:transition-none",
                open && "rotate-180",
              )}
            />
          )}
        </button>

        {/* Smooth height animation without measuring */}
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
            <div className="grid gap-2 border-t border-border/60 p-3 sm:grid-cols-2 sm:p-4">
              <ActionTile
                icon={<BookOpen className="size-5" />}
                title="Study content"
                hint="Read the lesson"
                tone="emerald"
                onClick={() => router.push(`/dashboard/topics/${topic.id}`)}
              />
              <ActionTile
                icon={<ClipboardCheck className="size-5" />}
                title="Quiz"
                hint="Check what you learned"
                tone="amber"
                onClick={() =>
                  router.push(`/dashboard/topics/${topic.id}/quiz`)
                }
              />
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

function ActionTile({
  icon,
  title,
  hint,
  tone,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  hint: string;
  tone: "emerald" | "amber";
  onClick: () => void;
}) {
  const tones = {
    emerald:
      "bg-emerald-500/10 text-emerald-700 hover:border-emerald-500/40 dark:text-emerald-400",
    amber:
      "bg-amber-500/10 text-amber-700 hover:border-amber-500/40 dark:text-amber-400",
  }[tone];

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex min-h-14 cursor-pointer items-center gap-3 rounded-xl border border-border/60 bg-background p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50",
        tones
          .split(" ")
          .filter((c) => c.startsWith("hover:") || c.startsWith("dark:hover"))
          .join(" "),
      )}
    >
      <span
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-lg",
          tones
            .split(" ")
            .filter((c) => !c.startsWith("hover:"))
            .join(" "),
        )}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-foreground">
          {title}
        </span>
        <span className="block text-xs text-muted-foreground">{hint}</span>
      </span>
      <ChevronDown
        className="size-4 -rotate-90 text-muted-foreground transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
        aria-hidden
      />
    </button>
  );
}
