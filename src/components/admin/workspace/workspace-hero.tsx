import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface WorkspaceHeroProps {
  backHref: string;
  backLabel: string;
  /** Optional cover image; falls back to the brand wash. */
  cover?: string;
  /** Square tile that overlaps the cover (thumbnail or icon). */
  media: ReactNode;
  title: string;
  /** Status / difficulty pills shown beside the title. */
  badges?: ReactNode;
  /** Quiet meta row under the title (code, duration…). */
  meta?: ReactNode;
  description?: string;
  /** Right-aligned actions; stack below the title on mobile. */
  actions?: ReactNode;
  className?: string;
}

/**
 * Shared header for the course and topic workspaces. A slim cover strip,
 * an overlapping media tile, then title / meta / actions on one clear row.
 */
export function WorkspaceHero({
  backHref,
  backLabel,
  cover,
  media,
  title,
  badges,
  meta,
  description,
  actions,
  className,
}: WorkspaceHeroProps) {
  return (
    <header
      className={cn(
        "animate-fade-up overflow-hidden rounded-xl border bg-card shadow-card",
        className,
      )}
    >
      <div className="relative h-24 w-full overflow-hidden bg-brand-wash sm:h-32">
        {cover && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cover} alt="" className="h-full w-full object-cover" />
        )}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-card/70 via-transparent to-transparent"
        />
        <Link
          href={backHref}
          className="group absolute left-3 top-3 inline-flex min-h-10 items-center gap-1.5 rounded-full bg-card/90 px-3.5 text-[13px] font-semibold text-foreground shadow-soft backdrop-blur transition-colors hover:bg-card focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
          {backLabel}
        </Link>
      </div>

      <div className="flex flex-col gap-5 px-4 pb-5 sm:px-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex min-w-0 items-end gap-4">
          <div className="-mt-9 shrink-0 sm:-mt-11">{media}</div>
          <div className="min-w-0 space-y-1.5 pb-0.5">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-heading text-2xl font-extrabold leading-tight tracking-tight text-foreground first-letter:capitalize sm:text-[28px]">
                {title}
              </h1>
              {badges}
            </div>
            {meta && (
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[13px] text-muted-foreground">
                {meta}
              </div>
            )}
          </div>
        </div>
        {actions && (
          <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>
        )}
      </div>

      {description && (
        <p className="border-t px-4 py-3.5 text-[15px] leading-relaxed text-muted-foreground first-letter:capitalize sm:px-6">
          <span className="line-clamp-2">{description}</span>
        </p>
      )}
    </header>
  );
}

/** Square media tile used inside `WorkspaceHero`. */
export function WorkspaceMedia({ children }: { children: ReactNode }) {
  return (
    <div className="flex size-[72px] items-center justify-center overflow-hidden rounded-xl border-4 border-card bg-primary-soft text-primary-soft-foreground shadow-card sm:size-24">
      {children}
    </div>
  );
}
