"use client";

import { Trophy, CheckCircle2, XCircle, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { QuizResultData } from "./types";

interface QuizResultsHeroProps {
  result: QuizResultData;
}

export function QuizResultsHero({ result }: QuizResultsHeroProps) {
  const circumference = 2 * Math.PI * 70;
  const offset = circumference - (result.score / 100) * circumference;

  const accent = result.passed
    ? {
        gradient: "from-slate-900 via-emerald-950 to-emerald-900",
        glow: "bg-emerald-500/20",
        ring: "ring-emerald-400/20",
        stopA: "#34d399",
        stopB: "#2dd4bf",
        badgeClass: "bg-emerald-500/20 text-emerald-300",
      }
    : {
        gradient: "from-slate-900 via-slate-900 to-rose-950/60",
        glow: "bg-rose-500/10",
        ring: "ring-rose-400/20",
        stopA: "#fb7185",
        stopB: "#f97316",
        badgeClass: "bg-rose-500/20 text-rose-300",
      };

  return (
    <Card
      className={`relative overflow-hidden border-0 bg-gradient-to-br text-white shadow-xl ${accent.gradient}`}
    >
      {/* Ambient background texture */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className={`absolute -right-24 -top-24 h-72 w-72 rounded-full ${accent.glow} blur-3xl`}
        />
        <div
          className={`absolute -bottom-24 -left-24 h-72 w-72 rounded-full ${accent.glow} blur-3xl`}
        />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <CardContent className="relative p-6 sm:p-8 lg:p-10">
        <div className="flex flex-col items-center gap-5 text-center sm:gap-6">
          {/* Trophy / result icon */}
          <div
            className={`flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10 shadow-lg ring-1 backdrop-blur-sm sm:h-20 sm:w-20 ${accent.ring}`}
          >
            {result.passed ? (
              <Trophy className="h-8 w-8 text-amber-300 sm:h-10 sm:w-10" />
            ) : (
              <Award className="h-8 w-8 text-rose-300 sm:h-10 sm:w-10" />
            )}
          </div>

          {/* Score circle */}
          <div className="relative h-32 w-32 sm:h-40 sm:w-40 lg:h-44 lg:w-44">
            <div
              className={`absolute inset-4 rounded-full ${accent.glow} blur-2xl`}
            />
            <svg
              className="relative h-full w-full -rotate-90"
              viewBox="0 0 160 160"
            >
              <circle
                cx="80"
                cy="80"
                r="70"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="10"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                fill="none"
                stroke="url(#scoreGradient)"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                className="transition-all duration-1000 ease-out motion-reduce:transition-none"
              />
              <defs>
                <linearGradient
                  id="scoreGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor={accent.stopA} />
                  <stop offset="100%" stopColor={accent.stopB} />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                {result.score}%
              </span>
              <span className="text-[11px] text-white/60 sm:text-xs">
                Your Score
              </span>
            </div>
          </div>

          {/* Pass / Fail badge */}
          <Badge
            variant="outline"
            className={`border-0 px-4 py-1.5 text-sm font-bold ${accent.badgeClass}`}
          >
            {result.passed ? (
              <CheckCircle2 className="mr-1.5 h-4 w-4" />
            ) : (
              <XCircle className="mr-1.5 h-4 w-4" />
            )}
            {result.passed ? "Passed!" : "Not Passed"}
          </Badge>

          {/* Stats row */}
          <div className="grid w-full max-w-md grid-cols-3 gap-3 sm:gap-4">
            <div className="rounded-2xl bg-white/10 p-3 text-center ring-1 ring-white/10 backdrop-blur-sm transition-colors hover:bg-white/[0.14] sm:p-4">
              <CheckCircle2 className="mx-auto mb-1 h-4 w-4 text-emerald-400 sm:h-5 sm:w-5" />
              <p className="text-lg font-extrabold sm:text-xl">
                {result.correctAnswers}
              </p>
              <p className="text-[10px] text-white/60 sm:text-[11px]">
                Correct
              </p>
            </div>
            <div className="rounded-2xl bg-white/10 p-3 text-center ring-1 ring-white/10 backdrop-blur-sm transition-colors hover:bg-white/[0.14] sm:p-4">
              <XCircle className="mx-auto mb-1 h-4 w-4 text-rose-400 sm:h-5 sm:w-5" />
              <p className="text-lg font-extrabold sm:text-xl">
                {result.incorrectAnswers}
              </p>
              <p className="text-[10px] text-white/60 sm:text-[11px]">
                Incorrect
              </p>
            </div>
            <div className="rounded-2xl bg-white/10 p-3 text-center ring-1 ring-white/10 backdrop-blur-sm transition-colors hover:bg-white/[0.14] sm:p-4">
              <Award className="mx-auto mb-1 h-4 w-4 text-amber-300 sm:h-5 sm:w-5" />
              <p className="text-lg font-extrabold sm:text-xl">
                {result.totalPoints}
              </p>
              <p className="text-[10px] text-white/60 sm:text-[11px]">Points</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
