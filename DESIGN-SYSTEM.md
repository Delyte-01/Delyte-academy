# Delyte Design System v2 (Parts 8–9)

## Tokens (`src/app/globals.css`)
Brand = soft indigo. Change ONLY the "Brand" + "Charts" groups to re-brand.
Surfaces: `bg-background` (page) · `bg-card` (surfaces) · `bg-muted` (quiet fills) · `border` (hairlines).
Brand: `bg-primary`, `bg-primary-soft` + `text-primary-soft-foreground`, `bg-brand-gradient` (hero CTAs only), `bg-brand-wash` (static section backdrop).
Status: `success | warning | info | destructive` (+ `-soft` surfaces).
Radius: `rounded-lg` 14 · `rounded-xl` 18 (cards) · `rounded-2xl` 24 (dialogs). Fonts: Urbanist only (`font-sans` / `font-heading`).
Shadows: `shadow-soft` (controls) · `shadow-card` (surfaces) · `shadow-float` (menus/dialogs) · `shadow-brand` (primary buttons).
Motion utilities: `animate-fade-up`, `animate-fade-in`, `hover-lift`, `stagger` (+ `style={{"--i": n}}`), `skeleton-shimmer`.

## Primitives (`src/components/ui`)
Button (default/brand/soft/outline/secondary/ghost/destructive/link; sizes sm/default/lg/icon) · Card · Input · Textarea · Select · Checkbox · Switch · Tabs (pill + line) · Table · Dialog · AlertDialog · Sheet · DropdownMenu · Tooltip · Avatar · Badge · StatusBadge · Skeleton · ProgressBar · Sonner toasts.

## Shared patterns
| Component | Use |
|---|---|
| `ui/page-header` `PageHeader` | Top of every page: breadcrumb, eyebrow, title, description, actions |
| `ui/section-header` `SectionHeader` | Section title + "View all" link |
| `ui/stat-card` `StatCard` | KPI tile; numbers count up; optional trend/progress (real data only) |
| `ui/data-table-shell` `DataTableShell` | Card wrapper for `ui/table` with toolbar + footer, scrolls on mobile |
| `empty-states` `EmptyState` | No-data / no-results with CTA |

## GSAP kit (`src/lib/gsap.ts`, `src/components/motion`)
```tsx
<Reveal selector="[data-reveal]" stagger={0.08}> … <div data-reveal/> … </Reveal>   // scroll/mount entrance
<RevealText as="h1" text="Learn with focus." />                                       // word-mask headline
<CountUp value={1280} suffix="+" />                                                  // number tween
<ProgressRing value={72}><span>72%</span></ProgressRing>                              // arc draws in
<Magnetic><Button variant="brand" size="lg">Get started</Button></Magnetic>          // follows cursor
<SpotlightCard className="p-5">…</SpotlightCard>                                      // cursor glow card
```
Rules: transform/opacity only · gate with `prefersReducedMotion()` · import GSAP from `@/lib/gsap` only · no infinite decorative loops.

## Known follow-ups
- (Done in Part 10) The old dashboard `stats-card.tsx` was deleted; `ui/stat-card` is the only StatCard.
- Several older components register GSAP plugins locally; Parts 10–15 migrate them to `@/lib/gsap` as each page is redesigned.

## Student shell patterns (Part 10)
- `dashboard-components/command-palette.tsx` — ⌘K / Ctrl+K search + jump-to. Open it from anywhere with `onOpenChange`.
- `dashboard-components/dashboard/*` — `ContinueLearningHero` / `StartLearningHero`, `UpNextQuizzes`, `RecentActivity`.
- `dashboard-components/courses/course-card.tsx` — `CourseCardView` (SpotlightCard, stretched link, on-brand fallback cover from `--brand-from/--brand-to`).
- Sticky page toolbars use `sticky top-16` (header is 64px). Keep `main` free of `overflow-auto`, or sticky breaks.
- Mobile ordering trick: wrap columns in `contents xl:flex ...` and order blocks with `max-xl:order-N`.

