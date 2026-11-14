# DELYTE ACADEMY — UI/UX REDESIGN HANDOFF (v2 — Premium SaaS Pass)

> **Status: v2 — Parts 8–14b DONE (admin fully redesigned: shell, dashboard, courses, admins, course/topic workspaces, quiz manager, students, forms — see §0.12 and §0.13). Next: Part 15 (responsive + a11y pass, `next build`/tsc/eslint QA).** Parts 1–7 of v1 are DONE (see `AUDIT-AND-PLAN.md`). v2 is a second, deeper design pass requested after Part 7 QA.
> v2 SUPERSEDES v1 on: brand colour, typography, radii/elevation, layout density and motion tone. Everything else in v1 (preservation rules, phases, working rules) still applies unchanged.
> Where v1 and the "v2 Direction" section below disagree, **v2 wins**.

## 0. v2 Direction — Premium SaaS Pass (READ FIRST)

### 0.1 Why v2
Part 1–7 made the app consistent and calm, but it still reads as "clean admin template". The goal now is a **premium, soft, product-grade SaaS look** — the feel of Linear / Stripe / Notion Calendar / Vercel dashboards: confident typography, soft layered surfaces, generous spacing, and polished micro-interactions. The user explicitly asked for: *redesign everything, especially UI and UX, industry-standard, premium, not boring, Urbanist font, soft premium colours like a SaaS company.*

### 0.1b What "redesign" means in v2 (IMPORTANT)
The owner wants a **new, whole redesign of every page** — new layouts, new hierarchy, new components and new interactions at industry-standard SaaS level. It is **NOT a re-skin**: swapping colours/fonts onto the old layouts is only the foundation (Parts 8–9). From Part 10 onward every page gets a fresh layout designed from scratch (see §0.7), built on the shared design system, while still reusing the existing data hooks/services untouched. If a page looks like "the old page, recoloured", the part is not done.

### 0.2 Hard requirements
1. **Font: Urbanist only.** One family for headings AND body (weights 400–800 via the variable font). Remove Inter and Plus Jakarta Sans entirely. Loaded once, in `app/layout.tsx`, via `next/font/google` as `--font-urbanist`. `--font-display` / `--font-body` remain as aliases so no component breaks. No other `next/font` loaders anywhere. Use `tabular-nums` for stats, timers and scores.
2. **Soft premium palette** (all via tokens in `globals.css`; components never use raw hex/palette classes):
   - Brand: soft indigo (`--primary`, hue ≈ 277) with a tinted `--primary-soft` surface. One restrained brand gradient utility (`.bg-brand-gradient`, indigo → violet) for primary hero CTAs and key highlights only.
   - Neutrals: lavender-tinted ink scale (hue ≈ 280, very low chroma) — never pure grey, never pure black. App background is a barely-tinted off-white; cards are white.
   - Status colours are softened (teal-green success, amber warning, sky info, rose destructive) and always come in a solid + `-soft` surface pair.
   - Dark mode is a first-class theme with the same brand (deep ink-indigo surfaces, lifted indigo primary), not an inversion.
   - The brand is intentionally **centralised in the token block**: swapping the whole product's colour must be a change to ONE file (`globals.css`). If a reference image/palette is supplied, only that block changes.
3. **Shape & elevation:** radius scale 10 / 12 / 14 / 18 px (`--radius: 0.875rem`). Surfaces = white card + hairline border + very soft, layered, low-opacity shadow (`--shadow-card`); floating layers (menus, dialogs, popovers) use `--shadow-float`. No hard shadows, no neon glows, no heavy blur.
4. **Typography scale (Urbanist):** display 40–56 / h1 32 / h2 24 / h3 18–20 / body 15–16 / small 13 / caption 12. Headings 700–800 with −0.02em tracking; body 400–500 with comfortable 1.6 leading. Urbanist runs visually small — body text in dense UI should be 15px, never below 13px.
5. **Layout feel:** more whitespace, clearer hierarchy, one primary action per screen, sections separated by space and hairlines instead of nested cards, content max-widths, sticky contextual headers, and refined data tables (row hover, quiet headers, inline actions).
6. **Motion tone + GSAP interactions:** premium = quiet but alive. GSAP is the interaction engine (already installed with `@gsap/react`, ScrollTrigger and Lenis). All new motion goes through the shared kit — `@/lib/gsap` (single plugin registration, shared eases) and `@/components/motion/*` (`Reveal`, `RevealText`, `CountUp`, `ProgressRing`, `Magnetic`, `SpotlightCard`). See §0.8 for the required interaction catalogue and rules. No infinite decorative loops; everything reduced-motion safe.
7. **UX upgrades expected (not just paint):** clear "what next" on every screen, skeletons that match final layout, optimistic/visible feedback on every action (toast + inline state), confirm dialogs for destructive actions, keyboard support (⌘K / `/` search focus where search exists), accessible focus rings, ≥44 px mobile touch targets, mobile-specific layouts (bottom-safe actions, sheets instead of side panels, tables → stacked rows).
8. **Industry-standard component quality:** every shared primitive (Button, Input, Select, Card, Badge, Tabs, Table, Dialog, Sheet, Dropdown, Tooltip, Skeleton, Empty state, Progress, Avatar) is reviewed against the new tokens and has hover / active / focus / disabled / loading states.

