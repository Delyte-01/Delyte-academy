"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronDown,
  Plus,
  X,
  GripVertical,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

export type TopicDifficulty = "beginner" | "intermediate" | "advanced";
export type TopicStatus = "draft" | "published";

export interface TopicFormData {
  title: string;
  slug: string;
  description: string;
  estimatedTime: string;
  difficulty: TopicDifficulty;
  status: TopicStatus;
  objectives: string[];
  prerequisites: string[];
}

export interface TopicFormErrors {
  title?: string;
  slug?: string;
  description?: string;
  estimatedTime?: string;
  difficulty?: string;
}

interface TopicFormProps {
  data: TopicFormData;
  errors: TopicFormErrors;
  onChange: (
    field: keyof TopicFormData,
    value: string | boolean | string[]
  ) => void;
}

const MAX_DESCRIPTION_LENGTH = 500;

const difficultyConfig: Record<TopicDifficulty, { color: string }> = {
  beginner: {
    color: "border-emerald-500/30 bg-emerald-500/15 text-emerald-700",
  },
  intermediate: { color: "border-amber-500/30 bg-amber-500/15 text-amber-700" },
  advanced: { color: "border-rose-500/30 bg-rose-500/15 text-rose-700" },
};

const statusConfig: Record<TopicStatus, { color: string }> = {
  draft: { color: "border-amber-500/30 bg-amber-500/15 text-amber-700" },
  published: {
    color: "border-emerald-500/30 bg-emerald-500/15 text-emerald-700",
  },
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function TopicForm({ data, errors, onChange }: TopicFormProps) {
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [objectiveInput, setObjectiveInput] = useState("");
  const [prerequisiteInput, setPrerequisiteInput] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  // Entrance stagger for the three section cards — the row-level list
  // animations (animate-slide-up / animate-scale-in) are untouched below.
  useGSAP(
    () => {
      gsap.fromTo(
        ".form-card",
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power2.out" }
      );
    },
    { scope: ref }
  );

  const addObjective = () => {
    const trimmed = objectiveInput.trim();
    if (!trimmed) return;
    onChange("objectives", [...data.objectives, trimmed]);
    setObjectiveInput("");
  };

  const removeObjective = (idx: number) => {
    onChange(
      "objectives",
      data.objectives.filter((_, i) => i !== idx)
    );
  };

  const addPrerequisite = () => {
    const trimmed = prerequisiteInput.trim();
    if (!trimmed) return;
    onChange("prerequisites", [...data.prerequisites, trimmed]);
    setPrerequisiteInput("");
  };

  const removePrerequisite = (idx: number) => {
    onChange(
      "prerequisites",
      data.prerequisites.filter((_, i) => i !== idx)
    );
  };

  return (
    <div ref={ref} className="space-y-6">
      <Card className="form-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-bold">Topic Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              value={data.title}
              onChange={(e) => {
                onChange("title", e.target.value);
                onChange("slug", slugify(e.target.value));
              }}
              onBlur={() => setTouched((t) => ({ ...t, title: true }))}
              placeholder="Introduction to Java Syntax"
              className={cn(
                "dark:text-white",
                touched.title &&
                  errors.title &&
                  "border-destructive focus-visible:ring-destructive "
              )}
            />
            {touched.title && errors.title && (
              <p className="flex items-center gap-1.5 text-xs text-destructive">
                <AlertCircle className="h-3 w-3" />
                {errors.title}
              </p>
            )}
            {touched.title && !errors.title && data.title && (
              <p className="flex items-center gap-1.5 text-xs text-emerald-600">
                <CheckCircle2 className="h-3 w-3" />
                Looks good
              </p>
            )}
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <Label htmlFor="slug">Slug (auto-generated)</Label>
            <div className="flex items-center rounded-xl border border-input bg-muted/40 transition-colors focus-within:border-primary/40 focus-within:bg-background">
              <span className="pl-3 pr-1 text-sm text-muted-foreground">
                /topics/
              </span>
              <input
                id="slug"
                value={data.slug}
                onChange={(e) => onChange("slug", slugify(e.target.value))}
                className="h-10 flex-1 bg-transparent pr-3 text-sm font-mono text-foreground outline-none"
                placeholder="introduction-to-java-syntax"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              The URL-friendly identifier. Auto-generated from the title, but
              editable.
            </p>
          </div>

          {/* Short Description */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="description">
                Short Description <span className="text-destructive">*</span>
              </Label>
              <span
                className={cn(
                  "text-xs",
                  data.description.length > MAX_DESCRIPTION_LENGTH - 50
                    ? "text-amber-600"
                    : "text-muted-foreground"
                )}
              >
                {data.description.length} / {MAX_DESCRIPTION_LENGTH}
              </span>
            </div>
            <Textarea
              id="description"
              value={data.description}
              onChange={(e) => {
                if (e.target.value.length <= MAX_DESCRIPTION_LENGTH) {
                  onChange("description", e.target.value);
                }
              }}
              onBlur={() => setTouched((t) => ({ ...t, description: true }))}
              placeholder="A brief summary of what this topic covers and what students will learn..."
              rows={4}
              className={cn(
                "resize-none",
                touched.description &&
                  errors.description &&
                  "border-destructive focus-visible:ring-destructive"
              )}
            />
            {touched.description && errors.description && (
              <p className="flex items-center gap-1.5 text-xs text-destructive">
                <AlertCircle className="h-3 w-3" />
                {errors.description}
              </p>
            )}
          </div>

          {/* Estimated Time + Difficulty */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="estimatedTime">
                Estimated Time <span className="text-destructive ">*</span>
              </Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="estimatedTime"
                  value={data.estimatedTime}
                  onChange={(e) => onChange("estimatedTime", e.target.value)}
                  onBlur={() =>
                    setTouched((t) => ({ ...t, estimatedTime: true }))
                  }
                  placeholder="45 min"
                  className="pl-9 dark:text-white"
                />
              </div>
              {touched.estimatedTime && errors.estimatedTime && (
                <p className="flex items-center gap-1.5 text-xs text-destructive">
                  <AlertCircle className="h-3 w-3" />
                  {errors.estimatedTime}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Difficulty</Label>
              <div className="flex flex-wrap gap-2">
                {(
                  ["beginner", "intermediate", "advanced"] as TopicDifficulty[]
                ).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => onChange("difficulty", d)}
                    className={cn(
                      "rounded-xl border px-3 py-2 text-xs font-semibold transition-all duration-200 active:scale-95",
                      data.difficulty === d
                        ? difficultyConfig[d].color
                        : "border-input bg-background text-muted-foreground hover:bg-muted hover:border-primary/40"
                    )}
                  >
                    {d}
                  </button>
                ))}
              </div>
              {errors.difficulty && (
                <p className="flex items-center gap-1.5 text-xs text-destructive">
                  <AlertCircle className="h-3 w-3" />
                  {errors.difficulty}
                </p>
              )}
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label>Status</Label>
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <select
                  value={data.status}
                  onChange={(e) =>
                    onChange("status", e.target.value as TopicStatus)
                  }
                  className="h-10 w-full cursor-pointer appearance-none rounded-xl border border-input bg-background pl-4 pr-10 text-sm font-medium text-foreground ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>
              <Badge
                variant="outline"
                className={cn(
                  "px-3 py-1.5 text-xs font-semibold",
                  statusConfig[data.status]?.color ??
                    "border-gray-300 bg-gray-100 text-gray-700"
                )}
              >
                {data.status}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Learning Objectives */}
      <Card className="form-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-bold">
            Learning Objectives
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            What students should be able to do after completing this topic.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input
              value={objectiveInput}
              onChange={(e) => setObjectiveInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addObjective();
                }
              }}
              placeholder="Add a learning objective..."
            />
            <Button
              type="button"
              variant="secondary"
              onClick={addObjective}
              disabled={!objectiveInput.trim()}
            >
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Add
            </Button>
          </div>
          {data.objectives.length > 0 ? (
            <ul className="space-y-2">
              {data.objectives.map((obj, idx) => (
                <li
                  key={idx}
                  className="group flex items-center gap-3 rounded-xl border bg-card p-3 animate-slide-up"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <GripVertical className="h-4 w-4 flex-shrink-0 cursor-grab text-muted-foreground/40" />
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-xs font-semibold text-blue-600">
                    {idx + 1}
                  </span>
                  <span className="flex-1 text-sm text-foreground">{obj}</span>
                  <button
                    type="button"
                    onClick={() => removeObjective(idx)}
                    className="flex h-6 w-6 items-center justify-center rounded-lg text-muted-foreground opacity-0 transition-opacity hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-xl border border-dashed p-4 text-center text-xs text-muted-foreground">
              No objectives added yet. Students will see these as clear learning
              goals.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Prerequisites */}
      <Card className="form-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-bold">Prerequisites</CardTitle>
          <p className="text-xs text-muted-foreground">
            Topics or knowledge students should have before starting this one.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input
              value={prerequisiteInput}
              onChange={(e) => setPrerequisiteInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addPrerequisite();
                }
              }}
              placeholder="Add a prerequisite..."
            />
            <Button
              type="button"
              variant="secondary"
              onClick={addPrerequisite}
              disabled={!prerequisiteInput.trim()}
            >
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Add
            </Button>
          </div>
          {data.prerequisites.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {data.prerequisites.map((pre, idx) => (
                <span
                  key={idx}
                  className="group inline-flex items-center gap-1.5 rounded-full border bg-card py-1.5 pl-3 pr-2 text-xs font-medium text-foreground animate-scale-in"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  {pre}
                  <button
                    type="button"
                    onClick={() => removePrerequisite(idx)}
                    className="flex h-5 w-5 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <p className="rounded-xl border border-dashed p-4 text-center text-xs text-muted-foreground">
              No prerequisites. This topic is accessible to all students.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
