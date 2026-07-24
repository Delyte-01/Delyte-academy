"use client";

import { useState, useMemo, useEffect } from "react";
import { Plus, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { QuizHeader } from "./quiz-header";
import { DeleteQuestionDialog } from "./delete-question-dialog";

import { EmptyState } from "./empty-state";
import { PreviewDrawer } from "./preview-drawer";

import { QuizStats } from "./quiz-stat";
import { QuizSettingsCard } from "./quiz-settings-card";
import { QuestionFilters } from "./questions/question-filters";
import { QuestionCard } from "./questions/question-card";
import { QuestionDialog } from "./questions/question-dialog";
import {
  QuestionFormData,
  QuizOptionForm,
  QuizQuestion,
  QuizSettingsForm,
} from "@/types/quiz";
import { useQuiz } from "@/hooks/useQuiz";
import { useQuestion } from "@/hooks/useQuestion";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { BulkActions } from "./bulk-actions";

export function QuizPage() {
  const [deleting, setDeleting] = useState(false);
  const params = useParams();
  const topicId = params.topicsId as string;

  const { quiz, saveQuiz, saving } = useQuiz(topicId);

  const {
    questions,
    // loading: questionLoading,
    addQuestion,
    editQuestion,
    removeQuestion,
  } = useQuestion(quiz?.id);

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(
    null
  );
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTargetIds, setDeleteTargetIds] = useState<string[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [settings, setSettings] = useState<QuizSettingsForm | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sort, setSort] = useState("newest");

  const status = quiz?.status ?? "draft";

  useEffect(() => {
    if (!quiz) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSettings({
      title: quiz.title,
      description: quiz.description ?? "",
      instructions: quiz.instructions ?? "",
      passingScore: quiz.passing_score,
      timeLimit: quiz.time_limit,
      maxAttempts: quiz.attempt_limit,
      shuffleQuestions: quiz.shuffle_questions,
      shuffleOptions: quiz.shuffle_options,
      showCorrectAnswers: quiz.show_results,
      requirePassingScore: quiz.require_passing_score,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quiz?.id]);

  const filteredQuestions = useMemo(() => {
    let result = [...questions];

    if (search) {
      result = result.filter((q) =>
        q.question.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (difficultyFilter !== "all") {
      result = result.filter((q) => q.difficulty === difficultyFilter);
    }
    if (typeFilter !== "all") {
      result = result.filter((q) => q.type === typeFilter);
    }

    switch (sort) {
      case "newest":
        result.sort((a, b) => b.order_index - a.order_index);
        break;
      case "oldest":
        result.sort((a, b) => a.order_index - b.order_index);
        break;
      case "difficulty":
        const order = { easy: 0, medium: 1, hard: 2 };
        result.sort((a, b) => order[a.difficulty] - order[b.difficulty]);
        break;
      case "points":
        result.sort((a, b) => b.points - a.points);
        break;
      case "az":
        result.sort((a, b) => a.question.localeCompare(b.question));
        break;
    }

    return result;
  }, [questions, search, difficultyFilter, typeFilter, sort]);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const clearSelection = () => setSelectedIds(new Set());

  const handleAddQuestion = () => {
    setEditingQuestion(null);
    setDialogOpen(true);
  };

  const handleEditQuestion = (q: QuizQuestion) => {
    setEditingQuestion(q);
    setDialogOpen(true);
  };

  const handleSaveQuestion = async (data: QuestionFormData) => {
    if (!quiz) return;

    const optionForms: QuizOptionForm[] = data.options.map((option) => ({
      optionText: option.optionText,
      isCorrect: option.isCorrect,
    }));

    if (editingQuestion) {
      await editQuestion({
        id: editingQuestion.id,
        quizId: quiz.id,
        question: data.question,
        type: data.type,
        difficulty: data.difficulty,
        points: data.points,
        explanation: data.explanation ?? "",
        orderIndex: editingQuestion.order_index,
        options: optionForms,
      });
    } else {
      await addQuestion({
        quizId: quiz.id,
        question: data.question,
        type: data.type,
        difficulty: data.difficulty,
        points: data.points,
        explanation: data.explanation ?? "",
        orderIndex: questions.length + 1,
        options: optionForms,
      });
      toast.success("Question Added Successfully");
      setEditingQuestion(null);
    }
    setEditingQuestion(null);
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setDeleteTargetIds([id]);
    setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    try {
      setDeleting(true);

      await Promise.all(deleteTargetIds.map(removeQuestion));

      if (expandedId && deleteTargetIds.includes(expandedId)) {
        setExpandedId(null);
      }

      if (editingQuestion && deleteTargetIds.includes(editingQuestion.id)) {
        setEditingQuestion(null);
      }

      clearSelection();
      setDeleteTargetIds([]);
      setDeleteOpen(false);

      toast.success(
        deleteTargetIds.length === 1
          ? "Question deleted"
          : `${deleteTargetIds.length} questions deleted`
      );
    } catch (err) {
      toast.error("Failed to delete questions");
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  const updateQuizStatus = async (status: "draft" | "published") => {
    if (!quiz) return;

    await saveQuiz({
      id: quiz.id,
      topicId: quiz.topic_id,

      title: quiz.title,
      description: quiz.description ?? "",
      instructions: quiz.instructions ?? "",

      passingScore: quiz.passing_score,
      timeLimit: quiz.time_limit,
      attemptLimit: quiz.attempt_limit,

      shuffleQuestions: quiz.shuffle_questions,
      shuffleOptions: quiz.shuffle_options,
      showResults: quiz.show_results,
      requirePassingScore: quiz.require_passing_score,

      status,
    });

    toast.success(
      status === "published" ? "Quiz published successfully." : "Draft saved."
    );
  };

  const handleSettingsChange = async (values: QuizSettingsForm) => {
    if (!quiz) return;

    await saveQuiz({
      id: quiz.id,
      topicId: quiz.topic_id,

      title: values.title,
      description: values.description,
      instructions: values.instructions,

      passingScore: values.passingScore,
      timeLimit: values.timeLimit,
      attemptLimit: values.maxAttempts,

      shuffleQuestions: values.shuffleQuestions,
      shuffleOptions: values.shuffleOptions,
      showResults: values.showCorrectAnswers,
      requirePassingScore: values.requirePassingScore,

      status: quiz.status,
    });
  };

  useEffect(() => {
    if (!settings || !quiz) return;

    const timeout = setTimeout(() => {
      handleSettingsChange(settings);
    }, 800);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings]);

  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
  const estimatedDuration = Math.ceil(totalPoints * 1.5);

  if (!quiz || !settings) {
    return <div>loading......</div>;
  }

  // --------------- Bulk funtionaities------------------------

  const handleExport = () => {
    const selected = questions.filter((q) => selectedIds.has(q.id));

    const blob = new Blob([JSON.stringify(selected, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = `${quiz?.title ?? "quiz"}-questions.json`;

    a.click();

    URL.revokeObjectURL(url);
  };

  const handleDuplicate = async (question: QuizQuestion) => {
    await addQuestion({
      quizId: quiz!.id,
      question: `${question.question} (Copy)`,
      type: question.type,
      difficulty: question.difficulty,
      points: question.points,
      explanation: question.explanation ?? "",
      orderIndex: questions.length + 1,
      options:
        question.options?.map((o) => ({
          optionText: o.option_text,
          isCorrect: o.is_correct,
        })) ?? [],
    });

    toast.success("Question duplicated");
  };

  const handleBulkDuplicate = async () => {
    const selected = questions.filter((q) => selectedIds.has(q.id));

    for (const question of selected) {
      await addQuestion({
        quizId: quiz!.id,
        question: `${question.question} (Copy)`,
        type: question.type,
        difficulty: question.difficulty,
        points: question.points,
        explanation: question.explanation ?? "",
        orderIndex: questions.length + 1,
        options:
          question.options?.map((o) => ({
            optionText: o.option_text,
            isCorrect: o.is_correct,
          })) ?? [],
      });
    }

    clearSelection();

    toast.success(`${selected.length} question(s) duplicated`);
  };

  const handleBulkDelete = () => {
    setDeleteTargetIds(Array.from(selectedIds));
    setDeleteOpen(true);
  };

  return (
    <div className="space-y-6">
      <QuizHeader
        onPreview={() => setPreviewOpen(true)}
        onSaveDraft={() => updateQuizStatus("draft")}
        onPublish={() => updateQuizStatus("published")}
        saving={saving}
      />

      <QuizStats
        questionCount={questions.length}
        estimatedDuration={estimatedDuration}
        passingScore={settings.passingScore}
        status={status}
      />

      <QuizSettingsCard settings={settings!} onChange={setSettings} />

      {/* Questions section */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <HelpCircle className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-base font-bold">Questions</CardTitle>
                <CardDescription className="text-sm">
                  Manage assessment questions.
                </CardDescription>
              </div>
            </div>
            <Button
              size="sm"
              onClick={handleAddQuestion}
              className="flex-shrink-0"
            >
              <Plus className="mr-1.5 h-4 w-4" />
              Add Question
            </Button>
          </div>
        </CardHeader>
      </Card>

      {questions.length === 0 ? (
        <EmptyState onAddQuestion={handleAddQuestion} />
      ) : (
        <div className="space-y-4">
          <QuestionFilters
            search={search}
            onSearchChange={setSearch}
            difficulty={difficultyFilter}
            onDifficultyChange={setDifficultyFilter}
            type={typeFilter}
            onTypeChange={setTypeFilter}
            sort={sort}
            onSortChange={setSort}
          />

          <BulkActions
            selectedCount={selectedIds.size}
            onDelete={handleBulkDelete}
            onDuplicate={handleBulkDuplicate}
            onExport={handleExport}
            onClear={clearSelection}
          />

          {/* Question list with drag handles */}
          <div className="space-y-3">
            {filteredQuestions.length === 0 ? (
              <div className="flex min-h-[200px] flex-col items-center justify-center rounded-2xl border border-dashed bg-muted/20 p-8 text-center">
                <HelpCircle className="h-8 w-8 text-muted-foreground/50" />
                <p className="mt-3 text-sm font-semibold text-foreground">
                  No questions found
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Try adjusting your filters or search.
                </p>
              </div>
            ) : (
              filteredQuestions.map((q) => (
                <QuestionCard
                  key={q.id}
                  question={q}
                  isExpanded={expandedId === q.id}
                  isSelected={selectedIds.has(q.id)}
                  onToggleExpand={() => toggleExpand(q.id)}
                  onToggleSelect={() => toggleSelect(q.id)}
                  onEdit={() => handleEditQuestion(q)}
                  onDelete={() => handleDelete(q.id)}
                  onDuplicate={() => handleDuplicate(q)}
                />
              ))
            )}
          </div>
        </div>
      )}

      <QuestionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editingQuestion={editingQuestion}
        questionOrder={questions.length}
        onSave={handleSaveQuestion}
        quizId={quiz.id}
      />

      <DeleteQuestionDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={confirmDelete}
        deleting={deleting}
        questionCount={deleteTargetIds.length}
      />

      <PreviewDrawer
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        questions={questions}
        quiz={quiz}
      />
    </div>
  );
}
