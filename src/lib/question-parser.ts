import { ParsedQuestion } from "@/types/parser";

export function parseQuestions(text: string): ParsedQuestion[] {
  const questions: ParsedQuestion[] = [];

  // Normalize line endings and restore line breaks for PDF text
  const normalized = text
    .replace(/\r/g, "")
    .replace(/\s+(?=Question(?:\s+\d+)?\s*:)/gi, "\n")
    .replace(/\s+(?=Type:)/gi, "\n")
    .replace(/\s+(?=Difficulty:)/gi, "\n")
    .replace(/\s+(?=Points:)/gi, "\n")
    .replace(/\s+(?=Option:)/gi, "\n")
    .replace(/\s+(?=Correct\s+Answer:)/gi, "\n")
    .replace(/\s+(?=Answer:)/gi, "\n")
    .replace(/\s+(?=Explanation:)/gi, "\n");

  const blocks = normalized
    .split(/(?=Question(?:\s+\d+)?\s*:)/i)
    .map((b) => b.trim())
    .filter(Boolean);

  for (const block of blocks) {
    const lines = block
      .split(/\n+/)
      .map((l) => l.trim())
      .filter(Boolean);

    let question = "";
    let explanation = "";
    let difficulty: "easy" | "medium" | "hard" = "medium";
    let points = 1;
    const options: { optionText: string; isCorrect: boolean }[] = [];
    let correctLetter = "";

    for (const line of lines) {
      if (/^Question(?:\s+\d+)?\s*:/i.test(line)) {
        question = line.replace(/^Question(?:\s+\d+)?\s*:/i, "").trim();
      } else if (/^Option\s*:/i.test(line)) {
        let optionText = line.replace(/^Option\s*:/i, "").trim();
        let isCorrect = false;

        if (optionText.endsWith("*")) {
          isCorrect = true;
          optionText = optionText.replace(/\*$/, "").trim();
        }

        options.push({ optionText, isCorrect });
      } else if (/^Correct\s+Answer\s*:/i.test(line)) {
        correctLetter =
          line.match(/^Correct\s+Answer\s*:\s*([A-D])/i)?.[1]?.toUpperCase() ??
          "";
      } else if (/^Answer\s*:/i.test(line)) {
        correctLetter =
          line.match(/^Answer\s*:\s*([A-D])/i)?.[1]?.toUpperCase() ?? "";
      } else if (/^Explanation\s*:/i.test(line)) {
        explanation = line.replace(/^Explanation\s*:/i, "").trim();
      } else if (/^Difficulty\s*:/i.test(line)) {
        difficulty = (
          line.match(/Difficulty\s*:\s*(Easy|Medium|Hard)/i)?.[1] ?? "Medium"
        ).toLowerCase() as "easy" | "medium" | "hard";
      } else if (/^Points\s*:/i.test(line)) {
        points = Number(line.match(/Points\s*:\s*(\d+)/i)?.[1] ?? 1);
      }
    }

    // If the file uses Correct Answer: B
    if (correctLetter) {
      const index = correctLetter.charCodeAt(0) - 65;
      if (options[index]) {
        options[index].isCorrect = true;
      }
    }

    if (question && options.length >= 2) {
      questions.push({
        question,
        options,
        explanation,
        difficulty,
        points,
        type: "multiple_choice",
      });
    }
  }

  return questions;
}
