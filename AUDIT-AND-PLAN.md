# Delyte Academy — Phase 1 Audit + Phase 2 Design Plan
(Part 1 of the redesign. No source files were modified in this part.)

## 1. Stack (actual, from repo)
Next.js 16.2.10 (App Router) · React 19.2 · TypeScript · Tailwind v4 (CSS-first, `@theme inline`) · shadcn/ui (new-york, slate) ·
Supabase (`@supabase/ssr`) · GSAP + `@gsap/react` + Lenis · next-themes · Sonner · Recharts · TipTap editor · KaTeX · lucide-react.
Structure: `src/app` (routes) · `components` · `features` (landing) · `hooks` · `services` (Supabase queries) · `context` · `lib` · `types`.
~41.7k lines TS/TSX. Baseline: `tsc --noEmit` clean. `eslint`: 1 error (`hooks/useTopic.ts:30` setState inside effect), 41 warnings. 40 `console.log`s.
No existing tests. Full `next build` was not run (needs Supabase env vars and Google Fonts network access).

## 2. Routes
Public: `/`, `/login`, `/sign-up`, `/privacy-policy`, `/terms-of-service`, `/auth/callback`
Student: `/dashboard`, `/dashboard/courses`, `/dashboard/courses/[courseId]`, `/dashboard/topics/[topicId]`, `.../quiz` (+`/player`, `/result`, `/no-quiz`), `/dashboard/progress`, `/dashboard/notification`, `/dashboard/settings`, `/dashboard/feedback`
Admin: `/admin`, `/admin/courses` (+create, `[id]`, `[id]/edit`, topics create/`[topicsId]`/edit), `/admin/students`, `/admin/admins`
API: `/api/account/delete`, `/api/admin/admins(/[id])`, `/api/admin/students/[id]`

## 3. Auth / authorization (MUST be preserved untouched)
- `middleware.ts` → `lib/supabase/middleware.ts#updateSession`: refreshes session, redirects unauthenticated `/dashboard`, redirects logged-in users off auth pages by role, blocks non-admins from `/admin`.
- `app/admin/layout.tsx` re-checks role server-side (admin | super_admin). Roles in `constants/roles.ts`. `lib/auth/guards.ts` for API routes.
- Student layout is a client component using `ProfileProvider`, `NotificationProvider`, `EnrollmentProvider`.

## 4. Styling system
- Tokens in `globals.css` (oklch). Light = navy/blue; dark = navy; **`.dark .student-theme` = emerald** override. So light and dark student modes have different brand colours (inconsistent).
- Fonts loaded 2×: root layout (Inter + Jakarta) AND again in `dashboard/layout.tsx` (`--font-display`, `--font-body`).
- 219 hardcoded hex/rgb colours in TSX; 60 files use GSAP; only 3 places respect `prefers-reduced-motion`.
- Dashboard shell: two large blurred "aura" blobs + infinite GSAP loop (decorative, costly, the "generic AI dashboard" look the brief warns against).
- Everything is rounded `Card`s.

## 5. UI/UX problems found
1. Student shell: blobs + infinite animation; no reduced-motion handling; `console.log(setLoading)` left in layout; layout returns `null` while profile loads (blank flash).
2. Brand inconsistency between light/dark/student themes; duplicated font loaders.
3. No `loading.tsx` / `error.tsx` / `not-found.tsx` route boundaries anywhere.
4. Motion is ad-hoc per page (GSAP per component) instead of shared, reduced-motion-aware utilities.
5. Very large page files (login 776, sign-up 772, hero 773, quiz-page 703) with duplicated auth-form markup.
6. Hardcoded colours bypass tokens, so dark mode and theming are fragile.
7. Mobile: student sidebar is a drawer (good); quiz player, admin tables and question dialogs need a dedicated mobile pass.

## 6. Data-integrity findings (handoff rules 10 & 11) — need your decision
- `app/admin/page.tsx` passes **hardcoded `pendingReviews`** ("Physics Fundamentals, Economics 101"…) from `admin-home/dashboard-data.ts`. This is fake data shown to admins. Recommend: derive from real Supabase data (e.g. draft courses) or remove the panel. **Needs your approval** (touches data flow).
- `dashboard-data.ts` also exports hardcoded `kpiStats` ("12,480 students"…). Currently not imported by pages (KPI cards use hooks) — safe to delete later, confirm.
- `lib/courseData.ts` (Pexels, fake students/ratings) is not imported anywhere — dead code. Landing `features/courses-section` / `testimonials` use static marketing content (acceptable for a marketing page, but must not look like live data).
- `middleware.ts` matcher and `isAuthPage` use `/signup`, but the real route is `/sign-up` → logged-in users are not redirected away from `/sign-up`. Auth-logic change: **not touched without approval.**
- Next 16 deprecates `middleware.ts` in favour of `proxy.ts`; works today, informational.

