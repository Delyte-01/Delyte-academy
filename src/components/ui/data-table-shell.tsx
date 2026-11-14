import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DataTableShellProps {
  /** Search / filters / bulk actions row above the table. */
  toolbar?: ReactNode;
  /** Pagination or summary row below the table. */
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
}

/**
 * Card wrapper for tables: toolbar on top, horizontally scrollable body,
 * footer below. Compose with `ui/table`. Wide tables scroll inside the card
 * instead of breaking the page layout on mobile.
 */
export function DataTableShell({ toolbar, footer, children, className }: DataTableShellProps) {
  return (
    <div className={cn("overflow-hidden rounded-xl border bg-card shadow-card", className)}>
      {toolbar && (
        <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
          {toolbar}
        </div>
      )}
      <div className="overflow-x-auto">{children}</div>
      {footer && (
        <div className="flex flex-col gap-3 border-t bg-muted/30 px-4 py-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          {footer}
        </div>
      )}
    </div>
  );
}
