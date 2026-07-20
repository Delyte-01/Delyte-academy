"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  CheckCircle2,
  ListChecks,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { TopicDifficulty, TopicStatus } from "./topic-form";

gsap.registerPlugin(useGSAP);

interface TopicPreviewCardProps {
  courseName: string;
  courseCode: string;
  title: string;
  slug: string;
  description: string;
  estimatedTime: string;
  difficulty: TopicDifficulty;
  status: TopicStatus;
  objectives: string[];
  thumbnail?: string;
}

const difficultyStyles: Record<TopicDifficulty, string> = {
  beginner: "border-emerald-500/30 bg-emerald-500/15 text-emerald-700",
  intermediate: "border-amber-500/30 bg-amber-500/15 text-amber-700",
  advanced: "border-rose-500/30 bg-rose-500/15 text-rose-700",
};

const statusStyles: Record<TopicStatus, string> = {
  draft: "border-amber-500/30 bg-amber-500/15 text-amber-700",
  published: "border-emerald-500/30 bg-emerald-500/15 text-emerald-700",
};

export function TopicPreviewCard({
  courseName,
  courseCode,
  title,
  slug,
  description,
  estimatedTime,
  difficulty,
  status,
  objectives,
  thumbnail,
}: TopicPreviewCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ref.current,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.5, delay: 0.15, ease: "power2.out" }
      );
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className="space-y-3 lg:sticky lg:top-24">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Live Preview
      </p>
      <Card className="overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl">
        {/* Gradient banner */}
        <div className="relative h-40 w-full overflow-hidden bg-gradient-to-br from-blue-500/25 via-muted to-muted">
          {thumbnail && (
            <img
              src={thumbnail}
              alt="Thumbnail"
              className="  h-full w-full border-2 border-background object-cover shadow-md"
            />
          )}
        </div>

        <CardContent className="p-5">
          {/* Course context */}
          <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
            <BookOpen className="h-3 w-3" />
            <span className="line-clamp-1">{courseName}</span>
            <span className="rounded bg-muted px-1 py-px font-mono text-[10px]">
              {courseCode}
            </span>
          </div>

          {/* Badges */}
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className={cn(
                "text-xs transition-colors duration-300",
                difficultyStyles[difficulty]
              )}
            >
              {difficulty}
            </Badge>
            <Badge
              variant="outline"
              className={cn(
                "text-xs transition-colors duration-300",
                statusStyles[status]
              )}
            >
              {status}
            </Badge>
          </div>

          {/* Title */}
          <h3 className="mt-2 line-clamp-2 text-sm font-bold text-foreground">
            {title || "Untitled Topic"}
          </h3>
          {slug && (
            <p className="mt-0.5 truncate font-mono text-xs text-muted-foreground">
              /topics/{slug}
            </p>
          )}

          {/* Description */}
          <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-muted-foreground">
            {description ||
              "Topic description will appear here. Start typing to see the live preview update."}
          </p>

          {/* Footer stats */}
          <div className="mt-3 flex items-center gap-3 border-t pt-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {estimatedTime || "—"}
            </span>
            <span className="inline-flex items-center gap-1">
              <ListChecks className="h-3 w-3" />
              {objectives.length} objectives
            </span>
          </div>

          {/* Objectives preview */}
          {objectives.length > 0 && (
            <ul className="mt-3 space-y-1.5">
              {objectives.slice(0, 3).map((obj, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-1.5 text-xs text-muted-foreground animate-slide-in-right"
                  style={{ animationDelay: `${idx * 60}ms` }}
                >
                  <CheckCircle2 className="mt-0.5 h-3 w-3 flex-shrink-0 text-emerald-600" />
                  <span className="line-clamp-1">{obj}</span>
                </li>
              ))}
              {objectives.length > 3 && (
                <li className="text-xs text-muted-foreground">
                  + {objectives.length - 3} more
                </li>
              )}
            </ul>
          )}
        </CardContent>
      </Card>
      <p className="text-center text-xs text-muted-foreground">
        This is how the topic will appear to students.
      </p>
    </div>
  );
}
