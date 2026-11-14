import { cn } from "@/lib/utils";
import { RevealText } from "@/components/motion";

interface SectionIntroProps {
  title: string;
  description?: string;
  /** Optional. Only use when the label adds information the title does not. */
  eyebrow?: string;
  align?: "left" | "center";
  /** `ink` for permanently dark sections. */
  tone?: "default" | "ink";
  className?: string;
}

/** Heading + supporting line used by every landing section. */
export function SectionIntro({
  title,
  description,
  eyebrow,
  align = "left",
  tone = "default",
  className,
}: SectionIntroProps) {
  const ink = tone === "ink";
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <p
          className={cn(
            "mb-5 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[13px] font-bold",
            ink
              ? "border-ink-line text-ink-foreground"
              : "border-border bg-card text-foreground",
          )}
        >
          <span aria-hidden className="size-2 rounded-full bg-pop ring-1 ring-foreground/15" />
          {eyebrow}
        </p>
      )}
      <RevealText
        as="h2"
        text={title}
        on="scroll"
        stagger={0.05}
        className={cn(
          "font-headline text-[2.15rem] font-bold leading-[1.04] tracking-[-0.028em] sm:text-5xl lg:text-[3.35rem]",
          ink ? "text-ink-foreground" : "text-foreground",
        )}
      />
      {description && (
        <p
          className={cn(
            "mt-4 max-w-xl text-base leading-relaxed sm:mt-5 sm:text-lg",
            align === "center" && "mx-auto",
            ink ? "text-ink-muted" : "text-muted-foreground",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
