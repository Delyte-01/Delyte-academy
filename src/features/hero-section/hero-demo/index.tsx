"use client";

import { useRef, useState, type RefObject } from "react";
import { Clock, Pause, Play } from "lucide-react";
import { EASE, gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { CourseScene } from "./course-scene";
import { DemoCursor } from "./demo-cursor";
import { CURRENT, FEEDBACK, QUESTION, QuizScene } from "./quiz-scene";

/**
 * Hero product demo (desktop, lg+). A looping ~11 s GSAP timeline that shows the
 * core loop: course page -> click a quiz -> question -> answer -> feedback.
 *
 * Hybrid behaviour: self-playing by default; hovering, clicking or tabbing into
 * the window pauses the loop and makes the options real buttons ("manual"
 * mode). After the visitor answers and goes idle, the loop resumes.
 *
 * How it stays smooth:
 *  - during auto-play GSAP drives the DOM (transform/opacity + `data-state`
 *    attributes styled with Tailwind data variants). React state is only the
 *    rarely-changing `mode` and `paused`;
 *  - the loop ends in exactly the state it starts in, which is what lets
 *    `repeatRefresh` re-evaluate the odd/even answer pick on every iteration;
 *  - everything (timeline, ScrollTrigger, observers, listeners) is created
 *    inside `gsap.matchMedia()` and torn down with it.
 */

type Mode = "auto" | "manual";
type Point = { x: number; y: number };
type Timeline = gsap.core.Timeline;
type Call = gsap.core.Tween;

interface Controller {
  answer: (index: number) => void;
  tryAgain: () => void;
  togglePause: () => void;
}

/** Odd loops pick the right answer ("4"); even loops pick a wrong one ("5"). */
const CORRECT_PICK = QUESTION.correct;
const WRONG_PICK = 2;

/** Illustrative countdown (seconds), shown as 05:00 and ticking down. */
const TIMER_START = 300;
const TIMER_STATIC = 292;

/** Seconds of idle time before the loop resumes after a takeover. */
const IDLE_ANSWERED = 4;
const IDLE_UNANSWERED = 2;

const DESKTOP_MOTION = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";
const DESKTOP_STILL = "(min-width: 1024px) and (prefers-reduced-motion: reduce)";

interface Els {
  sceneA: HTMLElement;
  sceneB: HTMLElement;
  labelA: HTMLElement;
  labelB: HTMLElement;
  chip: HTMLElement;
  timer: HTMLElement;
  cursor: HTMLElement;
  ripple: HTMLElement;
  pauseBtn: HTMLElement;
  targetRow: HTMLElement;
  qLabel: HTMLElement;
  qText: HTMLElement;
  feedback: HTMLElement;
  rows: HTMLElement[];
  navCells: HTMLElement[];
  optionWraps: HTMLElement[];
  options: HTMLElement[];
  badges: HTMLElement[];
  courseItems: HTMLElement[];
}

/** Collects every element the timeline touches; null if the markup is incomplete. */
function collect(root: HTMLElement): Els | null {
  const one = (selector: string) => root.querySelector<HTMLElement>(selector);
  const all = (selector: string) => Array.from(root.querySelectorAll<HTMLElement>(selector));

  const sceneA = one('[data-demo-scene="course"]');
  const sceneB = one('[data-demo-scene="quiz"]');
  const labelA = one('[data-demo-label="course"]');
  const labelB = one('[data-demo-label="quiz"]');
  const chip = one("[data-demo-chip]");
  const timer = one("[data-timer]");
  const cursor = one("[data-demo-cursor]");
  const ripple = one("[data-demo-ripple]");
  const pauseBtn = one("[data-pause]");
  const targetRow = one('[data-quiz-row="core"]');
  const qLabel = one("[data-q-label]");
  const qText = one("[data-q-text]");
  const feedback = one("[data-feedback]");
  const rows = all("[data-quiz-row]");
  const navCells = all("[data-nav-cell]");
  const optionWraps = all("[data-option-wrap]");
  const options = all("[data-option]");
  const badges = all("[data-badge]");
  const courseItems = all("[data-course-item]");

  if (
    !sceneA || !sceneB || !labelA || !labelB || !chip || !timer || !cursor ||
    !ripple || !pauseBtn || !targetRow || !qLabel || !qText || !feedback
  ) {
    return null;
  }
  if (
    navCells.length < CURRENT + 1 ||
    options.length !== QUESTION.options.length ||
    optionWraps.length !== options.length ||
    badges.length !== options.length
  ) {
    return null;
  }

  return {
    sceneA, sceneB, labelA, labelB, chip, timer, cursor, ripple, pauseBtn,
    targetRow, qLabel, qText, feedback, rows, navCells, optionWraps, options,
    badges, courseItems,
  };
}

const formatClock = (seconds: number) =>
  `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const setState = (el: Element, state: string) => el.setAttribute("data-state", state);

interface Host {
  root: HTMLElement;
  els: Els;
  /** false = reduced motion: no loop, static end frame, manual mode only. */
  animated: boolean;
  safe: <A extends unknown[], R>(fn: (...args: A) => R) => (...args: A) => R;
  modeRef: RefObject<Mode>;
  pausedRef: RefObject<boolean>;
  onModeChange: (mode: Mode) => void;
  onPausedChange: (paused: boolean) => void;
}

/** Builds the demo for the current media conditions. Returns its controller + teardown. */
function startDemo(host: Host): { controller: Controller; destroy: () => void } {
  const { root, els, animated, safe, modeRef, pausedRef, onModeChange, onPausedChange } = host;
  const {
    sceneA, sceneB, labelA, labelB, chip, timer, cursor, ripple, pauseBtn, targetRow,
    qLabel, qText, feedback, rows, navCells, optionWraps, options, badges, courseItems,
  } = els;

  const correctCell = navCells[CURRENT - 1];
  const nextCell = navCells[CURRENT];
  const animatedEls: HTMLElement[] = [
    sceneA, sceneB, labelA, labelB, chip, cursor, ripple, qLabel, qText, feedback,
    ...navCells, ...optionWraps, ...badges, ...courseItems,
  ];
  const now = () => performance.now();

  // ---- state that never needs a React render -----------------------------------
  let loop = 1;
  let timeline: Timeline | null = null;
  let transition: Timeline | null = null;
  let resumeCall: Call | null = null;
  let revealCall: Call | null = null;
  let rebuildCall: Call | null = null;
  let introPlayed = false;
  let answered = false;
  let pointerInside = false;
  let suppressPointer = false; // after an explicit "Play", ignore hover until the pointer leaves
  let lastActivity = now();
  let inView = true;
  let tabHidden = document.hidden;
  let shownSecond = -1;
  const clock = { v: TIMER_START };
  const pos = {
    start: { x: 0, y: 0 } as Point,
    row: { x: 0, y: 0 } as Point,
    opts: [] as Point[],
    pause: { x: 0, y: 0 } as Point,
  };

  const pickIndex = () => (loop % 2 === 1 ? CORRECT_PICK : WRONG_PICK);

  // ---- DOM state helpers (attribute flips, no React) ----------------------------
  const renderTimer = (value: number) => {
    const seconds = Math.max(0, Math.ceil(value));
    if (seconds === shownSecond) return;
    shownSecond = seconds;
    timer.textContent = formatClock(seconds);
  };

  /** Quiz back to "question shown, nothing answered". */
  const resetQuizDom = () => {
    options.forEach((o) => {
      setState(o, "idle");
      o.removeAttribute("aria-disabled");
    });
    navCells.forEach((c, i) =>
      setState(c, i + 1 < CURRENT ? "done" : i + 1 === CURRENT ? "current" : "idle"),
    );
    rows.forEach((r) => setState(r, "idle"));
    setState(feedback, "idle");
    feedback.textContent = FEEDBACK.idle;
    shownSecond = -1;
    renderTimer(TIMER_START);
    root.dataset.answered = "false";
  };

  const showPicked = (picked: number) => {
    options.forEach((o, i) => {
      setState(o, i === picked ? (i === CORRECT_PICK ? "correct" : "wrong") : "dim");
      o.setAttribute("aria-disabled", "true");
    });
    setState(correctCell, "done");
  };
  const revealCorrect = () => setState(options[CORRECT_PICK], "correct");
  const showFeedback = (ok: boolean) => {
    feedback.textContent = ok ? FEEDBACK.correct : FEEDBACK.wrong;
    setState(feedback, ok ? "correct" : "wrong");
  };

  /** Removes every inline style GSAP put on the demo, so CSS + data attributes decide. */
  const clearInline = () => {
    gsap.killTweensOf(animatedEls);
    gsap.set(animatedEls, { clearProps: "all" });
  };

  /** Reduced motion: the finished frame (scene B, answered correctly, no cursor). */
  const applyStaticFrame = () => {
    clearInline();
    root.dataset.scene = "b";
    resetQuizDom();
    showPicked(CORRECT_PICK);
    showFeedback(true);
    shownSecond = -1;
    renderTimer(TIMER_STATIC);
  };

  // ---- cursor targets ------------------------------------------------------------
  const rel = (el: HTMLElement, fx: number, fy: number): Point => {
    const r = root.getBoundingClientRect();
    const t = el.getBoundingClientRect();
    return {
      x: t.left - r.left - root.clientLeft + t.width * fx,
      y: t.top - r.top - root.clientTop + t.height * fy,
    };
  };
  const measure = () => {
    pos.start = { x: root.clientWidth - 30, y: root.clientHeight - 22 };
    pos.row = rel(targetRow, 0.72, 0.5);
    pos.opts = options.map((o) => rel(o, 0.55, 0.5));
    pos.pause = rel(pauseBtn, 0.5, 0.5);
  };

  /** The loop's first AND last frame. Must match exactly (see repeatRefresh note). */
  const applyInitial = () => {
    root.dataset.scene = "a";
    gsap.set(sceneA, { opacity: 1, x: 0 });
    gsap.set(sceneB, { opacity: 0, x: 24 });
    gsap.set(labelA, { opacity: 1, y: 0 });
    gsap.set(labelB, { opacity: 0, y: 4 });
    gsap.set(chip, { opacity: 0 });
    gsap.set(navCells, { opacity: 0, scale: 0.5 });
    gsap.set([qLabel, qText], { opacity: 0, y: 8 });
    gsap.set(optionWraps, { opacity: 0, y: 12 });
    gsap.set(badges, { scale: 1 });
    gsap.set(feedback, { opacity: 0, y: 6 });
    gsap.set(courseItems, { opacity: 1, y: 0 });
    gsap.set(ripple, { opacity: 0, scale: 0.3 });
    gsap.set(cursor, {
      x: pos.start.x, y: pos.start.y, opacity: 0, scale: 1,
      transformOrigin: "0 0", willChange: "transform",
    });
    resetQuizDom();
  };

  // ---- playback gate ---------------------------------------------------------------
  const shouldPlay = () =>
    modeRef.current === "auto" && !pausedRef.current && inView && !tabHidden;
  const apply = () => {
    if (timeline) timeline.paused(!shouldPlay());
  };

  // ---- the master timeline ----------------------------------------------------------
  const build = safe(() => {
    timeline?.kill();
    timeline = null;
    clearInline(); // untransformed layout, so the cursor targets measure correctly
    if (!animated || root.clientWidth === 0) return;
    measure();
    applyInitial();

    if (!introPlayed) {
      // First loop only: the course rows rise in (the window itself is already
      // revealed by the hero's own entrance, so it is not faded twice).
      introPlayed = true;
      gsap.fromTo(
        courseItems,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: EASE.out },
      );
    }

    const tl = gsap.timeline({
      paused: true,
      repeat: -1,
      repeatDelay: 0.6,
      repeatRefresh: true, // re-evaluates the function-based cursor/pick values each loop
      onRepeat: () => {
        loop += 1; // odd = correct, even = wrong. Deterministic, never random.
        applyInitial(); // belt and braces: every iteration starts from the exact first frame
      },
    });
    const ft = (
      target: gsap.TweenTarget,
      from: gsap.TweenVars,
      to: gsap.TweenVars,
      at: number,
    ) => tl.fromTo(target, from, { immediateRender: false, ...to }, at);
    const pick = pickIndex;
    const optX = () => pos.opts[pick()].x;
    const optY = () => pos.opts[pick()].y;

    // intro   0.0-0.6  (first loop's rise-in lives above; later loops simply dwell on scene A)
    tl.addLabel("intro", 0);

    // travel1 0.6-2.2  cursor enters bottom-right and glides to "Quiz: Core concepts"
    tl.addLabel("travel1", 0.6);
    ft(cursor, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: EASE.out }, 0.6);
    ft(
      cursor,
      { x: pos.start.x, y: pos.start.y },
      { x: pos.row.x, y: pos.row.y, duration: 1.6, ease: EASE.inOut },
      0.6,
    );
    tl.set(targetRow, { attr: { "data-state": "hover" } }, 2.05);

    // click1  2.2-2.7  press, ripple, row flashes border-primary
    tl.addLabel("click1", 2.2);
    ft(cursor, { scale: 0.9 }, { scale: 1, duration: 0.5, ease: EASE.spring }, 2.2);
    ft(ripple, { opacity: 0.7, scale: 0.3 }, { opacity: 0, scale: 1.8, duration: 0.6, ease: EASE.out }, 2.2);
    tl.set(targetRow, { attr: { "data-state": "press" } }, 2.2);

    // swap1   2.7-3.3  scene A slides out left, scene B in from the right; chrome cross-fades
    tl.addLabel("swap1", 2.7);
    tl.set(root, { attr: { "data-scene": "b" } }, 2.7);
    ft(sceneA, { x: 0, opacity: 1 }, { x: -24, opacity: 0, duration: 0.35, ease: EASE.inOut }, 2.7);
    ft(sceneB, { x: 24, opacity: 0 }, { x: 0, opacity: 1, duration: 0.4, ease: EASE.out }, 2.8);
    ft(labelA, { opacity: 1, y: 0 }, { opacity: 0, y: -4, duration: 0.25, ease: EASE.out }, 2.75);
    ft(labelB, { opacity: 0, y: 4 }, { opacity: 1, y: 0, duration: 0.3, ease: EASE.out }, 2.85);
    ft(chip, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: EASE.out }, 2.9);

    // quizIn  3.3-4.4  navigator pops, question and options rise in; the timer ticks down
    tl.addLabel("quizIn", 3.3);
    ft(
      navCells,
      { opacity: 0, scale: 0.5 },
      { opacity: 1, scale: 1, duration: 0.4, stagger: 0.04, ease: EASE.out },
      3.3,
    );
    ft(qLabel, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4, ease: EASE.out }, 3.55);
    ft(qText, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4, ease: EASE.out }, 3.65);
    ft(
      optionWraps,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: EASE.out },
      3.8,
    );
    ft(
      clock,
      { v: TIMER_START },
      { v: TIMER_START - 7, duration: 7.2, ease: "none", onUpdate: () => renderTimer(clock.v) },
      3.0,
    );

    // travel2 4.4-5.8  cursor glides to this loop's pick; the option takes the hover style
    tl.addLabel("travel2", 4.4);
    ft(
      cursor,
      { x: pos.row.x, y: pos.row.y },
      { x: optX, y: optY, duration: 1.4, ease: EASE.inOut },
      4.4,
    );
    tl.call(() => setState(options[pick()], "hover"), undefined, 5.6);

    // click2  5.8-6.2  press + ripple, the picked option's badge pops
    tl.addLabel("click2", 5.8);
    ft(cursor, { scale: 0.9 }, { scale: 1, duration: 0.5, ease: EASE.spring }, 5.8);
    ft(ripple, { opacity: 0.7, scale: 0.3 }, { opacity: 0, scale: 1.8, duration: 0.6, ease: EASE.out }, 5.8);
    ft(
      badges,
      { scale: (i: number) => (i === pick() ? 0.7 : 1) },
      { scale: 1, duration: 0.6, ease: EASE.spring },
      5.8,
    );

    // feedback 6.2-7.4  picked option turns success/destructive, the rest dim;
    //                    on a wrong pick the right answer is revealed 0.7 s later
    tl.addLabel("feedback", 6.2);
    tl.call(() => showPicked(pick()), undefined, 6.2);
    tl.call(() => showFeedback(pick() === CORRECT_PICK), undefined, 6.3);
    ft(feedback, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.4, ease: EASE.out }, 6.3);
    tl.call(() => {
      if (pick() !== CORRECT_PICK) revealCorrect();
    }, undefined, 6.9);

    // hold    7.4-10.0 the result stays readable; navigator advances; the cursor drifts
    //                  toward the pause button, then fades out
    tl.addLabel("hold", 7.4);
    tl.call(() => {
      setState(correctCell, "done");
      setState(nextCell, "current");
    }, undefined, 7.8);
    ft(
      cursor,
      { x: optX, y: optY },
      {
        x: () => lerp(pos.opts[pick()].x, pos.pause.x, 0.3),
        y: () => lerp(pos.opts[pick()].y, pos.pause.y, 0.3),
        duration: 1.2,
        ease: EASE.inOut,
      },
      7.6,
    );
    ft(cursor, { opacity: 1 }, { opacity: 0, duration: 0.5, ease: EASE.out }, 8.6);

    // reset   10.0-10.6 scene B out, scene A back in, then restore the exact start frame
    tl.addLabel("reset", 10);
    tl.set(root, { attr: { "data-scene": "a" } }, 10);
    ft(sceneB, { x: 0, opacity: 1 }, { x: -16, opacity: 0, duration: 0.35, ease: EASE.inOut }, 10);
    ft(labelB, { opacity: 1, y: 0 }, { opacity: 0, y: -4, duration: 0.25, ease: EASE.out }, 10);
    ft(chip, { opacity: 1 }, { opacity: 0, duration: 0.25, ease: EASE.out }, 10);
    ft(sceneA, { x: 24, opacity: 0 }, { x: 0, opacity: 1, duration: 0.4, ease: EASE.out }, 10.2);
    ft(labelA, { opacity: 0, y: 4 }, { opacity: 1, y: 0, duration: 0.3, ease: EASE.out }, 10.25);
    // Scene A is fading back in: clear the row highlight now (invisible at this point),
    // and reset the quiz once scene B is fully transparent. `onRepeat` then restores
    // the exact first frame (a call sitting on the very end of the loop is unreliable).
    tl.set(targetRow, { attr: { "data-state": "idle" } }, 10.2);
    tl.call(resetQuizDom, undefined, 10.4);

    timeline = tl;
    apply();
  });

  // ---- takeover (manual mode) ---------------------------------------------------------
  const kbFocus = () => {
    try {
      return root.querySelector(":focus-visible") !== null;
    } catch {
      return false;
    }
  };

  const checkResume = safe(() => {
    resumeCall = null;
    if (modeRef.current !== "manual" || pausedRef.current) return;
    if (kbFocus()) return; // keyboard user: wait until focus leaves (focusout reschedules)
    if (!answered && pointerInside) return; // still looking at the question
    const need = answered ? IDLE_ANSWERED : IDLE_UNANSWERED;
    const idle = (now() - lastActivity) / 1000;
    if (idle < need) {
      resumeCall = gsap.delayedCall(need - idle, checkResume);
      return;
    }
    returnToAuto();
  });

  const scheduleResume = safe(() => {
    resumeCall?.kill();
    resumeCall = null;
    if (modeRef.current !== "manual" || pausedRef.current) return;
    resumeCall = gsap.delayedCall(answered ? IDLE_ANSWERED : IDLE_UNANSWERED, checkResume);
  });

  const enterManual = safe(() => {
    lastActivity = now();
    resumeCall?.kill();
    resumeCall = null;
    if (modeRef.current === "manual") return;

    modeRef.current = "manual";
    root.dataset.mode = "manual";
    onModeChange("manual");
    timeline?.pause();
    transition?.kill();
    transition = null;
    revealCall?.kill();
    revealCall = null;
    answered = false;

    // Which scene is on screen right now? Cross-fade A -> B, otherwise just snap.
    const crossfade =
      animated &&
      Number(gsap.getProperty(sceneA, "opacity")) > Number(gsap.getProperty(sceneB, "opacity"));

    // Freeze everything the loop was doing, then put scene B's contents in their
    // resolved resting state (CSS default: visible, nothing answered).
    gsap.killTweensOf(animatedEls);
    gsap.set(ripple, { opacity: 0 });
    gsap.set(
      [qLabel, qText, feedback, ...navCells, ...optionWraps, ...badges, ...courseItems],
      { clearProps: "all" },
    );
    resetQuizDom();
    root.dataset.scene = "b";

    const finish = () => {
      gsap.set(animatedEls, { clearProps: "all" }); // no leftover inline transforms / will-change
    };
    if (!animated) {
      finish();
      return;
    }
    const tl = gsap.timeline({ onComplete: finish });
    tl.to(cursor, { opacity: 0, duration: 0.2, ease: EASE.out }, 0);
    if (crossfade) {
      tl.to(sceneA, { opacity: 0, x: -12, duration: 0.25, ease: EASE.out }, 0);
      tl.fromTo(sceneB, { opacity: 0, x: 12 }, { opacity: 1, x: 0, duration: 0.25, ease: EASE.out }, 0);
      tl.to(labelA, { opacity: 0, duration: 0.2, ease: EASE.out }, 0);
      tl.to(labelB, { opacity: 1, y: 0, duration: 0.25, ease: EASE.out }, 0);
      tl.to(chip, { opacity: 1, duration: 0.25, ease: EASE.out }, 0);
    }
    transition = tl;
  });

  const returnToAuto = safe(() => {
    if (modeRef.current !== "manual") return;
    modeRef.current = "auto";
    root.dataset.mode = "auto";
    onModeChange("auto");
    resumeCall?.kill();
    resumeCall = null;
    revealCall?.kill();
    revealCall = null;
    transition?.kill();
    transition = null;
    answered = false;

    // A pointer-focused (not keyboard-focused) option must not keep focus once hidden.
    const active = document.activeElement;
    if (active instanceof HTMLElement && root.contains(active) && !kbFocus()) active.blur();

    if (!animated) {
      applyStaticFrame();
      return;
    }
    // Fade back to scene A, then rebuild a fresh timeline (same as a restart).
    const tl = gsap.timeline({ onComplete: () => build() });
    tl.to(sceneB, { opacity: 0, x: -12, duration: 0.25, ease: EASE.out }, 0);
    tl.to(labelB, { opacity: 0, duration: 0.2, ease: EASE.out }, 0);
    tl.to(chip, { opacity: 0, duration: 0.2, ease: EASE.out }, 0);
    tl.fromTo(sceneA, { opacity: 0, x: 12 }, { opacity: 1, x: 0, duration: 0.3, ease: EASE.out }, 0.1);
    tl.to(labelA, { opacity: 1, duration: 0.25, ease: EASE.out }, 0.1);
    transition = tl;
  });

  // ---- controller used by the React handlers -------------------------------------------
  const controller: Controller = {
    answer: safe((index: number) => {
      if (modeRef.current !== "manual" || answered) return;
      answered = true;
      lastActivity = now();
      root.dataset.answered = "true";
      const ok = index === CORRECT_PICK;
      showPicked(index);
      showFeedback(ok);
      if (animated) {
        gsap.fromTo(
          badges[index],
          { scale: 0.7 },
          { scale: 1, duration: 0.6, ease: EASE.spring, clearProps: "transform" },
        );
      }
      if (!ok) {
        if (animated) revealCall = gsap.delayedCall(0.7, revealCorrect);
        else revealCorrect();
      }
      scheduleResume();
    }),

    tryAgain: safe(() => {
      if (modeRef.current !== "manual") return;
      answered = false;
      lastActivity = now();
      revealCall?.kill();
      revealCall = null;
      resetQuizDom();
      options[0].focus({ preventScroll: true }); // the "Try again" button just disappeared
    }),

    togglePause: safe(() => {
      const next = !pausedRef.current;
      pausedRef.current = next;
      onPausedChange(next);
      if (next) {
        resumeCall?.kill();
        resumeCall = null;
        apply();
        return;
      }
      // Explicit "Play": resume now, and don't let the pointer that is still over
      // the window immediately take the demo over again.
      suppressPointer = true;
      if (modeRef.current === "manual") returnToAuto();
      else apply();
    }),
  };

  // ---- listeners (all removed in destroy) -------------------------------------------------
  const cleanups: Array<() => void> = [];
  const on = <K extends keyof HTMLElementEventMap>(
    type: K,
    handler: (event: HTMLElementEventMap[K]) => void,
  ) => {
    root.addEventListener(type, handler);
    cleanups.push(() => root.removeEventListener(type, handler));
  };

  on("pointerenter", () => {
    pointerInside = true;
    lastActivity = now();
    if (!suppressPointer) enterManual();
  });
  on("pointermove", () => {
    lastActivity = now();
    if (modeRef.current === "auto" && !suppressPointer) enterManual();
  });
  on("pointerdown", () => {
    pointerInside = true;
    suppressPointer = false;
    enterManual();
  });
  on("pointerleave", () => {
    pointerInside = false;
    suppressPointer = false;
    lastActivity = now();
    scheduleResume();
  });
  on("focusin", () => enterManual());
  on("focusout", (event) => {
    const next = event.relatedTarget;
    if (next instanceof Node && root.contains(next)) return;
    lastActivity = now();
    scheduleResume();
  });

  const onVisibility = () => {
    tabHidden = document.hidden;
    apply();
  };
  document.addEventListener("visibilitychange", onVisibility);

  // Off-screen pause: the loop only runs while the window is on screen.
  const trigger = animated
    ? ScrollTrigger.create({
        trigger: root,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => {
          inView = self.isActive;
          apply();
        },
        onRefresh: (self) => {
          inView = self.isActive;
          apply();
        },
      })
    : null;

  // Rebuild on resize (debounced) so the cursor still lands on the right targets.
  let lastW = root.clientWidth;
  let lastH = root.clientHeight;
  const observer = animated
    ? new ResizeObserver(
        safe(() => {
          const w = root.clientWidth;
          const h = root.clientHeight;
          if (w === lastW && h === lastH) return;
          lastW = w;
          lastH = h;
          rebuildCall?.kill();
          rebuildCall = gsap.delayedCall(0.15, () => {
            if (modeRef.current === "auto") build();
          });
        }),
      )
    : null;
  observer?.observe(root);

  // ---- go -------------------------------------------------------------------------------------
  root.dataset.motion = animated ? "full" : "reduced";
  if (animated) build();
  else applyStaticFrame();

  const destroy = () => {
    cleanups.forEach((fn) => fn());
    document.removeEventListener("visibilitychange", onVisibility);
    observer?.disconnect();
    trigger?.kill();
    [resumeCall, revealCall, rebuildCall].forEach((call) => call?.kill());
    transition?.kill();
    timeline?.kill();
    timeline = null;
    clearInline();
    resetQuizDom();
    root.dataset.scene = "a";
    root.dataset.mode = "auto";
    delete root.dataset.motion;
    modeRef.current = "auto";
    onModeChange("auto");
  };

  return { controller, destroy };
}

export function HeroDemo() {
  const rootRef = useRef<HTMLDivElement>(null);
  const ctrlRef = useRef<Controller | null>(null);
  const modeRef = useRef<Mode>("auto");
  const pausedRef = useRef(false);
  const [mode, setMode] = useState<Mode>("auto");
  const [paused, setPaused] = useState(false);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      // Everything lives inside matchMedia: below lg nothing is created (no
      // timeline, no listeners, no observers); under reduced motion only the
      // static frame + manual mode exist.
      const mm = gsap.matchMedia();
      mm.add({ animated: DESKTOP_MOTION, still: DESKTOP_STILL }, (context, contextSafe) => {
        const animated = Boolean(context.conditions?.animated);
        if (!animated && !context.conditions?.still) return;
        const els = collect(root);
        if (!els) return;

        const { controller, destroy } = startDemo({
          root,
          els,
          animated,
          safe: (fn) => (contextSafe ? (contextSafe(fn) as typeof fn) : fn),
          modeRef,
          pausedRef,
          onModeChange: setMode,
          onPausedChange: setPaused,
        });
        ctrlRef.current = controller;

        return () => {
          ctrlRef.current = null;
          destroy();
        };
      });

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <div
      ref={rootRef}
      role="group"
      aria-label="Animated sample quiz demo"
      data-scene="a"
      data-mode={mode}
      data-answered="false"
      className="group/demo  relative flex h-[30rem] w-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-[0_40px_80px_-32px_oklch(0.25_0.08_281/0.45),0_8px_24px_-12px_oklch(0.25_0.08_281/0.2)]"
    >
      {/* window chrome: always visible, fixed height */}
      <div className="flex h-12 shrink-0 items-center justify-between gap-3 border-b bg-muted/60 pl-5 pr-1.5">
        <div className="flex items-center gap-2.5">
          <span aria-hidden className="size-2 rounded-full bg-success" />
          <span className="grid text-sm font-bold text-foreground">
            <span
              data-demo-label="course"
              aria-hidden
              className="col-start-1 row-start-1 group-data-[scene=b]/demo:opacity-0"
            >
              Demo
            </span>
            <span
              data-demo-label="quiz"
              className="col-start-1 row-start-1 opacity-0 group-data-[scene=b]/demo:opacity-100"
            >
              Sample quiz
            </span>
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span
            data-demo-chip
            className="inline-flex items-center gap-1.5 rounded-full border bg-card px-2.5 py-1 text-xs font-bold tabular-nums text-muted-foreground opacity-0 group-data-[scene=b]/demo:opacity-100"
          >
            <Clock className="size-3.5" aria-hidden />
            Timed
            <span data-timer aria-hidden>
              05:00
            </span>
          </span>
          <button
            type="button"
            data-pause
            aria-label={paused ? "Play demo" : "Pause demo"}
            aria-pressed={paused}
            onClick={() => ctrlRef.current?.togglePause()}
            className="inline-flex size-10 items-center justify-center rounded-lg text-muted-foreground outline-none transition-colors hover:bg-card hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/40 group-data-[motion=reduced]/demo:hidden"
          >
            {paused ? (
              <Play className="size-4 fill-current" aria-hidden />
            ) : (
              <Pause className="size-4 fill-current" aria-hidden />
            )}
          </button>
        </div>
      </div>

      {/* fixed-size stage: scenes are stacked, so swapping never shifts layout */}
      <div className="relative min-h-0 flex-1">
        <CourseScene />
        <QuizScene
          mode={mode}
          onAnswer={(index) => ctrlRef.current?.answer(index)}
          onTryAgain={() => ctrlRef.current?.tryAgain()}
        />
      </div>

      <DemoCursor />
    </div>
  );
}