## 7. SECURITY — action required
`note.txt` in your zip contains a Supabase DB password and several account emails/passwords in plain text.
I did NOT use them and removed `note.txt` from the zip I return. Please (a) rotate that DB password and those account passwords, (b) make sure `note.txt` is not committed to git, (c) never put credentials in files you share.

## 8. Keep / Improve / Refactor / Replace
- KEEP untouched: `services/*`, `hooks/*` data logic, `context/*`, `lib/supabase/*`, `lib/auth/*`, middleware, API routes, quiz scoring/submission logic, validators, parsers, TipTap editor internals.
- IMPROVE: tokens, `ui/*` primitives (button, input, card, badge, skeleton, table, dialog), sidebar/header, dashboard, course cards/detail, topic reader, quiz UI, results, progress, settings, admin screens.
- REFACTOR: shared `PageHeader`, `EmptyState`, `StatusBadge`, `ProgressBar`, motion helper (reduced-motion aware), auth form shell.
- REPLACE: aura blobs, hardcoded colours → tokens, duplicate font loaders, ad-hoc empty states.

## 9. Design plan (Phase 2) — for your approval
**Direction:** "Calm focus" — Linear/Vercel precision, Notion-style reading, Coursera-clear flows.
- **Colour:** one brand across light + dark: deep-ink neutrals (cool-gray scale) with a single confident emerald accent (matches the existing student theme, so brand continuity). Semantic success/warning/danger/info tokens. Remove the separate navy "admin" brand; admin shares the system with a neutral-ink accent.
- **Type:** Inter (body) + Plus Jakarta Sans (headings) already loaded → keep, remove duplicate loaders. Scale: 12/13/14/16/20/24/32/40, tight tracking on headings, tabular numbers for stats/timers.
- **Spacing/radius/shadow:** 4px grid; radii 6 / 10 / 14; hairline borders instead of shadows; one soft elevation for popovers only.
- **Layout:** Student — quiet left rail (no blobs), page header with one primary action; dashboard opens with a "Continue learning" hero + 3 real stats; sections separated by whitespace/dividers, not nested cards. Reader — centred 68ch column, sticky topic outline, progress hairline, prev/next bar. Quiz — distraction-free player: question left, numbered navigator (drawer on mobile), sticky timer/progress, clear submit-confirm dialog. Admin — compact sidebar, breadcrumb topbar, dense data tables with toolbars, confirm dialogs, inline validation.
- **Motion:** one shared reduced-motion-aware helper; 150–250ms fades/slides; progress bar fill; no infinite loops.
- **Mobile:** bottom-safe touch targets ≥44px, tables → stacked rows, quiz navigator in a sheet.

## 10. Proposed parts (one zip each)
- Part 2: Foundation — tokens, `ui/*` primitives, shared components, motion helper, font cleanup, remove blobs.
- Part 3: Student shell + dashboard + course discovery/detail.
- Part 4: Topic reader + quiz (instructions, player, result) + progress.
- Part 5: Settings, notifications, auth pages, landing polish.
- Part 6: Admin shell, dashboard, courses/topics tables & forms.
- Part 7: Admin quiz/students/admins, responsive + a11y pass, lint/tsc/build QA.

---
## Part 2 — Foundation (DONE)
Changed: `globals.css` (unified emerald brand tokens for light + dark, status/chart/shadow/motion tokens, reduced-motion rule, focus ring, motion utilities) · `ui/button` (soft variant, active state, lg touch size) · `ui/card` (hairline, no default shadow) · `ui/badge` (token variants: brand/success/warning/danger/info/muted; legacy names kept) · `ui/skeleton`.
Added: `ui/progress-bar`, `ui/page-header`, `ui/status-badge`, `hooks/useReducedMotion`.
Student layout: removed blurred aura blobs + infinite GSAP loop, removed duplicate font loaders (`--font-display/--font-body` now alias root fonts), removed a stray `console.log`, page fade skips when reduced-motion is set.
Approved fixes: middleware `/signup` → `/sign-up` (matcher + redirect check). Deleted dead `lib/courseData.ts` and unused `kpiStats`/`KpiStat` (nothing imported them). `pendingReviews` left untouched as requested.
Checks: `tsc` clean; eslint 1 error / 39 warnings (was 1 / 41); `next build` can't finish in sandbox (Google Fonts blocked) — run it locally.
Not touched: services, hooks logic, auth guards, quiz logic.

