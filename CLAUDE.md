# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install
cp .env.example .env      # fill in VITE_API_URL, VITE_TELEGRAM_BOT_USERNAME
npm run dev                # vite dev server, http://localhost:5173
npm run build               # tsc -b && vite build
npm run typecheck           # tsc -b --noEmit, no emit
npm run preview             # serve the production build locally
```

There is no lint script and no test runner configured in this repo — don't invent `npm run lint`/`npm test` commands. `npm run typecheck` is the only automated correctness check available; run it after any non-trivial change.

## Big-picture architecture

qubnix is a workspace/task-management SaaS with **two independent interfaces from one codebase**: a Telegram Mini App (mobile) and a plain web app (desktop). Design source of truth for new screens is `desktop.html` / `mobile.html` at the repo root (Claude Design canvas wireframes) — check these before building a new screen.

### Two independent forks

1. **Auth fork** — `src/components/layout/enter-way/index.ts` (`enterWay()`) decides at boot time, before React ever renders (called in `main.tsx`, awaited before `createRoot(...).render`):
   - `isTelegramMiniApp()` (`src/utils/platform.ts`) is **dynamic**: `Boolean(window.Telegram?.WebApp?.initData)`. There is no static/build-time platform flag.
   - Telegram → `enter-way.telegram.ts`: silent auth via `POST /auth/telegram-init-data` using the Mini App's init data.
   - Plain browser → `enter-way.web.ts`: tries to restore a session from the token already in `session.store` (calls `authApi.me()`); no token means `status: "unauthenticated"`.
   - In `routes/AppRoutes.tsx`, if not in Telegram **and** session isn't `"authenticated"`, the entire router is replaced by `widgets/features/login/FeatureLogin.tsx` instead of any route tree. This is currently a **mock login screen** (hardcoded `@akiylov` user, "Kirish (test)" button calling `setSession()` directly) — the real Telegram Login Widget (`TelegramLoginButton.tsx` / `useTelegramWidgetLogin.ts`) exists but is not wired up because the backend login flow (legacy hash-based vs Telegram's newer OIDC flow) isn't decided yet.
   - `src/middleware/AuthGuard.tsx` and `src/pages/Login.tsx` are **dead code** — not imported anywhere. Don't wire new auth logic through them; the real gate is the check in `AppRoutes.tsx` described above.

2. **Layout fork** — `useLayoutMode()` (`src/hooks/useLayoutMode.ts`) watches `matchMedia("(min-width: 768px)")`, reactive to resize. Wide viewport (including Telegram Desktop) → `AppLayout` (sidebar) + `routes.desktop.tsx`; narrow viewport → `MobileLayout` (bottom tab bar) + `routes.mobile.tsx`. This fork is **purely about viewport width**, not platform — it has no relationship to the auth fork above.

`mobileRoutes` and `desktopRoutes` intentionally mirror the same path list (`/, /doska, /profile, /tasks, /calendar, /statistics, /settings`) with platform-prefixed page components (`pages/desktop/DesktopDoska.tsx`, `pages/mobile/MobileDoska.tsx`, ...). Keep new routes symmetric across both files unless a page is genuinely platform-exclusive.

### Feature/widget structure (copied from a prior ParkOps-style project)

```
widgets/features/<desktop|mobile>/<feature>/
  components/            feature-local components (not shared)
  hooks/useApi<Feature>.ts   TanStack Query keys + queries/mutations, one file
  types/index.ts
  Feature<Name>.tsx       the actual screen implementation
