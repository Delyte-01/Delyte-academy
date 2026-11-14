"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Bell, LogOut, Menu, MessageSquare, Moon, Search, Settings, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Kbd } from "@/components/ui/kbd";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { NotificationBell } from "./notifications-components/notification-bell";

interface HeaderProps {
  onMenuClick: () => void;
  onSearchClick: () => void;
  onSignOut: () => void;
  displayName: string;
  displayLevel: string;
  avatarUrl: string;
}

const noopSubscribe = () => () => {};

/** Mac-style shortcut hint on Apple devices, "Ctrl" elsewhere. Hydration-safe. */
function useIsApple() {
  return useSyncExternalStore(
    noopSubscribe,
    () => /Mac|iPhone|iPad/i.test(navigator.userAgent),
    () => true,
  );
}

export default function Header({
  onMenuClick,
  onSearchClick,
  onSignOut,
  displayName,
  displayLevel,
  avatarUrl,
}: HeaderProps) {
  const { user } = useAuth();
  const { resolvedTheme, setTheme } = useTheme();
  const isApple = useIsApple();
  const iconWrapRef = useRef<HTMLSpanElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const toggleTheme = () => {
    if (iconWrapRef.current && !prefersReducedMotion()) {
      gsap.fromTo(
        iconWrapRef.current,
        { rotate: -90, opacity: 0, scale: 0.6 },
        { rotate: 0, opacity: 1, scale: 1, duration: 0.25, ease: "power2.out", clearProps: "all" },
      );
    }
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const avatarSrc =
    avatarUrl || user?.user_metadata?.avatar_url || user?.user_metadata?.picture || undefined;

  return (
    <header
      className={cn(
        "sticky top-0 z-20 flex h-16 items-center justify-between gap-3 bg-background/80 px-4 backdrop-blur-xl transition-shadow duration-200 sm:px-6 lg:px-8",
        scrolled ? "shadow-[0_1px_0_var(--border)]" : "shadow-none",
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="-ml-2 lg:hidden"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
        >
          <Menu className="size-5" />
        </Button>

        {/* Desktop: search field that opens the command palette */}
        <button
          type="button"
          onClick={onSearchClick}
          aria-label="Search courses and pages"
          className="hidden h-11 w-full max-w-sm items-center gap-3 rounded-xl border bg-card px-3.5 text-left text-[15px] text-muted-foreground shadow-soft transition-colors hover:border-primary/30 hover:text-foreground sm:flex"
        >
          <Search className="size-4 shrink-0" aria-hidden />
          <span className="flex-1 truncate">Search courses, pages…</span>
          <span className="flex items-center gap-1">
            <Kbd>{isApple ? "⌘" : "Ctrl"}</Kbd>
            <Kbd>K</Kbd>
          </span>
        </button>

        <Button
          variant="ghost"
          size="icon"
          className="sm:hidden"
          onClick={onSearchClick}
          aria-label="Search courses and pages"
        >
          <Search className="size-5" />
        </Button>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
          <span ref={iconWrapRef} className="inline-flex">
            <Sun className="hidden size-5 dark:block" />
            <Moon className="size-5 dark:hidden" />
          </span>
        </Button>

        <NotificationBell />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label="Open account menu"
              className="ml-1 flex min-h-11 items-center gap-2.5 rounded-xl py-1 pl-1 pr-2 outline-none transition-colors hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/40 sm:pr-3"
            >
              <Avatar className="size-9">
                <AvatarImage src={avatarSrc} alt={displayName} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <span className="hidden text-left leading-tight md:block">
                <span className="block max-w-[10rem] truncate text-sm font-bold text-foreground">
                  {displayName}
                </span>
                <span className="block text-[13px] text-muted-foreground">{displayLevel}</span>
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="truncate">{displayName}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="min-h-10 text-[15px]">
              <Link href="/dashboard/settings">
                <Settings /> Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="min-h-10 text-[15px]">
              <Link href="/dashboard/notification">
                <Bell /> Notifications
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="min-h-10 text-[15px]">
              <Link href="/dashboard/feedback">
                <MessageSquare /> Feedback
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onSelect={onSignOut} className="min-h-10 text-[15px]">
              <LogOut /> Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
