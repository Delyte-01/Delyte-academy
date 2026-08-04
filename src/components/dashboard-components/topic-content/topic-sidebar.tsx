"use client";

import Link from "next/link";
import {
  BookOpen,
  ClipboardCheck,
  Clock,
  Signal,
  Paperclip,
  Download,
  FileText,
  Inbox,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Topic } from "@/types/topic";
import { TopicAttachment } from "@/types/attachment";

interface TopicSidebarProps {
  topic: Topic;
  attachments: TopicAttachment[];
  hasQuiz?: boolean;
}

const difficultyStyles: Record<string, string> = {
  beginner: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700",
  intermediate: "border-amber-500/30 bg-amber-500/10 text-amber-700",
  advanced: "border-rose-500/30 bg-rose-500/10 text-rose-700",
};

export function TopicSidebar({
  topic,
  attachments,
  hasQuiz = true,
}: TopicSidebarProps) {
  const handleDownload = (resource: TopicAttachment) => {
    const link = document.createElement("a");

    link.href = resource.file_url;
    link.download = resource.file_name || resource.title;
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const difficultyClass =
    difficultyStyles[topic.difficulty?.toLowerCase?.()] ??
    "border-border bg-muted text-foreground";

  return (
    <div className="hidden space-y-5 lg:sticky lg:top-6 md:block">
      {/* Topic Information */}
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold">Topic Information</CardTitle>
        </CardHeader>

        <CardContent className="space-y-2.5 p-4 pt-0">
          <div className="flex items-center justify-between rounded-xl border border-border/60 p-3 transition-colors hover:bg-muted/40">
            <span className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-4 w-4 text-primary" />
              Estimated Time
            </span>
            <span className="text-sm font-bold text-foreground">
              {topic.estimated_time} min
            </span>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border/60 p-3 transition-colors hover:bg-muted/40">
            <span className="flex items-center gap-2 text-xs text-muted-foreground">
              <Signal className="h-4 w-4 text-amber-600" />
              Difficulty
            </span>
            <Badge
              variant="outline"
              className={`capitalize ${difficultyClass}`}
            >
              {topic.difficulty}
            </Badge>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border/60 p-3 transition-colors hover:bg-muted/40">
            <span className="text-xs text-muted-foreground">Topic</span>
            <span className="text-sm font-bold text-foreground">
              {topic.order_index}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Resources */}
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="hidden pb-3 md:flex">
          <CardTitle className="flex items-center gap-2 text-sm font-bold">
            <Paperclip className="h-4 w-4 text-primary" />
            Resources
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-2 p-4 pt-0">
          {attachments.length === 0 ? (
            <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-muted-foreground/25 py-6 text-center">
              <Inbox className="h-5 w-5 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">
                No resources available for this topic.
              </p>
            </div>
          ) : (
            attachments.map((resource) => (
              <div
                key={resource.id}
                className="group flex items-center justify-between gap-2 rounded-xl border border-border/60 p-3 transition-colors hover:border-primary/30 hover:bg-primary/[0.03]"
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-transform group-hover:scale-105">
                    <FileText className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium text-foreground">
                      {resource.title}
                    </p>
                    <p className="truncate text-[11px] text-muted-foreground">
                      {resource.file_type} ·{" "}
                      {(resource.file_size / 1024 / 1024).toFixed(1)} MB
                    </p>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="flex-shrink-0 group-hover:bg-primary/10 group-hover:text-primary"
                  onClick={() => handleDownload(resource)}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold">Quick Actions</CardTitle>
        </CardHeader>

        <CardContent className="space-y-2 p-4 pt-0">
          <Button variant="outline" className="w-full justify-start" asChild>
            <Link href={`/dashboard/courses/${topic.course_id}`}>
              <BookOpen className="mr-2 h-4 w-4" />
              Back to Course
            </Link>
          </Button>

          {hasQuiz && (
            <Button
              className="w-full justify-start shadow-sm transition-transform hover:scale-[1.01]"
              asChild
            >
              <Link href={`/dashboard/topics/${topic.id}/quiz`}>
                <ClipboardCheck className="mr-2 h-4 w-4" />
                Take Quiz
              </Link>
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
