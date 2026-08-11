"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Menu, Search, Bell, Sun, Moon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useTheme } from "next-themes";
import { Button } from "../ui/button";
import { useAuth } from "@/hooks/useAuth";
import { NotificationBell } from "./notifications-components/notification-bell";

interface HeaderProps {
  onMenuClick: () => void;
  displayName: string;
  displayLevel: string;
  avatarUrl: string;
}

export default function Header({
  onMenuClick,
  displayName,
  displayLevel,
  avatarUrl,
}: HeaderProps) {
  const { user } = useAuth();
  const headerRef = useRef<HTMLElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const iconWrapRef = useRef<HTMLSpanElement>(null);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: -14 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
      );
    });

    if (dotRef.current) {
      gsap.to(dotRef.current, {
        scale: 1.5,
        opacity: 0,
        duration: 1.4,
        repeat: -1,
        ease: "power1.out",
      });
    }

    return () => ctx.revert();
  }, []);

  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const toggleTheme = () => {
    if (iconWrapRef.current) {
      gsap.fromTo(
        iconWrapRef.current,
        { rotate: -90, opacity: 0, scale: 0.6 },
        {
          rotate: 0,
          opacity: 1,
          scale: 1,
          duration: 0.35,
          ease: "back.out(2)",
        },
      );
    }

    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-border bg-background/80 px-4 py-4 backdrop-blur-md sm:px-6"
    >
      <div className="flex items-center gap-3">
        <button
          className="rounded-xl p-1.5  transition-colors text-muted-foreground hover:bg-muted lg:hidden"
          onClick={onMenuClick}
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden items-center gap-2 rounded-xl  px-3.5 py-2.5 transition-colors bg-muted/60 focus-within:bg-muted0 sm:flex">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search courses, topics, past questions…"
            className="h-auto w-56 p-0 text-[13.5px]"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          <span ref={iconWrapRef} className="inline-flex">
            {mounted && theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </span>
        </Button>
        {/* Notifications */}
        <NotificationBell />

        <div className="hidden h-8 w-px bg-border sm:block" />

        <Link
          href="/dashboard/settings"
          className="flex items-center gap-2.5 rounded-xl py-1 pl-1 pr-2 transition-colors hover:bg-muted"
        >
          <Avatar className="h-9 w-9  ring-2 ring-background shadow-sm ">
            <AvatarImage
              src={
                avatarUrl ||
                user?.user_metadata?.avatar_url ||
                user?.user_metadata?.picture ||
                undefined
              }
              alt={displayName}
            />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <span className="hidden text-left leading-tight md:block">
            <span className="block text-[13px] font-semibold text-foreground">
              {displayName}
            </span>
            <span className="block text-[11px] text-muted-foreground">
              {displayLevel}
            </span>
          </span>
        </Link>
      </div>
    </header>
  );
}
