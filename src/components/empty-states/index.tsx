import { type LucideIcon, SearchX } from "lucide-react";
import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  /** Icon component, e.g. from lucide-react. Defaults to a "nothing found" glyph. */
  icon?: LucideIcon;
  title: string;
  description?: string;
  /** Optional call to action — e.g. a "Clear filters" or "Create topic" button. */
  action?: ReactNode;
  className?: string;
}

/** Friendly empty state with a soft concentric-ring icon. Static (no animation). */
export function EmptyState({
  icon: Icon = SearchX,
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      role="status"
      className={cn(
        "bg-brand-wash flex flex-col items-center justify-center gap-5 rounded-xl border border-dashed border-border px-6 py-16 text-center",
        className,
      )}
    >
      <div className="relative flex size-24 items-center justify-center" aria-hidden="true">
        <span className="absolute inset-0 rounded-full bg-primary-soft/60" />
        <span className="absolute inset-3 rounded-full bg-primary-soft" />
        <span className="relative flex size-12 items-center justify-center rounded-2xl border bg-card shadow-card">
          <Icon className="size-5 text-primary" strokeWidth={1.9} />
        </span>
      </div>

      <div className="flex max-w-sm flex-col gap-1.5">
        <p className="text-lg font-bold tracking-tight text-foreground">{title}</p>
        {description && (
          <p className="text-balance text-[15px] leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}
