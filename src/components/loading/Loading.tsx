"use client";

/**
 * FullPageLoader — a light-theme, GSAP-powered loading overlay with a
 * single, premium center-spinner (smooth rotating gradient arc + soft
 * breathing glow). No orbiting particles, no busy motion — designed to
 * feel calm, modern, and "product-grade" (think Linear / Stripe / Vercel).
 *
 * Install once in your project:
 *   npm install gsap
 *
 * Usage:
 *   import { FullPageLoader } from "./FullPageLoader";
 *
 *   if (loading) {
 *     return <FullPageLoader label="Loading" />;
 *   }
 *
 * Drop just the spinner (no overlay) anywhere:
 *   import { Spinner } from "./FullPageLoader";
 *   <Spinner size={48} />
 */

import React, { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { gsap } from "gsap";

/* ------------------------------------------------------------------ */
/*  Types & color tokens                                              */
/* ------------------------------------------------------------------ */

export type SpinnerColor =
  | "indigo"
  | "emerald"
  | "rose"
  | "amber"
  | "cyan"
  | "violet"
  | "slate";

export interface ColorTokens {
  readonly from: string;
  readonly to: string;
  readonly ring: string;
  readonly glow: string;
}

const COLOR_MAP: Readonly<Record<SpinnerColor, ColorTokens>> = {
  indigo: {
    from: "#6366f1",
    to: "#8b5cf6",
    ring: "#e0e7ff",
    glow: "rgba(99,102,241,0.25)",
  },
  emerald: {
    from: "#059669",
    to: "#10b981",
    ring: "#d1fae5",
    glow: "rgba(16,185,129,0.25)",
  },
  rose: {
    from: "#e11d48",
    to: "#fb7185",
    ring: "#ffe4e6",
    glow: "rgba(244,63,94,0.25)",
  },
  amber: {
    from: "#d97706",
    to: "#f59e0b",
    ring: "#fef3c7",
    glow: "rgba(245,158,11,0.25)",
  },
  cyan: {
    from: "#0891b2",
    to: "#22d3ee",
    ring: "#cffafe",
    glow: "rgba(6,182,212,0.25)",
  },
  violet: {
    from: "#7c3aed",
    to: "#c084fc",
    ring: "#ede9fe",
    glow: "rgba(139,92,246,0.25)",
  },
  slate: {
    from: "#334155",
    to: "#64748b",
    ring: "#e2e8f0",
    glow: "rgba(51,65,85,0.18)",
  },
};

/* ------------------------------------------------------------------ */
/*  Shared style injection (once per document)                        */
/* ------------------------------------------------------------------ */

const STYLE_ID = "ffl-styles-light";

function useInjectStyles(): void {
  useLayoutEffect(() => {
    if (typeof document === "undefined") return;
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = CSS;
    document.head.appendChild(style);
  }, []);
}

let uidCounter = 0;

/* ------------------------------------------------------------------ */
/*  Spinner — the premium center spinner                              */
/*                                                                     */
/*  Construction:                                                      */
/*  - a faint full track ring (sets the "socket" the arc lives in)     */
/*  - a gradient arc (~70% of the circle) that rotates smoothly        */
/*  - the arc's length breathes slightly (dash-array tween) so it      */
/*    never reads as a robotic, linear spin                            */
/*  - a soft blurred glow layer for depth, matched to the accent color */
/* ------------------------------------------------------------------ */

export interface SpinnerProps {
  /** Pixel size of the spinner (width & height). Default 56. */
  size?: number;
  /** Accent color theme. Default "indigo". */
  color?: SpinnerColor;
  /** Stroke width of the arc, in px at a 56px reference size. Default 4. */
  thickness?: number;
  /** Extra className passed to the wrapping element. */
  className?: string;
}

export function Spinner({
  size = 56,
  color = "indigo",
  thickness = 4,
  className,
}: SpinnerProps): React.JSX.Element {
  useInjectStyles();

  const tokens: ColorTokens = COLOR_MAP[color];
  const uid = useMemo<string>(() => `${uidCounter++}`, []);

  const groupRef = useRef<SVGGElement | null>(null);
  const arcRef = useRef<SVGCircleElement | null>(null);

  const radius = (size - thickness) / 2 - 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Continuous, perfectly linear rotation — this is what makes a
      // spinner feel "premium" rather than jittery.
      gsap.to(groupRef.current, {
        rotation: 360,
        transformOrigin: "50% 50%",
        duration: 1.1,
        repeat: -1,
        ease: "none",
      });

      // Subtle breathing of the arc length, like native macOS/iOS
      // activity indicators — keeps the eye engaged without noise.
      if (arcRef.current) {
        gsap.fromTo(
          arcRef.current,
          { strokeDashoffset: circumference * 0.92 },
          {
            strokeDashoffset: circumference * 0.18,
            duration: 1.3,
            repeat: -1,
            yoyo: true,
            ease: "power2.inOut",
          },
        );
      }
    });
    return () => ctx.revert();
  }, [circumference]);

  const gradId = `ffl-arc-grad-${uid}`;

  return (
    <div
      className={["ffl-glow-wrap", className].filter(Boolean).join(" ")}
      style={{
        ["--ffl-glow" as string]: tokens.glow,
        width: size,
        height: size,
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="ffl-svg"
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={tokens.from} />
            <stop offset="100%" stopColor={tokens.to} />
          </linearGradient>
        </defs>

        {/* faint track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={tokens.ring}
          strokeWidth={thickness}
        />

        {/* rotating gradient arc */}
        <g ref={groupRef}>
          <circle
            ref={arcRef}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={`url(#${gradId})`}
            strokeWidth={thickness}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * 0.75}
          />
        </g>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  FullPageLoader — light-theme overlay wrapping the Spinner          */
/* ------------------------------------------------------------------ */

export interface FullPageLoaderProps {
  /** Text shown under the spinner. Default "Loading". */
  label?: string;
  /** Accent color theme. Default "indigo". */
  color?: SpinnerColor;
  /** Spinner size in px. Default 64. */
  size?: number;
  /** Spinner stroke thickness in px. Default 4. */
  thickness?: number;
  /** Render nothing when false — keep the component mounted and toggle it. */
  visible?: boolean;
}

export function FullPageLoader({
  color = "indigo",
  size = 64,
  thickness = 4,
  visible = true,
}: FullPageLoaderProps): React.JSX.Element | null {
  useInjectStyles();

  const overlayRef = useRef<HTMLDivElement | null>(null);
  const dotsRef = useRef<Array<HTMLSpanElement | null>>([]);
  

  useEffect(() => {
    if (!visible) return;
    const ctx = gsap.context(() => {
      gsap.from(overlayRef.current, {
        opacity: 0,
        duration: 0.35,
        ease: "power2.out",
      });
      gsap.to(dotsRef.current, {
        opacity: 0.2,
        y: -2,
        duration: 0.5,
        repeat: -1,
        yoyo: true,
        stagger: 0.15,
        ease: "sine.inOut",
      });
    });
    return () => ctx.revert();
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="min-h-full w-full flex items-center justify-center">
      <div ref={overlayRef} className="ffl-overlay">
      <Spinner size={size} color={color} thickness={thickness} />
    </div></div>
   
  );
}

export default FullPageLoader;

/* ------------------------------------------------------------------ */
/*  CSS — light theme                                                 */
/* ------------------------------------------------------------------ */

const CSS = `
.ffl-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 18px;
  background: #fafafa;
}

.ffl-glow-wrap {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  filter: drop-shadow(0 4px 14px var(--ffl-glow));
}

.ffl-svg {
  display: block;
}

.ffl-label {
  margin: 0;
  font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.01em;
  color: transparent;
  background-clip: text;
  -webkit-background-clip: text;
  display: inline-flex;
}

.ffl-dots {
  display: inline-flex;
  margin-left: 2px;
  background-image: inherit;
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}

.ffl-dot {
  display: inline-block;
}

@media (prefers-reduced-motion: reduce) {
  .ffl-svg g,
  .ffl-svg circle,
  .ffl-dot {
    animation: none !important;
  }
}
`;
