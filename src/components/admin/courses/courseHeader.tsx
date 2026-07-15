"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ChevronRight, FileText, Home, Loader2, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CourseHeaderProps {
  title: string;
  subtitle: string;
  breadcrumbs: { label: string; href?: string }[];
  onSaveDraft: () => void;
  onPublish: () => void;
  onCancel: () => void;
  saving?: boolean;
  savingMessage: string;
}

export function CourseHeader({
  title,
  subtitle,
  breadcrumbs,
  onSaveDraft,
  onPublish,
  onCancel,
  saving,
  savingMessage,
}: CourseHeaderProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!rootRef.current) return;
    gsap.fromTo(
      rootRef.current,
      { opacity: 0, y: -8 },
      { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
    );
  }, []);

  return (
    <div ref={rootRef} className="space-y-4">
      {/* Breadcrumbs */}
      <nav className="flex flex-wrap items-center gap-1.5 text-sm">
        <Link
          href="/admin"
          className="flex items-center rounded-md p-1 -m-1 text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground"
        >
          <Home className="h-3.5 w-3.5" />
        </Link>
        {breadcrumbs.map((crumb, idx) => {
          const isLast = idx === breadcrumbs.length - 1;
          return (
            <span key={crumb.label} className="flex items-center gap-1.5">
              <ChevronRight className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground/40" />
              {crumb.href && !isLast ? (
                <Link
                  href={crumb.href}
                  className="relative capitalize text-muted-foreground transition-colors hover:text-foreground after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-0 after:bg-foreground after:transition-all after:duration-200 hover:after:w-full"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold capitalize text-primary">
                  {crumb.label}
                </span>
              )}
            </span>
          );
        })}
      </nav>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="relative">
          <span className="absolute -left-3 top-1 h-6 w-1 rounded-full bg-gradient-to-b from-primary to-indigo-600" />
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
            {title}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onCancel} disabled={saving}>
            Cancel
          </Button>
          <Button variant="secondary" onClick={onSaveDraft} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                {savingMessage}
              </>
            ) : (
              <FileText className="mr-1.5 h-4 w-4" />
            )}
            Save Draft
          </Button>
          <Button
            variant="secondary"
            onClick={onPublish}
            disabled={saving}
            className="bg-emerald-600 shadow-sm shadow-emerald-600/20 transition-shadow hover:bg-emerald-700 hover:shadow-md hover:shadow-emerald-600/30"
          >
            {saving ? (
              <>
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                {savingMessage}
              </>
            ) : (
              <UploadCloud className="mr-1.5 h-4 w-4" />
            )}
            Publish Course
          </Button>
        </div>
      </div>
    </div>
  );
}
