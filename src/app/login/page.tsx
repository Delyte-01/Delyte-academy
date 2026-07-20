"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useState } from "react";
import {
  BookOpen,
  Eye,
  EyeOff,
  ArrowRight,
  Lock,
  Mail,
  Check,
} from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { profileService } from "@/services/profile";
import Image from "next/image";

gsap.registerPlugin(useGSAP);

const INK = "#0B1220";
const BLUE = "#2454FF";
const BLUE_DEEP = "#0F2E99";
const SKY = "#F8F8F8";
const SLATE = "#64748B";
const GOLD = "#F5A623";

const BLOB_A =
  "M421,314Q409,428,300,455Q191,482,120,393Q49,304,79,197Q109,90,222,73Q335,56,398,150Q461,244,421,314Z";
const BLOB_B =
  "M438,290Q432,380,330,440Q228,500,140,430Q52,360,66,240Q80,120,200,85Q320,50,400,140Q480,230,438,290Z";
const BLOB_C =
  "M410,300Q420,410,310,470Q200,530,110,440Q20,350,60,230Q100,110,220,80Q340,50,410,160Q480,270,410,300Z";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
      />
      <path
        fill="#FF3D00"
        d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
      />
    </svg>
  );
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.warning("Email is required");
      return;
    }

    if (!password.trim()) {
      toast.warning("Password is required");
      return;
    }
    setLoading(true);

    try {
      const { data, error } = await authService.login(email, password);

      if (error) {
        throw error;
      }

      console.log(data);

      toast.success("Logged in successfully!");

      const profile = await profileService.getCurrentProfile();

      if (!profile) {
        throw new Error("Profile not found.");
      }

      if (profile.role === "admin" || profile.role === "super_admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.warning("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await authService.signInWithGoogle();

    if (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        router.replace("/dashboard");
      }
    };

    checkUser();
  }, [router]);

  // ------  Animation states ,refs and logic -------------------

  const leftPerspectiveRef = useRef<HTMLDivElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const hasFlippedRef = useRef(false);

  const rightPanelRef = useRef<HTMLDivElement>(null);
  const blobPathRef = useRef<SVGPathElement>(null);
  const blobWrapRef = useRef<HTMLDivElement>(null);
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const orb3Ref = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const shimmerRef = useRef<HTMLSpanElement>(null);
  const mockupRef = useRef<HTMLDivElement>(null);
  const ringCircleRef = useRef<SVGCircleElement>(null);
  const ringGlowRef = useRef<HTMLDivElement>(null);
  const levelBadgeRef = useRef<HTMLDivElement>(null);
  const courseRowsRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  const RING_RADIUS = 18;
  const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;
  const RING_PERCENT = 0.78;

  // ── LEFT: page-flip open. Own scope, own effect, guarded against
  // Strict Mode's mount→unmount→remount so it can't get silently
  // reverted before it's ever seen. ──
  useGSAP(
    () => {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (reduceMotion || !leftPanelRef.current || hasFlippedRef.current)
        return;

      gsap.set(leftPerspectiveRef.current, { perspective: 1200 });
      gsap.set(leftPanelRef.current, {
        transformOrigin: "left center",
        transformStyle: "preserve-3d",
        backfaceVisibility: "hidden",
        rotateY: -85,
        opacity: 0,
      });

      // Wait for a clean animation frame before starting the tween. Client-side
      // route transitions do a burst of synchronous work (unmount/mount/hydrate)
      // right before this runs; starting immediately means GSAP's ticker measures
      // across that burst and — with lagSmoothing(0) set for Lenis sync — jumps
      // the tween forward to match, making it look like it fires almost instantly.
      // Two rAFs guarantee we're past that burst and on a settled frame.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (!leftPanelRef.current || hasFlippedRef.current) return;
          gsap.to(leftPanelRef.current, {
            rotateY: 0,
            opacity: 1,
            duration: 1.1,
            ease: "power4.out",
            force3D: true,
            onStart: () => {
              hasFlippedRef.current = true;
            },
          });
        });
      });
    },
    { scope: leftPerspectiveRef }
  );

  // ── RIGHT: ambient / infinite system, desktop only. ──
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: "(min-width: 1024px)",
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { isDesktop, reduceMotion } = context.conditions as {
            isDesktop: boolean;
            reduceMotion: boolean;
          };
          if (!isDesktop || reduceMotion) return;

          const rows = courseRowsRef.current
            ? Array.from(courseRowsRef.current.children)
            : [];
          const particles = particlesRef.current
            ? Array.from(particlesRef.current.children)
            : [];

          const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

          tl.from(headingRef.current, { y: 26, opacity: 0, duration: 0.8 })
            .from(
              mockupRef.current,
              {
                y: 40,
                opacity: 0,
                rotate: 6,
                duration: 0.9,
                ease: "back.out(1.4)",
              },
              "-=0.5"
            )
            .from(
              levelBadgeRef.current,
              { scale: 0, opacity: 0, duration: 0.5 },
              "-=0.4"
            )
            .fromTo(
              ringCircleRef.current,
              { strokeDashoffset: RING_CIRCUMFERENCE },
              {
                strokeDashoffset: RING_CIRCUMFERENCE * (1 - RING_PERCENT),
                duration: 1,
                ease: "power2.out",
              },
              "-=0.5"
            )
            .from(
              rows,
              { x: -16, opacity: 0, duration: 0.5, stagger: 0.1 },
              "-=0.5"
            );

          // Infinite: blob morphs through three shapes for a less
          // mechanical, more organic loop than a single back-and-forth.
          gsap
            .timeline({
              repeat: -1,
              yoyo: true,
              defaults: { ease: "sine.inOut" },
            })
            .to(blobPathRef.current, { attr: { d: BLOB_B }, duration: 5 })
            .to(blobPathRef.current, { attr: { d: BLOB_C }, duration: 5 });

          // Infinite: the blob's wrapper also slowly rotates and breathes
          // in scale, layered on top of the path morph itself.
          gsap.to(blobWrapRef.current, {
            rotate: 12,
            scale: 1.08,
            duration: 14,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });

          // Infinite: three ambient orbs drift on independent, gently
          // circular-feeling paths (different durations/delays so they
          // never sync up and repeat in an obviously mechanical way).
          gsap.to(orb1Ref.current, {
            x: 30,
            y: -20,
            duration: 8,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
          gsap.to(orb2Ref.current, {
            x: -24,
            y: 24,
            duration: 9,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: 0.5,
          });
          gsap.to(orb3Ref.current, {
            x: 18,
            y: 18,
            duration: 11,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: 1.2,
          });

          // Infinite: device mockup idle float.
          gsap.to(mockupRef.current, {
            y: "+=10",
            rotate: "-=1.5",
            duration: 3.2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });

          // Infinite: progress ring glow pulses gently.
          gsap.to(ringGlowRef.current, {
            scale: 1.15,
            opacity: 0.5,
            duration: 1.6,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });

          // Infinite: level badge breathes.
          gsap.to(levelBadgeRef.current, {
            scale: 1.06,
            duration: 1.4,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });

          // Infinite: headline gets a slow diagonal light sweep, like a
          // subtle shimmer passing across premium UI text.
          if (shimmerRef.current) {
            gsap.set(shimmerRef.current, { backgroundPosition: "-200% 0" });
            gsap.to(shimmerRef.current, {
              backgroundPosition: "200% 0",
              duration: 5,
              repeat: -1,
              ease: "sine.inOut",
              repeatDelay: 1.5,
            });
          }

          // Infinite: tiny particles twinkle at staggered offsets.
          particles.forEach((p, i) => {
            gsap.to(p, {
              opacity: 0.9,
              y: "-=14",
              duration: 2 + (i % 3) * 0.6,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
              delay: i * 0.3,
            });
          });

          // Micro-interaction: course rows nudge on hover.
          rows.forEach((row) => {
            const el = row as HTMLElement;
            const onEnter = () =>
              gsap.to(el, { x: 4, duration: 0.25, ease: "power2.out" });
            const onLeave = () =>
              gsap.to(el, { x: 0, duration: 0.25, ease: "power2.out" });
            el.addEventListener("mouseenter", onEnter);
            el.addEventListener("mouseleave", onLeave);
          });
        }
      );

      return () => mm.revert();
    },
    { scope: rightPanelRef }
  );

  return (
    <div className="flex min-h-screen bg-white overflow-hidden">
      {/* ── LEFT: form ── */}
      <div
        ref={leftPerspectiveRef}
        className="w-full lg:w-[46%]"
        style={{ perspective: 1200 }}
      >
        <div
          ref={leftPanelRef}
          className="flex min-h-screen w-full flex-col justify-center px-6 py-12 sm:px-10 lg:px-16 xl:px-20"
        >
          <div className="mx-auto w-full max-w-sm">
            <Link href="/" className=" flex items-center gap-2 ">
              <div>
                <Image
                  src={
                    "https://res.cloudinary.com/dk5mfu099/image/upload/v1784143281/light_mode_yra76b.svg"
                  }
                  alt="delyte academy logo"
                  width={200}
                  height={120}
                  className="object-cover w-[220px] height-[100px] "
                />
              </div>
            </Link>

            <h1
              className="font-heading text-[2rem] font-extrabold leading-tight tracking-tight sm:text-[2.25rem]"
              style={{ color: INK }}
            >
              Welcome back
            </h1>
            <p className="mt-2.5 text-[15px]" style={{ color: SLATE }}>
              New to Delyte Academy?{" "}
              <Link
                href="/sign-up"
                className="font-semibold hover:opacity-80"
                style={{ color: BLUE }}
              >
                Create a free account
              </Link>
            </p>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 py-3.5 text-sm font-semibold transition-all hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98] cursor-pointer"
              style={{ color: INK }}
            >
              <GoogleIcon />
              Continue with Google
            </button>

            <div className="mt-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-xs font-medium" style={{ color: SLATE }}>
                or sign in with email
              </span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <form onSubmit={handleLogin} className="mt-6 space-y-5">
              <div>
                <label
                  className="mb-1.5 block text-sm font-medium text-foreground"
                  style={{ color: INK }}
                >
                  Email address
                </label>
                <div className="relative">
                  <Mail
                    className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2"
                    style={{ color: SLATE }}
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none transition-shadow focus:border-transparent"
                    onFocus={(e) =>
                      (e.target.style.boxShadow = `0 0 0 2px ${BLUE}`)
                    }
                    onBlur={(e) => (e.target.style.boxShadow = "")}
                  />
                </div>
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label
                    className="block text-sm font-medium"
                    style={{ color: INK }}
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-xs font-semibold hover:opacity-80"
                    style={{ color: BLUE }}
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock
                    className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2"
                    style={{ color: SLATE }}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-12 text-sm outline-none transition-shadow focus:border-transparent"
                    onFocus={(e) =>
                      (e.target.style.boxShadow = `0 0 0 2px ${BLUE}`)
                    }
                    onBlur={(e) => (e.target.style.boxShadow = "")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: SLATE }}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300"
                  style={{ accentColor: BLUE }}
                />
                <label
                  htmlFor="remember"
                  className="text-sm"
                  style={{ color: SLATE }}
                >
                  Remember me for 30 days
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white shadow-md transition-all hover:opacity-90 disabled:opacity-50"
                style={{ background: INK }}
              >
                {loading ? "signing in..." : "Sign in"}
                {!loading && <ArrowRight className="h-4 w-4" />}
              </button>
            </form>

            <p className="mt-9 text-center text-xs" style={{ color: SLATE }}>
              By signing in, you agree to our{" "}
              <span className="cursor-pointer underline">Terms of Service</span>{" "}
              and{" "}
              <span className="cursor-pointer underline">Privacy Policy</span>
            </p>
          </div>
        </div>
      </div>

      {/* ── RIGHT: brand panel, ambient animation system ── */}
      <div
        ref={rightPanelRef}
        className="relative hidden overflow-hidden lg:flex lg:w-[54%] lg:flex-col lg:justify-center lg:px-16 xl:px-20"
        style={{
          background: `linear-gradient(160deg, ${BLUE} 0%, ${BLUE_DEEP} 100%)`,
        }}
      >
        <div
          ref={blobWrapRef}
          className="pointer-events-none absolute -right-24 -top-16 h-[520px] w-[520px] opacity-[0.14]"
          aria-hidden
        >
          <svg viewBox="0 0 500 500" className="h-full w-full">
            <path ref={blobPathRef} d={BLOB_A} fill="#ffffff" />
          </svg>
        </div>

        <div
          ref={orb1Ref}
          className="pointer-events-none absolute -top-24 -left-16 h-72 w-72 rounded-full opacity-30 blur-3xl"
          style={{ background: "#ffffff" }}
          aria-hidden
        />
        <div
          ref={orb2Ref}
          className="pointer-events-none absolute -bottom-32 -right-10 h-96 w-96 rounded-full opacity-20 blur-3xl"
          style={{ background: "#ffffff" }}
          aria-hidden
        />
        <div
          ref={orb3Ref}
          className="pointer-events-none absolute bottom-1/3 left-1/4 h-40 w-40 rounded-full opacity-15 blur-2xl"
          style={{ background: "#ffffff" }}
          aria-hidden
        />

        <div
          ref={particlesRef}
          className="pointer-events-none absolute inset-0"
          aria-hidden
        >
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="absolute h-1.5 w-1.5 rounded-full bg-white opacity-40"
              style={{
                top: `${10 + ((i * 37) % 80)}%`,
                left: `${5 + ((i * 53) % 90)}%`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-md">
          <h2
            ref={headingRef}
            className="font-heading text-4xl font-extrabold leading-[1.15] text-white xl:text-[2.75rem]"
          >
            <span
              ref={shimmerRef}
              style={{
                backgroundImage:
                  "linear-gradient(110deg, #ffffff 40%, #d6e4ff 50%, #ffffff 60%)",
                backgroundSize: "300% 100%",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              Every practice test
            </span>
            <br />
            brings you closer.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-blue-100">
            Track your scores, revisit past questions, and study with a plan
            built around how you&apos;re actually performing.
          </p>
        </div>

        <div className="relative z-10 mt-14 flex justify-center">
          <div
            ref={mockupRef}
            className="w-[320px] rounded-2xl bg-white p-5 shadow-2xl"
            style={{ transform: "rotate(-4deg)" }}
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs" style={{ color: SLATE }}>
                  Welcome back
                </p>
                <p className="text-sm font-bold" style={{ color: INK }}>
                  Blessing A.
                </p>
              </div>
              <div
                ref={levelBadgeRef}
                className="flex items-center gap-1 rounded-full px-2.5 py-1"
                style={{ background: SKY }}
              >
                <span className="text-[11px] font-bold" style={{ color: BLUE }}>
                  Level 4
                </span>
              </div>
            </div>

            <div
              className="relative mb-4 flex items-center gap-3 rounded-xl p-3"
              style={{ background: SKY }}
            >
              <div
                ref={ringGlowRef}
                className="pointer-events-none absolute left-3 h-11 w-11 rounded-full"
                style={{ background: BLUE, opacity: 0.25, filter: "blur(8px)" }}
                aria-hidden
              />
              <svg
                width="44"
                height="44"
                viewBox="0 0 44 44"
                className="-rotate-90 shrink-0"
              >
                <circle
                  cx="22"
                  cy="22"
                  r={RING_RADIUS}
                  fill="none"
                  stroke="#D9E6FF"
                  strokeWidth="5"
                />
                <circle
                  ref={ringCircleRef}
                  cx="22"
                  cy="22"
                  r={RING_RADIUS}
                  fill="none"
                  stroke={BLUE}
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray={RING_CIRCUMFERENCE}
                  strokeDashoffset={RING_CIRCUMFERENCE * (1 - RING_PERCENT)}
                />
              </svg>
              <div>
                <p className="text-[11px]" style={{ color: SLATE }}>
                  Overall progress
                </p>
                <p className="text-base font-extrabold" style={{ color: INK }}>
                  78%
                </p>
              </div>
            </div>

            <p
              className="mb-2 text-[11px] font-semibold uppercase tracking-wide"
              style={{ color: SLATE }}
            >
              Recent courses
            </p>
            <div ref={courseRowsRef} className="space-y-2">
              {[
                { name: "Biology — Genetics", score: "92%", done: true },
                { name: "Physics — Waves", score: "76%", done: true },
                {
                  name: "Chemistry — Bonding",
                  score: "In progress",
                  done: false,
                },
              ].map((c) => (
                <div
                  key={c.name}
                  className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="flex h-5 w-5 items-center justify-center rounded-full"
                      style={{ background: c.done ? SKY : "#F1F5F9" }}
                    >
                      {c.done && (
                        <Check className="h-3 w-3" style={{ color: BLUE }} />
                      )}
                    </div>
                    <span
                      className="text-xs font-medium"
                      style={{ color: INK }}
                    >
                      {c.name}
                    </span>
                  </div>
                  <span
                    className="text-xs font-bold"
                    style={{ color: c.done ? GOLD : SLATE }}
                  >
                    {c.score}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="relative z-10 mt-14 text-xs text-blue-200">
          © 2026 StudyHub. All rights reserved.
        </p>
      </div>
    </div>
  );
}
