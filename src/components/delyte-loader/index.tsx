"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface DelyteLoaderProps {
  onComplete: () => void;
}

const VIEWBOX_W = 338;
const VIEWBOX_H = 333;
const LOGO_DISPLAY = 176; // rendered size of the assembled mark, in px
const LOGO_SHIFT_UP = 34; // lifts the mark to leave room for the wordmark below
const PARTICLE_COUNT = 260;
const COLOR_STOPS = ["#5B86FF", "#4873FF", "#3157FF", "#1E28F0"];

const PATH_D = [
  "M0 2.1827C0.201193 13.5956 16.9002 33.2177 34.6052 42.8285L45.2684 48.8353L116.692 49.8364C194.956 51.0378 194.352 51.0378 220.306 64.4529C235.597 72.4619 258.131 94.8872 268.19 111.906C281.268 134.332 284.688 148.748 284.688 180.984C284.487 206.213 284.085 210.618 279.055 224.834L273.421 240.451L287.907 263.277C295.754 275.891 302.997 286.103 303.801 286.103C306.618 286.103 325.329 247.86 329.755 233.243C351.484 162.564 324.927 80.0705 265.977 35.6204C258.533 30.0141 244.45 21.6046 234.39 16.599C202.4 1.18158 202.199 1.18158 95.1643 0.380673C17.3026 -0.42023 0 -0.0197789 0 2.1827Z",
  "M13.0776 93.6859C10.8644 94.6871 7.24296 97.4902 5.02983 99.8929C1.20717 104.098 1.00597 107.502 0.402393 209.617C6.98152e-06 286.503 0.603586 316.537 2.21313 320.742C6.23699 330.353 12.8764 332.155 43.0553 332.155H70.0152L97.981 299.518C113.272 281.698 132.989 258.872 141.439 248.661C150.09 238.449 157.937 229.639 158.943 229.039C159.948 228.438 168.197 237.648 177.251 249.462C208.034 289.306 231.976 319.14 238.213 325.547L244.248 332.155H273.019C288.913 332.155 301.79 331.554 301.79 330.953C301.79 328.35 177.05 167.369 170.612 161.362C163.972 155.556 155.723 156.957 147.072 165.367C142.646 169.571 119.911 196.001 96.5727 224.033C73.0331 252.064 53.115 275.291 52.5114 275.491C51.9078 275.891 51.3042 246.058 51.3042 209.416V142.941L84.0987 142.341L116.692 141.94V135.333C116.692 119.315 102.206 100.894 85.1047 94.6871C76.6546 91.6837 19.9181 90.8828 13.0776 93.6859Z",
  "M138.823 309.529L119.911 331.154L139.628 331.754C150.291 331.955 167.191 331.955 177.05 331.754L195.157 331.154L178.056 309.529C168.6 297.716 160.15 288.105 159.345 288.105C158.54 288.105 149.285 297.716 138.823 309.529Z",
];

interface Particle {
  x: number;
  y: number;
  tx: number;
  ty: number;
  size: number;
  color: string;
  alpha: number;
  angle: number;
}

