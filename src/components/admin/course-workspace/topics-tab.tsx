"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Clock,
  EyeOff,
  FolderTree,
  MoreVertical,
  Pencil,
  Plus,
  Search,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Reveal } from "@/components/motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "@/components/empty-states";
import { cn } from "@/lib/utils";
import { Topic } from "@/types/topic";
import { TopicService } from "@/services/topic";
import { TopicStatus } from "../topics/topic-form";

interface TopicsPageProp {
  topics: Topic[];
  courseId: string;
  setTopics: React.Dispatch<React.SetStateAction<Topic[]>>;
}

type StatusFilter = "all" | "draft" | "published";
type SortBy = "curriculum" | "newest" | "oldest" | "duration" | "alphabetical";

const DIFFICULTY_VARIANT = {
  beginner: "success",
  intermediate: "warning",
  advanced: "danger",
} as const;

/** Curriculum view of a course: an ordered list, one clear row per topic. */
export function TopicsTab({ courseId, topics, setTopics }: TopicsPageProp) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortBy, setSortBy] = useState<SortBy>("curriculum");
  const [toDelete, setToDelete] = useState<Topic | null>(null);
  const [deleting, setDeleting] = useState(false);

  const counts = useMemo(
    () => ({
      all: topics.length,
      published: topics.filter((t) => t.status === "published").length,
      draft: topics.filter((t) => t.status === "draft").length,
    }),
    [topics],
  );

  const visible = useMemo(() => {
    let data = [...topics];
    const q = query.trim().toLowerCase();
    if (q) data = data.filter((t) => t.title.toLowerCase().includes(q));
    if (statusFilter !== "all") data = data.filter((t) => t.status === statusFilter);
    const time = (d: string) => new Date(d).getTime();
    switch (sortBy) {
      case "curriculum":
        data.sort((a, b) => a.order_index - b.order_index);
        break;
      case "newest":
        data.sort((a, b) => time(b.created_at) - time(a.created_at));
        break;
      case "oldest":
        data.sort((a, b) => time(a.created_at) - time(b.created_at));
        break;
      case "duration":
        data.sort((a, b) => a.estimated_time - b.estimated_time);
        break;
      case "alphabetical":
        data.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }
    return data;
  }, [topics, query, statusFilter, sortBy]);

  const addTopic = () => router.push(`/admin/courses/${courseId}/topics/create`);

  const handleDelete = async (topic: Topic) => {
    setDeleting(true);
    try {
      await TopicService.deleteTopic(topic.id);
      toast.success("Topic deleted.");
      setTopics((prev) => prev.filter((t) => t.id !== topic.id));
      setToDelete(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete topic.");
    } finally {
      setDeleting(false);
    }
  };

  const handleChangeStatus = async (id: string, status: TopicStatus) => {
    try {
      await TopicService.changeStatus(id, status);
      toast.success(status === "published" ? "Topic published." : "Topic moved to draft.");
      setTopics((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
    } catch (error) {
      toast.error(`Failed to update topic. ${error}`);
    }
  };

  if (topics.length === 0) {
    return (
      <EmptyState
        icon={FolderTree}
        title="Start the curriculum"
        description="Topics are the lessons students work through. Add the first one to give this course its structure."
        action={
          <Button variant="brand" onClick={addTopic}>
            <Plus className="size-4" />
            Add first topic
          </Button>
        }
      />
    );
  }

  const chips: { value: StatusFilter; label: string }[] = [
    { value: "all", label: "All" },
    { value: "published", label: "Published" },
    { value: "draft", label: "Drafts" },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full sm:max-w-xs">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              aria-label="Search topics"
              placeholder="Search topics"
              className="pl-10 pr-10"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setQuery("")}
                className="absolute right-1.5 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by status">
            {chips.map((c) => (
              <button
                key={c.value}
                type="button"
                aria-pressed={statusFilter === c.value}
                onClick={() => setStatusFilter(c.value)}
                className={cn(
                  "inline-flex min-h-10 items-center gap-2 rounded-full border px-3.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
                  statusFilter === c.value
                    ? "border-transparent bg-primary-soft text-primary-soft-foreground"
                    : "bg-card text-muted-foreground hover:text-foreground",
                )}
              >
                {c.label}
                <span className="text-xs tabular-nums opacity-80">{counts[c.value]}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortBy)}>
            <SelectTrigger aria-label="Sort topics" className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="curriculum">Curriculum order</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="duration">Duration</SelectItem>
              <SelectItem value="alphabetical">A–Z</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="brand" onClick={addTopic}>
            <Plus className="size-4" />
            Add topic
          </Button>
        </div>
      </div>

      {visible.length === 0 ? (
        <EmptyState
          title="No topics match"
          description="Try a different search or clear the filters."
          action={
            <Button
              variant="outline"
              onClick={() => {
                setQuery("");
                setStatusFilter("all");
              }}
            >
              Clear filters
            </Button>
          }
        />
      ) : (
        <Reveal selector="[data-topic-row]" stagger={0.04}>
          <ol className="divide-y overflow-hidden rounded-xl border bg-card shadow-card">
            {visible.map((topic, i) => (
              <li
                key={topic.id}
                data-topic-row
                className="group relative flex items-center gap-3 px-4 py-4 transition-colors hover:bg-muted/50 sm:gap-4 sm:px-5"
              >
                <span
                  className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted font-heading text-sm font-extrabold tabular-nums text-muted-foreground"
                  aria-hidden
                >
                  {sortBy === "curriculum" ? i + 1 : topic.order_index || i + 1}
                </span>

                <div className="min-w-0 flex-1 space-y-1">
                  <Link
                    href={`/admin/courses/${courseId}/topics/${topic.id}`}
                    className="line-clamp-1 text-base font-bold text-foreground after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:ring-[3px] focus-visible:after:ring-ring/50 focus-visible:after:ring-inset"
                  >
                    {topic.title}
                  </Link>
                  {topic.description && (
                    <p className="line-clamp-1 text-sm text-muted-foreground">{topic.description}</p>
                  )}
                  <div className="flex flex-wrap items-center gap-2 pt-0.5 sm:hidden">
                    <StatusBadge status={topic.status} />
                    <Badge variant={DIFFICULTY_VARIANT[topic.difficulty]} size="sm" className="capitalize">
                      {topic.difficulty}
                    </Badge>
                  </div>
                </div>

                <div className="hidden items-center gap-3 sm:flex">
                  <Badge variant={DIFFICULTY_VARIANT[topic.difficulty]} className="capitalize">
                    {topic.difficulty}
                  </Badge>
                  <span className="inline-flex w-20 items-center gap-1.5 text-sm tabular-nums text-muted-foreground">
                    <Clock className="size-4" aria-hidden />
                    {topic.estimated_time} min
                  </span>
                  <StatusBadge status={topic.status} />
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Actions for ${topic.title}`}
                      className="relative z-10 size-10 shrink-0 text-muted-foreground"
                    >
                      <MoreVertical className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44">
                    <DropdownMenuItem
                      onSelect={() => router.push(`/admin/courses/${courseId}/topics/${topic.id}/edit`)}
                    >
                      <Pencil className="size-4" />
                      Edit
                    </DropdownMenuItem>
                    {topic.status === "published" ? (
                      <DropdownMenuItem onSelect={() => handleChangeStatus(topic.id, "draft")}>
                        <EyeOff className="size-4" />
                        Unpublish
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem onSelect={() => handleChangeStatus(topic.id, "published")}>
                        <UploadCloud className="size-4" />
                        Publish
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onSelect={() => setToDelete(topic)}
                    >
                      <Trash2 className="size-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
            ))}
          </ol>
        </Reveal>
      )}

      <p className="text-[13px] text-muted-foreground" aria-live="polite">
        Showing <span className="font-semibold tabular-nums text-foreground">{visible.length}</span> of{" "}
        <span className="tabular-nums">{topics.length}</span> topics
      </p>

      <AlertDialog open={!!toDelete} onOpenChange={(open) => !open && !deleting && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this topic?</AlertDialogTitle>
            <AlertDialogDescription>
              “{toDelete?.title}” and its content will be permanently removed. This can’t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={deleting}
              onClick={(e) => {
                e.preventDefault();
                if (toDelete) void handleDelete(toDelete);
              }}
            >
              {deleting ? "Deleting…" : "Delete topic"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
