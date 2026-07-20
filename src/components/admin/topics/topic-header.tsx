"use client";

import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowLeft, ChevronRight, Home, Layers } from "lucide-react";

gsap.registerPlugin(useGSAP);

interface TopicHeaderProps {
  title: string;
  subtitle: string;
  breadcrumbs: { label: string; href?: string }[];
  belongsTo: { label: string; code: string; href: string };
}

export function TopicHeader({
  title,
  subtitle,
  breadcrumbs,
  belongsTo,
}: TopicHeaderProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".topic-header-reveal",
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.07, ease: "power2.out" }
      );
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className="space-y-4">
      {/* Back link */}
      <Link
        href={belongsTo.href}
        className="topic-header-reveal group inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4 transition-transform duration-200 ease-out group-hover:-translate-x-1" />
        Back
      </Link>

      {/* Breadcrumbs */}
      <nav className="topic-header-reveal flex items-center gap-1.5 text-sm">
        <Link
          href="/admin"
          className="flex items-center text-muted-foreground transition-colors hover:text-foreground"
        >
          <Home className="h-3.5 w-3.5" />
        </Link>
        {breadcrumbs.map((crumb, idx) => {
          const isLast = idx === breadcrumbs.length - 1;
          return (
            <span key={crumb.label} className="flex items-center gap-1.5">
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
              {crumb.href && !isLast ? (
                <Link
                  href={crumb.href}
                  className="group relative capitalize text-muted-foreground transition-colors hover:text-foreground"
                >
                  {crumb.label}
                  <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-foreground/40 transition-all duration-300 group-hover:w-full" />
                </Link>
              ) : (
                <span className="font-medium capitalize text-foreground">
                  {crumb.label}
                </span>
              )}
            </span>
          );
        })}
      </nav>

      {/* Title + Belongs to */}
      <div className="topic-header-reveal flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-[26px]">
            {title}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        </div>

        <Link
          href={belongsTo.href}
          className="group flex items-center gap-2.5 rounded-xl border bg-card px-3 py-2 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md hover:shadow-primary/5"
        >
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 transition-transform duration-200 group-hover:scale-105">
            <Layers className="h-4 w-4 text-primary" />
          </div>
          <div className="leading-tight">
            <span className="block text-[11px] text-muted-foreground">
              Belongs to
            </span>
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
              {belongsTo.label}
              <span className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                {belongsTo.code}
              </span>
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}
