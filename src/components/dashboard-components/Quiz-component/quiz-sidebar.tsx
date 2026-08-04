"use client";

import { useEffect, useRef, useState } from "react";
import { ListChecks, Grid3x3 } from "lucide-react";
import gsap from "gsap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { QuestionNavigator, QuestionState } from "./question-navigator";


interface QuizSidebarProps {
  total: number;
  states: QuestionState[];
  current: number;
  onSelect: (index: number) => void;
  answeredCount: number;
  markedCount: number;
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Small helper: animates a number label counting up/down to its new value.
function useCountUp(value: number) {
  const ref = useRef<HTMLSpanElement>(null);
  const prevRef = useRef(0);

  useEffect(() => {
    const from = prevRef.current;
    prevRef.current = value;
    if (!ref.current) return;

    if (prefersReducedMotion()) {
      ref.current.textContent = String(value);
      return;
    }

    const obj = { val: from };
    const tween = gsap.to(obj, {
      val: value,
      duration: 0.4,
      ease: "power2.out",
      onUpdate: () => {
        if (ref.current) ref.current.textContent = String(Math.round(obj.val));
      },
    });

    return () => {
      tween.kill();
    };
  }, [value]);

  return ref;
}

export function QuizSidebar({
  total,
  states,
  current,
  onSelect,
  answeredCount,
  markedCount,
}: QuizSidebarProps) {
  const [open, setOpen] = useState(false);
  const unansweredCount = total - answeredCount - markedCount;

  const answeredRef = useCountUp(answeredCount);
  const markedRef = useCountUp(markedCount);
  const unansweredRef = useCountUp(unansweredCount);

  const legend = [
    { label: "Answered", color: "bg-emerald-500", ref: answeredRef },
    { label: "Marked", color: "bg-amber-500", ref: markedRef },
    {
      label: "Unanswered",
      color: "bg-muted-foreground/30",
      ref: unansweredRef,
    },
  ];

  const navigatorContent = (
    <div className="space-y-4">
      <QuestionNavigator
        total={total}
        states={states}
        current={current}
        onSelect={onSelect}
      />
      <div className="space-y-2 border-t border-border/60 pt-3 px-5">
        {legend.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between text-xs"
          >
            <span className="flex items-center gap-2 text-muted-foreground">
              <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
              {item.label}
            </span>
            <span
              ref={item.ref}
              className="font-bold tabular-nums text-foreground"
            >
              0
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:block lg:sticky lg:top-24">
        <Card className="border-border/70 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-bold">
              <Grid3x3 className="h-4 w-4 text-primary" />
              Question Navigator
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">{navigatorContent}</CardContent>
        </Card>
      </div>

      {/* Mobile: fixed bottom summary bar, keeps status + navigator one tap away */}
      <div className="lg:hidden">
        {/* Reserves space so page content doesn't sit behind the fixed bar */}
        <div className="h-[68px]" aria-hidden="true" />

        <div
          className="fixed inset-x-0 bottom-0 z-30 border-t border-border/70 bg-background/90 px-4 py-3 backdrop-blur-md supports-[backdrop-filter]:bg-background/75"
          style={{
            paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))",
          }}
        >
          <div className="mx-auto flex max-w-lg items-center justify-between gap-3">
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 font-semibold text-foreground">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="tabular-nums">{answeredCount}</span>/{total}{" "}
                answered
              </span>
              {markedCount > 0 && (
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  <span className="tabular-nums">{markedCount}</span> marked
                </span>
              )}
            </div>

            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-shrink-0 rounded-xl"
                >
                  <ListChecks className="mr-1.5 h-4 w-4" />
                  Navigator
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-sm">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <Grid3x3 className="h-5 w-5 text-primary" />
                    Question Navigator
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-6">{navigatorContent}</div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </>
  );
}