### 0.3 What must NOT change in v2
Everything in v1 §5 (Non-Negotiable Preservation Rules) is unchanged and still binding: no backend/schema/RLS/auth/role changes, no fake data, no removed features, no changed scoring/submission logic. v2 is paint + layout + interaction only. Auth/permission logic changes still require explicit approval.

### 0.4 v2 Parts (one zip each; start from the latest zip; handoff.md travels inside every zip)
| Part | Scope | Status |
|---|---|---|
| 8 | Foundation v2: Urbanist, soft-indigo tokens (light + dark), radius/shadow scale, primitives (Button/Card/Input/Badge/Progress) | DONE |
| 9 | **Design system v2 + GSAP kit:** all remaining primitives restyled (Dialog, Sheet, AlertDialog, Dropdown, Select, Tabs, Table, Tooltip, Switch, Checkbox, Avatar, Textarea, Skeleton shimmer, Sonner), shared `PageHeader`, `EmptyState`, `StatCard`, `SectionHeader`, `DataTableShell`, GSAP motion kit (`lib/gsap.ts`, `components/motion/*`), Lenis fix, `DESIGN-SYSTEM.md` | DONE |
| 10 | NEW student shell (sidebar, command-palette/search, header) + NEW dashboard + NEW course catalogue + NEW course detail | DONE |
| 11 | NEW lesson reader (focus mode, scroll-spy outline, reading-progress scrub) + NEW quiz intro / player / results + NEW progress page | DONE |
| 12 | NEW landing page (full marketing redesign, light + dark) + NEW auth pages | DONE |
| 13 | NEW settings, notifications, feedback, legal pages | DONE |
| 14 | NEW admin shell + ⌘K, dashboard, courses list, admins table, students header/KPIs; fake data removed from admin | DONE |
| 14b | NEW layouts for course workspace (header/tabs/topics tab), topic workspace, quiz manager, students table + detail sheets, course/topic/question forms (sticky action bar + inline validation) | **DONE (this zip)** |
| 15 | Responsive + a11y pass, remove all hard-coded hex (≈247) and raw palette classes (≈81), `next build`/tsc/eslint QA, final changelog | TODO |

### 0.5 Carry-over open items (from v1 Part 7 — still need the owner's decision)
1. ~~`pendingReviews` on `/admin` is hard-coded sample data~~ — **resolved in Part 14**: replaced by the real `NeedsAttention` panel (`useAdminAttention`).
2. Forgot-password flow does not exist (button removed in Part 5). Needs a new `resetPasswordForEmail` flow + reset page if wanted.
3. Landing stats/testimonials are static marketing copy — owner must confirm accuracy. Landing redesign (Part 12) must support dark mode or explicitly force light.
4. Rotate the credentials that were in the original `note.txt`; never commit or share credentials.
5. Run locally: `npm install && npm run build`, then click through student + admin flows (needs real Supabase sessions).

### 0.6 Per-part report format
After every part, report: files changed · what the user will see differently · checks run (tsc / eslint / render) · anything NOT verified · decisions needed. Every zip must contain this `handoff.md` (kept current) and `AUDIT-AND-PLAN.md`.

### 0.7 Page-by-page redesign briefs (new layouts — not re-skins)
Never invent data. Where a design shows a number, it must come from the existing hooks/services; otherwise show a real empty state.
- **Landing (`/`)**: sticky translucent navbar that hides on scroll-down; hero with `RevealText` headline, one primary + one secondary CTA (`Magnetic`), a product-preview built from real UI components (no fake stats/avatars); bento-grid feature section; 3-step "how it works"; FAQ accordion; closing CTA band; rich footer. Must support dark mode (or explicitly force light). Static marketing numbers/testimonials only if the owner confirms they are true.
- **Auth (`/login`, `/sign-up`)**: split layout — focused form column + brand panel (static gradient wash, benefits list, no fake dashboard); inline validation, password show/hide, loading state on submit; existing auth logic untouched.
- **Student dashboard**: greeting + single "Continue learning" hero with `ProgressRing`; KPI row of `StatCard`s; "Up next" (real upcoming quizzes); enrolled-courses row; compact activity timeline. Answer "what should I do next?" in one glance.
- **Course catalogue**: sticky search + filter chips + sort; grid of `SpotlightCard` course cards; skeleton grid matching final layout; real empty/no-results state.
- **Course detail**: cover/hero, sticky right rail (enroll/progress), curriculum accordion with per-topic completion states, clear start/resume CTA.
- **Lesson reader**: focus mode, ~68ch column, sticky scroll-spy outline, thin reading-progress bar (ScrollTrigger scrub), prev/next footer, mark-complete micro-celebration (SVG check draw).
- **Quiz**: instructions screen → player (question left, numbered navigator right / sheet on mobile, sticky timer + progress, keyboard shortcuts preserved) → results (`ProgressRing` + `CountUp` score, per-question review). Scoring/submission logic untouched.
- **Progress**: ring + stats, streak, weekly goal, consistency heatmap, achievements — real data only.
- **Settings**: left nav on desktop / tabs on mobile, grouped sections, sticky unsaved-changes bar, danger zone separated.
- **Notifications**: grouped by day, unread state, mark-all-read, empty state.
- **Admin**: compact sidebar + breadcrumb topbar, KPI row, `DataTableShell` tables with search/filter toolbars and row actions, forms with sticky action bar and inline validation, quiz manager as split list/preview, destructive confirms. admin vs super_admin permissions preserved exactly.

