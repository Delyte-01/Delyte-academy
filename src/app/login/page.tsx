"use client";

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

const INK = "#0B1220";
const BLUE = "#2454FF";
const BLUE_DEEP = "#0F2E99";
const SKY = "#EEF4FF";
const SLATE = "#64748B";
const GOLD = "#F5A623";

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

  return (
    <div className="flex min-h-screen bg-white">
      {/* ── LEFT: form ── */}
      <div className="flex w-full flex-col justify-center px-6 py-12 sm:px-10 lg:w-[46%] lg:px-16 xl:px-20">
        <div className="mx-auto w-full max-w-sm">
          <Link href="/" className="mb-12 flex items-center gap-2">
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
            Welcome back
          </h1>
          <p className="mt-2.5 text-[15px]" style={{ color: SLATE }}>
            New to StudyHub?{" "}
            <Link
              href="/signup"
              className="font-semibold hover:opacity-80"
              style={{ color: BLUE }}
            >
              Create a free account
            </Link>
          </p>

          {/* Google — primary, sits above the form as the fastest path in */}
          <button
            type="button"
            className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 py-3.5 text-sm font-semibold transition-all hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98]"
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

          <form onSubmit={(e) => e.preventDefault()} className="mt-6 space-y-5">
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

            <Link
              href="/dashboard"
              className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold text-white shadow-md transition-all hover:opacity-90 active:scale-[0.98]"
              style={{ background: INK }}
            >
              Sign in
              <ArrowRight className="h-4 w-4" />
            </Link>
          </form>

          <p className="mt-9 text-center text-xs" style={{ color: SLATE }}>
            By signing in, you agree to our{" "}
            <span className="cursor-pointer underline">Terms of Service</span>{" "}
            and <span className="cursor-pointer underline">Privacy Policy</span>
          </p>
        </div>
      </div>

      {/* ── RIGHT: brand panel ── */}
      <div
        className="relative hidden overflow-hidden lg:flex lg:w-[54%] lg:flex-col lg:justify-center lg:px-16 xl:px-20"
        style={{
          background: `linear-gradient(160deg, ${BLUE} 0%, ${BLUE_DEEP} 100%)`,
        }}
      >
        <div
          className="pointer-events-none absolute -top-24 -left-16 h-72 w-72 rounded-full opacity-30 blur-3xl"
          style={{ background: "#ffffff" }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-32 -right-10 h-96 w-96 rounded-full opacity-20 blur-3xl"
          style={{ background: "#ffffff" }}
          aria-hidden
        />

        <div className="relative z-10 max-w-md">
          <h2 className="font-heading text-4xl font-extrabold leading-[1.15] text-white xl:text-[2.75rem]">
            Every practice test
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
                className="flex items-center gap-1 rounded-full px-2.5 py-1"
                style={{ background: SKY }}
              >
                <span className="text-[11px] font-bold" style={{ color: BLUE }}>
                  Level 4
                </span>
              </div>
            </div>

            <div
              className="mb-4 flex items-center gap-3 rounded-xl p-3"
              style={{ background: SKY }}
            >
              <svg
                width="44"
                height="44"
                viewBox="0 0 44 44"
                className="-rotate-90 shrink-0"
              >
                <circle
                  cx="22"
                  cy="22"
                  r="18"
                  fill="none"
                  stroke="#D9E6FF"
                  strokeWidth="5"
                />
                <circle
                  cx="22"
                  cy="22"
                  r="18"
                  fill="none"
                  stroke={BLUE}
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 18}
                  strokeDashoffset={2 * Math.PI * 18 * 0.22}
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
            <div className="space-y-2">
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
