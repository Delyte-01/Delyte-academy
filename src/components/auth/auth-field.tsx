"use client";

import { useId, useState } from "react";
import { AlertCircle, Eye, EyeOff, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuthFieldProps
  extends Omit<React.ComponentProps<"input">, "id"> {
  label: string;
  icon: LucideIcon;
  /** Renders a show/hide toggle for password inputs. */
  revealable?: boolean;
  /** Inline validation message. Marks the field invalid for assistive tech. */
  error?: string;
  /** Neutral helper text shown under the field when there is no error. */
  hint?: React.ReactNode;
  /** Small control shown on the right of the label, e.g. a "Forgot password?" link. */
  labelAction?: React.ReactNode;
}

/** Labelled input with a leading icon, optional password reveal and inline validation. */
export function AuthField({
  label,
  icon: Icon,
  revealable = false,
  error,
  hint,
  labelAction,
  type = "text",
  className,
  ...props
}: AuthFieldProps) {
  const id = useId();
  const messageId = `${id}-message`;
  const [revealed, setRevealed] = useState(false);
  const inputType = revealable && revealed ? "text" : type;
  const hasMessage = Boolean(error || hint);

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <label htmlFor={id} className="block text-sm font-semibold text-foreground">
          {label}
        </label>
        {labelAction}
      </div>
      <div className="relative">
        <Icon
          className={cn(
            "pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2",
            error ? "text-destructive" : "text-muted-foreground",
          )}
          aria-hidden
        />
        <input
          id={id}
          type={inputType}
          aria-invalid={error ? true : undefined}
          aria-describedby={hasMessage ? messageId : undefined}
          className={cn(
            "h-12 w-full rounded-xl border bg-card pl-10 text-[15px] font-medium text-foreground shadow-soft outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-muted-foreground/70 focus-visible:ring-[3px] disabled:opacity-50",
            error
              ? "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/25"
              : "border-input focus-visible:border-ring focus-visible:ring-ring/30",
            revealable ? "pr-12" : "pr-4",
            className,
          )}
          {...props}
        />
        {revealable && (
          <button
            type="button"
            onClick={() => setRevealed((v) => !v)}
            className="absolute right-1.5 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/40"
            aria-label={revealed ? "Hide password" : "Show password"}
            aria-pressed={revealed}
          >
            {revealed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
      {hasMessage && (
        <div
          id={messageId}
          role={error ? "alert" : undefined}
          className={cn(
            "mt-1.5 flex items-center gap-1.5 text-[13px] font-medium",
            error ? "text-destructive" : "text-muted-foreground",
          )}
        >
          {error && <AlertCircle className="size-3.5 shrink-0" aria-hidden />}
          {error ?? hint}
        </div>
      )}
    </div>
  );
}

/** Google "G" mark and the "Continue with Google" button + divider. */
export function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
      <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
      <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
      <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
    </svg>
  );
}

export function GoogleButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-input bg-card text-[15px] font-semibold text-foreground shadow-soft outline-none transition-colors hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/40 active:translate-y-px"
    >
      <GoogleIcon />
      Continue with Google
    </button>
  );
}

export function AuthDivider({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6 flex items-center gap-3">
      <div className="h-px flex-1 bg-border" />
      <span className="text-xs font-medium text-muted-foreground">{children}</span>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

const STRENGTH = [
  { label: "", bar: "bg-muted" },
  { label: "Weak", bar: "bg-destructive" },
  { label: "Fair", bar: "bg-warning" },
  { label: "Good", bar: "bg-info" },
  { label: "Strong", bar: "bg-success" },
] as const;

/** 0 = empty, 1 = too short / weak, up to 4 = strong. Advisory only. */
export function passwordStrength(password: string): { level: number; tip: string } {
  if (!password) return { level: 0, tip: "" };
  if (password.length < 8) return { level: 1, tip: "Use at least 8 characters" };

  const checks = [
    { ok: password.length >= 12, tip: "Make it 12+ characters" },
    { ok: /[a-z]/.test(password) && /[A-Z]/.test(password), tip: "Mix upper and lower case" },
    { ok: /\d/.test(password), tip: "Add a number" },
    { ok: /[^A-Za-z0-9]/.test(password), tip: "Add a symbol" },
  ];
  const passed = checks.filter((c) => c.ok).length;
  const level = passed === 0 ? 1 : passed === 1 ? 2 : passed === 2 ? 3 : 4;
  const next = checks.find((c) => !c.ok);
  return { level, tip: next ? next.tip : "Great password" };
}

/** Four-segment meter + a short tip. Pass it as the `hint` of a password AuthField. */
export function PasswordStrength({ password }: { password: string }) {
  const { level, tip } = passwordStrength(password);
  if (level === 0) {
    return <span>At least 8 characters</span>;
  }
  return (
    <span className="block w-full" aria-live="polite">
      <span className="flex gap-1.5" aria-hidden>
        {[1, 2, 3, 4].map((n) => (
          <span
            key={n}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors duration-200",
              n <= level ? STRENGTH[level].bar : "bg-muted",
            )}
          />
        ))}
      </span>
      <span className="mt-1.5 flex justify-between gap-3">
        <span className="font-bold text-foreground">{STRENGTH[level].label}</span>
        <span>{tip}</span>
      </span>
    </span>
  );
}
