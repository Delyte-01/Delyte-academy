"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, LayoutGrid, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NavItem, QuestionNavigator } from "./question-navigator";

interface QuizSidebarProps {
  total: number;
  items: NavItem[];
  current: number;
  onSelect: (index: number) => void;
  answeredCount: number;
  markedCount: number;
  onPrev: () => void;
  onNext: () => void;
  onFinish: () => void;
  isLast: boolean;
  busy?: boolean;
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-muted/60 px-2 py-3 text-center">
      <dd className="font-heading text-xl font-extrabold tabular-nums">{value}</dd>
      <dt className="text-xs font-semibold text-muted-foreground">{label}</dt>
    </div>
  );
}

export function QuizSidebar({
  total,
  items,
  current,
  onSelect,
  answeredCount,
  markedCount,
  onPrev,
  onNext,
  onFinish,
  isLast,
  busy,
}: QuizSidebarProps) {
  const [open, setOpen] = useState(false);
  const unanswered = total - answeredCount;

  const stats = (
    <dl className="grid grid-cols-3 gap-2">
      <Stat label="Answered" value={answeredCount} />
      <Stat label="Left" value={unanswered} />
      <Stat label="Marked" value={markedCount} />
    </dl>
  );

  return (
    <>
      {/* Desktop: sticky rail, sits below the page header (64px) and the quiz bar (~72px) */}
      <aside className="hidden lg:block">
        <div className="sticky top-[10rem] space-y-5 rounded-2xl border bg-card p-5 shadow-card">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Questions
          </h2>
          <QuestionNavigator items={items} current={current} onSelect={onSelect} />
          {stats}
          <Button variant="outline" className="w-full" onClick={onFinish} disabled={busy}>
            <Send />
            Finish quiz
          </Button>
        </div>
      </aside>

      {/* Mobile: thumb-reach bar with navigator, previous and next/finish */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t bg-background/90 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex max-w-xl items-center gap-2">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="lg" className="min-w-0 flex-1 justify-start">
                <LayoutGrid className="shrink-0" />
                <span className="truncate tabular-nums">
                  {answeredCount}/{total} answered
                </span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="bottom"
              className="max-h-[85vh] overflow-y-auto rounded-t-2xl px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]"
            >
              <SheetHeader className="px-0 text-left">
                <SheetTitle>Questions</SheetTitle>
                <SheetDescription>Tap a number to jump to that question.</SheetDescription>
              </SheetHeader>
              <div className="mt-4 space-y-5">
                <QuestionNavigator
                  items={items}
                  current={current}
                  onSelect={(i) => {
                    onSelect(i);
                    setOpen(false);
                  }}
                />
                {stats}
                <Button
                  variant="outline"
                  className="w-full"
                  disabled={busy}
                  onClick={() => {
                    setOpen(false);
                    onFinish();
                  }}
                >
                  <Send />
                  Finish quiz
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          <Button
            variant="outline"
            size="lg"
            className="shrink-0 px-3.5"
            onClick={onPrev}
            disabled={current === 0}
            aria-label="Previous question"
          >
            <ArrowLeft />
          </Button>

          {isLast ? (
            <Button variant="brand" size="lg" className="shrink-0" onClick={onFinish} disabled={busy}>
              Finish
            </Button>
          ) : (
            <Button variant="brand" size="lg" className="shrink-0" onClick={onNext}>
              Next
              <ArrowRight />
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
