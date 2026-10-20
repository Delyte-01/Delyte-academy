"use client";

import Link from "next/link";
import { ArrowLeft, FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyQuizState({ topicId }: { topicId: string }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-5 px-4 py-10 text-center">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-muted">
        <FileQuestion
          className="size-8 text-muted-foreground"
          strokeWidth={1.75}
        />
      </div>
      <div className="max-w-sm space-y-1.5">
        <h1 className="text-lg font-semibold">This topic has no quiz yet</h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Questions haven&apos;t been added for this topic. Go back to the
          lesson and check again later.
        </p>
      </div>
      <Button asChild>
        <Link href={`/dashboard/topics/${topicId}`}>
          <ArrowLeft className="mr-2 size-4" />
          Back to topic
        </Link>
      </Button>
    </div>
  );
}
