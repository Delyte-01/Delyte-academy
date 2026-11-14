"use client";

import Link from "next/link";
import { Bell, GraduationCap, LogOut, Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Kbd } from "@/components/ui/kbd";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAdminNotifications } from "@/hooks/useAdminNotification";
import { initialsOf, roleLabel } from "@/components/admin/admin-sidebar";
import type { Profile } from "@/types/profile";

interface AdminTopbarProps {
  profile: Profile | null;
  onOpenMobile: () => void;
  onOpenSearch: () => void;
  onSignOut: () => void;
}

export default function AdminTopbar({ profile, onOpenMobile, onOpenSearch, onSignOut }: AdminTopbarProps) {
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useAdminNotifications();

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b bg-background/85 px-4 backdrop-blur-md sm:px-6">
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={onOpenMobile} aria-label="Open menu">
        <Menu aria-hidden />
      </Button>

      {/* Search / command palette trigger */}
      <button
        type="button"
        onClick={onOpenSearch}
        aria-label="Search courses and pages"
        className="group flex h-10 min-w-0 max-w-md flex-1 items-center gap-2.5 rounded-xl border bg-card px-3 text-left text-sm text-muted-foreground shadow-soft transition-colors hover:border-primary/40 hover:text-foreground"
      >
        <Search className="size-4 shrink-0" aria-hidden />
        <span className="min-w-0 flex-1 truncate">Search courses or jump to…</span>
        <Kbd className="hidden sm:inline-flex">⌘K</Kbd>
      </button>

      <div className="ml-auto flex items-center gap-1">
        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-xl"
              aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : "Notifications"}
            >
              <Bell aria-hidden />
              {unreadCount > 0 && (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold tabular-nums text-destructive-foreground">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[min(22rem,calc(100vw-2rem))]">
            <DropdownMenuLabel className="flex items-center justify-between gap-2">
              Notifications
              {unreadCount > 0 && (
                <Button
                  variant="link"
                  size="sm"
                  className="h-auto p-0 text-xs"
                  onClick={(e) => {
                    e.preventDefault();
                    void markAllAsRead();
                  }}
                >
                  Mark all as read
                </Button>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-96 overflow-y-auto">
              {loading ? (
                <div className="space-y-2 p-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="skeleton-shimmer h-12 rounded-lg bg-muted" />
                  ))}
                </div>
              ) : notifications.length === 0 ? (
                <p className="p-6 text-center text-sm text-muted-foreground">You&apos;re all caught up.</p>
              ) : (
                notifications.map((n) => (
                  <DropdownMenuItem
                    key={n.id}
                    className="flex cursor-pointer flex-col items-start gap-0.5 py-3"
                    onClick={() => void markAsRead(n.id)}
                  >
                    <div className="flex w-full items-start justify-between gap-2">
                      <span className="text-sm font-semibold">{n.title}</span>
                      {!n.read && <span aria-label="Unread" className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />}
                    </div>
                    <span className="text-[13px] text-muted-foreground">{n.message}</span>
                    <span className="text-xs text-muted-foreground/80">
                      {new Date(n.created_at).toLocaleString([], {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </DropdownMenuItem>
                ))
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label="Account menu"
              className="ml-1 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <Avatar className="size-9">
                <AvatarFallback className="bg-primary-soft text-xs font-bold text-primary-soft-foreground">
                  {initialsOf(profile)}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60">
            <DropdownMenuLabel>
              <div className="flex flex-col gap-0.5">
                <span className="truncate text-sm font-bold">{profile?.full_name || profile?.username || "Admin"}</span>
                <span className="truncate text-xs font-normal text-muted-foreground">{profile?.email}</span>
                {profile && <span className="text-xs font-semibold text-primary">{roleLabel(profile.role)}</span>}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard">
                <GraduationCap aria-hidden /> Student view
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={onSignOut}
            >
              <LogOut aria-hidden /> Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