---
## Part 3 — Student shell, dashboard, courses (DONE)
- Sidebar: calm token styling, soft-brand active state with indicator + `aria-current`, flame/entrance/infinite animations removed, drawer + entrance honour reduced-motion, streak/sign-out logic unchanged. The disabled "Upgrade now" button now reads "Coming soon" (still disabled).
- Header: 64px bar, 40px touch menu button, no infinite pulse, reduced-motion aware.
- Dashboard: "Continue learning" now sits directly under the greeting (what to do next), calmer StatCard, token colours for activity/quizzes, skeleton loading state instead of the full-page loader. Data hooks untouched.
- ContinueLearningHero rewritten as a hairline card using the shared ProgressBar (no blobs/loops).
- Course card + catalogue: hairline cards, shared ProgressBar, tokenised badges/filters/search; catalogue title is now "Courses" (matches the nav). Search/filter/pagination logic untouched.
- Course detail: hero, sidebar, progress card, topic accordion/cards moved to tokens and consistent radii.
Open items for later parts: header search box is not wired to anything (pre-existing) — decide: wire to `/dashboard/courses` search or remove; "Help & support" button has no handler (pre-existing).
Checks: tsc clean; eslint 1 error (pre-existing useTopic) / 38 warnings.

---
## Part 4 — Reader, quiz, progress (DONE)
Requested fixes:
- ESLint error in `hooks/useTopic.ts` was the `react-hooks/set-state-in-effect` rule flagging `loadTopics()` (calls `setLoading(true)` before its first await). Behaviour is intentional; silenced with a documented disable comment, same pattern already used in `useStudentCourses`. Lint is now 0 errors.
- "Help & support" sidebar button removed.
- Header search is now a real form: Enter goes to `/dashboard/courses?q=…`; the Courses page reads `q` (Suspense-wrapped `useSearchParams`, state synced during render), and typing there keeps the URL in sync via `history.replaceState`. Placeholder now says "Search courses…" (the old text promised topics/past questions, which were never searched). Mobile gets a search icon linking to Courses.
Redesign:
- Lesson reader: loading skeleton instead of full-page loader; token colours/radii throughout (typography stylesheet was already token-based and left as is).
- Quiz intro: calm light card (no dark gradient), tokenised stat tiles/badges, stacked buttons on mobile. Player, option cards, navigator, result hero/review: token colours, consistent radii, no shadows, fixed class artifacts. NO changes to scoring, answer validation, timer, submission, shortcuts.
- Progress page: streak card rebuilt as a light card with warning accent (no orange gradient), achievements and heatmap use brand/success tokens.
Checks: tsc clean; eslint 0 errors / 38 warnings. next build still must be run locally (sandbox can't fetch Google Fonts).

---
## Part 5 — Settings, notifications, auth, landing (DONE)
Settings + notifications:
- All settings sections, settings page, notification page/types and the email-verification modal moved from raw palette classes (rose/emerald/amber/blue/violet) to tokens (destructive/success/warning/info/primary). `rounded-2xl/3xl` → `rounded-xl`. Dark-mode overrides no longer needed.
- Notifications hero: blur blobs removed. Email-verification modal: infinite float + ring-pulse loops removed, frosted backdrop removed, entrance skipped under reduced-motion (content stays visible).
Auth (login + sign-up):
- New shared `components/auth/auth-shell.tsx` (form column + calm brand panel, light/dark logo) and `auth-field.tsx` (labelled field with icon, accessible show/hide password, Google button, divider). Each page dropped from ~775 lines to ~150–230.
- Removed: page-flip + infinite GSAP right panel, blurred orbs, particles, the blue brand and the **fake "Blessing A. / 78% / Level 4" mock dashboard** (rule 11).
- Preserved exactly: validation toasts, `authService.login/signup/signInWithGoogle`, role-based redirect, already-signed-in redirect, post-signup verification modal and form reset.
- Added: real `<label htmlFor>`, `autoComplete`, `aria-busy`, spinner on submit, Terms/Privacy are now real links (were plain spans).
Needs your decision (not changed):
- Removed dead controls that did nothing: "Forgot password?" (no reset flow exists in `authService`) and "Remember me" (not wired; Supabase already persists the session). If you want password reset, it needs a new `resetPasswordForEmail` flow + a reset page — say so and I'll add it in a later part.
- Sign-up panel claimed "120+ courses", "50,000+ past questions", "thousands of students" — unverifiable, replaced with non-numeric benefits. Landing stats (100% satisfaction, 12+ years…) and testimonials are still static marketing copy: confirm they are true.
- Dropped `console.log(data)` of the auth response in login/sign-up (it printed session data).
Landing: hero image-drift and floating ring/flame loops and the learning-feature floating cards removed (marquee remains, reduced-motion gated); blue brand (#2454FF family) → emerald across hero/stats/courses/FAQ/footer/testimonials; unused imports cleaned. Landing remains a light-only design (hard-coded light surfaces); dark mode for the landing is not addressed — it needs a decision (force light vs. full theming).
Added `app/not-found.tsx` and `app/error.tsx` (first route boundaries; `loading.tsx` still to do).
Checks: tsc clean; eslint 0 errors / 32 warnings (was 38); /login and /sign-up render at 1366px and 390px (dev server with stubbed fonts). `next build` still must be run locally.
Next — Part 6: Admin shell, dashboard, courses/topics tables & forms (incl. the hardcoded `pendingReviews` decision).

---
## Part 6 — Admin experience (DONE)
- Colour: every admin screen (shell, dashboard, course/topic workspaces, forms, quiz manager, students/admins) moved from raw palette classes (emerald/amber/rose/blue/violet/indigo/slate) to tokens (primary/warning/destructive/info/muted). ~560 class swaps; admin now shares the student brand (emerald) instead of the old navy.
- Removed leftover navy→indigo gradients (sidebar pill, avatars, progress bars, headers), neon `shadow-*-/25` glows and `hover:shadow-xl`; `rounded-2xl/3xl` → `rounded-xl`. Publish buttons use the standard primary Button instead of hand-coloured ones.
- Sidebar: active item is a soft-brand pill with primary icon (no glow/scale); sliding behaviour unchanged.
- Motion: removed decorative infinite loops (course-thumbnail idle float, placeholder-tab glow pulse); thumbnail loading shimmer skips under reduced motion. CSS `animate-ping/pulse` already neutralised by the global reduced-motion rule.
- Chart: enrollment chart colour now `var(--primary)` so it follows light/dark.
- Deleted dead mock exports `recentActivity`, `systemMetrics`, `recentCourses` from `dashboard-data.ts` (nothing imported them; same rule as Part 2).
- NOT touched: authorization (admin/super_admin), services, hooks, validators, API routes, upload/parse logic.
Still needs your decision: `pendingReviews` on `/admin` is still hardcoded sample data ("Physics Fundamentals…") shown to real admins. Options: (a) derive from real draft courses, (b) remove the panel.
Not verified: admin pages need a logged-in admin session, so they were checked by tsc/eslint only, not rendered. Please click through /admin, a course, a topic and the quiz manager locally. `next build` also still needs a local run.
Checks: tsc clean; eslint 0 errors / 32 warnings.
Next — Part 7: remaining admin quiz/students/admins polish, responsive + a11y pass, loading.tsx boundaries, final lint/tsc/build QA.

---
## Part 7 — QA, a11y, boundaries (DONE)
- Added `loading.tsx` + `error.tsx` for `/dashboard` and `/admin` (skeleton with `role=status`, `role=alert` retry), plus the global 404/error from Part 5. Every area now has loading, error and not-found states.
- A11y: added accessible names to the 3 icon-only buttons that lacked them (course actions, admin notification bell with unread count, admin row actions). All `<img>` already had `alt`. Auth fields have real labels, `autoComplete`, accessible show/hide password.
- Removed 31 stray `console.log` calls (several dumped auth/session or form data). 6 multi-line debug logs remain in admin course/topic create/edit pages and `PreviewCard` — left untouched to avoid editing save flows; safe to delete.
- Lint cleanup: unused imports removed. Final: `tsc --noEmit` clean; `eslint` 0 errors / 27 warnings (baseline was 1 error / 41 warnings).
- Responsive: `/`, `/login`, `/sign-up`, `/privacy-policy`, 404 checked at 390 / 768 / 1366 px — no horizontal overflow, all return expected status (dev server with stubbed Google Fonts).
Open items (need you):
1. `pendingReviews` on `/admin` is still hardcoded sample data — choose: derive from draft courses, or remove.
2. Forgot-password flow does not exist (button removed in Part 5).
3. Landing stats/testimonials are static marketing copy — confirm accuracy; landing is light-only (no dark theme).
4. Run locally: `npm run build`, then click through student flow (login → course → topic → quiz → result → progress) and admin flow (course → topic → quiz manager), light + dark. These need real Supabase sessions and could not be run here.
5. Rotate the credentials that were in `note.txt` (Part 1).

---
# v2 — PREMIUM SaaS PASS (see handoff.md §0)
## Part 8 — Foundation v2 (DONE)
- **Font:** Urbanist is now the only font (headings + body), loaded once in `app/layout.tsx` as `--font-urbanist`. Inter and Plus Jakarta Sans removed. `--font-display/--font-body` kept as aliases. Body 15px / weight 500 / 1.6 leading; headings 700, −0.02em, balanced wrapping.
- **Palette:** emerald brand replaced by a soft indigo brand, shared by light + dark. Lavender-tinted neutrals, softened status colours (teal success, amber warning, sky info, rose danger), new `--brand-from/--brand-to` for one restrained gradient. All in the token block of `globals.css` — re-branding = edit that block only.
- **Shape/elevation:** `--radius` 0.875rem (10/12/14/18 px). New soft layered shadows: `--shadow-xs`, `--shadow-card`, `--shadow-float`, `--shadow-brand`.
- **New utilities (Tailwind v4 `@utility`, so hover:/focus: variants work):** `shadow-card`, `shadow-soft`, `shadow-brand`, `bg-brand-gradient`, `bg-brand-wash`, `hover-lift`, `stagger` (+ existing `animate-fade-up/in`, `shadow-float`).
- **Primitives refreshed:** Button (new `brand` gradient variant, taller touch sizes h-10/h-12, soft press state), Card (soft shadow, bolder title), Input (removed hard-coded slate → tokens), Badge (12px), ProgressBar (brand gradient fill, thicker).
- Global input styling: token border, softer focus ring.
- **Not touched:** services, hooks, context, auth, middleware, API routes, quiz logic, validators, parsers.
- **Not verified:** zip has no `node_modules` and the sandbox has no network, so `tsc`, `eslint` and `next build` were NOT run. Run `npm install && npm run build` locally. Pages were not rendered, so the Urbanist 15px/500 body sizing and the new button heights (h-9→h-10) need a visual check.
- **Remaining colour debt for later parts:** ~247 hard-coded hex/rgb values (landing sections, legal layout, loaders, editor toolbar CSS, quiz analytics) and ~81 raw palette classes still bypass tokens; they keep working but will not follow the indigo brand until Parts 12–15 convert them.
- Next — Part 9: remaining primitives + shared EmptyState/PageHeader/StatCard/DataTable shell.

---
## Part 9 — Design system v2 + GSAP kit (DONE)
- **Scope clarified by owner:** v2 means a NEW redesign of every page (new layouts, not a re-skin) plus GSAP interactions. handoff.md §0.1b/§0.7/§0.8 now spell out page-by-page briefs and the interaction catalogue; roadmap re-cut (Parts 10–15 are per-page redesigns).
- **GSAP kit (new):** `lib/gsap.ts` (one plugin registration, shared eases, `prefersReducedMotion`, `hasFinePointer`), `components/motion/` → `Reveal`, `RevealText`, `CountUp`, `ProgressRing`, `Magnetic`, `SpotlightCard`. All gated for reduced motion; `Magnetic`/`SpotlightCard` mouse-only.
- **SmoothScrollProvider fixed:** the old cleanup called `gsap.ticker.remove` with a *new* function (never removed → leaked a Lenis tick per mount). Now stable reference + Lenis is skipped entirely for reduced-motion users.
- **Primitives restyled to tokens/soft elevation:** Dialog, AlertDialog, Sheet (soft scrim, rounded-2xl, float shadow), DropdownMenu, Select, Tooltip (inverted ink), Tabs (pill + primary line variant), Table (quiet uppercase header, roomier rows), Switch (44×24), Checkbox, Textarea, Avatar (removed hard-coded violet hex), Skeleton (shimmer), Sonner radius.
- **Shared components:** `PageHeader` v2 (breadcrumb + eyebrow pill + fade-up), `EmptyState` v2 (concentric halo icon), new `StatCard`, `SectionHeader`, `DataTableShell`.
- **Docs:** `DESIGN-SYSTEM.md` added (tokens, primitives, kit usage).
- **Not touched:** services, hooks, context, auth, middleware, API routes, quiz logic, validators, parsers; page layouts (that starts in Part 10).
- **Checks:** TypeScript parser run over every touched file → no syntax errors. Full `tsc`, `eslint`, `next build` NOT run (no node_modules / no network in sandbox); nothing rendered in a browser. Please run `npm install && npm run build` and eyeball dialogs, selects, tables and tabs — they changed globally.
- **Watch for:** tables now use `px-4 py-3.5` cells and uppercase headers, so admin tables that relied on the old compact `p-2` padding will look roomier until redesigned in Part 14; any page overriding `TableHead`/`TableCell` classes still wins via `cn`.
- Next — Part 10: new student shell + dashboard + course catalogue + course detail.


---
## Part 10 — Student shell, dashboard, catalogue, course detail (DONE)
New layouts (not re-skins), built on the Part 9 kit. Data hooks/services untouched.
- **Shell:** `dashboard/layout.tsx` rewritten. Skeleton shell while the profile loads (was a blank `null`), skip-to-content link, route-change fade via `@/lib/gsap`, `main` is `overflow-x-clip` (was `overflow-auto`, which would have broken sticky children). Sidebar: 256px rail, single sliding active pill (GSAP, transform only), streak card, close button + Esc on the mobile drawer, 44px targets. Header: search field that opens the new **command palette** (⌘K / Ctrl+K), theme toggle (no mount flicker), notification bell, avatar dropdown (Settings, Notifications, Feedback, Log out).
- **Command palette (new):** `command-palette.tsx`. Arrow keys / Enter / Esc, combobox + listbox ARIA. Empty query shows the learner's enrolled courses + pages; typing searches published courses (loaded lazily from `courseService.getPublishedCourses`) and offers "Search all courses for ...".
- **Dashboard (`/dashboard`):** greeting, one "Continue learning" hero with `ProgressRing` + `CountUp` and a real "Up next" topic (first uncompleted topic via `useTopics` + `useTopicProgress`), KPI row of `ui/StatCard`s, "Up next" quizzes (real `upcomingQuizzes`), "My courses" grid, compact activity timeline. If nothing is in progress the hero becomes a "Start your first course / Ready for your next course?" panel. Mobile order: hero, KPIs, quizzes, courses, activity.
- **Catalogue (`/dashboard/courses`):** sticky toolbar (search, sort: Latest / A to Z / Most progress, filter chips with counts), `SpotlightCard` grid with staggered reveal, skeleton cards with the same footprint, `EmptyState` for no-results / empty view, `/` focuses search, `?q=` URL sync and pagination kept.
- **Course detail (`/dashboard/courses/[id]`):** new cover + title hero (no fake rating/student counts), sticky right rail with `ProgressRing`, curriculum as one hairline-divided list with per-topic states (done / locked / up next / number) and Read lesson / Take quiz buttons (real links), first unfinished topic opens by default, "Course not found" state, mobile enroll bar kept (z-20 so the drawer covers it).
- **Shared changes:** `SpotlightCard` inner wrapper is now `flex flex-1 flex-col` so cards in a grid stay equal height. `CourseCard` (dashboard) now reads the shared `EnrollmentContext` instead of firing one enrollment request per card. Student pages use `EnrollmentContext` instead of the per-page `useEnrollment` hook (same data, one fetch).
- **Removed:** `dashboard-components/dashboard/stats-card.tsx` (replaced by `ui/stat-card`, as planned in DESIGN-SYSTEM.md). The disabled "Go Premium / Coming soon" card in the sidebar (non-functional promo; see decision 1).
- **Not touched:** services, hooks, contexts, auth, middleware, API routes, quiz logic, validators, parsers, `actions/use-course.ts` (enroll/continue logic).
- **Checks:** parsed every touched file with the TypeScript parser (no syntax errors) and verified that every `@/` import resolves and every named import is actually exported; scanned touched files for raw hex, raw palette classes, direct `gsap` imports, `console.*` and text under 13px (none; the one 12px wordmark label is the caption size). **NOT run:** `tsc`, `eslint`, `next build`, any browser render. The sandbox has no `node_modules` and no network.
- **Needs a local look:** sliding sidebar pill alignment, command palette on mobile, sticky catalogue toolbar offset under the header (`top-16`), hero ring/count animation, curriculum expand/collapse, dark mode on all four pages.
- **Decisions needed:** (1) OK to drop the disabled "Go Premium" card for good? (2) "Most progress" sort puts un-enrolled courses last; fine? (3) Settings page still imports `gsap` directly (Part 13 migrates it).
- Next: Part 11 — lesson reader, quiz intro / player / results, progress page.

---
## Part 12 — Landing page + auth pages (DONE)
New layouts (not re-skins), built on the Part 9 kit. Auth logic, services, hooks, middleware and API routes untouched.
**Landing (`/`)** — light + dark, tokens only (no hex, no raw palette classes, no direct `gsap` imports):
- **Navbar** rewritten: translucent, hairline once scrolled, **hides on scroll down / returns on scroll up or keyboard focus** (instant under reduced motion), anchor links (Features, How it works, Courses, FAQ), theme toggle, Sign in / Get started. Mobile menu is the shared `Sheet`. The old "Admin" link on the public nav is gone.
- **Hero**: `RevealText` headline ("Practice like it’s exam day."), one primary (`Magnetic`) + one secondary CTA, a small **interactive sample question** (built from the real quiz visual language, labelled "Sample question", no statistics), desktop-only scroll parallax on the preview (transform only).
- **Features** bento (`#features`): five real features (courses by topic, CBT quizzes, progress, notifications, continue-where-you-left-off) on `SpotlightCard`s with staggered `Reveal`.
- **How it works** (`#how-it-works`): three steps. **Courses** (`#courses`): up to 3 *real* published courses via the existing `useFeaturedCourses` hook (unchanged); skeleton while loading; **the whole section is omitted if there are none**. **FAQ** (`#faq`): accessible accordion (`aria-expanded`/`aria-controls`, CSS grid-rows animation), same 7 answers as before. **CTA band** and a rebuilt **footer** (server component, token colours).
- Page is now a server component and the full-screen `DelyteLoader` splash no longer gates the page (it delayed all content for an animation). Added skip-to-content link.
**Auth (`/login`, `/sign-up`)**: new `AuthShell` (form column with logo, theme toggle and "Back to home" + static brand panel with soft gradient wash, dot grid, and real benefit cards; headline uses `RevealText`). `AuthField` gained `error` / `hint` props (`aria-invalid`, `aria-describedby`, `role="alert"`) and accepts a `ref`. **Inline validation** on both forms: same rules and the same toast messages as before, but every failing field is now also marked inline and the first one is focused. Sign-up shows a live "At least 8 characters" rule. Photo panel removed on sign-up. Submit buttons use the brand gradient.
**Removed because the content was unverifiable or non-functional (rule: no invented data):** stats strip (100% satisfaction / 12 years / 20 students / 90 courses), testimonials (named people + quotes), the "Community & networking — thousands of students" feature claim, the footer course list (Physics Essentials etc., not real courses), and the newsletter form (no endpoint; it only pretended to subscribe). All are recoverable from the Part 11 zip if you confirm them.
**Fixed in passing:** footer "Create account" linked to `/signup` (404) → `/sign-up`; footer phone `tel:` link did not match the number shown → now matches (`+234 8139760048`, **please confirm which number is right**).
New shared files: `components/logo.tsx`, `components/theme-toggle.tsx`, `features/section-intro.tsx`. Old `features/hero-section`, `learning-feature`, `courses-section`, `FAQ`, `stats-section`, `testimonials` replaced by `hero-section`, `features-section`, `how-it-works`, `courses-section`, `FAQ`, `cta-band`.
**Checks run:** TypeScript parser over all 320 `src` files (0 syntax errors); every `@/` and relative import resolves; `noUnusedLocals` pass on every touched file (0 findings); grep for hex / raw palette classes / direct gsap imports / console in touched files (none). **NOT run:** `tsc` type-check, `eslint`, `next build`, any browser render (no `node_modules`, no network).
**Needs a local look:** navbar hide/show + mobile sheet, hero parallax and sample-question feedback, bento layout at 390 / 768 / 1366 px, dark mode on `/`, `/login`, `/sign-up`, FAQ open/close, auth inline errors + focus, courses section with and without published courses.
**Decisions needed:** (1) Confirm stats / testimonials if you want them back. (2) `components/delyte-loader` is now unused — delete it or restore the splash? (3) Footer phone number. (4) Sign-up still clears every field after a *failed* API call (pre-existing `finally` block, left untouched) — want it kept only on success? (5) Visitors clicking a course card go to `/dashboard/courses/:id`, which redirects to `/login` (middleware does not remember the target) — OK, or send them to `/sign-up`? (6) Forgot-password flow still does not exist.
Next — Part 13: settings, notifications, feedback, legal pages.

---
## Part 13 — Settings, notifications, feedback, legal (DONE)
- **Settings (`/dashboard/settings`)**: `PageHeader` + breadcrumb; desktop sticky rail (profile snapshot + sliding-pill nav, now `top-24`); mobile section tabs now sit **below the 64px app header** (`top-16`, they were hidden behind it) with 44px targets; **deep links** (`#security` etc. open that section, URL updates on select); crossfade via `@/lib/gsap`. Profile save bar is now a **sticky "unsaved changes" bar** (floats at the bottom while dirty, with a status dot). Danger zone stays separated at the bottom of the nav. All five sections moved from direct `gsap` imports to `@/lib/gsap`. Save / cancel / avatar / password / delete logic untouched.
- **Notifications (`/dashboard/notification`)**: new layout on `PageHeader` (unread count in the description, "Mark all as read" action), filter pills with live counts (`aria-pressed`, 40px), day groups (Today / Yesterday / Earlier) with `Reveal`, shared `EmptyState` (separate copy for "all caught up" vs "filter has no results" + "Show all"), skeleton on the new `Skeleton`. Removed the duplicated filter logic (now uses the existing `filterNotifications`). `NotificationCard` rebuilt: unread tint + dot + screen-reader "Unread", type chip, focus ring, proper `<button type="button">`; bell dropdown keeps the compact variant. Fixed `formatRelativeTime`: anything under an hour said "Just now"; now shows minutes.
- **Feedback (`/dashboard/feedback`)**: was an unstyled stub with a non-working form. There is no feedback endpoint or table, so the new form does **not pretend to submit**: it opens the learner's email app with category + message + their name/email pre-filled, addressed to `delyte780@gmail.com` (same address as the footer), with inline validation, character counter and a toast explaining the next step.
- **Legal (`/privacy-policy`, `/terms-of-service`)**: `LegalLayout` had ~40 hard-coded hex colours, serif/mono fonts and was light-only. Now tokens only (dark mode works), Urbanist headings, shared `Logo` + `ThemeToggle` in the top bar, brand-wash hero, 40px "Contents" button. Legal text (`legal-data.ts`) **not edited**.
- **Not touched:** services, hooks, contexts, auth, middleware, API routes, validators, legal wording.
- **Checks run:** TS parser over all 320 `src` files (0 syntax errors), all imports resolve, `noUnusedLocals` clean on every touched file, no hex / raw palette classes / direct gsap imports in touched files. **NOT run:** `tsc`, `eslint`, `next build`, browser render (no `node_modules`, no network).
- **Needs a local look:** settings deep links + sticky save bar over a long profile form (dirty → scroll), mobile tab offset under the header, notifications filters/empty states/bell dropdown, feedback mailto on desktop + phone, legal pages in dark mode incl. scroll-spy.
- **Decisions needed:** (1) Feedback goes by email only — want a real `feedback` table + RLS + admin inbox in a later part (needs schema approval)? (2) Legal pages say to contact `support@delyteacademy.com` while the site footer uses `delyte780@gmail.com` — which is correct? (3) Last-updated date and clauses in the legal text were not reviewed by me; have them checked before launch. (4) Settings "Learning Preferences" / "Account" sections were restyled only — confirm every preference there is actually persisted (I did not change or verify it).
Next — Part 14: admin shell, dashboard, courses/topics/quiz manager, students/admins tables (incl. the hard-coded `pendingReviews` decision).

## Part 14 — Admin shell, dashboard, courses, admins (DONE; workspaces → 14b)
Full report: `handoff.md` §0.12. New shell (layout/sidebar/topbar/breadcrumb/page-shell + ⌘K palette), new dashboard with a real "Needs attention" panel, courses list (search, filters, skeleton, confirm-delete), admins table (AlertDialog confirms), students header/KPIs; fake data and dead links removed; admin GSAP imports unified on `@/lib/gsap`. Not touched: services, auth, role checks, API routes, hooks' data logic (only `useAdminDashboardStats` / `useSystemSnapShot` return shapes changed from colour classes to tones; `useAdminAttention` is new and read-only).
Next — Part 14b: course/topic workspaces, quiz manager, students table + sheets, forms.


## Part 14b — Admin workspaces, quiz manager, students, forms (DONE)
Full report: `handoff.md` → §0.13. Summary: shared `WorkspaceHero` / `StatStrip` / `WorkspaceSkeleton` / underline `WorkspaceTabs`; curriculum-list topics tab with delete confirmation; split-layout quiz manager; students table + tabbed detail sheet with confirmations (and the stale-list delete bug fixed); course/topic/question forms with a floating action bar and full inline validation; fake data removed from the course edit page; create-course “stuck saving” bug fixed. Not verified: tsc / eslint / next build / render (no node_modules, no network). Next — Part 15: responsive + a11y pass, remove remaining hard-coded hex and raw palette classes outside admin, QA.
