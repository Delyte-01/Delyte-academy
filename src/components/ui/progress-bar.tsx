import { cn } from "@/lib/utils";

interface ProgressBarProps {
  /** 0–100. Values outside the range are clamped. */
  value: number;
  /** Accessible name, e.g. "Course progress". */
  label?: string;
  size?: "sm" | "md";
  tone?: "brand" | "success" | "warning" | "danger";
  className?: string;
}

const TONES = {
  brand: "bg-brand-gradient",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-destructive",
} as const;

/** Thin, accessible progress indicator. Fill animates via CSS (reduced-motion safe). */
export function ProgressBar({
  value,
  label = "Progress",
  size = "md",
  tone = "brand",
  className,
}: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, Number.isFinite(value) ? value : 0));
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pct)}
      className={cn(
        "w-full overflow-hidden rounded-full bg-muted",
        size === "sm" ? "h-1.5" : "h-2",
        className,
      )}
    >
      <div
        className={cn(
          "h-full rounded-full transition-[width] duration-500 ease-out motion-reduce:transition-none",
          TONES[tone],
        )}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