### 0.8 GSAP interaction catalogue + rules
Required interactions (build with the kit, only where they aid comprehension):
1. Page-load stagger of primary blocks (`Reveal` with `selector`).
2. Scroll-in reveals for long pages (`Reveal`, ScrollTrigger `once`).
3. Number count-up on KPIs and scores (`CountUp`); ring/bar fill on progress (`ProgressRing`, `ProgressBar`).
4. Cursor-tracking glow on course/feature cards (`SpotlightCard`); magnetic primary CTAs on marketing pages (`Magnetic`).
5. Headline word-mask rise on landing/auth (`RevealText`).
6. Sliding active indicator in sidebar/tabs; navbar hide-on-scroll; subtle landing parallax.
7. Reading-progress scrub bar in the lesson reader; SVG check-draw on topic complete; gentle option-select feedback in quizzes.
Rules: animate `transform`/`opacity` only; no layout-thrashing properties; no infinite loops except loading shimmers; every tween gated by `prefersReducedMotion()`; clean up via `useGSAP` scope; use `clearProps` after entrances so hover transforms still work; never delay access to content or block input; import GSAP only from `@/lib/gsap`.

### 0.9 Part 11 report (lesson reader · quiz · progress)

**Lesson reader (`/dashboard/topics/[topicId]`)**
- New left rail (xl+): back link, `ProgressRing` course progress, scroll-spy "On this page" outline with a single GSAP-slid brand marker, "Test yourself". Below xl: collapsible outline + sticky mobile action bar.
- **Focus mode** (xl+ button in the header): hides the rail, centres a ~48rem column. Stored per device in `localStorage` (`delyte:lesson-focus`, try/catch-safe).
- Reading-progress bar is now a ScrollTrigger **scrub** (`scrub: 0.35`, exact under reduced motion) with a ResizeObserver refresh for late-loading images/maths.
- Completion moment uses new `AnimatedCheck` (SVG path draw + spring pop, plays only on the false→true flip, never on revisit).
- Objectives / prerequisites / summary restyled ("Key takeaways"); video frame on tokens. `handleMarkComplete` is byte-for-byte unchanged.

**Quiz**
- Intro: split layout (hero + "Start quiz" brand CTA, at-a-glance facts list, instructions, attempts note, keyboard shortcuts). `time_limit = 0` now reads "No time limit" (previously "0 min").
- Player: **all logic untouched** (resume, timer, auto-submit, shortcuts, scoring, submit payload). Render layer rebuilt: sticky bar under the app header (`top-16` — the old `top-0` sat behind the 64px header), question left / numbered navigator rail right (sheet on mobile), per-question fade/slide, GSAP spring on the picked option's letter badge, confirm sheet kept. Infinite `animate-pulse` on the low-time clock removed (colour + aria-live only).
- Results: `ProgressRing` (brand on pass, warning on fail) + `CountUp` score, staggered entrance, same attempt-loading logic. Fixed: difficulty badge map was keyed `Easy/Medium/Hard` but data is lowercase, so styling never applied.

**Progress (`/dashboard/progress`)**
- New layout: overall ring + 4 `StatCard`s → streak + weekly goal → courses / heatmap / activity → quiz analytics → achievements + weak areas. Real empty states for no courses / no quizzes / no weak areas. Skeleton waits for auth + data.
- **Fake / wrong data removed (owner rule: never show invented numbers):**
  1. "Study Time 32h 45m" was hard-coded → stat removed (replaced by real "Average quiz score"; "—" until a quiz is taken). Real study time would need session tracking that does not exist.
  2. `ConsistencyHeatmap` was a hard-coded grid with "26 / 30" → rebuilt from real `topic_progress.completed_at`.
  3. Recent-activity sorted by `new Date("2 hours ago")` (NaN) → now sorts on a real timestamp (`ActivityItem.at`).
  4. "This week" strip lit days from any past week → now current Monday-first week only.
  5. Weak areas could never populate and per-course topic counts were always 0: `services/progress.ts` selected `course:courses(title)` / `topic:topics(course:…)` without `id`, but the hook groups by those ids → ids added to the selects.
  6. `topic_progress` only has rows for *completed* topics, so "N/N topics" was always 100%. Added one read-only query for published `topics` of enrolled courses; if it fails the UI falls back to the completed count.
  7. "Practice Now" button had no link → "Practice again" now opens that topic's quiz.
