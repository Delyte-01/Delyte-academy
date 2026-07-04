# Study Hub

Starter scaffold — Next.js (App Router, TypeScript) + Tailwind CSS v4 + shadcn/ui
foundations + GSAP + Lenis.

## What's included

- **Next.js 16** (App Router, TypeScript, `src/` directory)
- **Tailwind CSS v4**
- **shadcn/ui** — base config (`components.json`), theme tokens in
  `globals.css`, and a starter `Button` component in `src/components/ui`.
  Since the CLI registry isn't reachable from every environment, components
  were wired up manually; you can still run `npx shadcn@latest add <component>`
  from your machine to pull in more components normally.
- **GSAP** — animation library, already used on the homepage for a simple
  fade-in.
- **Lenis** — smooth scrolling, wired up in
  `src/components/smooth-scroll-provider.tsx` and mounted in the root layout,
  synced with GSAP's `ScrollTrigger`.

## Getting started

1. Extract this folder and open it in your editor.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the dev server:
   ```bash
   npm run dev
   ```
4. Open http://localhost:3000

## Project structure

```
src/
  app/
    layout.tsx        # Root layout, wraps app in SmoothScrollProvider
    page.tsx           # Homepage (starter hero section)
    globals.css        # Tailwind + shadcn theme tokens
  components/
    ui/
      button.tsx        # shadcn Button component
    smooth-scroll-provider.tsx  # Lenis + GSAP ScrollTrigger setup
  lib/
    utils.ts            # shadcn `cn()` helper
components.json          # shadcn/ui config
```

## Adding more shadcn components

```bash
npx shadcn@latest add card
npx shadcn@latest add input
npx shadcn@latest add dialog
```

## Notes

- Color theme is a navy/blue palette matching the Study Hub brand — adjust
  the CSS variables in `src/app/globals.css` under `:root` and `.dark` to
  change it.
- No backend, auth, or database is wired up yet — this is the visual/tech
  foundation only.
