"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import gsap from "gsap";
import { Moon, Sun, Bell, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface AdminTopbarProps {
  onOpenMobile: () => void;
  title: string;
  subtitle?: string;
}

export default function AdminTopbar({
  onOpenMobile,
  title,
  subtitle,
}: AdminTopbarProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const bellRef = useRef<HTMLButtonElement>(null);
  const iconWrapRef = useRef<HTMLSpanElement>(null);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  // Entrance
  useEffect(() => {
    if (!headerRef.current) return;
    gsap.fromTo(
      headerRef.current,
      { y: -16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" }
    );
  }, []);

  // One-time attention wobble on the bell, after entrance settles
  useEffect(() => {
    if (!mounted || !bellRef.current) return;
    const tl = gsap.timeline({ delay: 0.6 });
    tl.to(bellRef.current, {
      rotate: 14,
      duration: 0.12,
      ease: "power1.inOut",
      transformOrigin: "top center",
    })
      .to(bellRef.current, {
        rotate: -12,
        duration: 0.12,
        ease: "power1.inOut",
      })
      .to(bellRef.current, { rotate: 6, duration: 0.1, ease: "power1.inOut" })
      .to(bellRef.current, { rotate: 0, duration: 0.1, ease: "power1.inOut" });
  }, [mounted]);

  const toggleTheme = () => {
    if (iconWrapRef.current) {
      gsap.fromTo(
        iconWrapRef.current,
        { rotate: -90, opacity: 0, scale: 0.6 },
        { rotate: 0, opacity: 1, scale: 1, duration: 0.35, ease: "back.out(2)" }
      );
    }
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border/60 bg-background/70 px-4 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 sm:px-6"
    >
      {/* Mobile menu */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onOpenMobile}
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Title */}
      <div className="min-w-0 flex-1 lg:flex-none">
        <h1 className="truncate text-base font-bold tracking-tight text-foreground sm:text-lg">
          {title}
        </h1>
        {subtitle && (
          <p className="hidden truncate text-xs text-muted-foreground sm:block">
            {subtitle}
          </p>
        )}
      </div>

      {/* Search (desktop) */}
      <div className="relative hidden max-w-xs flex-1 md:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search..."
          className="h-9 border-border/60 bg-muted/60 pl-9 pr-12 transition-colors focus-visible:bg-background"
        />
        <kbd className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 items-center gap-0.5 rounded border border-border/60 bg-background px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground md:flex">
          ⌘K
        </kbd>
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        {/* Dark mode toggle */}
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              ref={bellRef}
              variant="ghost"
              size="icon"
              className="relative"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive/60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-destructive ring-2 ring-background" />
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            <DropdownMenuLabel className="flex items-center justify-between">
              Notifications
              <Badge  className="text-[10px]">
                3 new
              </Badge>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex flex-col items-start gap-0.5 py-2">
              <span className="text-sm font-medium">New student enrolled</span>
              <span className="text-xs text-muted-foreground">
                Adaora N. joined Biology
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-0.5 py-2">
              <span className="text-sm font-medium">
                Course submitted for review
              </span>
              <span className="text-xs text-muted-foreground">
                Chemistry in Depth
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-0.5 py-2">
              <span className="text-sm font-medium">
                Practice set published
              </span>
              <span className="text-xs text-muted-foreground">
                JAMB Math Mock #4
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="ml-1 flex items-center gap-2 rounded-full outline-none ring-offset-background transition-shadow focus-visible:ring-2 focus-visible:ring-ring">
              <Avatar className="h-9 w-9 ring-2 ring-primary/20 transition-all hover:ring-primary/40">
                <AvatarFallback className="bg-gradient-to-br from-primary to-indigo-700 text-xs font-bold text-primary-foreground">
                  DA
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="text-sm font-semibold">Super Admin</span>
                <span className="text-xs font-normal text-muted-foreground">
                  admin@delyte.academy
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
