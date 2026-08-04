"use client";

import Link from "next/link";
import { FileQuestion, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface EmptyQuizStateProps {
  topicId: string;
}

export function EmptyQuizState({ topicId }: EmptyQuizStateProps) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md border-border/70 shadow-sm">
        <CardContent className="flex flex-col items-center gap-5 p-6 text-center sm:p-8">
          {/* Icon with layered depth instead of a flat tile */}
          <div className="relative flex h-20 w-20 items-center justify-center">
            <div className="absolute inset-0 rounded-3xl bg-muted" />
            <div className="absolute inset-0 rounded-3xl border border-dashed border-border" />
            <FileQuestion
              className="relative h-9 w-9 text-muted-foreground"
              strokeWidth={1.75}
            />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-lg font-bold text-foreground">
              No quiz here yet
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              This topic doesn&apos;t have a quiz configured yet. Check back
              later, or head back and keep going with the material.
            </p>
          </div>

          <Button className="w-full shadow-sm sm:w-auto" asChild>
            <Link href={`/dashboard/topics/${topicId}`}>
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              Back to Topic
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
