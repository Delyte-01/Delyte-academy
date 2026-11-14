"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { MailCheck, ShieldCheck } from "lucide-react";

interface EmailVerificationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
}

export function EmailVerificationModal({
  open,
  onOpenChange,
  email,
}: EmailVerificationModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const iconWrapRef = useRef<HTMLDivElement>(null);
  const ringRefs = useRef<(HTMLDivElement | null)[]>([]);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  // Entrance choreography — runs fresh every time the modal opens.
  useEffect(() => {
    if (!open) return;
    // Reduced motion: leave everything visible, skip the entrance.
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;

    // Guard: bail if refs aren't attached yet
    if (!containerRef.current || !iconWrapRef.current) return;

    const rings = ringRefs.current.filter(Boolean); // never trust the array as-is

    const ctx = gsap.context(() => {
      gsap.set(
        [
          iconWrapRef.current,
          titleRef.current,
          descRef.current,
          infoRef.current,
        ].filter(Boolean),
        { opacity: 0 },
      );

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        barRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.6, ease: "power2.inOut" },
      )
        .fromTo(
          iconWrapRef.current,
          { opacity: 0, scale: 0.4, y: 10 },
          { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: "back.out(2.2)" },
          "-=0.35",
        )
        .fromTo(
          rings,
          { opacity: 0, scale: 0.6 },
          { opacity: 1, scale: 1, duration: 0.9, stagger: 0.12 },
          "<",
        )
        .fromTo(
          titleRef.current,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.5 },
          "-=0.5",
        )
        .fromTo(
          descRef.current,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.5 },
          "-=0.35",
        )
        .fromTo(
          infoRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.5 },
          "-=0.3",
        );
    }, containerRef);

    return () => {
      ringRefs.current = []; // clear stale nodes so next open starts fresh
      ctx.revert();
    };
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        ref={containerRef}
        className="overflow-hidden border-border/60 bg-background sm:max-w-md"
      >
        <div
          ref={barRef}
          className="absolute inset-x-0 top-0 h-1 origin-left bg-gradient-to-r from-primary/70 to-primary"
        />

        <DialogHeader className="items-center pt-2 text-center">
          <div className="relative flex h-16 w-16 items-center justify-center">
            {[0, 1].map((i) => (
              <div
                key={i}
                ref={(el) => {
                  ringRefs.current[i] = el; // remove the `if (el)` guard, allow null to clear it
                }}
                className="absolute inset-0 rounded-xl border-2 border-primary/30"
              />
            ))}
            <div
              ref={iconWrapRef}
              className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 text-primary"
            >
              <MailCheck className="h-8 w-8" />
            </div>
          </div>

          <DialogTitle ref={titleRef} className="text-xl font-bold">
            Verify your email
          </DialogTitle>

          <DialogDescription ref={descRef} className="text-center">
            We&apos;ve sent a verification email to
            <span className="mt-1 block font-semibold text-foreground">
              {email}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div
          ref={infoRef}
          className="rounded-xl border border-border/60 bg-muted/20 p-4 text-sm text-muted-foreground"
        >
          <div className="mb-2 flex items-center gap-2 font-medium text-foreground">
            <ShieldCheck className="h-4 w-4 text-primary" />
            One quick step remaining
          </div>
          Click the verification link in your email before logging in. If you
          don&apos;t see it within a minute, check your{" "}
          <span className="font-medium text-foreground">Spam</span>,{" "}
          <span className="font-medium text-foreground">Junk</span>, or{" "}
          <span className="font-medium text-foreground">Promotions</span>{" "}
          folder.
        </div>
      </DialogContent>
    </Dialog>
  );
}
