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
  User,
  Check,
} from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { toast } from "sonner";
import { authService } from "@/services/auth";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

gsap.registerPlugin(useGSAP);

const INK = "#0B1220";
const BLUE = "#2454FF";
const BLUE_DEEP = "#0F2E99";
// const SKY = "#F8F8F8";
const SLATE = "#64748B";

const BENEFITS = [
  "Access 120+ comprehensive courses",
  "50,000+ past exam questions",
  "Unlimited CBT mock tests",
  "Real-time progress tracking",
  "Completely free to get started",
];

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

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
   const router = useRouter();

  // ------------ form states ---------------------

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);





  const handleGoogleLogin = async () => {
    const { error } = await authService.signInWithGoogle();

    if (error) {
      toast.error(error.message);
    }
  };

  // ----------Handle Sign up Functionality ---------------------------

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation will go here
    if (!firstName.trim()) {
      toast.warning("First name is required");
      return;
    }

    if (!lastName.trim()) {
      toast.warning("Last name is required");
      return;
    }

    if (!email.trim()) {
      toast.warning("Email is required");
      return;
    }

    if (password.length < 8) {
      toast.warning("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.warning("Passwords do not match");
      return;
    }

    if (!acceptTerms) {
      toast.warning("Please accept the Terms of Service");
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await authService.signup(
        email,
        password,
        firstName,
        lastName
      );

      if (error) {
        throw error;
      }
      toast.success(
        "Account created! Please check your email to verify your account."
      );
      console.log(data);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong.");
      }
    } finally {
      setLoading(false);
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setAcceptTerms(false);
    }
  };

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient();

      const {
        data: { user },
      } = await  supabase.auth.getUser();

      if (user) {
        router.replace("/dashboard");
      }
    };

    checkUser();
  }, [router]);

  // ------------// animations states and refs ---------------------------------------------

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
  const benefitsRef = useRef<HTMLDivElement>(null);
  const imageCardRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  // ── LEFT: page-flip open. Own scope, guarded against Strict Mode
  // double-invoke, and deferred two rAFs so route-transition work
  // (unmount Home / mount Signup / hydrate) doesn't get measured into
  // the tween's elapsed time by GSAP's ticker (lagSmoothing is off for
  // Lenis sync, so without this delay the tween appears to jump forward).
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

          const benefits = benefitsRef.current
            ? Array.from(benefitsRef.current.children)
            : [];
          const particles = particlesRef.current
            ? Array.from(particlesRef.current.children)
            : [];

          const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

          tl.from(headingRef.current, { y: 26, opacity: 0, duration: 0.8 })
            .from(
              benefits,
              { x: -16, opacity: 0, duration: 0.5, stagger: 0.08 },
              "-=0.5"
            )
            .from(
              imageCardRef.current,
              {
                y: 40,
                opacity: 0,
                scale: 0.96,
                duration: 0.9,
                ease: "back.out(1.3)",
              },
              "-=0.4"
            );

          // Infinite: blob morphs through three shapes.
          gsap
            .timeline({
              repeat: -1,
              yoyo: true,
              defaults: { ease: "sine.inOut" },
            })
            .to(blobPathRef.current, { attr: { d: BLOB_B }, duration: 5 })
            .to(blobPathRef.current, { attr: { d: BLOB_C }, duration: 5 });

          gsap.to(blobWrapRef.current, {
            rotate: 12,
            scale: 1.08,
            duration: 14,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });

          // Infinite: ambient orbs drift on independent timings.
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

          // Infinite: image card idle float.
          gsap.to(imageCardRef.current, {
            y: "+=8",
            duration: 3.4,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });

          // Infinite: headline shimmer sweep.
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

          // Infinite: particles twinkle at staggered offsets.
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

          // Micro-interaction: benefit rows nudge on hover.
          benefits.forEach((row) => {
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
    <div className="flex min-h-screen bg-white">
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
            <Link href="/" className="mb-10 flex items-center gap-2">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg"
                style={{ background: INK }}
              >
                <BookOpen className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold" style={{ color: INK }}>
                Study<span style={{ color: BLUE }}>Hub</span>
              </span>
            </Link>

            <h1
              className="font-heading text-[2rem] font-extrabold leading-tight tracking-tight sm:text-[2.25rem]"
              style={{ color: INK }}
            >
              Create your account
            </h1>
            <p className="mt-2.5 text-[15px]" style={{ color: SLATE }}>
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold hover:opacity-80"
                style={{ color: BLUE }}
              >
                Sign in here
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
                or sign up with email
              </span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <form onSubmit={handleSignUp} className="mt-6 space-y-5">
              <div className="flex flex-col gap-5 sm:grid sm:grid-cols-2 sm:gap-4">
                <div>
                  <label
                    className="mb-1.5 block text-sm font-medium"
                    style={{ color: INK }}
                  >
                    First name
                  </label>
                  <div className="relative">
                    <User
                      className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2"
                      style={{ color: SLATE }}
                    />
                    <input
                      type="text"
                      placeholder="John"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none transition-shadow focus:border-transparent"
                      onFocus={(e) =>
                        (e.target.style.boxShadow = `0 0 0 2px ${BLUE}`)
                      }
                      onBlur={(e) => (e.target.style.boxShadow = "")}
                    />
                  </div>
                </div>
                <div>
                  <label
                    className="mb-1.5 block text-sm font-medium"
                    style={{ color: INK }}
                  >
                    Last name
                  </label>
                  <div className="relative">
                    <User
                      className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2"
                      style={{ color: SLATE }}
                    />
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Doe"
                      className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none transition-shadow focus:border-transparent"
                      onFocus={(e) =>
                        (e.target.style.boxShadow = `0 0 0 2px ${BLUE}`)
                      }
                      onBlur={(e) => (e.target.style.boxShadow = "")}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label
                  className="mb-1.5 block text-sm font-medium"
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
                    required
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
                <label
                  className="mb-1.5 block text-sm font-medium"
                  style={{ color: INK }}
                >
                  Password
                </label>
                <div className="relative">
                  <Lock
                    className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2"
                    style={{ color: SLATE }}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
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
                    aria-label="Toggle password"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label
                  className="mb-1.5 block text-sm font-medium"
                  style={{ color: INK }}
                >
                  Confirm password
                </label>
                <div className="relative">
                  <Lock
                    className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2"
                    style={{ color: SLATE }}
                  />
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat your password"
                    className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-12 text-sm outline-none transition-shadow focus:border-transparent"
                    onFocus={(e) =>
                      (e.target.style.boxShadow = `0 0 0 2px ${BLUE}`)
                    }
                    onBlur={(e) => (e.target.style.boxShadow = "")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: SLATE }}
                    aria-label="Toggle confirm password"
                  >
                    {showConfirm ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-2 pt-1">
                <input
                  id="terms"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 rounded border-slate-300"
                  style={{ accentColor: BLUE }}
                />
                <label
                  htmlFor="terms"
                  className="text-sm leading-relaxed"
                  style={{ color: SLATE }}
                >
                  I agree to the{" "}
                  <span
                    className="cursor-pointer font-semibold underline"
                    style={{ color: INK }}
                  >
                    Terms of Service
                  </span>{" "}
                  and{" "}
                  <span
                    className="cursor-pointer font-semibold underline"
                    style={{ color: INK }}
                  >
                    Privacy Policy
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white shadow-md transition-all hover:opacity-90 disabled:opacity-50"
                style={{ background: INK }}
              >
                {loading ? "Creating Account..." : "Create Account"}
                {!loading && <ArrowRight className="h-4 w-4" />}
              </button>
            </form>
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
              Start your learning
            </span>
            <br />
            journey today.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-blue-100">
            Join thousands of students already turning practice into progress
            with StudyHub.
          </p>

          <div ref={benefitsRef} className="mt-8 space-y-3.5">
            {BENEFITS.map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                  style={{ background: "rgba(255,255,255,0.15)" }}
                >
                  <Check className="h-3 w-3 text-white" />
                </div>
                <span className="text-sm text-blue-50">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 mt-10 flex justify-center">
          <div
            ref={imageCardRef}
            className="w-full max-w-md overflow-hidden rounded-2xl shadow-2xl"
          >
            <img
              src="https://res.cloudinary.com/dk5mfu099/image/upload/v1783153700/smiling-student-holding-notebook-on-busy-school-escalator_hm9i3e.jpg"
              alt="Students learning together"
              className="h-56 w-full object-cover"
            />
          </div>
        </div>

        <p className="relative z-10 mt-10 text-xs text-blue-200">
          © {new Date().getFullYear()} StudyHub. All rights reserved.
        </p>
      </div>
    </div>
  );
}
