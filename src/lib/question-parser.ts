import { ParsedQuestion } from "@/types/parser";

export function parseQuestions(text: string): ParsedQuestion[] {
  const questions: ParsedQuestion[] = [];

  // Split the PDF into question blocks
  const blocks =
    text.match(/\d+\.\s[\s\S]*?(?=\d+\.\s|$)/g)?.map((b) => b.trim()) ?? [];

  for (const block of blocks) {
    // Question
    const question = block.match(/^\d+\.\s*([\s\S]*?)\s*A\./)?.[1]?.trim() ?? "";

    // Options
    const optionA = block.match(/A\.\s*([\s\S]*?)\s*B\./)?.[1]?.trim() ?? "";

    const optionB = block.match(/B\.\s*([\s\S]*?)\s*C\./)?.[1]?.trim() ?? "";

    const optionC = block.match(/C\.\s*([\s\S]*?)\s*D\./)?.[1]?.trim() ?? "";

    const optionD = block.match(/D\.\s*([\s\S]*?)\s*Answer:/)?.[1]?.trim() ?? "";

    // Correct Answer
    const answer = block.match(/Answer:\s*([A-D])/i)?.[1]?.toUpperCase() ?? "";

    // Explanation
    const explanation =
      block.match(/Explanation:\s*([\s\S]*?)\s*Difficulty:/)?.[1]?.trim() ?? "";

    // Difficulty
    const difficulty = (
      block.match(/Difficulty:\s*(Easy|Medium|Hard)/i)?.[1] ?? "Medium"
    ).toLowerCase() as "easy" | "medium" | "hard";

    // Points
    const points = Number(block.match(/Points:\s*(\d+)/)?.[1] ?? 1);

    // Skip invalid blocks
    if (!question) continue;

    questions.push({
      question,
      options: [
        {
          optionText: optionA,
          isCorrect: answer === "A",
        },
        {
          optionText: optionB,
          isCorrect: answer === "B",
        },
        {
          optionText: optionC,
          isCorrect: answer === "C",
        },
        {
          optionText: optionD,
          isCorrect: answer === "D",
        },
      ].filter((o) => o.optionText !== ""),
      explanation,
      difficulty,
      points,
      type: "multiple_choice",
    });
  }

  return questions;
}
