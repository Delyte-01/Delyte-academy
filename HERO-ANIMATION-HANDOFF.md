# HERO DEMO ANIMATION — HANDOFF (Part 16)

> **Read first:** `handoff.md` (v2 rules), `DESIGN-SYSTEM.md` (tokens + GSAP kit). Everything in those files still binds. This document only adds the spec for ONE feature.

## 0. Prompt to give the agent

```
Read HERO-ANIMATION-HANDOFF.md in the project root, plus handoff.md and DESIGN-SYSTEM.md.
Build the hero demo animation exactly as specified there: a self-playing, looping,
GSAP-driven product demo (course list -> click a quiz -> question + options ->
answer -> correct/wrong feedback -> loop) that the visitor can take over by
hovering or clicking. Desktop (lg+) only. Keep the existing QuizPreview for
screens below lg. Do not change anything outside the files listed in section 3.
When done, run `npm run lint` and `npx tsc --noEmit`, fix every error you
introduced, and walk through the acceptance checklist in section 10.
```

## 1. Goal

On desktop, the hero's right-hand "product window" (today the static `QuizPreview`) becomes a **short looping demo that shows the core product loop in ~12 seconds**:

1. A course page lists topics and quizzes. A cursor glides to a quiz and **clicks** it.
2. The quiz player opens with the question navigator, a timer chip, one question and four options.
3. The cursor **picks an answer**. The correct option turns green (a wrong pick turns red first, then the correct one is revealed) with a one-line explanation.
4. The navigator advances, the window resets, and the loop restarts.

**Hybrid behaviour (the key idea):** self-playing by default; if the visitor hovers, clicks or tabs into the window, the loop pauses and the options become real, clickable buttons. After they answer and stay idle, the loop resumes.

## 2. Hard constraints

- **Frontend only.** No backend, schema, auth or data-hook changes. No new npm packages: GSAP, `@gsap/react` and ScrollTrigger are already installed.
- **Import GSAP only from `@/lib/gsap`** (`gsap`, `useGSAP`, `EASE`, `DURATION`, `prefersReducedMotion`, `hasFinePointer`). Never `import gsap from "gsap"` directly.
- **Tokens only.** Use design tokens and utilities (`bg-card`, `border`, `text-foreground`, `bg-primary`, `bg-primary-soft`, `bg-success-soft`, `border-success`, `bg-destructive/10`, `shadow-card`, `shadow-float`, `font-headline`, `tabular-nums` ...). No raw hex, no palette classes like `bg-green-500`. Must look right in **light and dark** themes.
- **Animate `transform` and `opacity` only** (x, y, scale, opacity). Never animate width/height/top/left/box-shadow. Use `will-change: transform` sparingly and remove it when idle.
- **No fake data.** Everything shown is clearly sample content: the badge says "Demo" / "Sample quiz". No scores, student counts, percentages or user names. The timer chip is illustrative and labelled "Timed".
- **Exception to the "no infinite decorative loops" rule in DESIGN-SYSTEM.md:** this loop is a functional product demo, not decoration, so it is allowed ONLY with every guard in section 7 (pause button, reduced-motion, off-screen pause, tab-hidden pause).
- Keep the headline, sub-copy, CTAs and bullet points in the hero unchanged and **still**. Only the right-hand window moves.

## 3. Files

| Action | Path |
|---|---|
| NEW | `src/features/hero-section/hero-demo/index.tsx` (exports `HeroDemo`, owns the timeline + mode state) |
| NEW | `src/features/hero-section/hero-demo/course-scene.tsx` (scene A markup) |
| NEW | `src/features/hero-section/hero-demo/quiz-scene.tsx` (scene B/C markup, reuse look of `quiz-preview.tsx`) |
| NEW | `src/features/hero-section/hero-demo/demo-cursor.tsx` (the fake pointer + click ripple) |
| EDIT | `src/features/hero-section/index.tsx` (render `HeroDemo` on `lg+`, keep `QuizPreview` below `lg`) |
| UNCHANGED | `quiz-preview.tsx` stays as the mobile/tablet preview. Do not delete it. |

In `index.tsx` wrap the two like this (CSS switch, so there is no SSR/hydration mismatch):

```tsx
<div data-hero-preview>
  <div className="relative z-10">
    <div className="hidden lg:block"><HeroDemo /></div>
    <div className="lg:hidden"><QuizPreview /></div>
  </div>
  <ContinueCard />
</div>
```

`HeroDemo` must do nothing (no timeline, no listeners) below `lg` even though it is mounted. Gate everything with `gsap.matchMedia()` using `(min-width: 1024px)`.

**Do not touch** the existing hero scroll-parallax (`[data-hero-glow]`, `[data-hero-preview]`, `[data-hero-copy]` tweens). Animate only elements **inside** the demo so the two never fight over the same transform.

## 4. Layout and stability

