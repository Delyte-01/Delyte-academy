"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon, Plus } from "lucide-react";

interface TopicPlaceholderTabProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel: string;
  iconColor?: string;
  iconBg?: string;
}

export function TopicPlaceholderTab({
  icon: Icon,
  title,
  description,
  actionLabel,
  iconColor = "text-primary",
  iconBg = "bg-primary/10",
}: TopicPlaceholderTabProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo(
      cardRef.current,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
    )
      .fromTo(
        iconRef.current,
        { opacity: 0, scale: 0.7 },
        { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(2)" },
        "-=0.2"
      )
      .fromTo(
        glowRef.current,
        { scale: 1, opacity: 0.35 },
        {
          scale: 1.35,
          opacity: 0,
          duration: 1.8,
          ease: "power1.out",
          repeat: -1,
          repeatDelay: 0.6,
        },
        "-=0.1"
      );
  }, []);

  return (
    <Card
      ref={cardRef}
      className="flex min-h-[400px] flex-col items-center justify-center border-dashed border-border/80 bg-muted/20 p-8 text-center"
    >
      <div
        ref={iconRef}
        className={`relative flex h-14 w-14 items-center justify-center rounded-2xl ${iconBg}`}
      >
        <span
          ref={glowRef}
          className={`absolute inset-0 rounded-2xl ${iconBg}`}
          style={{ opacity: 0 }}
        />
        <Icon className={`relative h-6 w-6 ${iconColor}`} />
      </div>
      <h3 className="mt-4 text-base font-bold text-foreground">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        {description}
      </p>
      <Button
        className="mt-4 shadow-sm shadow-primary/20 transition-shadow hover:shadow-md hover:shadow-primary/30"
        size="sm"
      >
        <Plus className="mr-1.5 h-3.5 w-3.5" />
        {actionLabel}
      </Button>
    </Card>
  );
}
