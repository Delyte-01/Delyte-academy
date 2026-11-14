"use client";

import { type ReactNode } from "react";
import { Inbox, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import AdminBreadcrumb from "@/components/admin/admin-breadcrumb";
import { cn } from "@/lib/utils";

interface AdminPageShellProps {
  title: string;
  description?: string;
  /** Primary "create" action (brand button with a plus). */
  actionLabel?: string;
  onAction?: () => void;
  /** Extra actions rendered before the primary button. */
  actions?: ReactNode;
  /** Kept for backwards compatibility with existing callers; no longer rendered. */
  icon?: ReactNode;
  children: ReactNode;
}

/** Standard admin page: breadcrumb + PageHeader + content. */
export default function AdminPageShell({
  title,
  description,
  actionLabel,
  onAction,
  actions,
  children,
}: AdminPageShellProps) {
  return (
    <div className="space-y-8">
      <PageHeader
        breadcrumb={<AdminBreadcrumb />}
        title={title}
        description={description}
        actions={
          (actions || actionLabel) && (
            <>
              {actions}
              {actionLabel && (
                <Button variant="brand" onClick={onAction}>
                  <Plus aria-hidden />
                  {actionLabel}
                </Button>
              )}
            </>
          )
        }
      />
      <div className="animate-fade-in">{children}</div>
    </div>
  );
}

interface PlaceholderCardProps {
  message: string;
  icon?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

/** Quiet dashed placeholder for "nothing here yet" panels. */
export function PlaceholderCard({
  message,
  icon,
  actionLabel,
  onAction,
  className,
}: PlaceholderCardProps) {
  return (
    <div
      role="status"
      className={cn(
        "bg-brand-wash flex min-h-[320px] flex-col items-center justify-center gap-3 rounded-xl border border-dashed p-8 text-center",
        className,
      )}
    >
      <span className="flex size-12 items-center justify-center rounded-2xl border bg-card text-primary shadow-card">
        {icon ?? <Inbox className="size-5" aria-hidden />}
      </span>
      <p className="max-w-xs text-[15px] leading-relaxed text-muted-foreground">{message}</p>
      {actionLabel && (
        <Button variant="soft" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
