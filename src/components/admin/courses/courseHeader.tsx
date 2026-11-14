"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";

interface CourseHeaderProps {
  title: string;
  subtitle: string;
  breadcrumbs: { label: string; href?: string }[];
  /** Kept for call-site compatibility — actions live in the sticky `ActionBar`. */
  onSaveDraft?: () => void;
  onPublish?: () => void;
  onCancel?: () => void;
  saving?: boolean;
  savingMessage?: string;
}

/** Form page heading. The single set of save actions is the sticky bar below the form. */
export function CourseHeader({ title, subtitle, breadcrumbs }: CourseHeaderProps) {
  return (
    <PageHeader
      title={title}
      description={subtitle}
      breadcrumb={
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5">
          <Link
            href="/admin"
            aria-label="Admin home"
            className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Home className="size-4" />
          </Link>
          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <span key={crumb.label} className="flex items-center gap-1.5">
                <ChevronRight className="size-4 shrink-0 text-muted-foreground/50" aria-hidden />
                {crumb.href && !isLast ? (
                  <Link
                    href={crumb.href}
                    className="font-medium capitalize text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="font-semibold capitalize text-foreground">
                    {crumb.label}
                  </span>
                )}
              </span>
            );
          })}
        </nav>
      }
    />
  );
}
