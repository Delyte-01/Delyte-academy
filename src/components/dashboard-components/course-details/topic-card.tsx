"use client";

import {
  ChevronDown,
  Clock,
  BookOpen,
  ClipboardCheck,
  CheckCircle,
  Play,
  Lock,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DifficultyLevel, Topic } from "@/types/topic";
import { useRouter } from "next/navigation";

interface TopicCardProps {
  topic: Topic;
  isExpanded: boolean;
  onToggle: () => void;
  topicNumber: number;
  isCompleted: boolean;
}

export function TopicCard({
  topic,
  isExpanded,
  onToggle,
  topicNumber,
  isCompleted,
}: TopicCardProps) {
  const router = useRouter();

  const difficultyStyles: Record<DifficultyLevel, string> = {
    beginner: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
    intermediate: "bg-amber-500/10 text-amber-700 border-amber-500/20",
    advanced: "bg-rose-500/10 text-rose-700 border-rose-500/20",
  };

  const status = String(topic.status ?? "");
  const isCurrent = status === "current";
  const isLocked = status === "locked";

  const statusMeta = isCompleted
    ? { icon: CheckCircle, className: "bg-emerald-500/10 text-emerald-600" }
    : isCurrent
      ? { icon: Play, className: "bg-primary/10 text-primary" }
      : isLocked
        ? { icon: Lock, className: "bg-muted text-muted-foreground" }
        : { icon: BookOpen, className: "bg-muted text-muted-foreground" };

  const StatusIcon = statusMeta.icon;

  const handleContentClick = () => {
    if (isLocked) return;
    router.push(`/dashboard/topics/${topic.id}`);
  };

  const handleQuizClick = () => {
    if (isLocked) return;
    router.push(`/dashboard/topics/${topic.id}/quiz`);
  };

  return (
    <Card
      className={cn(
        "overflow-hidden border-border/60 transition-all duration-300",
        isExpanded && "shadow-md ring-1 ring-primary/15",
        isLocked && "opacity-70",
      )}
    >
      {/* Accordion header */}
      <button
        onClick={onToggle}
        disabled={isLocked}
        className={cn(
          "flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-muted/30 disabled:cursor-not-allowed sm:gap-4 sm:p-5",
        )}
      >
        <div
          className={cn(
            "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl transition-colors sm:h-11 sm:w-11",
            statusMeta.className,
          )}
        >
          <StatusIcon className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className={cn("capitalize", difficultyStyles[topic.difficulty])}
            >
              {topic.difficulty}
            </Badge>
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Topic {topicNumber}
            </h2>
            {isCurrent && (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                In progress
              </span>
            )}
          </div>

          <h1 className="truncate text-sm font-bold capitalize text-foreground">
            {topic.title}
          </h1>
          <p className="line-clamp-1 text-xs text-muted-foreground">
            {topic.description}
          </p>
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Clock className="h-3 w-3" />
            {topic.estimated_time}min read
          </div>
        </div>

        {isLocked ? (
          <Lock className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
        ) : (
          <ChevronDown
            className={cn(
              "h-5 w-5 flex-shrink-0 text-muted-foreground transition-transform duration-300",
              isExpanded && "rotate-180",
            )}
          />
        )}
      </button>

      {/* Accordion content */}
      {isExpanded && !isLocked && (
        <div className="border-t border-border/60 bg-muted/20 p-4 sm:p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            {/* Study Content */}
            <div className="group flex items-center gap-3 rounded-xl border border-border/60 bg-card p-4 transition-all hover:border-primary/30 hover:bg-primary/[0.03] hover:shadow-sm">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-105">
                <BookOpen className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground">
                  Study Content
                </p>
                <p className="text-xs text-muted-foreground">
                  Read the learning material
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="flex-shrink-0 group-hover:border-primary/40 group-hover:bg-primary/10 group-hover:text-primary"
                onClick={handleContentClick}
              >
                Open
              </Button>
            </div>

            {/* Quiz */}
            <div className="group flex items-center gap-3 rounded-xl border border-border/60 bg-card p-4 transition-all hover:border-amber-500/30 hover:bg-amber-500/[0.04] hover:shadow-sm">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 transition-transform group-hover:scale-105">
                <ClipboardCheck className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground">Quiz</p>
                <p className="text-xs text-muted-foreground">
                  Test your knowledge
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="flex-shrink-0 group-hover:border-amber-500/40 group-hover:bg-amber-500/10 group-hover:text-amber-700"
                onClick={handleQuizClick}
              >
                Start
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
