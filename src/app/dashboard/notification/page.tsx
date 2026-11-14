"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Bell, CheckCheck, Inbox } from "lucide-react";
import { toast } from "sonner";

import { EmptyState } from "@/components/empty-states";
import { Reveal } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

import { NotificationCard } from "@/components/dashboard-components/notifications-components/notification-card";
import { useNotifications } from "@/components/dashboard-components/notifications-components/notification-context";
import {
  filterConfig,
  filterNotifications,
  groupNotifications,
  type NotificationFilter,
} from "@/components/dashboard-components/notifications-components/notification-types";

export default function NotificationsPage() {
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } =
    useNotifications();
  const [filter, setFilter] = useState<NotificationFilter>("all");

  const filtered = filterNotifications(notifications, filter);
  const groups = groupNotifications(filtered);

  const handleMarkAllRead = async () => {
    await markAllAsRead();
    toast.info("All notifications marked as read.");
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <PageHeader
        title="Notifications"
        description={
          unreadCount > 0
            ? `You have ${unreadCount} unread ${unreadCount === 1 ? "notification" : "notifications"}.`
            : "New courses, quizzes, announcements and your latest results."
        }
        actions={
          <Button
            variant="outline"
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0}
          >
            <CheckCheck aria-hidden />
            Mark all as read
          </Button>
        }
      />

      {/* Filters */}
      <div
        role="group"
        aria-label="Filter notifications"
        className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {filterConfig.map((f) => {
          const count = filterNotifications(notifications, f.value).length;
          const isActive = filter === f.value;
          return (
            <button
              key={f.value}
              type="button"
              aria-pressed={isActive}
              onClick={() => setFilter(f.value)}
              className={cn(
                "flex min-h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-semibold outline-none transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/40",
                isActive
                  ? "border-primary bg-primary text-primary-foreground shadow-soft"
                  : "bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground",
              )}
            >
              {f.label}
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[11px] font-bold leading-none tabular-nums",
                  isActive
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* List */}
      {loading ? (
        <NotificationSkeleton />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={filter === "all" ? Bell : Inbox}
          title={filter === "all" ? "You’re all caught up" : "Nothing here yet"}
          description={
            filter === "all"
              ? "No notifications right now. We’ll let you know when something new is published."
              : "Try a different filter to see more notifications."
          }
          action={
            filter === "all" ? (
              <Button asChild variant="outline">
                <Link href="/dashboard">
                  Back to dashboard
                  <ArrowRight aria-hidden />
                </Link>
              </Button>
            ) : (
              <Button variant="outline" onClick={() => setFilter("all")}>
                Show all
              </Button>
            )
          }
        />
      ) : (
        <div className="space-y-8">
          {groups.map((group) => (
            <Reveal key={group.label} on="mount" className="space-y-3">
              <div className="flex items-center gap-3 px-1">
                <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {group.label}
                </h2>
                <div className="h-px flex-1 bg-border" />
              </div>
              <div className="space-y-3">
                {group.items.map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    onRead={markAsRead}
                  />
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}

function NotificationSkeleton() {
  return (
    <div className="space-y-8" aria-busy>
      {["Today", "Earlier"].map((label) => (
        <div key={label} className="space-y-3">
          <Skeleton className="h-3 w-16 rounded-full" />
          {[0, 1].map((i) => (
            <div key={i} className="flex items-start gap-3.5 rounded-xl border bg-card p-4">
              <Skeleton className="size-11 shrink-0 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-3.5 w-3/4" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
