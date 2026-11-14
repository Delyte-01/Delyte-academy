/**
 * Single entry point for GSAP in Delyte.
 * - Registers plugins once.
 * - Exposes shared eases/durations so every animation feels the same.
 * - `prefersReducedMotion()` must gate every decorative tween.
 * Import from here instead of `gsap` directly in new code.
 */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export const EASE = {
  /** Default entrance: fast start, long soft landing. */
  out: "power3.out",
  /** Hero / large-surface entrances. */
  soft: "expo.out",
  /** Two-way moves (drawers, tabs). */
  inOut: "power2.inOut",
  /** Playful settle for magnetic / press feedback. */
  spring: "elastic.out(1, 0.55)",
} as const;

export const DURATION = {
  fast: 0.25,
  base: 0.6,
  slow: 0.9,
} as const;

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** True on devices with a real hover-capable pointer (not touch). */
export function hasFinePointer(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches
  );
}

export { gsap, ScrollTrigger, useGSAP };