- Hook now returns `summary` (typed `ProgressSummary`) instead of `overviewStats`; `overview-stats.tsx` deleted. All hex/palette classes in the hook and chart (`#10B981`, emerald/blue/violet…) → tokens (`var(--chart-1)` etc.).

**Checks run:** TypeScript *parser* pass (0 syntax errors) on all 220 `src` files; every `@/` and relative import and named export resolves; grep: no hex or raw palette classes and no unused imports in the files changed this part.
**NOT verified:** `tsc` type-check, `eslint`, `next build` and any visual/browser render — this environment has no `node_modules` and no network. Run `npm install && npx tsc --noEmit && npm run lint && npm run build` first, then click through: a lesson (focus mode, outline, complete), a timed quiz (start → refresh to resume → submit → results), and `/dashboard/progress` with a student who has quiz attempts.

**Decisions needed from the owner**
1. Quiz `attemptNumber` is still hard-coded to `1` in the player (existing `TODO`), and `attempt_limit` is displayed but never enforced. Left untouched (business logic); say if you want it fixed.
2. Real "study time" would need a time-tracking table. Stat removed rather than faked — confirm.
3. The extra published-topics query in `services/progress.ts` assumes a student can read `topics` under RLS (the course pages already do). Confirm on a real session.
4. Weekly goal target is a fixed `5` topics in the hook; make it user-configurable?

### 0.10 Part 12 report (landing · auth)

**Landing (`/`)** — server-component page; navbar (hide-on-scroll, anchors, theme toggle, `Sheet` mobile menu) → hero (`RevealText`, `Magnetic` CTA, interactive *sample* question, desktop parallax) → bento features → 3-step how-it-works → real featured courses (section hidden when none) → accessible FAQ → CTA band → footer. Light + dark via tokens only. `DelyteLoader` splash removed from the page (it blocked content); the component file remains, unused.
**Auth** — `AuthShell` (form + static brand panel with benefit cards), `AuthField` with `error`/`hint`/`ref`, inline validation on both pages (same rules and toast messages as before; first invalid field is focused). Auth calls, redirects and the verification modal are unchanged.
**Removed (unverifiable / non-functional):** stats strip, testimonials, "thousands of students" claim, fake footer course list, newsletter form. **Fixed:** footer `/signup` → `/sign-up`; footer `tel:` now matches the number shown.
**Checks run:** TS parser over 320 files (0 syntax errors), all imports resolve, `noUnusedLocals` clean on touched files, no hex / raw palette / direct gsap / console in touched files. **NOT verified:** `tsc`, `eslint`, `next build`, visual render (no `node_modules`, no network).
**Decisions needed:** confirm stats/testimonials (if wanted back); delete or restore `DelyteLoader`; footer phone number; whether sign-up should keep the form after a failed API call; where course cards should send logged-out visitors; forgot-password flow.

### 0.11 Part 13 report (settings · notifications · feedback · legal)
Full detail is in `AUDIT-AND-PLAN.md` → Part 13. Summary: settings gets a deep-linkable section nav, mobile tabs fixed under the app header and a sticky unsaved-changes bar; notifications gets a new layout, counts on filters, shared EmptyState and a rebuilt card (also fixed "Just now" for anything under an hour); feedback is now an honest mailto form (no backend exists); legal pages are tokenised (dark mode) with Urbanist and the shared Logo/ThemeToggle, wording untouched.
**Checks run:** TS parser (0 syntax errors), imports resolve, no unused locals / hex / raw palette / direct gsap in touched files. **NOT verified:** `tsc`, `eslint`, `next build`, any render.
**Decisions needed:** real feedback table vs email; support email address (`delyte780@gmail.com` vs `support@delyteacademy.com`); legal text review; confirm preferences persist.

