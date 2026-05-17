# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

This is a monorepo with a single Next.js application:

```
gei-nit/
├── sia-nit/          ← Next.js 16 app (all development happens here)
├── README.md
└── Projeto_Pratico_Gestao_Informacao_NIT.docx.md
```

All commands below must be run from inside `sia-nit/`.

## Commands

```bash
npm run dev      # dev server (Turbopack)
npm run build    # production build — always run before committing
npx tsc --noEmit # type-check without emitting (run after any TS change)
npm run lint     # ESLint
```

There are no tests. TypeScript and the production build are the verification gates.

## Critical: Tailwind CSS v4 breaking changes

This project uses **Tailwind CSS v4**, which renamed several utilities. Using v3 names silently produces no output:

| v3 (broken here) | v4 (correct) |
|---|---|
| `bg-gradient-to-r` | `bg-linear-to-r` |
| `bg-gradient-to-br` | `bg-linear-to-br` |

Colors are defined in **OKLCH** space in `app/globals.css` under `@theme inline`. The primary color is `oklch(0.488 0.243 264.376)` (blue-600). Do not hardcode hex values — use Tailwind semantic classes (`bg-primary`, `text-blue-600`, etc.).

The PostCSS pipeline is `@tailwindcss/postcss` — there is no `tailwind.config.ts`.

## Architecture

### App Router structure

```
app/
├── layout.tsx                 # Root: Inter font, AuthProvider
├── login/page.tsx             # Public route
└── (protected)/
    ├── layout.tsx             # Auth guard (redirects → /login) + AnimatePresence page transitions
    ├── dashboard/page.tsx
    ├── projetos/page.tsx
    ├── demandas/page.tsx
    └── recomendacao/page.tsx  # Core feature: AI recommendation pipeline
```

All pages are `"use client"`. The `(protected)` route group enforces authentication via `useAuth()` in its layout — no per-page auth checks needed.

### Authentication

`lib/auth-context.tsx` — React Context + `localStorage` (`sia_user` key). Two hard-coded users:

- `admin / nit2026` → perfil `admin_NIT`
- `consultor / unitins` → perfil `consultor`

Access via the `useAuth()` hook anywhere inside `AuthProvider`.

### Data layer

All data lives in `lib/mock-data.ts` — no API calls, no database. The types `Projeto`, `Demanda`, and `Recomendacao` are defined there and used across all pages. Pages own their state via `useState` initialised from those mock arrays.

### UI component system — Base UI React, not Radix

`components/ui/` wraps **`@base-ui/react`** (not Radix UI, not shadcn-default). The APIs differ:

- **Select**: `SelectPrimitive.Value` renders the raw `value` string, **not** the item's text content. To display the selected item's label in the trigger, read from state directly and place a `<span>` inside `<SelectTrigger>` — do not use `<SelectValue />` for dynamic data.
- **Dialog**: uses `data-open` / `data-closed` data attributes for animation, not `open` prop on overlay.
- **Button**: built on `@base-ui/react/button` with CVA variants (`default`, `outline`, `secondary`, `ghost`, `destructive`, `link`) and sizes (`xs`, `sm`, `default`, `lg`, `icon`).

### Animations

`components/ui/motion.tsx` re-exports Framer Motion primitives and defines shared variants:

- `staggerContainer` / `staggerItem` — use as `variants` on `motion.div` wrappers for cascading list reveals.
- `PageTransition` — wraps page content with fade + slide; already applied in `(protected)/layout.tsx` via `AnimatePresence`.
- Import `motion` and `AnimatePresence` from `@/components/ui/motion`, not directly from `framer-motion`, so tree-shaking and typing stay consistent.

When defining inline `transition` objects, `ease` must be a **string** (`"easeOut"`, `"easeIn"`, etc.) — Framer Motion's TypeScript types reject bare number arrays for `ease`.

### CSS custom classes (globals.css)

Two animation keyframes are defined in `app/globals.css` and used as plain class names:

- `.ai-glow` — pulsing blue box-shadow on the AI recommendation card.
- `.animate-sparkle` — gentle rotation on the Sparkles icon in the recommendation header.

## Deployment

Live at **https://sia-nit.vercel.app** (Vercel project: `paulofveras-projects/sia-nit`).

The Vercel project root is `sia-nit/` — Next.js is auto-detected. Deploy via CLI from inside `sia-nit/`:

```bash
vercel --prod
```

Or push to `main` on GitHub (`paulofveras/gei-nit`) and trigger from the Vercel dashboard.
