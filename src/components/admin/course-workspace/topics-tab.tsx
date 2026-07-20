"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Plus,
  MoreVertical,
  Pencil,
  UploadCloud,
  EyeOff,
  Trash2,
  Clock,
  FileText,
  ClipboardList,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Topic } from "@/types/topic";
import { TopicService } from "@/services/topic";
import { toast } from "sonner";
import { TopicStatus } from "../topics/topic-form";

interface TopicsPageProp {
  topics: Topic[];
  courseId: string;
  setTopics: React.Dispatch<React.SetStateAction<Topic[]>>;
}

type Status = "draft" | "published";
type Difficulty = "beginner" | "intermediate" | "advanced";

const difficultyStyles: Record<Difficulty, string> = {
  beginner: "border-emerald-500/30 bg-emerald-500/15 text-emerald-700",
  intermediate: "border-amber-500/30 bg-amber-500/15 text-amber-700",
  advanced: "border-rose-500/30 bg-rose-500/15 text-rose-700",
};

const statusStyles: Record<Status, string> = {
  published: "border-emerald-500/30 bg-emerald-500/15 text-emerald-700",
  draft: "border-amber-500/30 bg-amber-500/15 text-amber-700",
};

export function TopicsTab({ courseId, topics, setTopics }: TopicsPageProp) {
  const toolbarRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(
      toolbarRef.current,
      { opacity: 0, y: -8 },
      { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }
    );

    const cards = gsap.utils.toArray<HTMLElement>(
      gridRef.current?.querySelectorAll("[data-topic-card]") ?? []
    );
    tl.fromTo(
      cards,
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: "power2.out" },
      "-=0.15"
    );
  }, []);

  const handleNavigateId = () => {
    router.push(`/admin/courses/${courseId}/topics/create`);
  };

  const handleDelete = async (id: string) => {
    try {
      await TopicService.deleteTopic(id);

      toast.success("Topic deleted.");

      setTopics((prev) => prev.filter((topic) => topic.id !== id));
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete topic."
      );
    }
  };

  const handleChangeStatus = async (id: string, status: TopicStatus) => {
    try {
      await TopicService.changeStatus(id, status);

      toast.success(
        status === "published" ? "Topic published." : "Topic moved to draft."
      );

      setTopics((prev) =>
        prev.map((topic) => (topic.id === id ? { ...topic, status } : topic))
      );
    } catch (error) {
      toast.error(`Failed to update topic. ${error}`);
    }
  };
  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div
        ref={toolbarRef}
        className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="relative max-w-sm flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search topics..."
            className="border-border/60 bg-muted/40 pl-9 transition-colors focus-visible:bg-background"
          />
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Filter: All
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem>All</DropdownMenuItem>
              <DropdownMenuItem>Draft</DropdownMenuItem>
              <DropdownMenuItem>Published</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Sort: Newest
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem>Newest first</DropdownMenuItem>
              <DropdownMenuItem>Oldest first</DropdownMenuItem>
              <DropdownMenuItem>Title (A–Z)</DropdownMenuItem>
              <DropdownMenuItem>Duration</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            size="sm"
            onClick={handleNavigateId}
            className="shadow-sm shadow-primary/20 transition-shadow hover:shadow-md hover:shadow-primary/30"
          >
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Add Topic
          </Button>
        </div>
      </div>

      {/* Topic cards */}
      <div ref={gridRef} className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {topics.length === 0 ? (
          <div>empty data</div>
        ) : (
          topics.map((topic) => (
            <Card
              className=" border-border/60 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 cursor-pointer"
              key={topic.id}
              onClick={() =>
                router.push(`/admin/courses/${courseId}/topics/${topic.id}`)
              }
              data-topic-card
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px]",
                          difficultyStyles[topic.difficulty]
                        )}
                      >
                        {topic.difficulty}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px]",
                          statusStyles[topic.status]
                        )}
                      >
                        {topic.status}
                      </Badge>
                    </div>
                    <h3 className="mt-2 line-clamp-1 text-sm font-bold text-foreground">
                      {topic.title}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                      {topic.description}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 flex-shrink-0 text-muted-foreground "
                        onClick={(e) => e.preventDefault()}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();

                          router.push(
                            `/admin/courses/${courseId}/topics/${topic.id}/edit`
                          );
                        }}
                      >
                        <Pencil className="mr-2 h-3.5 w-3.5" />
                        Edit
                      </DropdownMenuItem>
                      {topic.status === "published" ? (
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleChangeStatus(topic.id, "draft");
                          }}
                        >
                          <EyeOff className="mr-2 h-3.5 w-3.5" />
                          Unpublish
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleChangeStatus(topic.id, "published");
                          }}
                        >
                          <UploadCloud className="mr-2 h-3.5 w-3.5" />
                          Publish
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleDelete(topic.id);
                        }}
                      >
                        <Trash2 className="mr-2 h-3.5 w-3.5" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Footer stats */}
                <div className="mt-3 flex items-center gap-3 border-t border-border/60 pt-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {topic.estimated_time}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    {/* {topic.resources} */}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <ClipboardList className="h-3 w-3" />
                    {/* {topic.practiceSets} */}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <HelpCircle className="h-3 w-3" />
                    {/* {topic.questions} */}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