### 0.12 Part 14 report (admin)
**New / rebuilt**
- **Shell:** `AdminLayoutClient` (one profile fetch shared by sidebar + topbar, skip-link, `max-w-[1400px]` content, `h-dvh`), `AdminSidebar` (shared `Logo`, GSAP-slid active pill via `@/lib/gsap`, ≥44px targets, Esc closes drawer, `aria-current`, collapse persists only in memory), `AdminTopbar` (search trigger + **⌘K**, shared `ThemeToggle`, notifications, account menu), `AdminBreadcrumb` (UUIDs shown as "Details"), `AdminPageShell` (now `PageHeader` + breadcrumb; same props, plus optional `actions`), new `AdminCommandPalette` (jump to pages + search all courses via `courseService.getCourses()`).
- **Dashboard (`/admin`):** `PageHeader` greeting → 4 `StatCard`s (skeleton while loading) → "Needs attention" + Quick actions (first on mobile) beside enrollment chart + recent activity → recent-courses `DataTableShell` (stacked rows on mobile) → platform snapshot grid.
- **Courses (`/admin/courses`):** `StatCard`s, search, status chips with counts, skeleton grid, real empty / no-results states (the old empty-state button did nothing), stretched-link `SpotlightCard` cards, **delete now asks for confirmation** (was immediate).
- **Admins (`/admin/admins`):** `AdminPageShell` + `StatCard`s + `DataTableShell`, search with clear, "Showing x of y", real empty states; `window.confirm` replaced by `AlertDialog` (same revoke/delete calls). Row opens the detail sheet from a real button (keyboard reachable).
- **Students (`/admin/students`):** `PageHeader`, KPI cards on `StatCard`; table/toolbar/sheet logic untouched.
- **Course workspace + topic workspace:** `StatsBar` is now `StatCard`-based.
- All `gsap` / `@gsap/react` imports in `components/admin` and `app/admin` now go through `@/lib/gsap` (26 files); removed the looping image shimmer in `CourseThumbnail`, GSAP overshoot menu in `CourseCardMenu` (now the shared `DropdownMenu`).

**Fake / wrong data removed (owner rule)**
1. `pendingReviews` ("Physics Fundamentals, Economics 101", "3 quizzes", "5 topics") → real `NeedsAttention` (draft courses, quizzes with no questions, topics with no content; each group fails independently and says so).
2. Sidebar + topbar hard-coded "Super Admin / admin@delyte.academy / DA" → real profile (name, email, role, initials).
3. KPI/Students cards showed a fake "Live" / "+0%" trend pill → removed.
4. Course page `recentActivity` constant ("Published topic Geometry & Trigonometry"…) → removed (the Overview tab already uses the real `useCourseActivity`).
5. Topic workspace tiles "Lessons 6 / Resources 4 / Practice Sets 2 / Questions 24 / Completion 82%" + fake activity list → replaced by real figures from the topic (reading time, objectives, attachments, external links); fake activity card removed.
6. Course workspace tile labelled "Quiz Questions" actually counted quizzes → relabelled "Quizzes".
**Broken links fixed:** quick actions pointed to `/admin/topics`, `/admin/questions`, `/admin/analytics` (none exist); welcome button pointed to `/admin/courses/new` (real route is `/create`). Quick actions now only list real routes and hide super-admin links from admins (same rule as the sidebar).
**Colour debt in admin:** `text-white/black`, `dark:text-white`, `#6D5BF5` → tokens. (`quiz/types.txt` is a stray non-compiled file and still has old code.)

**Checks run:** TS parser over 322 `src` files (0 syntax errors); every `@/` and relative import and named export resolves (0 problems); no unused imports in files created/rewritten this part. **NOT verified:** `tsc` type-check, `eslint`, `next build`, any browser render (no `node_modules`, no network). The new `useAdminAttention` queries (`questions(count)` embed on `quizzes`, `topics.or("content.is.null,content.eq.")`) assume the FK/column names used elsewhere in the app — confirm on a real session.

