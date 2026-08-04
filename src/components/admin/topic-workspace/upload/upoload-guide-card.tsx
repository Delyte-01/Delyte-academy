"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, FileText, FileSpreadsheet, FileType } from "lucide-react";

interface UploadGuideCardProps {
  mode: "quiz" | "content";
}

export function UploadGuideCard({ mode }: UploadGuideCardProps) {
  const quizGuides = [
    {
      icon: FileText,
      format: "DOCX",
      description: "Supports formatted questions.",
    },
    {
      icon: FileSpreadsheet,
      format: "CSV",
      description: "Bulk upload hundreds of questions.",
    },
    {
      icon: FileType,
      format: "PDF",
      description: "Extract questions from study materials.",
    },
  ];

  const contentGuides = [
    { icon: FileText, format: "DOCX", description: "Import lecture notes." },
    {
      icon: FileType,
      format: "PDF",
      description: "Import textbooks or handouts.",
    },
  ];

  const guides = mode === "quiz" ? quizGuides : contentGuides;

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-bold">Import Guide</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Format guides */}
        <div className="space-y-3">
          {guides.map(({ icon: Icon, format, description }) => (
            <div key={format} className="flex items-start gap-2.5">
              <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
                <Check className="h-3 w-3 text-emerald-600" />
              </div>
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-semibold text-foreground">
                  {format}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>
          ))}
        </div>

        {/* Example cards */}
        <div className="space-y-2 border-t pt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Example Files
          </p>

          {mode === "quiz" ? (
            <div className="grid grid-cols-2 gap-2">
              {/* DOCX example */}
              <div className="rounded-xl border bg-muted/30 p-3">
                <div className="mb-2 flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-blue-500" />
                  <span className="text-xs font-semibold text-foreground">
                    DOCX
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] font-medium text-foreground">
                    Question?
                  </p>
                  <div className="space-y-0.5">
                    <div className="h-1.5 w-10 rounded-full bg-muted-foreground/20" />
                    <div className="h-1.5 w-10 rounded-full bg-muted-foreground/20" />
                    <div className="h-1.5 w-10 rounded-full bg-muted-foreground/20" />
                    <div className="h-1.5 w-10 rounded-full bg-muted-foreground/20" />
                  </div>
                </div>
              </div>

              {/* CSV example */}
              <div className="rounded-xl border bg-muted/30 p-3">
                <div className="mb-2 flex items-center gap-1.5">
                  <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-500" />
                  <span className="text-xs font-semibold text-foreground">
                    CSV
                  </span>
                </div>
                <div className="space-y-0.5">
                  <p className="font-mono text-[9px] text-muted-foreground">
                    Question,Option A,
                  </p>
                  <p className="font-mono text-[9px] text-muted-foreground">
                    What is 2+2?,4,
                  </p>
                  <p className="font-mono text-[9px] text-muted-foreground">
                    What is 3+3?,6,
                  </p>
                </div>
              </div>

              {/* PDF example */}
              <div className="col-span-2 rounded-xl border bg-muted/30 p-3">
                <div className="mb-2 flex items-center gap-1.5">
                  <FileType className="h-3.5 w-3.5 text-rose-500" />
                  <span className="text-xs font-semibold text-foreground">
                    PDF
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="h-1.5 w-full rounded-full bg-muted-foreground/15" />
                  <div className="h-1.5 w-3/4 rounded-full bg-muted-foreground/15" />
                  <div className="h-1.5 w-5/6 rounded-full bg-muted-foreground/15" />
                </div>
                <p className="mt-1.5 text-[10px] text-muted-foreground">
                  Lecture Notes.pdf
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl border bg-muted/30 p-3">
                <div className="mb-2 flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-blue-500" />
                  <span className="text-xs font-semibold text-foreground">
                    DOCX
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="h-1.5 w-full rounded-full bg-muted-foreground/15" />
                  <div className="h-1.5 w-3/4 rounded-full bg-muted-foreground/15" />
                  <div className="h-1.5 w-5/6 rounded-full bg-muted-foreground/15" />
                </div>
                <p className="mt-1.5 text-[10px] text-muted-foreground">
                  Introduction.docx
                </p>
              </div>
              <div className="rounded-xl border bg-muted/30 p-3">
                <div className="mb-2 flex items-center gap-1.5">
                  <FileType className="h-3.5 w-3.5 text-rose-500" />
                  <span className="text-xs font-semibold text-foreground">
                    PDF
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="h-1.5 w-full rounded-full bg-muted-foreground/15" />
                  <div className="h-1.5 w-2/3 rounded-full bg-muted-foreground/15" />
                  <div className="h-1.5 w-4/5 rounded-full bg-muted-foreground/15" />
                </div>
                <p className="mt-1.5 text-[10px] text-muted-foreground">
                  Lecture.pdf
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Future: AI extraction, OCR, parsed preview */}
      </CardContent>
    </Card>
  );
}