export default function DelyteLoaderParticles({
  onComplete,
}: DelyteLoaderProps) {
  const loaderRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hiddenSvgRef = useRef<SVGSVGElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ruleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const loader = loaderRef.current;
    const hiddenSvg = hiddenSvgRef.current;
    if (!canvas || !loader || !hiddenSvg) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // sample even arc-length points along the real logo geometry —
    // the particles' destinations are the actual mark, not an approximation
    const pathEls = Array.from(
      hiddenSvg.querySelectorAll<SVGPathElement>("path"),
    );
    const lengths = pathEls.map((p) => p.getTotalLength());
    const totalLength = lengths.reduce((a, b) => a + b, 0);

    const scale = LOGO_DISPLAY / VIEWBOX_W;
    const originX = window.innerWidth / 2 - (VIEWBOX_W * scale) / 2;
    const originY =
      window.innerHeight / 2 - (VIEWBOX_H * scale) / 2 - LOGO_SHIFT_UP;

    const colorFn = gsap.utils.interpolate(COLOR_STOPS) as (
      t: number,
    ) => string;

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
        const angle = Math.atan2(
          ty - window.innerHeight / 2,
          tx - window.innerWidth / 2,
        );
        const startRadius =
          Math.max(window.innerWidth, window.innerHeight) *
          (0.6 + Math.random() * 0.7);
        const startAngle = Math.random() * Math.PI * 2;
        particles.push({
          x: window.innerWidth / 2 + Math.cos(startAngle) * startRadius,
          y: window.innerHeight / 2 + Math.sin(startAngle) * startRadius,
          tx,
          ty,
          size: 1.1 + Math.random() * 1.6,
          color: colorFn(Math.min(1, Math.max(0, pt.y / VIEWBOX_H))),
          alpha: 0,
          angle,
        });
      }
    });

    // render loop: low-alpha overpaint each frame leaves soft light trails
    const render = () => {
      ctx.fillStyle = "rgba(8,10,18,0.22)";
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
      for (const p of particles) {
        if (p.alpha <= 0.01) continue;
        ctx.beginPath();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    gsap.set(canvas, { opacity: 0 });
    gsap.set(textRef.current, { opacity: 0, y: 8 });
    gsap.set(subRef.current, { opacity: 0, y: 6 });
    gsap.set(ruleRef.current, { scaleX: 0 });

    const tl = gsap.timeline({ defaults: { ease: "power2.out" }, onComplete });

    tl.to(canvas, { opacity: 1, duration: 0.3 })

      // the constellation converges into the mark
      .call(() => {
        particles.forEach((p) => {
          gsap.to(p, {
            x: p.tx,
            y: p.ty,
            alpha: 1,
            duration: 1.1 + Math.random() * 0.6,
            delay: Math.random() * 0.7,
            ease: "power3.out",
          });
        });
      })
      .to({}, { duration: 1.9 }) // hold for the convergence to land

      .to(textRef.current, { opacity: 1, y: 0, duration: 0.7 }, "-=0.2")
      .to(
        ruleRef.current,
        { scaleX: 1, duration: 0.5, ease: "power2.inOut" },
        "-=0.35",
      )
      .to(subRef.current, { opacity: 1, y: 0, duration: 0.6 }, "-=0.3")

      .to({}, { duration: 0.6 }) // a quiet moment before it lets go

      // ---- burst exit: the mark shatters outward and the page is revealed ----
      .to(
        [textRef.current, subRef.current, ruleRef.current],
        { opacity: 0, y: -8, duration: 0.4 },
        "burst",
      )
      .call(
        () => {
          particles.forEach((p) => {
            const dist = 260 + Math.random() * 340;
            gsap.to(p, {
              x: p.x + Math.cos(p.angle) * dist,
              y: p.y + Math.sin(p.angle) * dist,
              size: p.size * 0.4,
              alpha: 0,
              duration: 0.9 + Math.random() * 0.4,
              ease: "power2.in",
            });
          });
        },
        [],
        "burst",
      )
      .to(
        canvas,
        { opacity: 0, duration: 0.9, ease: "power2.in" },
        "burst+=0.5",
      )
      .to(
        loader,
        { opacity: 0, duration: 0.4, ease: "power1.in" },
        "burst+=1.1",
      );

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      tl.kill();
      gsap.killTweensOf(particles);
    };
  }, [onComplete]);

  return (
    <div
      ref={loaderRef}
      className="fixed inset-0 z-[9999] overflow-hidden bg-[#0A0D18]"
    >
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* hidden geometry source — never rendered, only measured for particle targets */}
      <svg
        ref={hiddenSvgRef}
        viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
        className="pointer-events-none absolute h-0 w-0 opacity-0"
        aria-hidden
      >
        {PATH_D.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </svg>

      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center">
        <div
          style={{ height: LOGO_DISPLAY - LOGO_SHIFT_UP + 56 }}
          aria-hidden
        />
        <h2
          ref={textRef}
          className="text-[13px] font-bold tracking-[0.42em] text-[#EAEDF7]"
        >
          DELYTE ACADEMY
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