pages/<desktop|mobile>/<Platform><Name>.tsx   one-line wrapper that only renders the Feature
```

`widgets/features/login/` is the one exception — platform-agnostic, used only by the auth-fork gate above, not routed normally.

Query key + query/mutation convention (see `widgets/features/mobile/tasks/hooks/useApiTasks.ts`): a `<DOMAIN>_KEYS` object of key-builder functions, then one `useX` hook per query/mutation calling the matching `api/<resource>/<resource>.api.ts` function. API files are flat objects of thin `axiosInstance` wrappers keyed by resource, one file per backend resource under `api/<resource>/`.

Adding a new screen: create the `widgets/features/<platform>/<feature>/` folder per the template above, add a one-line wrapper in `pages/<platform>/`, register it in both `routes.desktop.tsx` and `routes.mobile.tsx`. Something used by more than one feature moves to `components/ui/` (Cus* kit) or `hooks/`/`utils/`, not left duplicated inside a feature folder.

### Cus* UI kit — mandatory, Chakra-coupled

`components/ui/` is a kit of ~20 `Cus*` components (`CusButton`, `CusInput`, `CusSelect`, `CusDialog`, `CusDrawer`, `CusTable`, `CusCalendar`, `CusPopover`, ...) copied from a prior project and built on **Chakra UI v3** (`@chakra-ui/react`, via Ark UI/Zag.js primitives internally) plus `chakra-system.ts` (`createSystem(defaultConfig, { disableLayers: true })`), wrapped around the app in `App.tsx` via `<ChakraProvider value={system}>`.

**Rule: page/feature content must be built only from existing `Cus*` components** — never a raw Chakra element or a hand-rolled Tailwind button/input/card directly in a page or feature. If no existing `Cus*` component fits a wireframe element, ask before inventing one; don't design a new component unilaterally. Card/wrapper blocks specifically use `CusCardbox`, never a bare `div`.

Two components are the exception and are Chakra-free, plain Tailwind: `CusCardbox` (border+padding wrapper) and `CusPageTitle` (h1+description wrapper). `src/components/ui-custom/` is a newer, separate kit being built the same Chakra-free way (starting with `CusButton`) as a possible path off Chakra — it exists alongside `components/ui/`, not a replacement for it yet; don't assume every `Cus*` name resolves to `components/ui/` without checking which kit it's actually in.

Layout chrome (`components/layout/**` — Sidebar, Header, BottomTabBar) is exempt from the Cus*-only rule since it isn't page content; it's written with raw Tailwind, using `CusPopover` where an interactive dropdown is needed (e.g. the workspace switcher).

### No i18n

All UI text is hardcoded **Russian**, written directly in components. There is no `useTranslation`/i18n abstraction anywhere — don't introduce one or reference a translation key when adding text.

### State and data

- `store/session.store.ts` (Zustand) — token persisted in `localStorage` (`qubnix_token`), rehydrated on load. `status` drives the auth-fork gate in `AppRoutes.tsx`.
- `store/workspace.store.ts` — currently static mock data (3 hardcoded workspaces + per-workspace project filters); `selectedWorkspaceId` persisted in `localStorage` (`qubnix_selected_workspace`). There is no backend workspace-list endpoint wired up yet — `api/workspace/workspace.api.ts` only covers a single "current" workspace and isn't used by this store.
- `api-config/axiosInstance.ts` + `interceptors.ts` — request interceptor attaches `Authorization: Bearer <token>` from the session store; response interceptor clears the session on `401`.
- Design tokens consumed by `Cus*` components (`--bg-second`, `--text-default`, `--border-default`, `--color-blue`, `--vio`, etc.) live in `src/styles/globals.css` `:root`/`.dark` — changing a Cus* component's look usually means editing these tokens, not the component markup.

### Misc gotchas

- Path alias `@` → `src/` (`vite.config.ts`, `tsconfig.app.json`).
- Don't put a `.ts` and `.d.ts` file with the same base name in one folder — TypeScript silently drops the `.d.ts` from compilation. Ambient types live in `types-global/` for this reason (e.g. `telegram-window.d.ts` augments `Window.Telegram`, deliberately not named `telegram.d.ts` next to `utils/telegram.ts`).
- The user's C: drive tends to run low on space; if `npm install` fails with `ENOSPC`, retry with `npm install --cache "D:/temp-npm-cache"` rather than changing global npm config.
