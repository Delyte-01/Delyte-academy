"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Notification } from "@/types/notification";
import { formatRelativeTime, notificationTypeMeta } from "./notification-types";

interface NotificationCardProps {
  notification: Notification;
  onRead?: (id: string) => void;
  variant?: "default" | "compact";
}

export function NotificationCard({
  notification,
  onRead,
  variant = "default",
}: NotificationCardProps) {
  const meta = notificationTypeMeta[notification.type] ?? notificationTypeMeta.system;
  const Icon = meta.icon;
  const compact = variant === "compact";

  const content = (
    <div
      className={cn(
        "group relative flex items-start gap-3.5 rounded-xl border transition-[border-color,box-shadow,background-color] duration-200 motion-reduce:transition-none",
        compact ? "p-3" : "p-4 hover:border-primary/30 hover:shadow-card",
        notification.read
          ? "bg-card"
          : "border-primary/25 bg-primary-soft/50",
      )}
    >
      <div
        className={cn(
          "flex shrink-0 items-center justify-center rounded-xl",
          compact ? "size-9" : "size-11",
          meta.bg,
        )}
      >
        <Icon className={cn(compact ? "size-4" : "size-5", meta.accent)} aria-hidden />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-[15px] font-bold leading-snug text-foreground">
            {notification.title}
          </p>
          {!notification.read && (
            <>
              <span
                aria-hidden
                className="mt-1.5 size-2 shrink-0 rounded-full bg-primary"
              />
              <span className="sr-only">Unread</span>
            </>
          )}
        </div>

        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          {notification.message}
        </p>

        <div className="mt-2 flex items-center gap-2 text-xs font-semibold text-muted-foreground">
          <span className="rounded-full bg-muted px-2 py-0.5">{meta.label}</span>
          <span aria-hidden>·</span>
          <span>{formatRelativeTime(notification.created_at)}</span>
        </div>
      </div>

      {!compact && notification.link && (
        <span
          aria-hidden
          className="inline-flex size-8 shrink-0 items-center justify-center self-center rounded-full bg-muted text-muted-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground"
        >
          <ArrowRight className="size-3.5" />
        </span>
      )}
    </div>
  );

  const focusRing =
    "block w-full rounded-xl text-left outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40";

  if (notification.link) {
    return (
      <Link
        href={notification.link}
        onClick={() => onRead?.(notification.id)}
        className={focusRing}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onRead?.(notification.id)}
      className={focusRing}
    >
      {content}
    </button>
  );
}
