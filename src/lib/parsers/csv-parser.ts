import { ParsedQuestion } from "@/types/parser";
import Papa from "papaparse";

export async function parseCSV(file: File): Promise<ParsedQuestion[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,

      complete(results) {
        const questions: ParsedQuestion[] = results.data
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .filter((row: any) => row.question?.trim())
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((row: any) => ({
            question: row.question,
            options: [
              {
                optionText: row.option_a,
                isCorrect: row.correct === "A",
              },
              {
                optionText: row.option_b,
                isCorrect: row.correct === "B",
              },
              {
                optionText: row.option_c,
                isCorrect: row.correct === "C",
              },
              {
                optionText: row.option_d,
                isCorrect: row.correct === "D",
              },
            ],
            explanation: row.explanation,
            difficulty: row.difficulty?.toLowerCase(),
            points: Number(row.points) || 1,
            type: "multiple_choice",
          }));
        console.log("Parsed Questions:", questions);
        resolve(questions);
      },

      error(error) {
        reject(error);
      },
    });
  });
}
