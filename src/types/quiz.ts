import { LucideIcon } from "lucide-react";

export type QuizStatus = "draft" | "published";

export type QuestionType = "multiple_choice" | "true_false" | "short_answer";

export type Difficulty = "easy" | "medium" | "hard";

export interface Quiz {
  id: string;

  topic_id: string;

  title: string;

  description: string | null;

  instructions: string | null;

  passing_score: number;

  time_limit: number;

  attempt_limit: number;

  shuffle_questions: boolean;

  shuffle_options: boolean;

  show_results: boolean;

  require_passing_score: boolean;

  status: QuizStatus;

  created_at: string;

  updated_at: string;
}

export interface QuizQuestion {
  id: string;

  quiz_id: string;

  question: string;

  type: QuestionType;

  difficulty: Difficulty;

  points: number;

  explanation: string | null;

  order_index: number;

  options?: QuizOption[];
}

export interface QuizOption {
  id: string;

  question_id: string;

  option_text: string;

  is_correct: boolean;

  order_index: number;
}

export interface QuizOptionForm {
  optionText: string;
  isCorrect: boolean;
}

export interface CreateQuizData {
  topicId: string;

  title: string;

  description?: string;

  instructions?: string;

  passingScore: number;

  timeLimit: number;

  attemptLimit: number;

  shuffleQuestions: boolean;

  shuffleOptions: boolean;

  showResults: boolean;

  requirePassingScore: boolean;

  status: QuizStatus;
}

export interface UpdateQuizData extends CreateQuizData {
  id: string;
}

export interface CreateQuestionData {
  quizId: string;

  question: string;

  type: QuestionType;

  difficulty: Difficulty;

  points: number;

  explanation?: string;

  orderIndex: number;
  options: QuizOptionForm[];
}

export interface UpdateQuestionData extends CreateQuestionData {
  id: string;
}

export interface CreateOptionData {
  questionId: string;

  optionText: string;

  isCorrect: boolean;

  orderIndex: number;
}

export const QUESTION_TYPES = [
  {
    label: "Multiple Choice",
    value: "multiple_choice",
  },
  {
    label: "True / False",
    value: "true_false",
  },
  {
    label: "Short Answer",
    value: "short_answer",
  },
] as const;

export const DIFFICULTIES = [
  {
    label: "Easy",
    value: "easy",
  },
  {
    label: "Medium",
    value: "medium",
  },
  {
    label: "Hard",
    value: "hard",
  },
] as const;

export const QUIZ_STATUSES = [
  {
    label: "Draft",
    value: "draft",
  },
  {
    label: "Published",
    value: "published",
  },
] as const;

export const difficultyStyles: Record<Difficulty, string> = {
  easy: "border-emerald-500/30 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",

  medium:
    "border-amber-500/30 bg-amber-500/15 text-amber-700 dark:text-amber-400",

  hard: "border-rose-500/30 bg-rose-500/15 text-rose-700 dark:text-rose-400",
};

export const questionTypeStyles: Record<QuestionType, string> = {
  multiple_choice:
    "border-blue-500/30 bg-blue-500/15 text-blue-700 dark:text-blue-400",

  true_false:
    "border-violet-500/30 bg-violet-500/15 text-violet-700 dark:text-violet-400",

  short_answer:
    "border-cyan-500/30 bg-cyan-500/15 text-cyan-700 dark:text-cyan-400",
};

export const statusStyles: Record<QuizStatus, string> = {
  draft:
    "border-amber-500/30 bg-amber-500/15 text-amber-700 dark:text-amber-400",

  published:
    "border-emerald-500/30 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
};

export interface QuizStatItem {
  label: string;

  value: string;

  icon: LucideIcon;

  color: string;

  bgColor: string;
}

export interface QuestionForm {
  question: string;

  type: QuestionType;

  difficulty: Difficulty;

  points: number;

  explanation: string;

  options: QuizOptionForm[];
}

export interface QuestionFormData {
  id?: string;

  question: string;

  type: QuestionType;

  difficulty: Difficulty;

  points: number;

  explanation?: string | null;

  orderIndex: number;

  options: QuizOptionForm[];
}

export interface QuizSettingsForm {
  title: string;

  description: string;

  instructions: string;

  passingScore: number;

  timeLimit: number;

  maxAttempts: number;

  shuffleQuestions: boolean;

  shuffleOptions: boolean;

  showCorrectAnswers: boolean;

  requirePassingScore: boolean;
}
