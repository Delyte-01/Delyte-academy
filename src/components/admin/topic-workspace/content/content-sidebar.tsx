"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Clock,
  BarChart2,
  Calendar,
  Eye,
  Copy,
  FileDown,
  Link as LinkIcon,
  CheckCircle2,
  Circle,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Status = "draft" | "published";
type Difficulty = "beginner" | "intermediate" | "advanced";

interface ContentSidebarProps {
  status: Status;
  lastUpdated: string;
  createdAt: string;
  readingTime: number;
  difficulty: Difficulty;
}

const statusStyles: Record<Status, string> = {
  published: "border-emerald-500/30 bg-emerald-500/15 text-emerald-700",
  draft: "border-amber-500/30 bg-amber-500/15 text-amber-700",
};

const checklist = [
  { label: "Introduction", done: true },
  { label: "Objectives", done: true },
  { label: "Prerequisites", done: true },
  { label: "Main Content", done: true },
  { label: "Summary", done: true },
  { label: "Resources", done: false },
];

const quickActions: { icon: LucideIcon; label: string }[] = [
  { icon: Eye, label: "Preview Topic" },
  { icon: Copy, label: "Duplicate Content" },
  { icon: FileDown, label: "Export PDF" },
  { icon: LinkIcon, label: "Copy Link" },
];

export function ContentSidebar({
  status,
  lastUpdated,
  createdAt,
  readingTime,
  difficulty,
}: ContentSidebarProps) {
  const [premium, setPremium] = useState(false);
  const completedCount = checklist.filter((c) => c.done).length;
  const progress = Math.round((completedCount / checklist.length) * 100);

  const details = [
    { icon: BarChart2, label: "Difficulty", value: difficulty },
    { icon: Clock, label: "Reading Time", value: readingTime },
    { icon: Calendar, label: "Created", value: createdAt },
    { icon: Calendar, label: "Updated", value: lastUpdated },
  ];

  return (
    <div className="space-y-5 lg:sticky lg:top-24">
      {/* Publishing */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold">Publishing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Status</span>
            <Badge
              variant="outline"
              className={cn("text-xs", statusStyles[status])}
            >
              {status}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-foreground">
                Visibility
              </p>
              <p className="text-[10px] text-muted-foreground">
                {premium ? "Premium members only" : "Free for everyone"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "text-[10px] font-medium",
                  !premium && "text-foreground"
                )}
              >
                Free
              </span>
              <Switch checked={premium} onCheckedChange={setPremium} />
              <span
                className={cn(
                  "text-[10px] font-medium",
                  premium && "text-foreground"
                )}
              >
                Premium
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Topic Details */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold">Topic Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {details.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-muted">
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-sm font-semibold text-foreground">{value}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Content Checklist */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-bold">
              Content Checklist
            </CardTitle>
            <span className="text-xs font-semibold text-muted-foreground">
              {completedCount}/{checklist.length}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-center text-xs text-muted-foreground">
              {progress}% complete
            </p>
          </div>
          <ul className="space-y-1.5">
            {checklist.map((item) => (
              <li
                key={item.label}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors",
                  item.done ? "bg-emerald-500/5" : "hover:bg-muted/50"
                )}
              >
                {item.done ? (
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-600" />
                ) : (
                  <Circle className="h-4 w-4 flex-shrink-0 text-muted-foreground/40" />
                )}
                <span
                  className={cn(
                    "text-xs",
                    item.done
                      ? "font-medium text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-2">
          {quickActions.map(({ icon: Icon, label }) => (
            <Button
              key={label}
              variant="outline"
              size="sm"
              className="justify-start transition-all duration-200 hover:translate-x-0.5"
            >
              <Icon className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
              {label}
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
