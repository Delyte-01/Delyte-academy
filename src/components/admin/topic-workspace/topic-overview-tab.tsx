"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FolderTree,
  Clock,
  BarChart2,
  Calendar,
  User,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Status = "draft" | "published";
type Difficulty = "beginner" | "intermediate" | "advanced";

interface TopicOverviewTabProps {
  title: string;
  description: string;
  code: string;
  difficulty: Difficulty;
  duration: number;
  status: Status;
  createdAt: string;
  updatedAt: string;
  author?: string;
  stats: { label: string; value: string }[];
}

const difficultyStyles: Record<Difficulty, string> = {
  beginner: "border-primary/30 bg-primary/15 text-primary",
  intermediate: "border-warning/30 bg-warning/15 text-warning",
  advanced: "border-destructive/30 bg-destructive/15 text-destructive",
};

const statusStyles: Record<Status, string> = {
  published: "border-primary/30 bg-primary/15 text-primary",
  draft: "border-warning/30 bg-warning/15 text-warning",
};

export function TopicOverviewTab({
  title,
  description,
  code,
  difficulty,
  duration,
  status,
  createdAt,
  updatedAt,
  author,
  stats,
}: TopicOverviewTabProps) {
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);

  const meta = [
    {
      icon: FolderTree,
      label: "Topic Code",
      value: code,
      color: "text-info",
      bg: "bg-info/10",
    },
    {
      icon: BarChart2,
      label: "Difficulty",
      value: difficulty,
      color: "text-warning",
      bg: "bg-warning/10",
    },
    {
      icon: Clock,
      label: "Estimated Duration",
      value: duration,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      icon: FileText,
      label: "Status",
      value: status,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      icon: Calendar,
      label: "Created",
      value: createdAt,
      color: "text-destructive",
      bg: "bg-destructive/10",
    },
    {
      icon: Calendar,
      label: "Last Updated",
      value: updatedAt,
      color: "text-destructive",
      bg: "bg-destructive/10",
    },
    {
      icon: User,
      label: "Author",
      value: author,
      color: "text-info",
      bg: "bg-info/10",
    },
  ];

  useEffect(() => {
    const tl = gsap.timeline();

    const leftCards = gsap.utils.toArray<HTMLElement>(
      leftColRef.current?.querySelectorAll("[data-overview-card]") ?? []
    );
    tl.fromTo(
      leftCards,
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: "power2.out" },
      0
    );

    const rightCards = gsap.utils.toArray<HTMLElement>(
      rightColRef.current?.querySelectorAll("[data-overview-card]") ?? []
    );
    tl.fromTo(
      rightCards,
      { opacity: 0, x: 12 },
      { opacity: 1, x: 0, duration: 0.4, stagger: 0.08, ease: "power2.out" },
      0.05
    );

    const glanceTiles = gsap.utils.toArray<HTMLElement>(
      leftColRef.current?.querySelectorAll("[data-glance-tile]") ?? []
    );
    glanceTiles.forEach((tile) => {
      const valueEl = tile.querySelector<HTMLElement>("[data-glance-value]");
      if (!valueEl) return;
      const raw = valueEl.dataset.rawValue ?? "";
      const match = raw.match(/^(\D*)([\d,]+)(.*)$/);
      if (!match) return;
      const [, prefix, numStr, suffix] = match;
      const target = parseInt(numStr.replace(/,/g, ""), 10);
      valueEl.textContent = `${prefix}0${suffix}`;
      const counter = { val: 0 };
      gsap.to(counter, {
        val: target,
        duration: 0.8,
        delay: 0.3,
        ease: "power2.out",
        onUpdate: () => {
          valueEl.textContent = `${prefix}${Math.round(
            counter.val
          ).toLocaleString()}${suffix}`;
        },
      });
    });

  }, []);

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div ref={leftColRef} className="space-y-6 lg:col-span-2">
        {/* About */}
        <Card data-overview-card className="border-border/60">
          <CardHeader className="pb-4">
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="text-base font-bold first-letter:capitalize">{title}</CardTitle>
              <Badge
                variant="outline"
                className={cn("text-xs", statusStyles[status])}
              >
                {status}
              </Badge>
              <Badge
                variant="outline"
                className={cn("text-xs", difficultyStyles[difficulty])}
              >
                {difficulty}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          </CardContent>
        </Card>

        {/* Quick stats */}
        <Card data-overview-card className="border-border/60">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-bold">At a glance</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map(({ label, value }) => (
              <div
                key={label}
                data-glance-tile
                className="group rounded-xl border border-border/60 p-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-sm"
              >
                <p
                  data-glance-value
                  data-raw-value={value}
                  className="text-2xl font-extrabold tracking-tight tabular-nums text-foreground"
                >
                  {value}
                </p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Right column */}
      <div ref={rightColRef} className="space-y-6">
        {/* Metadata */}
        <Card data-overview-card className="border-border/60">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-bold">Topic details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {meta.map(({ icon: Icon, label, value, color, bg }) => (
              <div key={label} className="flex items-center gap-3">
                <div
                  className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${bg}`}
                >
                  <Icon className={`h-4 w-4 ${color}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="truncate text-sm font-semibold text-foreground">
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
