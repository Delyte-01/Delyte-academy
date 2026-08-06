"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface DelyteLoaderProps {
  onComplete: () => void;
}

const VIEWBOX_W = 338;
const VIEWBOX_H = 333;
const LOGO_DISPLAY = 176;
const LOGO_SHIFT_UP = 34;
const COLOR_STOPS = ["#5B86FF", "#4873FF", "#3157FF", "#1E28F0"];
const BUCKETS = 6;
const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const BRAND_TEXT = "DELYTE ACADEMY";

const PATH_D = [
  "M0 2.1827C0.201193 13.5956 16.9002 33.2177 34.6052 42.8285L45.2684 48.8353L116.692 49.8364C194.956 51.0378 194.352 51.0378 220.306 64.4529C235.597 72.4619 258.131 94.8872 268.19 111.906C281.268 134.332 284.688 148.748 284.688 180.984C284.487 206.213 284.085 210.618 279.055 224.834L273.421 240.451L287.907 263.277C295.754 275.891 302.997 286.103 303.801 286.103C306.618 286.103 325.329 247.86 329.755 233.243C351.484 162.564 324.927 80.0705 265.977 35.6204C258.533 30.0141 244.45 21.6046 234.39 16.599C202.4 1.18158 202.199 1.18158 95.1643 0.380673C17.3026 -0.42023 0 -0.0197789 0 2.1827Z",
  "M13.0776 93.6859C10.8644 94.6871 7.24296 97.4902 5.02983 99.8929C1.20717 104.098 1.00597 107.502 0.402393 209.617C6.98152e-06 286.503 0.603586 316.537 2.21313 320.742C6.23699 330.353 12.8764 332.155 43.0553 332.155H70.0152L97.981 299.518C113.272 281.698 132.989 258.872 141.439 248.661C150.09 238.449 157.937 229.639 158.943 229.039C159.948 228.438 168.197 237.648 177.251 249.462C208.034 289.306 231.976 319.14 238.213 325.547L244.248 332.155H273.019C288.913 332.155 301.79 331.554 301.79 330.953C301.79 328.35 177.05 167.369 170.612 161.362C163.972 155.556 155.723 156.957 147.072 165.367C142.646 169.571 119.911 196.001 96.5727 224.033C73.0331 252.064 53.115 275.291 52.5114 275.491C51.9078 275.891 51.3042 246.058 51.3042 209.416V142.941L84.0987 142.341L116.692 141.94V135.333C116.692 119.315 102.206 100.894 85.1047 94.6871C76.6546 91.6837 19.9181 90.8828 13.0776 93.6859Z",
  "M138.823 309.529L119.911 331.154L139.628 331.754C150.291 331.955 167.191 331.955 177.05 331.754L195.157 331.154L178.056 309.529C168.6 297.716 160.15 288.105 159.345 288.105C158.54 288.105 149.285 297.716 138.823 309.529Z",
];

// ---- hand-rolled cubic-bezier solver — our own "CustomEase", no plugin needed ----
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

// the "house" cinematic curves, reused across every motion for a consistent identity
const EASE_IN = cubicBezier(0.16, 1, 0.3, 1);
const EASE_OUT = cubicBezier(0.7, 0, 0.84, 0);

interface Particle {
  x: number;
  y: number;
  sx: number;
  sy: number;
  cx: number;
  cy: number;
  tx: number;
  ty: number;
  cvDelay: number;
  cvDur: number;
  bsx: number;
  bsy: number;
  bcx: number;
  bcy: number;
  btx: number;
  bty: number;
  bDelay: number;
  bDur: number;
  angle: number;
  baseSize: number;
  size: number;
  colorIdx: number;
  alpha: number;
}

let instanceCounter = 0;

