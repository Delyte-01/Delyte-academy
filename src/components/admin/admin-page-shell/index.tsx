'use client';

import { ReactNode, useEffect, useRef } from 'react';
import { Plus, Inbox } from 'lucide-react';
import gsap from 'gsap';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import AdminBreadcrumb from '@/components/admin/admin-breadcrumb';
import { cn } from '@/lib/utils';

interface AdminPageShellProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
  children: ReactNode;
}

export default function AdminPageShell({
  title,
  description,
  actionLabel,
  onAction,
  icon,
  children,
}: AdminPageShellProps) {
  const headerRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(
      headerRef.current,
      { opacity: 0, y: -8 },
      { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' },
    ).fromTo(
      bodyRef.current,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' },
      '-=0.25',
    );
  }, []);

  return (
    <div className="space-y-6">
      <div ref={headerRef} className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2.5">
          <AdminBreadcrumb />
          <div className="flex items-center gap-3">
            {icon && (
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary ring-1 ring-primary/10">
                {icon}
              </div>
            )}
            <div className="relative">
              <span className="absolute -left-3 top-1 h-6 w-1 rounded-full bg-gradient-to-b from-primary to-indigo-600" />
              <h1 className="text-2xl font-extrabold tracking-tight text-foreground">{title}</h1>
              {description && (
                <p className="mt-1 text-sm text-muted-foreground">{description}</p>
              )}
            </div>
          </div>
        </div>
        {actionLabel && (
          <Button
            onClick={onAction}
            className="group w-fit shadow-sm shadow-primary/20 transition-shadow hover:shadow-md hover:shadow-primary/30"
          >
            <Plus className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:rotate-90" />
            {actionLabel}
          </Button>
        )}
      </div>
      <div ref={bodyRef}>{children}</div>
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

export function PlaceholderCard({
  message,
  icon,
  actionLabel,
  onAction,
  className,
}: PlaceholderCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, scale: 0.97 },
      { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' },
    );
  }, []);

  return (
    <Card
      ref={cardRef}
      className={cn(
        'flex min-h-[400px] flex-col items-center justify-center gap-3 border-dashed border-border/80 bg-muted/20 p-8 text-center',
        className,
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-primary/5 text-primary/70 ring-1 ring-primary/10">
        {icon ?? <Inbox className="h-5 w-5" />}
      </div>
      <p className="max-w-xs text-sm text-muted-foreground">{message}</p>
      {actionLabel && (
        <Button variant="outline" size="sm" onClick={onAction} className="mt-1 cursor-pointer">
          {actionLabel}
        </Button>
      )}
    </Card>
  );
}