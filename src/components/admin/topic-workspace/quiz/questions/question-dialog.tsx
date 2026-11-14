"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  HelpCircle,
  AlertCircle,
  ListChecks,
  ToggleLeft,
  Type,
  Minus,
  Plus,
  Save,
} from "lucide-react";

import { QuestionOptions } from "./queston-options";
import {
  Difficulty,
  QuestionFormData,
  QuestionType,
  QuizOption,
  QuizQuestion,
} from "@/types/quiz";
import { cn } from "@/lib/utils";

interface QuestionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingQuestion: QuizQuestion | null;
  questionOrder: number;
  onSave: (data: QuestionFormData) => Promise<void>;
  quizId: string;
}

const createDefaultOptions = (): QuizOption[] => [
  {
    id: crypto.randomUUID(),
    question_id: "",
    option_text: "",
    is_correct: true,
    order_index: 1,
  },
  {
    id: crypto.randomUUID(),
    question_id: "",
    option_text: "",
    is_correct: false,
    order_index: 2,
  },
];

const difficultyStyles: Record<Difficulty, string> = {
  easy: "text-primary",
  medium: "text-warning",
  hard: "text-destructive",
};

export function QuestionDialog({
  open,
  onOpenChange,
  editingQuestion,
  questionOrder,
  onSave,
  quizId,
}: QuestionDialogProps) {
  const [question, setQuestion] = useState("");
  const [type, setType] = useState<QuestionType>("multiple_choice");

  const [difficulty, setDifficulty] = useState<Difficulty>("medium");

  const [points, setPoints] = useState(1);

  const [options, setOptions] = useState<QuizOption[]>([]);

  const [explanation, setExplanation] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const formRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSubmitted(false);

    if (editingQuestion) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQuestion(editingQuestion.question);
      setType(editingQuestion.type);
      setDifficulty(editingQuestion.difficulty);
      setPoints(editingQuestion.points);
      setOptions(editingQuestion.options ?? []);
      setExplanation(editingQuestion.explanation ?? "");
    } else {
      setQuestion("");
      setType("multiple_choice");
      setDifficulty("medium");
      setPoints(1);
      setOptions(createDefaultOptions());
      setExplanation("");
    }
  }, [editingQuestion, open]);

  // Stagger the fields in whenever the dialog opens
  useEffect(() => {
    if (!open || !formRef.current) return;
    const fields = formRef.current.querySelectorAll("[data-field]");
    gsap.fromTo(
      fields,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.35, stagger: 0.05, ease: "power2.out" }
    );
  }, [open]);

  // Fade the options block in whenever it (re)appears after switching type
  useEffect(() => {
    if (type !== "short_answer" && optionsRef.current) {
      gsap.fromTo(
        optionsRef.current,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
      );
    }
  }, [type]);

  const handleTypeChange = (newType: QuestionType) => {
    setType(newType);
    if (newType === "true_false") {
      setOptions([
        {
          id: crypto.randomUUID(),
          question_id: quizId,
          option_text: "True",
          is_correct: true,
          order_index: 1,
        },
        {
          id: crypto.randomUUID(),
          question_id: quizId,
          option_text: "False",
          is_correct: false,
          order_index: 2,
        },
      ]);
    } else if (newType === "short_answer") {
      setOptions([
        {
          id: crypto.randomUUID(),
          question_id: quizId,
          option_text: "",
          is_correct: true,
          order_index: 1,
        },
      ]);
    } else {
      setOptions(createDefaultOptions());
    }
  };

  const questionError = !question.trim() ? "Enter the question text." : undefined;
  const optionsError = (() => {
    if (type === "short_answer") {
      return options.some((o) => o.option_text.trim())
        ? undefined
        : "Enter the correct answer.";
    }
    if (options.some((o) => !o.option_text.trim())) return "Fill in every option.";
    if (!options.some((o) => o.is_correct)) return "Mark one option as correct.";
    return undefined;
  })();

  const handleSave = () => {
    setSubmitted(true);
    if (questionError || optionsError) {
      if (questionError) document.getElementById("q-text")?.focus();
      return;
    }
    onSave({
      id: editingQuestion?.id,

      question,

      type,

      difficulty,

      points,

      explanation,

      orderIndex: editingQuestion?.order_index ?? questionOrder,

      options: options.map((o, index) => ({
        optionText: o.option_text,

        isCorrect: o.is_correct,

        orderIndex: index,
      })),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90dvh] max-w-lg flex-col gap-0 overflow-hidden p-0 sm:max-w-xl">
        <DialogHeader className="flex-row items-start gap-3 space-y-0 shrink-0 border-b px-6 pb-4 pt-6">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary-soft-foreground">
            <HelpCircle className="size-5" />
          </div>
          <div className="space-y-1">
            <DialogTitle className="text-lg font-bold tracking-tight">
              {editingQuestion ? "Edit Question" : "Add Question"}
            </DialogTitle>
            <DialogDescription className="text-sm">
              {editingQuestion
                ? "Update question details and options."
                : `Create question #${questionOrder} for this quiz.`}
            </DialogDescription>
          </div>
        </DialogHeader>

        <div ref={formRef} className="min-h-0 flex-1 space-y-5 overflow-y-auto px-6 py-5">
          {/* Question text */}
          <div data-field className="space-y-2">
            <Label htmlFor="q-text" className="text-sm font-semibold">
              Question
            </Label>
            <Textarea
              id="q-text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Enter your question..."
              aria-invalid={submitted && !!questionError}
              aria-describedby={submitted && questionError ? "q-text-error" : undefined}
              className="min-h-[80px] resize-y transition-shadow"
            />
            {submitted && questionError && (
              <p id="q-text-error" role="alert" className="flex items-center gap-1.5 text-[13px] font-medium text-destructive">
                <AlertCircle className="size-3.5" aria-hidden />
                {questionError}
              </p>
            )}
          </div>

          {/* Type, Difficulty, Points */}
          <div data-field className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Question Type</Label>
              <Select
                value={type}
                onValueChange={(v) => handleTypeChange(v as QuestionType)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="multiple_choice">
                    <span className="flex items-center gap-2">
                      <ListChecks className="h-3.5 w-3.5 text-info" />
                      Multiple Choice
                    </span>
                  </SelectItem>
                  <SelectItem value="true_false">
                    <span className="flex items-center gap-2">
                      <ToggleLeft className="h-3.5 w-3.5 text-primary" />
                      True / False
                    </span>
                  </SelectItem>
                  <SelectItem value="short_answer">
                    <span className="flex items-center gap-2">
                      <Type className="h-3.5 w-3.5 text-primary" />
                      Short Answer
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Difficulty</Label>
              <Select
                value={difficulty}
                onValueChange={(v) => setDifficulty(v as Difficulty)}
              >
                <SelectTrigger
                  className={cn(
                    "font-medium",
                    difficultyStyles[difficulty]
                  )}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">
                    <span className="flex items-center gap-2 text-primary">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      Easy
                    </span>
                  </SelectItem>
                  <SelectItem value="medium">
                    <span className="flex items-center gap-2 text-warning">
                      <span className="h-1.5 w-1.5 rounded-full bg-warning" />
                      Medium
                    </span>
                  </SelectItem>
                  <SelectItem value="hard">
                    <span className="flex items-center gap-2 text-destructive">
                      <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
                      Hard
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="q-points" className="text-sm font-semibold">
                Points
              </Label>
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-10 w-9 flex-shrink-0 rounded-xl"
                  onClick={() => setPoints((p) => Math.max(1, p - 1))}
                  aria-label="Decrease points"
                >
                  <Minus className="h-3.5 w-3.5" />
                </Button>
                <Input
                  id="q-points"
                  type="number"
                  min={1}
                  value={points}
                  onChange={(e) => setPoints(Number(e.target.value))}
                  className="h-10 rounded-xl text-center tabular-nums"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-10 w-9 flex-shrink-0 rounded-xl"
                  onClick={() => setPoints((p) => p + 1)}
                  aria-label="Increase points"
                >
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Options */}
          <div ref={optionsRef} data-field>
            {type !== "short_answer" && (
              <div className="space-y-2">
                <div className="flex items-center gap-1.5">
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                  <Label className="text-sm font-semibold">Options</Label>
                  <span className="text-xs text-muted-foreground">
                    — select the correct answer
                  </span>
                </div>
                <QuestionOptions
                  options={options}
                  onChange={setOptions}
                  quizId={quizId}
                />
                {submitted && optionsError && (
                  <p role="alert" className="flex items-center gap-1.5 text-[13px] font-medium text-destructive">
                    <AlertCircle className="size-3.5" aria-hidden />
                    {optionsError}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Explanation */}
          <div data-field className="space-y-2">
            <Label htmlFor="q-explanation" className="text-sm font-semibold">
              Explanation
            </Label>
            <Textarea
              id="q-explanation"
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Shown to students after they submit the quiz..."
              className="min-h-[70px] resize-y transition-shadow"
            />
          </div>
        </div>

        <DialogFooter className="shrink-0 gap-2 border-t bg-card px-6 py-4 sm:items-center">
          {submitted && (questionError || optionsError) && (
            <p role="status" className="mr-auto hidden text-[13px] font-medium text-destructive sm:block">
              Fix the highlighted fields to save.
            </p>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="brand" onClick={handleSave}>
            <Save className="size-4" />
            Save question
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