export default function DelyteLoaderCinematic({
  onComplete,
}: DelyteLoaderProps) {
  const idRef = useRef(`dl${instanceCounter++}`);
  const loaderRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logoSvgRef = useRef<SVGSVGElement>(null);
  const materializeGroupRef = useRef<SVGGElement>(null);
  const displaceRef = useRef<SVGFEDisplacementMapElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ruleRef = useRef<HTMLDivElement>(null);
  const barTopRef = useRef<HTMLDivElement>(null);
  const barBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = idRef.current;
    const canvas = canvasRef.current;
    const loader = loaderRef.current;
    const logoSvg = logoSvgRef.current;
    const textEl = textRef.current;
    if (!canvas || !loader || !logoSvg || !textEl) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let raf = 0;
    let holdActive = false;
    let particleDim = 1; // global multiplier — dims particles to an ambient halo once the real mark is drawn

    const isLowPower =
      (typeof navigator !== "undefined" &&
        (navigator.hardwareConcurrency ?? 8) <= 4) ||
      window.innerWidth < 480;
    const PARTICLE_COUNT = isLowPower ? 130 : 230;
    const MAX_DPR = isLowPower ? 1.25 : 1.75;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // ---- position the real logo svg precisely where the particles will land ----
    const scale = LOGO_DISPLAY / VIEWBOX_W;
    const originX = window.innerWidth / 2 - (VIEWBOX_W * scale) / 2;
    const originY =
      window.innerHeight / 2 - (VIEWBOX_H * scale) / 2 - LOGO_SHIFT_UP;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    Object.assign(logoSvg.style, {
      position: "absolute",
      left: `${originX}px`,
      top: `${originY}px`,
      width: `${VIEWBOX_W * scale}px`,
      height: `${VIEWBOX_H * scale}px`,
      opacity: "1",
    });

    if (!isLowPower && materializeGroupRef.current) {
      materializeGroupRef.current.setAttribute(
        "filter",
        `url(#${id}-materialize)`,
      );
    }

    // paths start fully undrawn and unfilled — invisible until the timeline reveals them
    const pathEls = Array.from(
      logoSvg.querySelectorAll<SVGPathElement>(".logo-path"),
    );
    const lengths = pathEls.map((p) => p.getTotalLength());
    const totalLength = lengths.reduce((a, b) => a + b, 0);
    pathEls.forEach((p, i) => {
      gsap.set(p, {
        strokeDasharray: lengths[i],
        strokeDashoffset: lengths[i],
        strokeWidth: 1.1,
        fillOpacity: 0,
      });
    });

    // ---- pre-rendered particle glow sprites (drawImage instead of shadowBlur) ----
    const makeSprite = (color: string, size: number) => {
      const c = document.createElement("canvas");
      c.width = c.height = size;
      const sc = c.getContext("2d")!;
      const r = size / 2;
      const g = sc.createRadialGradient(r, r, 0, r, r, r);
      g.addColorStop(0, color);
      g.addColorStop(0.45, color);
      g.addColorStop(1, "rgba(0,0,0,0)");
      sc.fillStyle = g;
      sc.beginPath();
      sc.arc(r, r, r, 0, Math.PI * 2);
      sc.fill();
      return c;
    };

    const colorFn = gsap.utils.interpolate(COLOR_STOPS) as (
      t: number,
    ) => string;
    const sprites = Array.from({ length: BUCKETS }, (_, i) =>
      makeSprite(colorFn(i / (BUCKETS - 1)), 48),
    );
    const spriteRed = makeSprite("#ff3b5c", 48);
    const spriteBlue = makeSprite("#3ba7ff", 48);

    // ---- particles sample real points off the same paths that will be vector-drawn ----
    const particles: Particle[] = [];
    pathEls.forEach((pathEl, i) => {
      const count = Math.max(
        6,
        Math.round((lengths[i] / totalLength) * PARTICLE_COUNT),
      );
      const step = lengths[i] / count;
      for (let k = 0; k < count; k++) {
        const pt = pathEl.getPointAtLength(k * step + step / 2);
        const tx = originX + pt.x * scale;
        const ty = originY + pt.y * scale;
        const angle = Math.atan2(ty - centerY, tx - centerX);
        const startRadius =
          Math.max(window.innerWidth, window.innerHeight) *
          gsap.utils.random(0.6, 1.3);
        const startAngle = gsap.utils.random(0, Math.PI * 2);
        const sx = centerX + Math.cos(startAngle) * startRadius;
        const sy = centerY + Math.sin(startAngle) * startRadius;

        const dx = tx - sx;
        const dy = ty - sy;
        const dist = Math.hypot(dx, dy) || 1;
        const perpX = -dy / dist;
        const perpY = dx / dist;
        const swirl =
          (Math.random() < 0.5 ? -1 : 1) * dist * gsap.utils.random(0.18, 0.4);
        const cx = (sx + tx) / 2 + perpX * swirl;
        const cy = (sy + ty) / 2 + perpY * swirl;

        const cvDur = gsap.utils.random(0.55, 0.9);
        const cvDelay = gsap.utils.random(0, 1 - cvDur);
        const baseSize = gsap.utils.random(1.1, 2.6);

        particles.push({
          x: sx,
          y: sy,
          sx,
          sy,
          cx,
          cy,
          tx,
          ty,
          cvDelay,
          cvDur,
          bsx: 0,
          bsy: 0,
          bcx: 0,
          bcy: 0,
          btx: 0,
          bty: 0,
          bDelay: 0,
          bDur: 0,
          angle,
          baseSize,
          size: baseSize,
          colorIdx: Math.round((pt.y / VIEWBOX_H) * (BUCKETS - 1)),
          alpha: 0,
        });
      }
    });

    // ---- pointer tracking, smoothed with quickTo ----
    const pointer = { x: centerX, y: centerY };
    const setPointerX = gsap.quickTo(pointer, "x", {
      duration: 0.5,
      ease: "power3",
    });
    const setPointerY = gsap.quickTo(pointer, "y", {
      duration: 0.5,
      ease: "power3",
    });
    const onPointerMove = (e: PointerEvent) => {
      setPointerX(e.clientX);
      setPointerY(e.clientY);
    };
    window.addEventListener("pointermove", onPointerMove);

    const camera = { zoom: 1.08 };
    const chroma = { v: 0 };
    const flare = { scale: 0, alpha: 0 };

    const updateConverge = (t: number) => {
      for (const p of particles) {
        const raw = Math.min(1, Math.max(0, (t - p.cvDelay) / p.cvDur));
        const u = EASE_IN(raw);
        const mu = 1 - u;
        p.x = mu * mu * p.sx + 2 * mu * u * p.cx + u * u * p.tx;
        p.y = mu * mu * p.sy + 2 * mu * u * p.cy + u * u * p.ty;
        p.alpha = raw <= 0 ? 0 : Math.min(1, raw * 3);
        const settle =
          raw > 0.85 ? Math.max(0, 1 - Math.abs(raw - 0.92) / 0.08) : 0;
        p.size = p.baseSize * (1 + settle * 0.6);
      }
    };

    const updateBurst = (t: number) => {
      for (const p of particles) {
        const raw = Math.min(1, Math.max(0, (t - p.bDelay) / p.bDur));
        const u = EASE_OUT(raw);
        const mu = 1 - u;
        p.x = mu * mu * p.bsx + 2 * mu * u * p.bcx + u * u * p.btx;
        p.y = mu * mu * p.bsy + 2 * mu * u * p.bcy + u * u * p.bty;
        p.alpha = 1 - raw;
        p.size = p.baseSize * (1 - raw * 0.7);
      }
    };

    // ---- render loop, fully decoupled from the gsap timeline ----
    const render = () => {
      ctx.fillStyle = "rgba(7,9,17,0.24)";
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.scale(camera.zoom, camera.zoom);
      ctx.translate(-centerX, -centerY);

      for (const p of particles) {
        const alpha = p.alpha * particleDim;
        if (alpha <= 0.01) continue;

        let dx = p.x;
        let dy = p.y;
        if (holdActive) {
          const rx = p.x - pointer.x;
          const ry = p.y - pointer.y;
          const d = Math.hypot(rx, ry);
          if (d < 90 && d > 0.01) {
            const force = 1 - d / 90;
            dx = p.x + (rx / d) * force * 22;
            dy = p.y + (ry / d) * force * 22;
          }
        }

        const d2 = p.size * 7;
        const half = d2 / 2;

        if (chroma.v > 0.01) {
          const off = chroma.v * 5;
          ctx.globalCompositeOperation = "lighter";
          ctx.globalAlpha = alpha * 0.5 * chroma.v;
          ctx.drawImage(spriteRed, dx - off - half, dy - half, d2, d2);
          ctx.drawImage(spriteBlue, dx + off - half, dy - half, d2, d2);
          ctx.globalCompositeOperation = "source-over";
        }

        ctx.globalAlpha = alpha;
        ctx.drawImage(sprites[p.colorIdx], dx - half, dy - half, d2, d2);
      }

      if (flare.alpha > 0.01) {
        const fx = centerX;
        const fy = originY + (VIEWBOX_H * scale) / 2;
        const r = 90 * flare.scale;
        const g = ctx.createRadialGradient(fx, fy, 0, fx, fy, r);
        g.addColorStop(0, `rgba(180,200,255,${flare.alpha})`);
        g.addColorStop(0.4, `rgba(91,134,255,${flare.alpha * 0.35})`);
        g.addColorStop(1, "rgba(91,134,255,0)");
        ctx.globalCompositeOperation = "lighter";
        ctx.globalAlpha = 1;
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(fx, fy, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalCompositeOperation = "source-over";
      }

      ctx.restore();
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    // ---- decode / scramble text reveal ----
    const scramble = (el: HTMLElement, finalText: string, duration: number) => {
      const state = { p: 0 };
      return gsap.to(state, {
        p: 1,
        duration,
        ease: (t: number) => EASE_IN(t),
        onUpdate: () => {
          const revealCount = Math.floor(state.p * finalText.length);
          let out = "";
          for (let i = 0; i < finalText.length; i++) {
            if (finalText[i] === " ") out += " ";
            else if (i < revealCount) out += finalText[i];
            else
              out +=
                SCRAMBLE_CHARS[
                  Math.floor(Math.random() * SCRAMBLE_CHARS.length)
                ];
          }
          el.textContent = out;
        },
        onComplete: () => {
          el.textContent = finalText;
        },
      });
    };

    // ---- gsap setup ----
    gsap.set(canvas, { opacity: 0 });
    gsap.set(textEl, { opacity: 0, y: 8 });
    gsap.set(subRef.current, { opacity: 0, y: 6 });
    gsap.set(ruleRef.current, { scaleX: 0 });
    gsap.set([barTopRef.current, barBottomRef.current], { scaleY: 0 });
    if (displaceRef.current)
      gsap.set(displaceRef.current, { attr: { scale: 46 } });

    const CONVERGE_DURATION = 2.2;
    const cineEase = (t: number) => EASE_IN(t);
    const cineEaseOut = (t: number) => EASE_OUT(t);

    const tl = gsap.timeline({ defaults: { ease: cineEase }, onComplete });

    tl.to(canvas, { opacity: 1, duration: 0.3 })

      // dust begins gathering
      .call(() => {
        gsap.to(camera, {
          zoom: 1,
          duration: CONVERGE_DURATION,
          ease: cineEase,
        });
        gsap.to(
          { t: 0 },
          {
            t: 1,
            duration: CONVERGE_DURATION,
            ease: "none",
            onUpdate: function () {
              updateConverge(this.targets()[0].t);
            },
          },
        );
      })
      .to(
        [barTopRef.current, barBottomRef.current],
        { scaleY: 1, duration: 0.7, ease: cineEase },
        "+=0.6",
      )

      // the real vector mark draws itself while the dust is still arriving —
      // both climax at the same instant
      .to(
        pathEls,
        { strokeDashoffset: 0, duration: 0.9, stagger: 0.1, ease: cineEase },
        "-=0.1",
      )
      .call(
        () => {
          if (!isLowPower && displaceRef.current) {
            gsap.to(displaceRef.current, {
              attr: { scale: 0 },
              duration: 1.0,
              ease: cineEaseOut,
            });
          }
        },
        [],
        "<",
      )
      .to(
        pathEls,
        { fillOpacity: 1, strokeWidth: 0, duration: 0.35, ease: cineEase },
        "-=0.15",
      )

      // the mark has landed — flare, glow pulse, particles recede to an ambient halo
      .call(() => {
        holdActive = true;
        gsap
          .timeline()
          .set(flare, { scale: 0, alpha: 0.95 })
          .to(flare, { scale: 2.6, alpha: 0, duration: 0.7, ease: cineEase });
        gsap.to(logoSvg, {
          filter:
            "drop-shadow(0 0 20px rgba(91,134,255,0.35)) drop-shadow(0 0 40px rgba(49,87,255,0.18))",
          duration: 0.3,
        });
        gsap.to(logoSvg, { filter: "none", duration: 0.4, delay: 0.35 });
        gsap.to(
          { v: particleDim },
          {
            v: 0.22,
            duration: 0.6,
            onUpdate: function () {
              particleDim = this.targets()[0].v;
            },
          },
        );
      })
      .to(textEl, { opacity: 1, y: 0, duration: 0.4 }, "holdStart")
      .call(() => scramble(textEl, BRAND_TEXT, 0.85), [], "holdStart")
      .to({}, { duration: 0.85 })
      .to(ruleRef.current, { scaleX: 1, duration: 0.5, ease: cineEase })
      .to(subRef.current, { opacity: 1, y: 0, duration: 0.5 }, "-=0.3")

      .to({}, { duration: 0.5 })

      // ---- burst ----
      .call(
        () => {
          holdActive = false;
          gsap.to(
            { v: particleDim },
            {
              v: 1,
              duration: 0.3,
              onUpdate: function () {
                particleDim = this.targets()[0].v;
              },
            },
          );
        },
        [],
        "burst",
      )
      .to(
        [textEl, subRef.current, ruleRef.current],
        { opacity: 0, y: -8, duration: 0.4 },
        "burst",
      )
      .to(
        [barTopRef.current, barBottomRef.current],
        { scaleY: 0, duration: 0.5, ease: cineEaseOut },
        "burst",
      )
      .to(
        logoSvg,
        {
          opacity: 0,
          scale: 1.15,
          filter: "blur(6px)",
          duration: 0.55,
          ease: cineEaseOut,
        },
        "burst",
      )
      .call(
        () => {
          for (const p of particles) {
            p.bsx = p.x;
            p.bsy = p.y;
            const distOut = gsap.utils.random(260, 620);
            p.btx = p.x + Math.cos(p.angle) * distOut;
            p.bty = p.y + Math.sin(p.angle) * distOut;

            const dx = p.btx - p.bsx;
            const dy = p.bty - p.bsy;
            const dist = Math.hypot(dx, dy) || 1;
            const perpX = -dy / dist;
            const perpY = dx / dist;
            const swirl =
              (Math.random() < 0.5 ? -1 : 1) *
              dist *
              gsap.utils.random(0.15, 0.35);
            p.bcx = (p.bsx + p.btx) / 2 + perpX * swirl;
            p.bcy = (p.bsy + p.bty) / 2 + perpY * swirl;

            p.bDur = gsap.utils.random(0.55, 0.8);
            p.bDelay = gsap.utils.random(0, 1 - p.bDur);
          }

          gsap.to(camera, { zoom: 1.06, duration: 1, ease: cineEaseOut });
          gsap
            .timeline()
            .to(chroma, { v: 1, duration: 0.3, ease: cineEase })
            .to(chroma, { v: 0, duration: 0.6, ease: cineEase });
          gsap.to(
            { t: 0 },
            {
              t: 1,
              duration: 1,
              ease: "none",
              onUpdate: function () {
                updateBurst(this.targets()[0].t);
              },
            },
          );
        },
        [],
        "burst",
      )
      .to(
        canvas,
        { opacity: 0, duration: 0.9, ease: cineEaseOut },
        "burst+=0.5",
      )
      .to(
        loader,
        { opacity: 0, duration: 0.4, ease: cineEaseOut },
        "burst+=1.1",
      );

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      tl.kill();
      gsap.killTweensOf(particles);
      gsap.killTweensOf(camera);
      gsap.killTweensOf(chroma);
      gsap.killTweensOf(flare);
    };
  }, [onComplete]);

  // eslint-disable-next-line react-hooks/refs
  const id = idRef.current;

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[9999] overflow-hidden bg-[#0A0D18]"
    >
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* the real, crisp vector logo — drawn and filled, not just approximated by dust */}
      <svg
        ref={logoSvgRef}
        viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
        className="pointer-events-none absolute z-10 opacity-0"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <defs>
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

          {/* materialize filter: heavy noise-driven displacement that eases to zero,
              so the vector mark looks like it's condensing out of energy rather than just fading in */}
          <filter
            id={`${id}-materialize`}
            x="-30%"
            y="-30%"
            width="160%"
            height="160%"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.012 0.09"
              numOctaves="2"
              seed="7"
              result="noise"
            />
            <feDisplacementMap
              ref={displaceRef}
              in="SourceGraphic"
              in2="noise"
              scale={46}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>

        <g ref={materializeGroupRef}>
          <path
            className="logo-path"
            stroke={`url(#${id}-paint0)`}
            fill={`url(#${id}-paint0)`}
            d={PATH_D[0]}
          />
          <path
            className="logo-path"
            stroke={`url(#${id}-paint1)`}
            fill={`url(#${id}-paint1)`}
            d={PATH_D[1]}
          />
          <path
            className="logo-path"
            stroke={`url(#${id}-paint2)`}
            fill={`url(#${id}-paint2)`}
            d={PATH_D[2]}
          />
        </g>
      </svg>

      {/* cinematic letterbox framing */}
      <div
        ref={barTopRef}
        className="pointer-events-none absolute inset-x-0 top-0 z-20 h-[9vh] origin-top bg-black"
        style={{ boxShadow: "0 1px 0 rgba(91,134,255,0.25)" }}
      />
      <div
        ref={barBottomRef}
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[9vh] origin-bottom bg-black"
        style={{ boxShadow: "0 -1px 0 rgba(91,134,255,0.25)" }}
      />

      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center">
        <div
          style={{ height: LOGO_DISPLAY - LOGO_SHIFT_UP + 56 }}
          aria-hidden
        />
        <h2
          ref={textRef}
          className="text-[13px] font-medium tracking-[0.42em] text-[#EAEDF7]"
        >
          {BRAND_TEXT}
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
