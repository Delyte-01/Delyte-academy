"use client";

import { useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

import { NotificationCard } from "./notification-card";
import { useNotifications } from "./notification-context";
import { groupNotifications } from "./notification-types";

export function NotificationBell() {
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    reload,
  } = useNotifications();

  const [open, setOpen] = useState(false);
  const [pulse, setPulse] = useState(false);

  const hasUnread = unreadCount > 0;
  const badgeText = unreadCount > 99 ? "99+" : String(unreadCount);

  const handleMarkAllRead = async () => {
    await markAllAsRead();

    toast.success("All notifications marked as read.");
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (value) reload();
      }}
    >
      {" "}
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          onMouseEnter={() => setPulse(true)}
          onMouseLeave={() => setPulse(false)}
          aria-label="Notifications"
        >
          <Bell
            className={cn(
              "h-5 w-5 transition-transform duration-300",
              pulse && "rotate-12",
            )}
          />

          {hasUnread && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground shadow-sm">
              {badgeText}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 p-0 sm:max-w-md"
      >
        <SheetHeader className="space-y-0 border-b px-5 py-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2 text-lg font-bold">
              Notifications
              {hasUnread && (
                <Badge variant="outline" className="text-[10px]">
                  {badgeText} unread
                </Badge>
              )}
            </SheetTitle>

            <div className="flex items-center gap-1 mr-6 rounded-3xl shadow ">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllRead}
                disabled={!hasUnread}
                className="h-8 text-xs "
              >
                <CheckCheck className="mr-1.5 h-3.5 w-3.5" />
                Mark all read
              </Button>
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-3 py-4">
          {loading ? (
            <NotificationSkeleton />
          ) : notifications.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-5">
              {groupNotifications(notifications).map((group) => (
                <div key={group.label} className="space-y-2">
                  <p className="px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {group.label}
                  </p>

                  <div className="space-y-2">
                    {group.items.map((notification) => (
                      <NotificationCard
                        key={notification.id}
                        notification={notification}
                        onRead={markAsRead}
                        variant="compact"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      {" "}
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        {" "}
        <Bell className="h-7 w-7 text-muted-foreground" />{" "}
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground">
          You&apos;re all caught up
        </p>

        <p className="mt-1 text-xs text-muted-foreground">
          No new notifications right now.
        </p>
      </div>
    </div>
  );
}

function NotificationSkeleton() {
  return (
    <div className="space-y-4">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="flex items-start gap-3 rounded-3xl border bg-card p-4"
        >
          {" "}
          <div className="h-11 w-11 animate-pulse rounded-2xl bg-muted" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-1/2 animate-pulse rounded-full bg-muted" />
            <div className="h-3 w-3/4 animate-pulse rounded-full bg-muted" />
            <div className="h-2.5 w-20 animate-pulse rounded-full bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}
