import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  description?: string;
  /** Optional "View all" style link. */
  href?: string;
  actionLabel?: string;
  /** Custom right-side content (overrides href). */
  actions?: ReactNode;
  className?: string;
}

/** Heading for a section inside a page (below PageHeader). */
export function SectionHeader({
  title,
  description,
  href,
  actionLabel = "View all",
  actions,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("mb-5 flex items-end justify-between gap-4", className)}>
      <div className="min-w-0">
        <h2 className="font-heading text-xl font-bold tracking-tight text-foreground">{title}</h2>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions ??
        (href && (
          <Link
            href={href}
            className="group inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-sm font-semibold text-primary transition-colors hover:bg-primary-soft"
          >
            {actionLabel}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
          </Link>
        ))}
    </div>
  );
}
