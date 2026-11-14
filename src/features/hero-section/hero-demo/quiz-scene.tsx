import { Check, RotateCcw, X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Scene B/C of the hero demo: the quiz player. Same look as `quiz-preview.tsx`,
 * but every state that the GSAP timeline toggles is a `data-state` attribute
 * (styled with Tailwind data variants), so auto-play never re-renders React.
 *
 * Sample content only: no scores, no names, no statistics.
 */
export const QUESTION = {
  text: "Solve for x: 2x + 6 = 14",
  options: ["3", "4", "5", "8"],
  /** Index of the right answer ("4"). */
  correct: 1,
} as const;

export const LETTERS = ["A", "B", "C", "D"] as const;
export const TOTAL = 8;
/** 1-based position shown in the navigator. */
export const CURRENT = 3;

export const FEEDBACK = {
  idle: "Pick an answer to see how feedback works.",
  correct: "Correct. Real quizzes score automatically.",
  wrong: "Not quite. 2x = 8, so x = 4.",
} as const;

interface QuizSceneProps {
  /** `manual`: options are real, focusable buttons. `auto`: decorative. */
  mode: "auto" | "manual";
  onAnswer: (index: number) => void;
  onTryAgain: () => void;
}

export function QuizScene({ mode, onAnswer, onTryAgain }: QuizSceneProps) {
  const manual = mode === "manual";

  return (
    <div
      data-demo-scene="quiz"
      className="pointer-events-none absolute inset-0 p-5 opacity-0 group-data-[mode=manual]/demo:pointer-events-auto group-data-[scene=b]/demo:opacity-100"
    >
      {/* question navigator, illustrative only */}
      <div className="flex items-center gap-1.5" aria-hidden>
        {Array.from({ length: TOTAL }, (_, i) => i + 1).map((n) => (
          <span
            key={n}
            data-nav-cell
            data-state={n < CURRENT ? "done" : n === CURRENT ? "current" : "idle"}
            className="flex h-8 flex-1 items-center justify-center rounded-md bg-muted text-xs font-bold tabular-nums text-muted-foreground transition-colors duration-200 data-[state=current]:bg-primary data-[state=current]:text-primary-foreground data-[state=current]:shadow-brand data-[state=done]:bg-primary-soft data-[state=done]:text-primary-soft-foreground motion-reduce:transition-none"
          >
            {n}
          </span>
        ))}
      </div>

      <p data-q-label className="mt-4 text-sm font-semibold text-muted-foreground">
        Question {CURRENT} of {TOTAL}
      </p>
      <p
        data-q-text
        className="mt-1 font-headline text-2xl font-bold tracking-[-0.02em] text-foreground"
      >
        {QUESTION.text}
      </p>

      <div className="mt-4 space-y-2">
        {QUESTION.options.map((option, i) => (
          // The wrapper is what GSAP staggers in (opacity/y); the button only
          // changes colour through `data-state`, so the two never fight.
          <div key={option} data-option-wrap>
            <button
              type="button"
              data-option={i}
              data-state="idle"
              tabIndex={manual ? 0 : -1}
              onClick={() => onAnswer(i)}
              className="group/opt flex min-h-11 w-full items-center gap-3 rounded-xl border bg-background px-3.5 py-2 text-left text-[15px] font-semibold text-foreground outline-none transition-[border-color,background-color,box-shadow,opacity] duration-150 focus-visible:ring-[3px] focus-visible:ring-ring/40 motion-reduce:transition-none group-data-[mode=auto]/demo:pointer-events-none data-[state=correct]:border-success data-[state=correct]:bg-success-soft data-[state=dim]:opacity-55 data-[state=hover]:border-primary/50 data-[state=hover]:bg-primary-soft/60 data-[state=hover]:shadow-soft data-[state=idle]:hover:border-primary/50 data-[state=idle]:hover:bg-primary-soft/60 data-[state=idle]:hover:shadow-soft data-[state=wrong]:border-destructive data-[state=wrong]:bg-destructive/10"
            >
              <span
                data-badge
                className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-bold text-muted-foreground transition-colors duration-150 group-data-[state=correct]/opt:bg-success group-data-[state=correct]/opt:text-background group-data-[state=wrong]/opt:bg-destructive group-data-[state=wrong]/opt:text-background motion-reduce:transition-none"
              >
                <span className="group-data-[state=correct]/opt:hidden group-data-[state=wrong]/opt:hidden">
                  {LETTERS[i]}
                </span>
                <Check aria-hidden className="hidden size-4 group-data-[state=correct]/opt:block" />
                <X aria-hidden className="hidden size-4 group-data-[state=wrong]/opt:block" />
              </span>
              <span className="tabular-nums">{option}</span>
            </button>
          </div>
        ))}
      </div>

      <div className="mt-3 flex min-h-9 items-center justify-between gap-3">
        <p
          data-feedback
          data-state="idle"
          aria-live={manual ? "polite" : "off"}
          className="text-sm font-semibold text-muted-foreground data-[state=correct]:text-success data-[state=wrong]:text-destructive"
        >
          {FEEDBACK.idle}
        </p>
        <button
          type="button"
          data-retry
          onClick={onTryAgain}
          className={cn(
            "hidden shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-bold text-primary outline-none transition-colors hover:bg-primary-soft focus-visible:ring-[3px] focus-visible:ring-ring/40",
            "group-data-[answered=true]/demo:group-data-[mode=manual]/demo:inline-flex",
          )}
        >
          <RotateCcw className="size-3.5" aria-hidden />
          Try again
        </button>
      </div>
    </div>
  );
}
