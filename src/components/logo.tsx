import Image from "next/image";
import { cn } from "@/lib/utils";

const LOGO_LIGHT =
  "https://res.cloudinary.com/dk5mfu099/image/upload/v1784143281/light_mode_yra76b.svg";
const LOGO_DARK =
  "https://res.cloudinary.com/dk5mfu099/image/upload/v1784143355/dark_mode_yern29.svg";

interface LogoProps {
  className?: string;
  priority?: boolean;
  /** `onDark` always shows the light-coloured artwork, for permanently dark surfaces. */
  tone?: "auto" | "onDark";
}

/** Delyte wordmark. Swaps between the light and dark artwork with the theme (CSS only, no flicker). */
export function Logo({ className, priority = false, tone = "auto" }: LogoProps) {
  return (
    <>
      <Image
        src={LOGO_LIGHT}
        alt="Delyte Academy"
        width={180}
        height={48}
        priority={priority}
        className={cn("h-auto w-[150px]", tone === "onDark" ? "hidden" : "dark:hidden", className)}
      />
      <Image
        src={LOGO_DARK}
        alt=""
        aria-hidden
        width={180}
        height={48}
        priority={priority}
        className={cn("h-auto w-[150px]", tone === "onDark" ? "block" : "hidden dark:block", className)}
      />
    </>
  );
}
