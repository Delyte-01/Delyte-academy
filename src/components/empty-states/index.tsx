import { type LucideIcon, SearchX } from "lucide-react";
import { type ReactNode } from "react";

interface EmptyStateProps {
  /** Icon component, e.g. from lucide-react. Defaults to a "nothing found" glyph. */
  icon?: LucideIcon;
  title: string;
  description?: string;
  /** Optional call to action — e.g. a "Clear filters" or "Create topic" button. */
  action?: ReactNode;
  className?: string;
}

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
      className={`flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border px-6 py-16 text-center ${className}`}
    >
      <div className="flex size-12 items-center justify-center rounded-full bg-muted">
        <Icon className="size-5 text-muted-foreground" strokeWidth={1.75} aria-hidden="true" />
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-foreground">{title}</p>
        {description && (
          <p className="text-sm text-muted-foreground max-w-sm text-balance">{description}</p>
        )}
      </div>

      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}