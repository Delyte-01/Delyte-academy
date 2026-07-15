"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { BookOpen } from "lucide-react";

gsap.registerPlugin(useGSAP);

interface CourseThumbnailProps {
  src?: string | null;
  alt: string;
}

export function CourseThumbnail({ src, alt }: CourseThumbnailProps) {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const shineRef = useRef<HTMLDivElement>(null);
  const shimmerRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<SVGSVGElement>(null);

  // Shimmer sweep, loops until the real image finishes decoding
  useGSAP(
    () => {
      if (!src || loaded || !shimmerRef.current) return;
      const tween = gsap.fromTo(
        shimmerRef.current,
        { xPercent: -130 },
        { xPercent: 130, duration: 1.3, repeat: -1, ease: "power1.inOut" }
      );
      return () => {
        tween.kill();
      };
    },
    { dependencies: [src, loaded] }
  );

  // Reveal once actually loaded — avoids a jarring "pop" on slow connections
  useGSAP(
    () => {
      if (loaded && imgRef.current) {
        gsap.fromTo(
          imgRef.current,
          { opacity: 0, scale: 1.08 },
          { opacity: 1, scale: 1, duration: 0.65, ease: "power2.out" }
        );
      }
    },
    { dependencies: [loaded] }
  );

  // Gentle idle float for the no-thumbnail state, so empty cards still feel alive
  useGSAP(
    () => {
      if (!src && iconRef.current) {
        gsap.to(iconRef.current, {
          y: -3,
          duration: 1.6,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
    },
    { dependencies: [src] }
  );

  const handleEnter = () => {
    if (!shineRef.current) return;
    gsap.fromTo(
      shineRef.current,
      { xPercent: -150 },
      { xPercent: 150, duration: 0.9, ease: "power2.inOut", overwrite: true }
    );
  };

  return (
    <div
      onMouseEnter={handleEnter}
      className="relative aspect-[16/9] w-full overflow-hidden bg-muted"
    >
      {src ? (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          onLoad={() => setLoaded(true)}
          className="h-full w-full origin-center object-cover opacity-0 transition-transform duration-700 ease-out group-hover:scale-[1.08]"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/15 via-indigo-500/10 to-transparent">
          <BookOpen ref={iconRef} className="h-8 w-8 text-primary/40" />
        </div>
      )}

      {/* Loading shimmer */}
      {src && !loaded && (
        <div
          ref={shimmerRef}
          className="pointer-events-none absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/60 to-transparent"
        />
      )}

      {/* Hover shine sweep */}
      {src && (
        <div
          ref={shineRef}
          className="pointer-events-none absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent"
        />
      )}

      {/* Permanent depth scrim so flat images still feel premium */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" />
    </div>
  );
}
