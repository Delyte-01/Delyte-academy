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
const meta =
notificationTypeMeta[notification.type] ??
notificationTypeMeta.system;

const Icon = meta.icon;

const content = (
<div
className={cn(
"group relative flex items-start gap-3.5 rounded-3xl border p-4 transition-all duration-200",
"hover:-translate-y-0.5 hover:shadow-md",
notification.read
? "border-border bg-card"
: "border-primary/20 bg-primary/[0.03]",
)}
>
{/* Icon */}
<div
className={cn(
"flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl",
meta.bg,
)}
>
<Icon className={cn("h-5 w-5", meta.accent)} /> </div>


  {/* Body */}
  <div className="min-w-0 flex-1">
    <div className="flex items-start justify-between gap-2">
      <p className="text-sm font-semibold text-foreground">
        {notification.title}
      </p>

      {!notification.read && (
        <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-primary transition-opacity duration-300 group-hover:opacity-40" />
      )}
    </div>

    <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
      {notification.message}
    </p>

    <div className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground">
      {notification.course_id && (
        <>
          <span className="truncate font-medium text-foreground/70">
            Course
          </span>

          <span className="text-muted-foreground/50">·</span>
        </>
      )}

      <span>{formatRelativeTime(notification.created_at)}</span>
    </div>
  </div>

  {/* Action */}
  {variant === "default" && notification.link && (
    <div className="flex-shrink-0 self-center">
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground transition-all group-hover:bg-primary group-hover:text-primary-foreground">
        <ArrowRight className="h-3.5 w-3.5" />
      </span>
    </div>
  )}
</div>


);

if (notification.link) {
return (
<Link
href={notification.link}
onClick={() => onRead?.(notification.id)}
className="block"
>
{content} </Link>
);
}

return (
<button
onClick={() => onRead?.(notification.id)}
className="block w-full text-left"
>
{content} </button>
);
}
