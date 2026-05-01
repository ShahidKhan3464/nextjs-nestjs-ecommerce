# Atelier Commerce — client walkthrough

This document describes how the **Next.js 15** storefront under `client/` is organized, how requests flow through it, and where server vs client rendering fits in. Paths are relative to `client/` unless noted.

---

## Quick orientation

| Piece | Role |
|--------|------|
| `src/app/` | App Router: pages, layouts, loading/error boundaries, Route Handlers (`api/`) |
| `src/modules/` | Feature-oriented UI + wiring (products, cart, checkout, auth, admin, …) |
| `src/components/ui/` | Reusable primitives from **shadcn/ui** (buttons, forms, sheets, …) |
| `src/shared/` | Cross-cutting layout, providers, marketing blocks, shared hooks |
| `src/store/` | **Zustand** stores (auth, cart, wishlist, recently viewed) |
| `src/lib/` | Utilities, mock/product data, API helpers, `session-cookie.ts` (JWT from cookies), server-side order memory |
| `src/config/` | `site.ts` — brand name, description, URL, locale |
| `src/constants/` | `routes.ts`, `query-keys.ts`, shared constants |
| `components.json` | **shadcn** CLI config (do not delete; see below) |

---

## What `components.json` is

`components.json` is the configuration file for the **[shadcn/ui](https://ui.shadcn.com)** CLI (`npx shadcn add …`). It tells the CLI:

- Which **style preset** you use (`base-nova` here).
- That you use **React Server Components** (`"rsc": true`) and **TSX**.
- Where **Tailwind** reads global CSS (`src/app/globals.css`), base color, and CSS variables.
- **Import aliases** (`@/components`, `@/components/ui`, `@/lib/utils`, …) so generated components match your project.

It is **not** a runtime dependency for your app at build time beyond documenting where UI pieces live; deleting it would only break or confuse future `shadcn` CLI adds.

---

## Route groups and URLs

Parentheses in folder names are **route groups**: they organize files **without** appearing in the URL.

| Folder under `src/app/` | URL examples | Layout / shell |
|-------------------------|--------------|----------------|
| `(marketing)/` | `/` | `SiteShell` — marketing header/footer |
| `(auth)/` | `/login`, `/register`, `/forgot-password` | `SiteShell` + centered card |
| `(shop)/` | `/products`, `/products/[slug]`, `/cart`, `/checkout`, `/orders`, `/dashboard`, `/profile`, `/wishlist`, `/users`, … | `ShopRoleShell` → `CustomerAppShell` or `AdminAppShell` |

### Auth, middleware, and `ShopRoleShell`

**Middleware** protects shop URLs and redirects legacy `/admin/*`. **`ShopRoleShell`** picks **`AdminAppShell`** vs **`CustomerAppShell`** from **`useAuthStore`** after mount.

File: `src/shared/components/layout/shop-role-shell.tsx` (**client**).

Until the client store has hydrated, a minimal padded wrapper is shown. Shared paths (`/dashboard`, `/products`, `/orders`, …) render admin vs customer content by role; `/users` and `/products/new` are admin-only.

---

## Request flow (high level)

1. **Browser** requests a path (e.g. `/products/teapot`).
2. **Next.js** picks the matching `page.tsx`, merges nested `layout.tsx` files from root downward.
3. **Server** runs Server Components and any data fetching on the server for that segment.
4. **Client** hydrates Client Components (`"use client"`), which can use hooks, Zustand, TanStack Query, etc.
5. **Route Handlers** under `src/app/api/v1/**` serve JSON for fetches (auth, products, orders, admin, coupons).

Data for listings often flows: **page (server or client boundary)** → **module components** → **services** (e.g. `axios` to `/api/v1/...`) → **TanStack Query** where used.

---

## Rendering modes (SSG, SSR, ISR, dynamic)

These are **per-route** behaviors in the App Router:

### Static (SSG)

- **`(marketing)/page.tsx`**: `export const dynamic = "force-static"` — home page built as static HTML.

### ISR (Incremental Static Regeneration)

- **`(shop)/products/[slug]/page.tsx`**: `generateStaticParams()` + `revalidate = 120` — **SSG** product pages with periodic refresh.

- **`(shop)/products/page.tsx`**: uses `getAccessTokenPayload()` to branch admin vs customer UI → typically **dynamic** (also serves admin inventory on the same URL).

### Dynamic / SSR

- Combined shop routes such as **`/dashboard`**, **`/orders`**, **`/products`** (when role-split), and admin analytics use server rendering or client data hooks as needed.

### Default behavior

Routes without `dynamic` or `revalidate` follow Next defaults (often static where possible). Client-heavy pages still ship server-rendered shells where the parent `page.tsx` is a Server Component.

---

## Server vs client components

**Rule of thumb:** A file is a **Server Component** unless it starts with `"use client"`.

### Typically server

- Root `layout.tsx`, route `page.tsx` files that only compose children and fetch on server.
- Route Handlers: `src/app/api/v1/**/route.ts`.

### Must be client (`"use client"`)

- Anything using `useState`, `useEffect`, browser-only APIs, or event handlers (`onClick`).
- **Zustand** stores consumed in UI (cart, auth UI, wishlist).
- **TanStack Query** (`useQuery`, `useMutation`).
- **Forms** with `react-hook-form` where the form component uses hooks.
- Layout shells that depend on auth store or pathname for navigation: `ShopRoleShell`, `CustomerAppShell`, `AdminAppShell`, `SiteHeader`, etc.

**Pattern:** Keep `page.tsx` as a thin Server Component when possible; import a `"use client"` module component for interactivity (e.g. product PDP passes server-fetched `product` into `ProductDetailView`).

---

## `src/app` special files

| File | Purpose |
|------|---------|
| `layout.tsx` | Shared UI wrapper for a segment and children |
| `page.tsx` | Page UI for a route |
| `loading.tsx` | Instant loading UI while segment suspends |
| `error.tsx` | Error boundary UI |
| `not-found.tsx` | Local 404 UI |

---

## Feature modules (`src/modules/`)

Grouped by domain:

- **`products/`** — listing, filters, PDP view, cards, recently viewed strip.
- **`cart/`** — cart page, cart sheet.
- **`checkout/`** — multi-step wizard.
- **`orders/`** — list + detail views, services.
- **`wishlist/`** — grid + types.
- **`auth/`** — login, register, forgot-password forms.
- **`profile/`** — profile form.
- **`dashboard/`** — customer overview.
- **`admin/`** — analytics, tables, admin forms, detail views.

Each module usually contains `components/` and sometimes `services/` for API calls.

---

## State and data

| Concern | Implementation |
|---------|----------------|
| Auth session (client) | `src/store/auth-store.ts` + API routes under `api/v1/auth/` |
| Cart | `src/store/cart-store.ts` |
| Wishlist | `src/store/wishlist-store.ts` |
| Recently viewed | `src/store/recently-viewed-store.ts` |
| Server-side catalog source | `src/lib/product-store.ts`, `src/lib/mock-data.ts` (replace with real backend later) |
| Orders (demo persistence) | `src/lib/order-memory.ts` |
| Query cache keys | `src/constants/query-keys.ts` |

---

## Global providers

`src/app/layout.tsx` wraps the tree with `AppProviders` (`src/shared/components/providers/app-providers.tsx`):

- **TanStack Query** — `QueryClientProvider`
- **next-themes** — dark/light/system
- **Sonner** — toast notifications

---

## Styling

- **Tailwind CSS v4** via PostCSS (`postcss.config.mjs`).
- Design tokens and shadcn variables live in `src/app/globals.css`.
- **`cn()`** helper: `src/lib/utils.ts` (`clsx` + `tailwind-merge`).

---

## Environment

See `.env.example` for variables such as `NEXT_PUBLIC_SITE_URL`. Metadata and absolute URLs use `siteConfig.url`.

---

## Scripts

```bash
npm run dev      # development server
npm run build    # production build
npm run start    # production server
npm run lint     # ESLint
```

---

## Former `AGENTS.md` / `CLAUDE.md`

Those files were **short stubs for AI coding assistants** (notes about Next.js and a pointer between files). They were **not** required for builds or runtime and have been removed to reduce clutter. Project-specific guidance can live in this `walkthrough.md` or in `.cursor/rules` if you use Cursor rules.
