import * as pdfjsLib from "pdfjs-dist";

// Worker
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

export async function parsePDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();

  const pdf = await pdfjsLib.getDocument({
    data: arrayBuffer,
  }).promise;

  let text = "";

  for (let page = 1; page <= pdf.numPages; page++) {
    const currentPage = await pdf.getPage(page);

    const content = await currentPage.getTextContent();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pageText = content.items.map((item: any) => item.str).join(" ");

    text += pageText + "\n";
  }

  return text;
}
