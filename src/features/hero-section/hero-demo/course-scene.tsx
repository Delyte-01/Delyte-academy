import { BookOpen, ChevronRight, ListChecks } from "lucide-react";

/**
 * Scene A of the hero demo: a sample course page listing topics, each with a
 * quiz row underneath. Purely decorative (the fake cursor "clicks" a row), so
 * it is `aria-hidden` and contains nothing focusable.
 *
 * Sample labels only: no counts, durations, scores or names.
 */
const TOPICS = [
  { id: "intro", title: "Introduction" },
  { id: "core", title: "Core concepts" },
  { id: "worked", title: "Worked examples" },
] as const;

export function CourseScene() {
  return (
    <div
      data-demo-scene="course"
      aria-hidden
      className="pointer-events-none absolute inset-0 p-5 group-data-[scene=b]/demo:opacity-0"
    >
      <div data-course-item className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary-soft-foreground">
          <BookOpen className="size-5" />
        </span>
        <div className="min-w-0">
          <p className="font-headline text-xl font-bold leading-tight tracking-[-0.02em] text-foreground">
            Sample course
          </p>
          <p className="text-sm font-semibold text-muted-foreground">
            Pick a quiz to start
          </p>
        </div>
      </div>

      <ol className="mt-4 space-y-3.5">
        {TOPICS.map((topic, i) => (
          <li key={topic.id} data-course-item>
            <div className="flex h-11 items-center gap-3">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold tabular-nums text-muted-foreground">
                {i + 1}
              </span>
              <span className="truncate text-[15px] font-bold text-foreground">
                {topic.title}
              </span>
            </div>
            <div
              data-quiz-row={topic.id}
              data-state="idle"
              className="ml-10 flex h-10 items-center gap-2.5 rounded-xl border bg-background px-3 text-sm font-semibold text-foreground transition-[border-color,background-color] duration-150 motion-reduce:transition-none data-[state=hover]:border-primary/50 data-[state=hover]:bg-primary-soft/60 data-[state=press]:border-primary data-[state=press]:bg-primary-soft"
            >
              <ListChecks className="size-4 shrink-0 text-primary" />
              <span className="min-w-0 flex-1 truncate">Quiz: {topic.title}</span>
              <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
