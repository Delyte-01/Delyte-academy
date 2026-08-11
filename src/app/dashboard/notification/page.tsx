"use client";

import Link from "next/link";
import { Bell, CheckCheck, ArrowRight, Inbox } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { useNotifications } from "@/components/dashboard-components/notifications-components/notification-context";
import { NotificationCard } from "@/components/dashboard-components/notifications-components/notification-card";

import { useState } from "react";
import {
  filterConfig,
  groupNotifications,
  NotificationFilter,
} from "@/components/dashboard-components/notifications-components/notification-types";
import { toast } from "sonner";
import { NotificationType } from "@/types/notification";

const COURSE_TYPES: NotificationType[] = [
  "course_published",
  "topic_added",
  "course_completed",
];

export default function NotificationsPage() {
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } =
    useNotifications();

  const [filter, setFilter] = useState<NotificationFilter>("all");

  const countFor = (value: NotificationFilter) => {
    switch (value) {
      case "unread":
        return notifications.filter((n) => !n.read).length;
      case "courses":
        return notifications.filter((n) => COURSE_TYPES.includes(n.type))
          .length;
      case "quizzes":
        return notifications.filter((n) => n.type === "quiz_added").length;
      case "announcements":
        return notifications.filter((n) => n.type === "announcement").length;
      case "results":
        return notifications.filter((n) => n.type === "quiz_result").length;
      default:
        return notifications.length;
    }
  };

  const filtered = (() => {
    switch (filter) {
      case "unread":
        return notifications.filter((n) => !n.read);
      case "courses":
        return notifications.filter((n) => COURSE_TYPES.includes(n.type));
      case "quizzes":
        return notifications.filter((n) => n.type === "quiz_added");
      case "announcements":
        return notifications.filter((n) => n.type === "announcement");
      case "results":
        return notifications.filter((n) => n.type === "quiz_result");
      default:
        return notifications;
    }
  })();

  const groups = groupNotifications(filtered);

  const handleMarkAllRead = async () => {
    await markAllAsRead();
    toast.info("All notifications marked as read.");
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl border bg-card p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-violet-500/10 blur-3xl" />

        <div className="relative">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary">
                <Bell className="h-5.5 w-5.5" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                  Notifications
                </h1>
                <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                  New courses, quizzes, announcements, and your latest results.
                </p>
              </div>
            </div>

            {unreadCount > 0 && (
              <span className="hidden shrink-0 items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary sm:inline-flex">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                {unreadCount} unread
              </span>
            )}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-border/60 pt-5">
            <div className="flex flex-wrap gap-3">
              <StatPill label="Total" value={notifications.length} />
              <StatPill label="Unread" value={unreadCount} accent />
              <StatPill
                label="Read"
                value={notifications.length - unreadCount}
              />
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllRead}
              disabled={unreadCount === 0}
            >
              <CheckCheck className="mr-1.5 h-4 w-4" />
              Mark all as read
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {filterConfig.map((f) => {
          const count = countFor(f.value);
          const isActive = filter === f.value;
          return (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                "flex flex-shrink-0 items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-medium transition-all",
                isActive
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground",
              )}
            >
              {f.label}
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[11px] font-semibold leading-none tabular-nums",
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
        <EmptyState hasFilter={filter !== "all"} />
      ) : (
        <div className="space-y-6">
          {groups.map((group) => (
            <div key={group.label} className="space-y-3">
              <div className="flex items-center gap-3 px-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {group.label}
                </p>
                <div className="h-px flex-1 bg-border/60" />
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatPill({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-2xl border px-4 py-2",
        accent ? "border-primary/30 bg-primary/5" : "border-border bg-muted/30",
      )}
    >
      <span
        className={cn(
          "text-xl font-extrabold tabular-nums",
          accent ? "text-primary" : "text-foreground",
        )}
      >
        {value}
      </span>
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
    </div>
  );
}

function EmptyState({ hasFilter = false }: { hasFilter?: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border bg-card py-20 text-center">
      <div className="relative">
        <div className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-primary/5 blur-2xl" />
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          {hasFilter ? (
            <Inbox className="h-9 w-9 text-muted-foreground" />
          ) : (
            <Bell className="h-9 w-9 text-muted-foreground" />
          )}
        </div>
        {!hasFilter && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white shadow-sm">
            ✓
          </span>
        )}
      </div>

      <div>
        <p className="text-lg font-bold text-foreground">
          {hasFilter ? "Nothing here yet" : "You're all caught up"}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {hasFilter
            ? "Try a different filter to see more notifications."
            : "No new notifications right now."}
        </p>
      </div>

      <Link href="/dashboard">
        <Button variant="outline" size="sm">
          Back to dashboard
          <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
        </Button>
      </Link>
    </div>
  );
}

function NotificationSkeleton() {
  return (
    <div className="space-y-6">
      {["Today", "Earlier"].map((label) => (
        <div key={label} className="space-y-3">
          <div className="h-3 w-16 animate-pulse rounded-full bg-muted" />
          {[0, 1].map((i) => (
            <div
              key={i}
              className="flex items-start gap-3.5 rounded-3xl border bg-card p-4"
            >
              <div className="h-11 w-11 flex-shrink-0 animate-pulse rounded-2xl bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/2 animate-pulse rounded-full bg-muted" />
                <div className="h-3 w-3/4 animate-pulse rounded-full bg-muted" />
                <div className="h-2.5 w-20 animate-pulse rounded-full bg-muted" />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
