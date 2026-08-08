/* eslint-disable react-hooks/refs */
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface DelyteLoaderProps {
  onComplete: () => void;
}

const VIEWBOX_W = 338;
const VIEWBOX_H = 333;
const BRAND_TEXT = "DELYTE ACADEMY";

const PATH_D = [
  "M0 2.1827C0.201193 13.5956 16.9002 33.2177 34.6052 42.8285L45.2684 48.8353L116.692 49.8364C194.956 51.0378 194.352 51.0378 220.306 64.4529C235.597 72.4619 258.131 94.8872 268.19 111.906C281.268 134.332 284.688 148.748 284.688 180.984C284.487 206.213 284.085 210.618 279.055 224.834L273.421 240.451L287.907 263.277C295.754 275.891 302.997 286.103 303.801 286.103C306.618 286.103 325.329 247.86 329.755 233.243C351.484 162.564 324.927 80.0705 265.977 35.6204C258.533 30.0141 244.45 21.6046 234.39 16.599C202.4 1.18158 202.199 1.18158 95.1643 0.380673C17.3026 -0.42023 0 -0.0197789 0 2.1827Z",
  "M13.0776 93.6859C10.8644 94.6871 7.24296 97.4902 5.02983 99.8929C1.20717 104.098 1.00597 107.502 0.402393 209.617C6.98152e-06 286.503 0.603586 316.537 2.21313 320.742C6.23699 330.353 12.8764 332.155 43.0553 332.155H70.0152L97.981 299.518C113.272 281.698 132.989 258.872 141.439 248.661C150.09 238.449 157.937 229.639 158.943 229.039C159.948 228.438 168.197 237.648 177.251 249.462C208.034 289.306 231.976 319.14 238.213 325.547L244.248 332.155H273.019C288.913 332.155 301.79 331.554 301.79 330.953C301.79 328.35 177.05 167.369 170.612 161.362C163.972 155.556 155.723 156.957 147.072 165.367C142.646 169.571 119.911 196.001 96.5727 224.033C73.0331 252.064 53.115 275.291 52.5114 275.491C51.9078 275.891 51.3042 246.058 51.3042 209.416V142.941L84.0987 142.341L116.692 141.94V135.333C116.692 119.315 102.206 100.894 85.1047 94.6871C76.6546 91.6837 19.9181 90.8828 13.0776 93.6859Z",
  "M138.823 309.529L119.911 331.154L139.628 331.754C150.291 331.955 167.191 331.955 177.05 331.754L195.157 331.154L178.056 309.529C168.6 297.716 160.15 288.105 159.345 288.105C158.54 288.105 149.285 297.716 138.823 309.529Z",
];

// depth positions for each shard, back to front, plus the sweep layer that floats above all of them
const LAYER_Z = [-18, 0, 16];
const SWEEP_Z = 30;

// ---- hand-rolled cubic-bezier solver — a consistent "house" easing curve ----
function cubicBezier(x1: number, y1: number, x2: number, y2: number) {
  const A = (a1: number, a2: number) => 1 - 3 * a2 + 3 * a1;
  const B = (a1: number, a2: number) => 3 * a2 - 6 * a1;
  const C = (a1: number) => 3 * a1;
  const calc = (t: number, a1: number, a2: number) =>
    ((A(a1, a2) * t + B(a1, a2)) * t + C(a1)) * t;
  const slope = (t: number, a1: number, a2: number) =>
    3 * A(a1, a2) * t * t + 2 * B(a1, a2) * t + C(a1);
  const solveT = (x: number) => {
    let t = x;
    for (let i = 0; i < 4; i++) {
      const s = slope(t, x1, x2);
      if (s === 0) return t;
      t -= (calc(t, x1, x2) - x) / s;
    }
    return t;
  };
  return (x: number) => (x1 === y1 && x2 === y2 ? x : calc(solveT(x), y1, y2));
}

