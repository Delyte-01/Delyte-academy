/**
 * The fake pointer of the hero demo. A zero-size anchor that GSAP moves with
 * `x`/`y`; the arrow tip sits exactly on the anchor, and the click ripple is
 * centred on it. Decorative: hidden from assistive tech, never receives events,
 * and invisible by default (so it never shows when the loop is not running).
 */
export function DemoCursor() {
  return (
    <div
      data-demo-cursor
      aria-hidden
      className="pointer-events-none absolute left-0 top-0 z-30 size-0 opacity-0"
    >
      <span
        data-demo-ripple
        className="absolute left-0 top-0 -ml-4 -mt-4 size-8 rounded-full border-2 border-primary opacity-0"
      />
      <svg
        viewBox="0 0 24 24"
        className="absolute -left-[3px] -top-[2px] size-[22px] fill-background stroke-foreground text-foreground drop-shadow-md"
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        <path d="M3 2 L3 18 L7.2 14.2 L10 20.6 L12.6 19.4 L9.8 13.2 L15.6 12.8 Z" />
      </svg>
    </div>
  );
}