## Reader / quiz / progress patterns (Part 11)
- `motion/animated-check` `AnimatedCheck done` — completion badge, draws once on false→true. `ProgressRing` gained `tone="brand|success|warning"`.
- Lesson: `topic-content/topic-sidebar` exports `LessonRail` (xl+) and `MobileOutline`; `ReadingProgress` is a ScrollTrigger scrub bar. Focus mode = page-level state persisted in `localStorage`.
- Quiz: sticky bar uses `sticky top-16`, rail uses `top-[10rem]`. Option feedback = GSAP spring on the letter badge; question change = 0.28s fade/slide, `clearProps` after.
- Progress: every block is `progress/panel` `Panel`; headline numbers come from the hook's `summary` — never hard-code a stat.

## Landing + auth patterns (Part 12)
- `components/logo.tsx` `Logo` (light/dark artwork swap via CSS) · `components/theme-toggle.tsx` `ThemeToggle` (no mount flicker) — use these instead of inlining logos / theme buttons.
- `features/section-intro.tsx` `SectionIntro` (eyebrow + title + description) heads every landing section. Sections use `scroll-mt-20` so anchor jumps clear the fixed navbar.
- Landing sections animate with `Reveal` (`selector="[data-…]"`); cards are `SpotlightCard`. Wrap the card in the element that carries the `data-` attribute so the whole card (border included) reveals together.
- `components/auth/auth-field.tsx` `AuthField` props: `label`, `icon`, `revealable`, `error` (inline message + `aria-invalid`), `hint`, plus any `<input>` prop incl. `ref`. `auth-shell.tsx` takes `panelItems: AuthPanelItem[]` (`{ icon, title, text }`).
- Static section backdrops: `bg-brand-wash` + a `color-mix(var(--foreground) …)` dot grid with a radial `mask-image`; no hex.

## Settings / notifications / legal patterns (Part 13)
- Sticky elements inside the student shell: page toolbars `sticky top-16`; side rails `sticky top-24`; floating save bars `sticky bottom-4` with `shadow-float` (needs no `overflow` on ancestors).
- Settings sections are addressed by hash (`#profile | #account | #preferences | #security | #danger`).
- Filter chips: `rounded-full`, `min-h-10`, `aria-pressed`, count badge in `tabular-nums`.
- Legal / long-form pages use `font-heading` headings, `text-foreground/80` body and tokens only; never hard-code the old cream/green palette.

## Admin patterns (Part 14)
- Every admin page = `AdminPageShell` (breadcrumb + `PageHeader`, optional `actions`) → `StatCard` row → `DataTableShell` / card grid. Dashboard-style pages use `PageHeader` directly.
- Admin sticky header is the topbar (`h-16`); the scroll container is `<main id="admin-main">`, so keep admin pages free of their own `overflow-y`.
- ⌘K opens `admin-command-palette.tsx`; the topbar button is the visible trigger.
- Destructive actions use `AlertDialog` with a disabled/“Working…” state — never `window.confirm`, never immediate.
- Status pills: `StatusBadge` (courses) / `Badge variant="success|danger"` (accounts). Tones for icon chips: `StatTone` from `ui/stat-card`.
- Content-health signals come from `hooks/useAdminAttention` (read-only). Never hard-code sample counts.

## Admin workspace patterns (Part 14b)
- Workspace pages (course, topic) = `WorkspaceHero` → `StatStrip` → sticky `WorkspaceTabs` → `role=tabpanel`. Loading = `WorkspaceSkeleton`, never a full-page spinner.
- `WorkspaceTabs` sticks at `top-0` of the admin scroll area (`<main>`); sticky side rails under it use `xl:sticky xl:top-16`.
- Lists of children (topics, questions) are ordered rows in one bordered card, title as the stretched link (`after:absolute after:inset-0`), row menu above it (`relative z-10`).
- Tables = `DataTableShell` + `ui/table` for `md+`, a `<ul class="divide-y md:hidden">` of stacked rows below.
- Forms: `PageHeader` + breadcrumb, content cards, sticky preview (`lg:sticky lg:top-4`), and one floating `ActionBar` (`errorCount`, `publishLabel`). Fields show errors when `touched || submitAttempted`; always set `aria-invalid`, `aria-describedby`, and `role="alert"` on the message.
- Destructive or privilege-changing actions (delete, suspend, grant/revoke admin) always go through `AlertDialog` with a “Working…” state.
