"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const NAV_LINKS: [string, string][] = [
  ["#features", "Features"],
  ["#how-it-works", "How it works"],
  ["#courses", "Courses"],
  ["#faq", "FAQ"],
];

/**
 * Landing header. Fixed to the top and always visible while scrolling, in both
 * directions. It starts as a light frosted bar and firms up (solid surface,
 * hairline, soft shadow) once the page moves. The link for the section in view
 * is marked as current.
 */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy: the section crossing the middle band of the viewport is current.
  useEffect(() => {
    const targets = NAV_LINKS.map(([href]) =>
      document.getElementById(href.slice(1)),
    ).filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );
    targets.forEach((el) => observer.observe(el));

    // Back above the first section: nothing is current.
    const onScroll = () => {
      if (window.scrollY < 200) setActive("");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4">
      <div
        className={cn(
          "pointer-events-auto relative mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 rounded-full border bg-card/85 pl-5 pr-2 backdrop-blur-xl transition-[border-color,box-shadow] duration-300 motion-reduce:transition-none",
          scrolled ? "border-foreground/15 shadow-float" : "border-border shadow-card",
        )}
      >
        <Link
          href="/"
          aria-label="Delyte Academy home"
          className="rounded-lg outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40"
        >
          <Logo priority />
        </Link>

        <nav
          aria-label="Primary"
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex"
        >
          {NAV_LINKS.map(([href, label]) => {
            const current = active === href;
            return (
              <Link
                key={href}
                href={href}
                aria-current={current ? "location" : undefined}
                className={cn(
                  "relative rounded-full px-3.5 py-1.5 text-sm font-semibold outline-none transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/40",
                  current
                    ? "bg-primary-soft text-primary-soft-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <ThemeToggle />
          <Button asChild variant="ghost" className="hidden rounded-full md:inline-flex">
            <Link href="/login">Sign in</Link>
          </Button>
          <Button asChild variant="brand" className="hidden rounded-full px-5 md:inline-flex">
            <Link href="/sign-up">
              Get started
              <ArrowRight aria-hidden />
            </Link>
          </Button>

          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Open menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(true)}
            >
              <Menu aria-hidden />
            </Button>
            <SheetContent side="right" className="landing w-[85%] max-w-sm p-0">
              <SheetHeader className="border-b p-5">
                <SheetTitle className="font-heading text-lg">Menu</SheetTitle>
                <SheetDescription className="sr-only">
                  Site navigation and account links
                </SheetDescription>
              </SheetHeader>
              <nav aria-label="Mobile" className="flex flex-col gap-1 px-3 pt-3">
                {NAV_LINKS.map(([href, label]) => (
                  <SheetClose asChild key={href}>
                    <Link
                      href={href}
                      className="flex h-12 items-center rounded-xl px-3 text-base font-semibold text-foreground outline-none transition-colors hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/40"
                    >
                      {label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
              <div className="mt-auto flex flex-col gap-3 border-t p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
                <SheetClose asChild>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/login">Sign in</Link>
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button asChild variant="brand" size="lg" className="rounded-full">
                    <Link href="/sign-up">
                      Create free account
                      <ArrowRight aria-hidden />
                    </Link>
                  </Button>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
