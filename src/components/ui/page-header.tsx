import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  /** Small label above the title, e.g. a section name. */
  eyebrow?: string;
  /** Breadcrumb / back link rendered above the eyebrow. */
  breadcrumb?: ReactNode;
  /** Primary action(s), right-aligned on desktop and stacked on mobile. */
  actions?: ReactNode;
  className?: string;
}

/** Standard page heading used by student and admin pages. */
export function PageHeader({
  title,
  description,
  eyebrow,
  breadcrumb,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "animate-fade-up flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="min-w-0 space-y-2">
        {breadcrumb && <div className="text-sm text-muted-foreground">{breadcrumb}</div>}
        {eyebrow && (
          <p className="inline-flex items-center rounded-full bg-primary-soft px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-primary-soft-foreground">
            {eyebrow}
          </p>
        )}
        <h1 className="font-heading text-[28px] font-extrabold leading-tight tracking-tight text-foreground sm:text-[34px]">
          {title}
        </h1>
        {description && (
          <p className="max-w-2xl text-[15px] leading-relaxed text-muted-foreground sm:text-base">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex shrink-0 flex-wrap items-center gap-2.5">{actions}</div>
      )}
    </header>
  );
}