**Decisions needed**
1. Removed the **Settings** link from the admin sidebar: `/admin/settings` has no page (404). Say if you want a page built instead.
2. Removed the two permanently disabled "Invite Student" / "Add Student" buttons from Students (no handlers, no backend). Restore when the flow exists?
3. Course/topic/quiz-manager/student-table/form **layouts** are Part 14b (they're tokenised, on the GSAP kit and free of fake numbers, but not re-laid-out). OK to continue there next?
4. Topic workspace "Practice Sets / Questions / Analytics" tabs are still placeholders — keep, hide, or build?
5. Sidebar collapse state isn't persisted; persist per device like the lesson focus mode?

### 0.13 Part 14b report (admin workspaces · quiz manager · students · forms)
**New shared building blocks (`components/admin/workspace/`)**
- `WorkspaceHero` + `WorkspaceMedia` — one header for course and topic workspaces (slim cover strip, overlapping media tile, title + status/meta row, actions; stacks on mobile). The old looping `animate-ping` dot and GSAP entrance timelines are gone.
- `StatStrip` — one card with divided cells (CountUp numbers) replacing rows of separate StatCards on workspace pages.
- `WorkspaceSkeleton` — layout-matching loading state; replaces the full-page spinner on both workspaces.
- `WorkspaceTabs` (rewritten, same props + optional `count`) — sticky underline tab bar with one GSAP-slid indicator, `role=tablist`, Arrow/Home/End keys, scrolls horizontally on phones. Pages now render `role=tabpanel` and respect reduced motion.

**Pages / components redesigned**
- **Course workspace:** new hero, `StatStrip`, tab counts (topics/students). **Topics tab** is now an ordered curriculum list (number, title link, difficulty, minutes, status, row menu), status chips with counts, sort incl. *Curriculum order* (default, by `order_index`), real empty state with “Add first topic”. **Topic delete now asks for confirmation** (was immediate). **Students tab** = `DataTableShell` table (stacked rows on mobile) with search + progress bars.
- **Topic workspace:** new hero (Edit / Publish / Unpublish), `StatStrip` of real figures.
- **Quiz manager:** split layout — questions list left, sticky settings rail right (stacks on mobile); `StatStrip` header stats; floating bulk-action bar; shared EmptyState; question numbers continue across pages (were restarting at 1 on page 2).
- **Students:** toolbar (clear button, labels, mobile grid); table via `DataTableShell` + mobile stacked rows; keyboard-reachable row button; **delete uses `AlertDialog`** and now actually removes the row (the old table used a *separate* `useAdminStudents()` instance, so the list never updated). `as any` casts removed from the page. **Detail sheet** rebuilt as Overview / Courses / Activity tabs with a pinned admin-controls footer; grant/revoke admin, suspend and delete each ask for confirmation (same `updateStudent` / `deleteStudent` calls). “Message” is now a real `mailto:` link (it had no handler).
- **Forms (course create/edit, topic create/edit):** `CourseHeader` / `TopicHeader` → shared `PageHeader` with breadcrumb (one set of save actions: the sticky bar). `ActionBar` is now a floating card with live status (“Saving…”, “N fields need attention”). Inline validation now shows on **all** fields after a failed submit (was: only fields the user had blurred), with `aria-invalid` / `aria-describedby` / `role=alert`. Preview cards are sticky on desktop. **Question dialog:** inline errors (question text, options, correct answer) instead of a silently disabled Save; sticky footer.

**Fake / wrong data and bugs removed (owner rule)**
1. Course **edit** page showed hard-coded sample data: “Created by Super Admin · Jan 15, 2025”, “Topics 24 / Practice sets 12 / Questions 320”, and a Statistics card “Enrolled 1,240 / Completion 68%”. Metadata card now shows real creator / created / updated; fake counts and `StatisticsCard` (deleted) removed. Breadcrumb used a mock course title → now the real title.
2. Create-course “Save draft”: `saving` was set before validation and never reset on a validation error (buttons stuck disabled), and image upload ran outside `try`. Validation now runs first and the upload is inside `try/finally`. Publish got the same treatment.
3. Topic create/edit: removed `console.log` of form data; publish showed “Topic saved as draft.”; `try/finally` with no `catch` swallowed errors → now `catch` + error toast.
4. “Completed” badge in the course students tab was `bg-primary text-primary` (invisible text) → `StatusBadge`.
5. Dead files removed: `course-workspace/stats-bar.tsx`, `courses/statisticsCard.tsx`.

**Checks run:** TS parser over all 322 `src` files (0 syntax errors); every `@/` and relative import and named/default export resolves (0 problems); `noUnusedLocals` clean on every file created/changed this part; no hex / `rgba()` / raw palette / `text-white` anywhere in `components/admin` or `app/admin`. **NOT verified:** `tsc` type-check, `eslint`, `next build`, any browser render (no `node_modules`, no network). Run `npm install && npx tsc --noEmit && npm run lint && npm run build`, then click through: course workspace (tabs by keyboard, topic delete, curriculum sort), topic workspace publish/unpublish, quiz manager (add / import / bulk select / settings rail), students (search, open sheet, each confirm dialog), create/edit course and topic with empty fields (errors appear on all fields, buttons recover).

**Decisions needed**
1. Question dialog now blocks saving when a multiple-choice/true-false question has an empty option or no correct option, or a short-answer has no answer. Previously only empty question text blocked. Keep (recommended) or relax?
2. Course workspace **Analytics / Settings** and topic workspace **Practice Sets / Questions / Analytics** tabs are still placeholders (no backend). Keep, hide, or build?
3. Topic edit page still saves only title/description/time/difficulty/status (unchanged); content is edited in the workspace Content tab.
4. Student “Message” opens the mail client; a real in-app messaging flow doesn’t exist.
5. Course/topic **Content tab, Overview tabs and the Upload centre** are tokenised and fake-data-free but were not re-laid-out in this part; say if you want them done before Part 15.

---

# (v1 brief follows — still valid except where §0 overrides)

## 1. Project Overview

Delyte Academy is an existing online learning platform built with Next.js and Supabase.

The objective is to transform the existing application into a premium, modern, production-quality EdTech SaaS platform.

This is a UI/UX redesign and frontend experience improvement project.

**This is NOT a request to rebuild the application from scratch.**

The existing application already has working features, authentication, database relationships, business logic and user workflows. Your responsibility is to improve the visual experience, usability, accessibility, responsiveness and overall product quality while preserving the existing functionality.

## 2. Primary Objective

Transform Delyte Academy into a polished learning platform comparable in design quality and user experience to established SaaS and EdTech products.

The final result should feel:

- Premium and professional.
- Modern and visually distinctive.
- Intuitive and easy to navigate.
- Responsive across desktop, tablet and mobile.
- Consistent throughout all pages.
- Accessible and user-friendly.
- Fast and lightweight.

Avoid generic AI-generated dashboard aesthetics.

Do not simply place everything inside rounded cards. Prioritise visual hierarchy, whitespace, typography, alignment and intentional component design.

## 3. Existing Technology Stack

The existing project uses:

- Next.js
- React
- Supabase
- TypeScript/JavaScript as currently implemented
- Existing authentication and authorization
- Existing database schema and Supabase queries

IMPORTANT:

Inspect the actual repository before making assumptions about the versions, structure or implementation.

Do not introduce unnecessary dependencies.

Reuse existing libraries and components wherever appropriate.

## 4. Existing Application Functionality

The platform already includes student-facing functionality such as:

- Student authentication and account access.
- Student dashboard.
- Course discovery and enrollment.
- Course topics and lessons.
- CBT quizzes and assessments.
- Student progress tracking.
- Notifications.
- Quiz results.
- Course completion tracking.

The administrative side includes:

- Admin dashboard.
- Super admin and admin roles.
- Course creation and management.
- Topic creation and management.
- Quiz creation and management.
- Administrative access restrictions.

The project uses Supabase for its backend.

Inspect the existing source code to establish the exact current functionality before modifying anything.

Some features may have additional functionality not listed here. Preserve those too.

## 5. Non-Negotiable Preservation Rules

These rules are extremely important.

DO NOT:

1. Rebuild the backend.
2. Replace Supabase with another backend.
3. Change the existing database schema unnecessarily.
4. Remove existing features.
5. Break authentication or session handling.
6. Change admin/super_admin role permissions.
7. Weaken or remove Row Level Security policies.
8. Remove existing API integrations.
9. Replace working database operations with dummy data.
10. Hardcode information that should come from Supabase.
11. Introduce fake functionality to make the interface look complete.
12. Break existing routes or navigation.
13. Remove existing validation and error handling.
14. expose environment variables or sensitive credentials.

Preserve existing functionality and data flows.

If a change to existing business logic is genuinely necessary, explain why and request approval before implementing it.

## 6. Design Direction

Use a premium, soft, modern SaaS aesthetic (see §0 — v2 Direction for the binding palette, Urbanist typography and elevation rules).

Design inspiration:

- Linear: clean interface, navigation and interactions.
- Notion: organised learning content and information hierarchy.
- Vercel: polished typography, spacing and visual consistency.
- Coursera: learning workflows and course discovery.

Do not copy these products. Use them as design references.

### Visual principles

- Strong typographic hierarchy.
- Consistent spacing system.
- Carefully selected colour palette.
- Restrained use of shadows.
- Subtle gradients where appropriate.
- Consistent border radiuses.
- High-quality icons.
- Beautiful empty states.
- Meaningful micro-interactions.
- Consistent buttons and form elements.
- Clear visual feedback for user actions.

Avoid excessive gradients, unnecessary animations, excessive glassmorphism and generic dashboard layouts.

## 7. Student Experience Redesign

Prioritise the student experience.

### Student dashboard

Improve:

- Welcome section.
- Learning overview.
- Enrolled courses.
- Learning progress.
- Continue learning section.
- Upcoming or available assessments.
- Recent activities.
- Notifications.
- Relevant quick actions.

The dashboard should immediately communicate what the student should do next.

### Course discovery

Improve:

- Course catalogue.
- Course cards.
- Search and filtering if already supported.
- Course descriptions.
- Course detail pages.
- Enrollment experience.
- Empty and loading states.

Make course discovery visually engaging and intuitive.

### Learning experience

This is one of the most important areas.

Improve the experience of:

- Opening a course.
- Navigating between topics.
- Accessing lessons.
- Reading lesson content.
- Moving between learning materials.
- Tracking completion.

The learning interface should minimise distractions and make it easy to concentrate.

### CBT and quiz experience

Improve:

- Quiz instructions.
- Starting assessments.
- Question presentation.
- Answer selection.
- Question navigation.
- Progress indicators.
- Submission experience.
- Results presentation.
- Feedback and review states where supported.

Prioritise clarity and usability.

Do not change assessment logic, scoring calculations, answer validation or submission behaviour.

### Progress and results

Make learning progress easier to understand through clear visual indicators, meaningful statistics and well-organised result layouts.

Do not invent statistics or display information that does not exist in the backend.

## 8. Administrative Experience Redesign

The administrative dashboard should feel like a professional SaaS content management workspace.

Improve:

- Dashboard overview.
- Navigation.
- Course management.
- Course creation forms.
- Topic management.
- Quiz creation and management.
- Data tables.
- Search and filtering where supported.
- Confirmation dialogs.
- Form validation feedback.
- Empty states.
- Loading states.
- Success and error messages.

Make administrative workflows efficient.

An administrator should be able to perform common tasks without unnecessary navigation or confusion.

Preserve the distinction between admin and super_admin permissions.

## 9. Responsive Design

The application must work properly on:

- Desktop computers.
- Laptops.
- Tablets.
- Mobile phones.

Pay special attention to:

- Navigation behaviour.
- Sidebar responsiveness.
- Course cards.
- Quiz questions.
- Tables.
- Forms.
- Modals and dialogs.
- Content overflow.
- Touch targets.

Do not simply shrink the desktop interface to fit a phone.

Design intentional mobile experiences.

## 10. Design System

Create or improve a reusable design system.

Establish consistent:

- Colour tokens.
- Typography.
- Spacing.
- Border radiuses.
- Shadows.
- Buttons.
- Inputs.
- Cards.
- Navigation elements.
- Modals.
- Dropdowns.
- Status indicators.
- Loading skeletons.
- Empty states.

Avoid creating different versions of the same component unnecessarily.

Use reusable components and maintain the existing project conventions.

## 11. Animations and Interactions

Use animations intentionally.

Examples:

- Subtle page transitions.
- Button hover and active states.
- Navigation transitions.
- Dropdown animations.
- Progress animations.
- Card interactions.
- Loading transitions.
- Feedback when completing actions.

Animations must be smooth, restrained and purposeful.

Respect reduced-motion preferences.

Avoid animations that interfere with learning or slow down the interface.

## 12. UX Requirements

Every major workflow should have appropriate:

- Loading states.
- Error states.
- Success feedback.
- Empty states.
- Disabled states.
- Confirmation where necessary.
- Form validation.
- Accessible labels.
- Keyboard interactions.

Do not leave the user wondering whether an action worked.

Reduce unnecessary steps in existing workflows without changing their underlying behaviour.

## 13. Implementation Strategy

Work in stages.

### Phase 1: Repository Audit

Before modifying any files:

1. Inspect the complete project structure.
2. Identify the existing routes and pages.
3. Identify shared layouts and components.
4. Understand authentication and authorization.
5. Inspect Supabase integrations.
6. Identify the existing styling system.
7. Identify installed dependencies.
8. Identify existing reusable components.
9. Identify areas with existing UI/UX problems.

Produce a concise audit report.

Identify what should be retained, improved, refactored or replaced.

Do not start implementation before completing the audit.

### Phase 2: Design Planning

Develop a cohesive visual direction.

Define:

- Colour system.
- Typography.
- Spacing system.
- Component styles.
- Navigation patterns.
- Student dashboard layout.
- Course discovery layout.
- Learning interface.
- CBT interface.
- Administrative dashboard.

Explain the proposed changes before implementation.

### Phase 3: Foundation

Implement the shared design system and reusable components.

Make sure the foundation is consistent before redesigning every page.

### Phase 4: Student Experience

Redesign student-facing pages and workflows incrementally.

Test existing functionality after each major change.

### Phase 5: Administrative Experience

Redesign the admin and super_admin experience while preserving authorization and administrative workflows.

### Phase 6: Responsive and UX Refinement

Test mobile, tablet and desktop layouts.

Refine accessibility, interactions, loading states and error states.

### Phase 7: Quality Assurance

Run:

- Production build.
- TypeScript checks where applicable.
- Existing lint checks.
- Relevant tests.
- Authentication checks.
- Student workflow checks.
- Admin workflow checks.
- Quiz and submission checks.
- Responsive layout checks.

Fix regressions before considering the work complete.

## 14. Working Rules

- Work directly within the existing repository.
- Do not replace the entire application with a new scaffold.
- Do not delete existing functionality.
- Keep components modular and maintainable.
- Follow the existing folder structure unless a refactor is justified.
- Reuse existing Supabase queries and server actions.
- Avoid unnecessary dependencies.
- Avoid duplicating components.
- Keep code readable and maintainable.
- Do not silently ignore errors.
- Do not claim a feature works without verifying it.

If something is unclear, inspect the implementation before making assumptions.

If you discover a feature that cannot be preserved safely, explain the issue before proceeding.

## 15. Definition of Success

(v2 addition: the product also uses Urbanist exclusively, shares one soft-indigo brand across student/admin/landing/auth, and contains no hard-coded hex colours outside the token block.)


The redesign is successful when:

1. Delyte Academy looks like a professionally designed EdTech SaaS product.
2. The student experience is intuitive and enjoyable.
3. The administrative experience is efficient and polished.
4. Existing functionality remains intact.
5. Authentication and authorization still work.
6. Supabase integrations remain functional.
7. Existing data is preserved.
8. The application is responsive.
9. The interface is consistent across all pages.
10. The application builds successfully.

## Final Instruction

Think like a senior product designer, UX engineer and experienced frontend architect.

Do not prioritise visual appearance over usability.

Do not prioritise speed of implementation over preservation of working features.

The objective is to elevate the existing Delyte Academy product into a premium, production-quality learning platform while respecting the existing architecture and functionality.

Start with the repository audit. Do not immediately rewrite the application.

Work incrementally and report completed changes, modified files, tests performed and any outstanding issues after each phase.
---

## Part 16 (proposed): Hero demo animation
Self-playing, interactive GSAP product demo in the landing hero (desktop only). Full spec, storyboard, guards and acceptance checklist: see `HERO-ANIMATION-HANDOFF.md` in the project root.
