export interface ParsedQuestion {
  question: string;

  options: {
    optionText: string;
    isCorrect: boolean;
  }[];

  explanation?: string;

  difficulty?: "easy" | "medium" | "hard";

  points?: number;

  type?: "multiple_choice";
}