- The demo window has a **fixed, reserved height** (same footprint as today's quiz window, roughly 26-30rem) so swapping scenes never causes layout shift. Scenes are stacked with `absolute inset-0`; only one is visible at a time.
- Window chrome (always visible): top bar with a green dot + label (`Demo` in scene A, `Sample quiz` in scene B/C), the "Timed" chip (scene B/C only), and the **pause/play button** on the right.
- Width/shape: same as today (`rounded-2xl border bg-card`, same shadow string as `quiz-preview.tsx`).

## 5. Storyboard (master timeline, ~12 s, `repeat: -1`)

Build ONE `gsap.timeline({ repeat: -1, repeatDelay: 0.6 })` with labels. Eases: `EASE.out` for entrances, `EASE.inOut` for cursor travel, `EASE.spring` only for the click press.

| Time | Label | What happens |
|---|---|---|
| 0.0-0.6 | `intro` | Window fades/rises in (only on first loop). Scene A visible: course header ("Sample course"), 3 topic rows, each with a small quiz row beneath it. |
| 0.6-2.2 | `travel1` | Cursor enters from the bottom-right of the window and glides (`EASE.inOut`) to the quiz row "Quiz: Core concepts". Row gets hover state (`bg-primary-soft`). |
| 2.2-2.7 | `click1` | Cursor presses (scale 0.9 -> 1, `EASE.spring`), a ring ripple expands and fades from the cursor tip, the row flashes `border-primary`. |
| 2.7-3.3 | `swap1` | Scene A fades/slides left (x: -24, opacity 0, 0.35 s). Scene B fades/slides in from right. Top-bar label cross-fades to "Sample quiz"; "Timed" chip fades in. |
| 3.3-4.4 | `quizIn` | Navigator cells pop in (stagger 0.04, scale 0.5 -> 1), "Question 3 of 8" fades up, question text fades up, the 4 options stagger in (y: 12 -> 0, stagger 0.08). Timer chip text ticks down in whole seconds via a tiny `onUpdate` (illustrative, e.g. 05:00 downward). |
| 4.4-5.8 | `travel2` | Cursor glides to the option it will pick (see loop variety below). Option gets hover state. |
| 5.8-6.2 | `click2` | Press + ripple. The option badge pops with `EASE.spring`. |
| 6.2-7.4 | `feedback` | **Correct loop:** picked option turns success (border, `bg-success-soft`, check badge). **Wrong loop:** picked option turns destructive with an X, 0.7 s later the correct option turns success. Other options drop to `opacity-55`. Feedback line fades up ("Correct. Real quizzes score automatically." / "Not quite. 2x = 8, so x = 4."). Current navigator cell switches to the "done" style. |
| 7.4-10.0 | `hold` | Hold so the result can be read (about 2.5 s). Cursor drifts slightly toward the pause button, then fades out. |
| 10.0-10.6 | `reset` | Scene B fades out, state resets to scene A (rows un-highlighted, options un-answered, cursor parked bottom-right, opacity 0). Loop restarts. |

**Loop variety:** keep a counter; **odd loops pick the correct answer (4), even loops pick a wrong one (5)** and then reveal the correct one. Toggle it in the timeline's `onRepeat`. Never pick randomly (must be deterministic and testable).

**Sample content (reuse, do not invent new data):**
- Question: "Solve for x: 2x + 6 = 14", options 3 / 4 / 5 / 8, correct = 4 (index 1). Same as `quiz-preview.tsx`.
- Course scene labels: "Sample course", topics "Introduction", "Core concepts", "Worked examples"; quiz row label "Quiz: Core concepts".

## 6. Implementation approach (important)

1. **Drive the DOM with GSAP and `data-state` attributes, not React state, during auto-play.** Re-rendering React 60 times a second will stutter. Toggle states with `tl.set(el, { attr: { "data-state": "correct" } })` and style them with Tailwind data variants (`data-[state=correct]:border-success data-[state=correct]:bg-success-soft`, `data-[state=wrong]:...`, `data-[state=dim]:opacity-55`, `data-[state=hover]:...`).
2. React state is allowed only for the **mode** (`"auto" | "manual"`) and **paused** (boolean) because they change rarely.
3. Cursor targets: measure with `getBoundingClientRect()` relative to the demo root when the timeline is built, and **rebuild the timeline on resize** (debounced ResizeObserver, 150 ms) so the cursor still lands on the right element at any desktop width. Use `x`/`y` transforms for movement.
4. Use `useGSAP` with `{ scope: rootRef }` and `gsap.matchMedia()`:
   - `(min-width: 1024px) and (prefers-reduced-motion: no-preference)` -> build the loop.
   - `(min-width: 1024px) and (prefers-reduced-motion: reduce)` -> no timeline; render the static end frame (scene B, answered correctly, no cursor). Manual mode still works.
   - Return/revert so everything is killed on unmount (no leaked timelines or listeners).
5. Keep the cursor a small `pointer-events-none` SVG (arrow) with `aria-hidden`. Use tokens (`text-foreground`, a `drop-shadow`), no image files.
6. Reuse styling from `quiz-preview.tsx` for the navigator, option buttons, badges and feedback line so scene B looks identical to what ships today.

## 7. Guards (all required)

1. **Pause/Play button** in the window bar: real `<button>`, `aria-label` "Pause demo" / "Play demo", `aria-pressed`, >= 40 px hit area, visible focus ring. Pausing calls `tl.pause()`; the visitor's choice persists until they press play again (do not auto-resume after an explicit pause).
2. **Reduced motion:** see section 6.4. Also react to the media query changing at runtime (matchMedia handles it).
3. **Off-screen pause:** a `ScrollTrigger` on the demo root with `onToggle: (self) => tl.paused(!self.isActive)` (respect an explicit user pause: do not resume if `userPaused`).
4. **Tab hidden pause:** `document.visibilitychange` pauses/resumes (same `userPaused` rule).
5. **Cleanup:** kill the timeline, ScrollTrigger, observers and event listeners on unmount.
6. **Performance budget:** no layout-triggering properties, no per-frame React renders, no more than one active timeline. Must stay smooth on a mid-range laptop.

## 8. Interactive takeover ("manual" mode)

State machine: `auto` <-> `manual`.

- **Enter manual** on `pointerenter` of the window, on any `pointerdown`/`click` inside it, or on `focusin` (keyboard). Do it immediately:
  1. `tl.pause()`, fade the fake cursor out (0.2 s).
  2. Snap to the **quiz scene, question unanswered** (scene B resolved state: options visible, no feedback). If the loop was in scene A, cross-fade to scene B quickly (0.25 s).
  3. Options become real, focusable buttons (same behaviour as today's `QuizPreview`: choose once, show correct/wrong + feedback line + "Try again").
- **Manual answer:** same visuals as auto feedback, announced via `aria-live="polite"` on the feedback line (live region is only active in manual mode; in auto mode set `aria-live="off"`).
- **Leave / idle:** after the visitor has answered (or left the window) and **4 s** pass with no pointer/focus activity, return to `auto`: fade back to scene A, reset states, `tl.restart()`. If they never answered and the pointer just left, wait 2 s then resume.
- **Keyboard:** Tab must reach pause button then the four options in order; Enter/Space selects; focus must never be lost when the mode switches (do not unmount focused elements, only toggle `data-state`/`pointer-events`).
- In `auto` mode the options are `tabIndex={-1}` and `aria-hidden` is NOT used on the whole window (it contains the pause button); only the cursor and the decorative scenes' duplicate text are hidden from assistive tech. Give the window `role="group"` and `aria-label="Animated sample quiz demo"`.

## 9. Copy and visual details

- Keep copy short and honest. No claims beyond what the product does: timed quizzes, instant feedback, automatic scoring.
- Cursor: 20-24 px arrow, white fill with dark outline works on light and dark; ripple ring uses `border-primary`.
- Hover state used by the cursor (`data-state="hover"`) must match the real hover style (`bg-primary-soft/60`, `border-primary/50`).
- Timer chip: `tabular-nums`, e.g. `Clock` icon + "04:52" counting down only while scene B/C is on screen; reset on loop.
- Dark mode check: success/destructive surfaces must have enough contrast (use the existing `-soft` pairs / `bg-destructive/10`).

## 10. Acceptance checklist

- [ ] Below 1024 px nothing from `HeroDemo` runs; the existing `QuizPreview` shows exactly as before.
- [ ] At >= 1024 px the loop plays automatically, shows all 4 scenes, loops forever, and alternates correct / wrong picks.
- [ ] The cursor lands on the right quiz row and the right option at 1024, 1280, 1440 and 1920 px widths, and after resizing the window.
- [ ] Hovering or clicking the window pauses the loop and gives real clickable options; answering shows feedback; idle returns to auto.
- [ ] Pause button works, is keyboard-operable, and an explicit pause is never auto-resumed.
- [ ] `prefers-reduced-motion: reduce` -> no loop, no cursor, static answered frame, manual mode still works.
- [ ] Loop pauses when scrolled out of view and when the tab is hidden; resumes correctly.
- [ ] No layout shift (CLS ~ 0); the window height is constant across scenes.
- [ ] Light and dark themes both look right; only design tokens are used (no hex, no palette classes).
- [ ] Hero headline/CTAs do not move; the existing hero parallax still works.
- [ ] No console errors/warnings; no leaked timelines after navigating away and back (check in React strict mode, which double-mounts in dev).
- [ ] `npm run lint` and `npx tsc --noEmit` pass for all files touched.

## 11. Do NOT

- Do not add Lottie, video, GIF, canvas or any new dependency.
- Do not autoplay sound.
- Do not animate the headline, buttons or background glows as part of this task.
- Do not show fake stats, fake user names or fake scores.
- Do not use `setInterval`/`requestAnimationFrame` loops for the animation; use the GSAP timeline.
- Do not leave `will-change` or inline `transform` styles on elements after the loop ends or the user takes over (use `clearProps` when switching to manual).
