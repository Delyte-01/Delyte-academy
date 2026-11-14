"use client";

import { Fragment, useRef, type ElementType } from "react";
import { cn } from "@/lib/utils";
import { EASE, gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";

interface RevealTextProps {
  text: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  /** Seconds between words. */
  stagger?: number;
  /** Play on mount (default) or when scrolled into view. */
  on?: "mount" | "scroll";
}

/**
 * Headline that rises word-by-word from a mask. Screen readers get the plain text
 * (aria-label) and the animated spans are hidden from them.
 */
export function RevealText({
  text,
  as: Tag = "h1",
  className,
  delay = 0,
  stagger = 0.06,
  on = "mount",
}: RevealTextProps) {
  const ref = useRef<HTMLElement>(null);
  // "\n" in `text` forces a line break (e.g. "Study smarter,\nTrack every step").
  const lines = text.split("\n");

  useGSAP(
    () => {
      const root = ref.current;
      if (!root || prefersReducedMotion()) return;
      gsap.from(root.querySelectorAll("[data-word]"), {
        yPercent: 110,
        duration: 0.9,
        delay,
        stagger,
        ease: EASE.soft,
        clearProps: "transform",
        scrollTrigger:
          on === "scroll"
            ? { trigger: root, start: "top 88%", once: true }
            : undefined,
      });
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} aria-label={text.replace(/\n/g, " ")} className={cn(className)}>
      {lines.map((line, li) => {
        const words = line.split(" ");
        return (
          <Fragment key={li}>
            {li > 0 && <br />}
            {words.map((w, i) => (
              <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.12em] align-bottom">
                <span data-word className="inline-block will-change-transform">
                  {w}
                  {i < words.length - 1 ? "\u00A0" : ""}
                </span>
              </span>
            ))}
          </Fragment>
        );
      })}
    </Tag>
  );
}
