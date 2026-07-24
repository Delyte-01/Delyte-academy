"use client";

import {
  GripVertical,
  ChevronDown,
  Pencil,
  Trash2,
  CheckCircle2,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import {
  difficultyStyles,
  questionTypeStyles,
  QuizQuestion,
} from "@/types/quiz";

interface QuestionCardProps {
  question: QuizQuestion;
  isExpanded: boolean;
  isSelected: boolean;
  onToggleExpand: () => void;
  onToggleSelect: () => void;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

export function QuestionCard({
  question,
  isExpanded,
  isSelected,
  onToggleExpand,
  onToggleSelect,
  onEdit,
  onDuplicate,
  onDelete,
}: QuestionCardProps) {
  return (
    <div
      className={cn(
        "group rounded-2xl border bg-card transition-all duration-200",
        isSelected && "border-primary/50 ring-1 ring-primary/20",
        isExpanded ? "shadow-sm" : "hover:shadow-sm"
      )}
    >
      {/* Collapsed header */}
      <div className="flex items-center gap-2 p-3 sm:gap-3 sm:p-4">
        {/* Drag handle */}
        <div className="flex cursor-grab items-center text-muted-foreground/40 hover:text-muted-foreground">
          <GripVertical className="h-5 w-5" />
        </div>

        {/* Checkbox */}
        <Checkbox
          checked={isSelected}
          onCheckedChange={onToggleSelect}
          className="flex-shrink-0"
        />

        {/* Question number badge */}
        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-bold text-muted-foreground">
          {question.order_index}
        </div>

        {/* Question text */}
        <button onClick={onToggleExpand} className="min-w-0 flex-1 text-left">
          <p className="truncate text-sm font-semibold text-foreground">
            {question.question}
          </p>
        </button>

        {/* Badges */}
        <div className="hidden flex-shrink-0 items-center gap-1.5 sm:flex">
          <Badge
            variant="outline"
            className={cn("text-xs", questionTypeStyles[question.type])}
          >
            {question.type}
          </Badge>
          <Badge
            variant="outline"
            className={cn("text-xs", difficultyStyles[question.difficulty])}
          >
            {question.difficulty}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {question.points} pts
          </Badge>
          <Badge variant="outline" className="text-xs text-muted-foreground">
            {question.options?.length ?? 0} options
          </Badge>
        </div>

        {/* Actions */}
        <div className="flex flex-shrink-0 items-center gap-0.5">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8  transition-opacity "
            onClick={onDuplicate}
          >
            <Copy className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8  transition-opacity "
            onClick={onEdit}
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground  transition-opacity hover:text-destructive "
            onClick={onDelete}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onToggleExpand}
          >
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform duration-200",
                isExpanded && "rotate-180"
              )}
            />
          </Button>
        </div>
      </div>

      {/* Mobile badges */}
      <div className="flex flex-wrap items-center gap-1.5 px-4 pb-3 sm:hidden">
        <Badge
          variant="outline"
          className={cn("text-xs", questionTypeStyles[question.type])}
        >
          {question.type}
        </Badge>
        <Badge
          variant="outline"
          className={cn("text-xs", difficultyStyles[question.difficulty])}
        >
          {question.difficulty}
        </Badge>
        <Badge variant="outline" className="text-xs">
          {question.points} pts
        </Badge>
        <Badge variant="outline" className="text-xs text-muted-foreground">
          {question.options?.length ?? 0} options
        </Badge>
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <div className="space-y-4 border-t px-4 py-4">
          {/* Question text */}
          <div className="space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Question
            </p>
            <p className="text-sm leading-relaxed text-foreground">
              {question.question}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Options
            </p>
            <div className="space-y-2">
              {question.options?.map((option) => (
                <div
                  key={option.id}
                  className={cn(
                    "flex items-center gap-2.5 rounded-xl border p-2.5 text-sm",
                    option.is_correct
                      ? "border-emerald-500/40 bg-emerald-500/10"
                      : "border-border bg-muted/20"
                  )}
                >
                  {option.is_correct ? (
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-600" />
                  ) : (
                    <div className="h-4 w-4 flex-shrink-0 rounded-full border-2 border-muted-foreground/30" />
                  )}
                  <span
                    className={cn(
                      option.is_correct
                        ? "font-medium text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {option.option_text}
                  </span>
                  {option.is_correct && (
                    <Badge
                      variant="outline"
                      className="ml-auto border-emerald-500/30 bg-emerald-500/10 text-xs text-emerald-700 dark:text-emerald-400"
                    >
                      Correct
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Correct answer */}
          {/* <div className="space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Correct Answer
            </p>
            <p className="text-sm font-medium text-foreground">
              {question.correctAnswer}
            </p>
          </div> */}

          {/* Explanation */}
          <div className="space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Explanation
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {question.explanation ?? "No explanation provided."}
            </p>
          </div>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <Badge
              variant="outline"
              className={cn("text-xs", difficultyStyles[question.difficulty])}
            >
              {question.difficulty}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {question.points} points
            </Badge>
            <Badge
              variant="outline"
              className={cn("text-xs", questionTypeStyles[question.type])}
            >
              {question.type}
            </Badge>
          </div>
        </div>
      )}
    </div>
  );
}
