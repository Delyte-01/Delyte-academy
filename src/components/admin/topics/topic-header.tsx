"use client";

import Link from "next/link";
import { ChevronRight, Home, Layers } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";

interface TopicHeaderProps {
  title: string;
  subtitle: string;
  breadcrumbs: { label: string; href?: string }[];
  belongsTo: { label: string; code: string; href: string };
}

export function TopicHeader({ title, subtitle, breadcrumbs, belongsTo }: TopicHeaderProps) {
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
      actions={
        <Link
          href={belongsTo.href}
          className="group flex min-h-12 items-center gap-3 rounded-xl border bg-card px-3.5 py-2 shadow-soft transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary-soft-foreground">
            <Layers className="size-[18px]" aria-hidden />
          </span>
          <span className="leading-tight">
            <span className="block text-xs text-muted-foreground">Belongs to</span>
            <span className="flex items-center gap-2 text-[15px] font-bold text-foreground">
              <span className="max-w-[200px] truncate">{belongsTo.label}</span>
              <span className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
                {belongsTo.code}
              </span>
            </span>
          </span>
        </Link>
      }
    />
  );
}