const EASE_IN = cubicBezier(0.16, 1, 0.3, 1);
const EASE_OUT = cubicBezier(0.7, 0, 0.84, 0);
// a gentle, symmetric glide — no sharp start or sudden vanish, used for the logo's own dissolve
const EASE_SMOOTH = cubicBezier(0.45, 0, 0.15, 1);
const easeIn = (t: number) => EASE_IN(t);
const easeOut = (t: number) => EASE_OUT(t);
const easeSmooth = (t: number) => EASE_SMOOTH(t);

let instanceCounter = 0;

export default function DelyteLoaderDepth({ onComplete }: DelyteLoaderProps) {
  const idRef = useRef(`dld${instanceCounter++}`);
  const loaderRef = useRef<HTMLDivElement>(null);
  const curtainTopRef = useRef<HTMLDivElement>(null);
  const curtainBottomRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null); // perspective container
  const logoWrapRef = useRef<HTMLDivElement>(null); // the tilting group
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sweepLayerRef = useRef<HTMLDivElement>(null);
  const sweepRectRef = useRef<SVGRectElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ruleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loader = loaderRef.current;
    const stage = stageRef.current;
    const logoWrap = logoWrapRef.current;
    const textEl = textRef.current;
    const glow = glowRef.current;
    const curtainTop = curtainTopRef.current;
    const curtainBottom = curtainBottomRef.current;
    const sweepLayer = sweepLayerRef.current;
    const sweepRect = sweepRectRef.current;
    const content = contentRef.current;
    const rule = ruleRef.current;
    const sub = subRef.current;

    // resolve every ref once, up front — every element below is guaranteed non-null
    // for the rest of the effect, instead of sprinkling `.current` (and `| null`) everywhere
    if (
      !loader ||
      !stage ||
      !logoWrap ||
      !textEl ||
      !glow ||
      !curtainTop ||
      !curtainBottom ||
      !sweepLayer ||
      !sweepRect ||
      !content ||
      !rule ||
      !sub
    ) {
      return;
    }

    const mm = gsap.matchMedia();

    mm.add(
      {
        reduced: "(prefers-reduced-motion: reduce)",
        full: "(prefers-reduced-motion: no-preference)",
      },
      (context) => {
        const conditions = context.conditions as { reduced: boolean };

        // ---- respectful fallback: a simple, fast crossfade, no motion flourishes ----
        if (conditions.reduced) {
          gsap.set(content, { opacity: 0 });
          gsap.set([curtainTop, curtainBottom], { yPercent: 0 });
          const tlReduced = gsap.timeline({ onComplete });
          tlReduced
            .to(content, { opacity: 1, duration: 0.4 })
            .to({}, { duration: 0.7 })
            .to(content, { opacity: 0, duration: 0.3 })
            .to(loader, { opacity: 0, duration: 0.35 }, "-=0.1");
          return () => tlReduced.kill();
        }

        // ---- full cinematic build ----
        const paths = logoWrap.querySelectorAll<SVGPathElement>(".logo-path");
        const chars = textEl.querySelectorAll<HTMLSpanElement>(".char");

        paths.forEach((p) => {
          const length = p.getTotalLength();
          gsap.set(p, {
            strokeDasharray: length,
            strokeDashoffset: length,
            strokeWidth: 1.1,
            fillOpacity: 0,
          });
        });

        gsap.set(stage, { perspective: 900 });
        gsap.set(logoWrap, {
          opacity: 0,
          scale: 0.9,
          rotateX: 14,
          rotateY: -8,
          filter: "blur(10px)",
          transformStyle: "preserve-3d",
          transformOrigin: "50% 50%",
        });
        layerRefs.current.forEach((el, i) => gsap.set(el, { z: LAYER_Z[i] }));
        gsap.set(sweepLayer, { z: SWEEP_Z });
        gsap.set(chars, { opacity: 0, y: 8, filter: "blur(4px)" });
        gsap.set(rule, { scaleX: 0 });
        gsap.set(sub, { opacity: 0, y: 6 });
        gsap.set(sweepRect, { x: -90 });
        gsap.set([curtainTop, curtainBottom], { yPercent: 0 });
        gsap.set(content, { opacity: 1 });

        gsap.to(glow, {
          opacity: 0.55,
          scale: 1.08,
          duration: 3.2,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });

        // variable-weight settle on the wordmark — a no-op on non-variable fonts,
        // a genuine typographic move on ones that support the 'wght' axis
        const weightState = { w: 240 };
        const paintWeight = () => {
          textEl.style.fontVariationSettings = `'wght' ${Math.round(weightState.w)}`;
        };
        paintWeight();

        // ---- cursor-driven depth parallax — only active while the mark is held ----
        let holdActive = false;
        const setRotY = gsap.quickTo(logoWrap, "rotateY", {
          duration: 0.7,
          ease: "power3",
        });
        const setRotX = gsap.quickTo(logoWrap, "rotateX", {
          duration: 0.7,
          ease: "power3",
        });
        const setGlowX = gsap.quickTo(glow, "x", {
          duration: 0.9,
          ease: "power3",
        });
        const setGlowY = gsap.quickTo(glow, "y", {
          duration: 0.9,
          ease: "power3",
        });
        const onPointerMove = (e: PointerEvent) => {
          if (!holdActive) return;
          const nx = (e.clientX / window.innerWidth - 0.5) * 2;
          const ny = (e.clientY / window.innerHeight - 0.5) * 2;
          setRotY(nx * 9);
          setRotX(-ny * 7);
          setGlowX(-nx * 14);
          setGlowY(-ny * 10);
        };
        window.addEventListener("pointermove", onPointerMove);

        const tl = gsap.timeline({ defaults: { ease: easeIn }, onComplete });

        // ---- entrance ----
        tl.to(logoWrap, {
          opacity: 1,
          scale: 1,
          rotateX: 0,
          rotateY: 0,
          filter: "blur(0px)",
          duration: 1.15,
        })
          .to(
            paths,
            { strokeDashoffset: 0, duration: 1.1, stagger: 0.12 },
            "-=0.75",
          )
          .to(paths, { fillOpacity: 1, duration: 0.5 }, "-=0.35")
          .to(
            sweepRect,
            { x: VIEWBOX_W + 90, duration: 0.75, ease: easeOut },
            "-=0.4",
          )
          .to(
            chars,
            {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              duration: 0.6,
              stagger: 0.02,
            },
            "-=0.55",
          )
          .to(
            weightState,
            { w: 520, duration: 0.7, onUpdate: paintWeight },
            "-=0.6",
          )
          .to(rule, { scaleX: 1, duration: 0.5 }, "-=0.25")
          .to(sub, { opacity: 1, y: 0, duration: 0.5 }, "-=0.25")

          // the mark is held — parallax comes alive, invites a glance around it
          .call(() => {
            holdActive = true;
          })
          .to({}, { duration: 1.1 })

          // ---- exit: the logo gets a longer, gentler dissolve than everything else,
          // so it recedes quietly instead of popping out at the same beat as the text ----
          .call(
            () => {
              holdActive = false;
              setRotX(0);
              setRotY(0);
            },
            [],
            "exit",
          )
          .to(
            [chars, sub, rule],
            {
              opacity: 0,
              y: -10,
              filter: "blur(2px)",
              duration: 0.5,
              ease: easeOut,
            },
            "exit",
          )
          .to(
            logoWrap,
            {
              opacity: 0,
              scale: 1.015,
              filter: "blur(5px)",
              duration: 1.1,
              ease: easeSmooth,
            },
            "exit",
          )
          .to(glow, { opacity: 0, duration: 0.9, ease: easeSmooth }, "exit")
          .to(
            curtainTop,
            { yPercent: -100, duration: 1.05, ease: easeIn },
            "exit+=0.35",
          )
          .to(
            curtainBottom,
            { yPercent: 100, duration: 1.05, ease: easeIn },
            "exit+=0.35",
          );

        return () => {
          window.removeEventListener("pointermove", onPointerMove);
          tl.kill();
        };
      },
    );

    return () => mm.revert();
  }, [onComplete]);

  const id = idRef.current;

  const gradientDefs = (
    <>
      <linearGradient
        id={`${id}-paint0`}
        x1="168.64"
        y1="286.103"
        x2="168.64"
        y2="0.0000610352"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5B86FF" />
        <stop offset="0.35" stopColor="#4873FF" />
        <stop offset="0.7" stopColor="#3157FF" />
        <stop offset="1" stopColor="#1E28F0" />
      </linearGradient>
      <linearGradient
        id={`${id}-paint1`}
        x1="151.036"
        y1="332.155"
        x2="151.036"
        y2="91.9573"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5B86FF" />
        <stop offset="0.35" stopColor="#4873FF" />
        <stop offset="0.7" stopColor="#3157FF" />
        <stop offset="1" stopColor="#1E28F0" />
      </linearGradient>
      <linearGradient
        id={`${id}-paint2`}
        x1="157.534"
        y1="331.905"
        x2="157.534"
        y2="288.105"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#5B86FF" />
        <stop offset="0.35" stopColor="#4873FF" />
        <stop offset="0.7" stopColor="#3157FF" />
        <stop offset="1" stopColor="#1E28F0" />
      </linearGradient>
    </>
  );

  return (
    <div ref={loaderRef} className="fixed inset-0 z-[9999] overflow-hidden">
      <div
        ref={curtainTopRef}
        className="absolute inset-x-0 top-0 h-1/2 bg-[#0A0D18]"
      />
      <div
        ref={curtainBottomRef}
        className="absolute inset-x-0 bottom-0 h-1/2 bg-[#0A0D18]"
      />

      <div
        ref={glowRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(circle at 50% 44%, rgba(49,87,255,0.18), transparent 45%)",
        }}
      />

      <div
        ref={contentRef}
        className="relative flex h-full w-full flex-col items-center justify-center"
      >
        <div ref={stageRef} className="relative h-24 w-24">
          <div ref={logoWrapRef} className="relative h-full w-full">
            {/* three depth shards of the same mark, stacked with real translateZ */}
            {PATH_D.map((d, i) => (
              <div
                key={i}
                ref={(el) => {
                  layerRefs.current[i] = el;
                }}
                className="absolute inset-0"
              >
                <svg
                  viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
                  className="h-full w-full"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
                >
                  <defs>{gradientDefs}</defs>
                  <path
                    className="logo-path"
                    stroke={`url(#${id}-paint${i})`}
                    fill={`url(#${id}-paint${i})`}
                    d={d}
                  />
                </svg>
              </div>
            ))}

            {/* the light sweep floats in front of all three shards */}
            <div ref={sweepLayerRef} className="absolute inset-0">
              <svg
                viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
                className="h-full w-full"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <defs>
                  <clipPath id={`${id}-clip`}>
                    <path d={PATH_D[0]} />
                    <path d={PATH_D[1]} />
                    <path d={PATH_D[2]} />
                  </clipPath>
                  <linearGradient
                    id={`${id}-sweep`}
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="0"
                  >
                    <stop offset="0" stopColor="white" stopOpacity="0" />
                    <stop offset="0.5" stopColor="white" stopOpacity="0.9" />
                    <stop offset="1" stopColor="white" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <g clipPath={`url(#${id}-clip)`}>
                  <rect
                    ref={sweepRectRef}
                    x="-90"
                    y="-20"
                    width="70"
                    height={VIEWBOX_H + 40}
                    fill={`url(#${id}-sweep)`}
                    transform="rotate(14 169 166)"
                  />
                </g>
              </svg>
            </div>
          </div>
        </div>

        <h2
          ref={textRef}
          className="mt-8 flex overflow-hidden text-[13px] tracking-[0.42em] text-[#EAEDF7]"
        >
          {BRAND_TEXT.split("").map((c, i) => (
            <span key={i} className="char inline-block">
              {c === " " ? "\u00A0" : c}
            </span>
          ))}
        </h2>

        <div
          ref={ruleRef}
          className="mt-4 h-px w-10 origin-center bg-[#5B86FF]/50"
        />

        <p
          ref={subRef}
          className="mt-4 text-[11px] font-light tracking-[0.14em] text-slate-500"
        >
          Preparing your learning workspace
        </p>
      </div>
    </div>
  );
}
