import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PanelProps {
  title: string;
  description?: string;
  /** Right-aligned header content (a link, a toggle…). */
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

/** Shared surface for every block on the progress page: one hairline card, one heading style. */
export function Panel({ title, description, action, children, className }: PanelProps) {
  return (
    <section className={cn("rounded-xl border bg-card p-5 shadow-card sm:p-6", className)}>
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="font-heading text-lg font-extrabold tracking-tight">{title}</h2>
          {description && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
