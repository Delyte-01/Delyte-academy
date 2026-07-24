"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
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
  easy: "text-emerald-600",
  medium: "text-amber-600",
  hard: "text-rose-600",
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

  const formRef = useRef<HTMLDivElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

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

  const handleSave = () => {
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
      <DialogContent className="max-h-[90vh] max-w-lg gap-0 overflow-y-auto rounded-2xl p-0 sm:max-w-xl">
        <DialogHeader className="flex-row items-start gap-3 space-y-0 border-b border-border/60 px-6 pb-4 pt-6">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <HelpCircle className="h-4.5 w-4.5" />
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

        <div ref={formRef} className="space-y-5 px-6 py-5">
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
              className="min-h-[80px] resize-y transition-shadow"
            />
          </div>

          {/* Type, Difficulty, Points */}
          <div data-field className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Question Type</Label>
              <Select
                value={type}
                onValueChange={(v) => handleTypeChange(v as QuestionType)}
              >
                <SelectTrigger className="h-10 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="multiple_choice">
                    <span className="flex items-center gap-2">
                      <ListChecks className="h-3.5 w-3.5 text-blue-600" />
                      Multiple Choice
                    </span>
                  </SelectItem>
                  <SelectItem value="true_false">
                    <span className="flex items-center gap-2">
                      <ToggleLeft className="h-3.5 w-3.5 text-violet-600" />
                      True / False
                    </span>
                  </SelectItem>
                  <SelectItem value="short_answer">
                    <span className="flex items-center gap-2">
                      <Type className="h-3.5 w-3.5 text-emerald-600" />
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
                    "h-10 rounded-xl font-medium",
                    difficultyStyles[difficulty]
                  )}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">
                    <span className="flex items-center gap-2 text-emerald-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Easy
                    </span>
                  </SelectItem>
                  <SelectItem value="medium">
                    <span className="flex items-center gap-2 text-amber-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                      Medium
                    </span>
                  </SelectItem>
                  <SelectItem value="hard">
                    <span className="flex items-center gap-2 text-rose-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
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

        <DialogFooter className="gap-2 border-t border-border/60 px-6 py-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-xl"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!question.trim()}
            className="rounded-xl shadow-sm shadow-primary/20 transition-shadow hover:shadow-md hover:shadow-primary/30"
          >
            <Save className="mr-1.5 h-3.5 w-3.5" />
            Save Question
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
