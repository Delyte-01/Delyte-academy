"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { FileText, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type CourseStatus = "draft" | "published";

interface StatusSelectorProps {
  value: CourseStatus;
  onChange: (status: CourseStatus) => void;
}

const options: { value: CourseStatus; label: string; icon: typeof FileText }[] =
  [
    { value: "draft", label: "Draft", icon: FileText },
    { value: "published", label: "Published", icon: CheckCircle2 },
  ];

export function StatusSelector({ value, onChange }: StatusSelectorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const hasAnimated = useRef(false);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const pill = pillRef.current;
    const activeBtn = btnRefs.current[value];
    if (!container || !pill || !activeBtn) return;

    const cRect = container.getBoundingClientRect();
    const bRect = activeBtn.getBoundingClientRect();

    gsap.to(pill, {
      x: bRect.left - cRect.left,
      width: bRect.width,
      duration: hasAnimated.current ? 0.35 : 0.01,
      ease: "power3.out",
    });
    hasAnimated.current = true;
  }, [value]);

  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-foreground">
        Course Status
      </label>
      <div
        ref={containerRef}
        className="relative inline-flex w-full items-center gap-1 rounded-xl bg-muted p-1 sm:w-auto"
      >
        <div
          ref={pillRef}
          className={cn(
            "absolute left-0 top-1 h-[calc(100%-8px)] rounded-lg shadow-sm transition-colors duration-200",
            value === "published" ? "bg-emerald-500" : "bg-background"
          )}
          style={{ willChange: "transform, width" }}
        />
        {options.map(({ value: optValue, label, icon: Icon }) => {
          const active = value === optValue;
          return (
            <button
              key={optValue}
              type="button"
              ref={(el) => {
                btnRefs.current[optValue] = el;
              }}
              onClick={() => onChange(optValue)}
              className={cn(
                "relative z-10 flex flex-1 items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition-colors sm:flex-none sm:px-5",
                active
                  ? optValue === "published"
                    ? "text-white"
                    : "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
