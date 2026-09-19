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
   - In `routes/AppRoutes.tsx`, if not in Telegram **and** session isn't `"authenticated"`, the entire router is replaced by `widgets/features/login/FeatureLogin.tsx` instead of any route tree. `FeatureLogin` is a two-tab screen (`CusSegment`): **Login** → `LoginPhoneForm` (phone + OTP via `usePhoneLogin`, which calls `setSession()` on success and then `useLoginRedirect()`); **Ro'yxatdan o'tish** → `TelegramRegisterPanel`, which only explains the bot flow and deep-links to `@<bot>` (`login/lib/bot.ts`) — registration happens entirely inside the Telegram bot, there is no in-app sign-up.
   - The phone/OTP backend doesn't exist yet. `api/auth/auth.api.ts` has a single `USE_MOCK_PHONE_AUTH = true` switch that routes `sendPhoneCode`/`verifyPhoneCode` to `api/auth/auth.mock.ts` (accepts only code `123456`, 120s TTL). When the real endpoints land, flip that one flag — hooks, forms and types stay untouched. Don't add a second mock path elsewhere.
   - `TelegramLoginButton.tsx` and `useTelegramWidgetLogin.ts` exist and target `POST /auth/telegram-widget`, but **nothing imports them** — the widget isn't wired up because the backend login flow (legacy hash-based vs Telegram's newer OIDC flow) isn't decided yet.
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

If a feature opens a `CusDrawer` or `CusDialog`, put that component in a `modals/` folder inside the feature (`widgets/features/<platform>/<feature>/modals/`), not in `components/` — see `settings-members/modals/InvitePersonDrawer.tsx` for the existing precedent.

Query key + query/mutation convention (see `widgets/features/mobile/tasks/hooks/useApiTasks.ts`): a `<DOMAIN>_KEYS` object of key-builder functions, then one `useX` hook per query/mutation calling the matching `api/<resource>/<resource>.api.ts` function. API files are flat objects of thin `axiosInstance` wrappers keyed by resource, one file per backend resource under `api/<resource>/`.

Adding a new screen: create the `widgets/features/<platform>/<feature>/` folder per the template above, add a one-line wrapper in `pages/<platform>/`, register it in both `routes.desktop.tsx` and `routes.mobile.tsx`. Something used by more than one feature moves to `components/ui/` (Cus* kit) or `hooks/`/`utils/`, not left duplicated inside a feature folder.

### Design tokens — bitta manba

Barcha rang, radius, oraliq va soya qiymatlari `src/styles/globals.css` da CSS o'zgaruvchi sifatida yashaydi. Ular Figma "Qubnix Redesign" faylining Variables kolleksiyasidan generatsiya qilingan. Fayl 9 blokdan iborat va **blok tartibi ma'noli**.

**Qat'iy qoidalar:**

1. **Komponentda hech qachon hex, rgba yoki `#` yozilmaydi.** Faqat `var(--token)` yoki unga bog'langan Tailwind sinfi (`bg-surface`, `text-secondary`, `border-subtle`, `rounded-card`).
2. **Yangi kod faqat semantik token ishlatadi** — 2-6 bloklardan:
   - fon: `--bg-canvas`, `--bg-surface`, `--bg-surface-secondary`, `--bg-overlay`
   - matn: `--text-primary`, `--text-secondary`, `--text-disabled`, `--text-inverse`, `--text-on-brand`
   - chegara: `--border-default`, `--border-subtle`, `--border-focus`
   - brend: `--brand-default`, `--brand-hover`, `--brand-pressed`, `--brand-subtle-bg`
   - holat: `--status-{success|warning|error}-{text|bg|solid}`, `--status-{info|progress}-{text|bg}` — info va progress uchun Figma'da `solid` varianti yo'q
   - teg/avatar: `--accent-{teal|orange|pink|cyan}`, `--avatar-1…6`
   - radius: `--radius-{input|button|card|popover|modal|chip|avatar}`
   - oraliq: `--space-1…16`, z-index: `--z-{sticky|dropdown|drawer|modal|toast}`
3. **7-blokdagi `⛔ DEPRECATED` alias'lar taqiqlangan.** `--vio`, `--accent`, `--bg-main`, `--bg-second`, `--bg-hover`, `--bg-input`, `--text-default`, `--text-2/3/4`, `--text-muted`, `--text-dim`, `--border-2`, `--border-input`, `--color-blue/red/green*`, `--vio-10`, `--text-on-accent` — bularni **faqat eski `components/ui/` fayllarida uchratishingiz mumkin**. Yangi joyda yozmang; eski joyda ko'rsangiz — ko'chirish uchun nomzod.
4. **Komponentni tokenga ko'chirish** — mustaqil, xavfsiz operatsiya: fayldagi barcha legacy nomlarni yuqoridagi ro'yxat bo'yicha semantik nomga almashtirasiz, vizual natija o'zgarmasligi kerak (alias'lar aynan shu qiymatlarga ishora qiladi). Ko'chirish tugagach, o'sha alias faqat shu komponentda ishlatilgan bo'lsa — `globals.css` ning 7-blokidan o'chiring.
5. **Qiymatni o'zgartirish faqat 1-3 bloklarda.** Figma'dagi variable o'zgarsa — primitiv yoki semantik qiymat yangilanadi, komponent fayllari umuman ochilmaydi.
6. **Dark tema** — `.dark` sinfi orqali (3-blok). Yangi token qo'shsangiz, **light va dark, ikkalasiga ham** qiymat bering; aks holda dark rejimda light qiymat qolib ketadi.
7. **Yangi token ixtiro qilmang.** Figma'da yo'q rang kerak bo'lsa — so'rang, o'zingizdan qo'shmang. Istisno: 5-blok (spacing) va typography hozircha Figma'da yo'q, taklif sifatida turibdi.

**Tailwind sinflari** — `tailwind.config.ts` da har bir semantik token'ga sinf bog'langan. `bg-surface` va `bg-[var(--bg-surface)]` bir xil natija beradi; birinchisi afzal.

| Token | Tailwind sinfi |
|---|---|
| `--bg-canvas` / `--bg-surface` / `--bg-surface-secondary` / `--bg-overlay` | `bg-canvas`, `bg-surface`, `bg-surface-secondary`, `bg-overlay` |
| `--text-primary` / `-secondary` / `-disabled` / `-inverse` / `--text-on-brand` | `text-primary`, `text-secondary`, `text-disabled`, `text-inverse`, `text-on-brand` |
| `--border-default` / `-subtle` / `-focus` | `border-default`, `border-subtle`, `border-focus` |
| `--brand-default` / `-hover` / `-pressed` / `-subtle-bg` | `brand`, `brand-hover`, `brand-pressed`, `brand-subtle` (bg/text/border prefiksi bilan) |
| `--status-<X>-solid` / `-bg` / `-text` | `<X>`, `<X>-soft`, `<X>-strong` — bu yerda `<X>` = `success`/`warning`/`error`/`info`/`progress`. Masalan `bg-error`, `bg-error-soft`, `text-error-strong` |
| `--accent-{teal|orange|pink|cyan}` | `teal`, `orange`, `pink`, `cyan` (Tailwind'ning standart 50–900 shkalasi bu nomlarda **almashtirilgan** — `bg-teal-500` endi yo'q) |
| `--radius-*` | `rounded-input` (8px), `rounded-button` / `rounded-card` (12px), `rounded-popover` (16px), `rounded-modal` (24px), `rounded-chip` / `rounded-avatar` (dumaloq) |
| `--shadow-*` | `shadow-sm`, `shadow-md`, `shadow-dropdown`, `shadow-modal` — `shadow-sm`/`shadow-md` Tailwind standartini **almashtiradi** (dark temada kuchliroq soya beradi) |
| `--z-*` | `z-sticky`, `z-dropdown`, `z-drawer`, `z-modal`, `z-toast` |

`--space-*` uchun Tailwind sinfi qo'shilmagan: standart shkala (`p-1`=4px, `p-2`=8px, …) allaqachon aynan shu qiymatlar. `--space-*` faqat inline CSS / `calc()` uchun.

**Avatar/workspace ranglari** — `src/utils/avatarColor.ts` dagi `avatarColorVar(id)` orqali, qo'lda tanlanmaydi. ID'dan barqaror hash olinadi va `--avatar-1…6` dan biri qaytadi, ya'ni bir xil workspace doim bir xil rangda. `store/workspace.store.ts` dagi mock ma'lumot hali hex saqlaydi — backend ulanganda o'sha maydon olib tashlanib, rang shu funksiyadan olinadi.

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
- Existing `Cus*` components still read the **legacy alias** names (`--bg-second`, `--text-default`, `--color-blue`, `--vio`, …). Those are block 7 of `globals.css` and are deprecated — see "Design tokens" above. To change how a Cus* component looks, edit the semantic token it ultimately resolves to (blocks 2–3), not the alias and not the component markup.

### Misc gotchas

- Path alias `@` → `src/` (`vite.config.ts`, `tsconfig.app.json`).
- Don't put a `.ts` and `.d.ts` file with the same base name in one folder — TypeScript silently drops the `.d.ts` from compilation. Ambient types live in `types-global/` for this reason (e.g. `telegram-window.d.ts` augments `Window.Telegram`, deliberately not named `telegram.d.ts` next to `utils/telegram.ts`).
- The user's C: drive tends to run low on space; if `npm install` fails with `ENOSPC`, retry with `npm install --cache "D:/temp-npm-cache"` rather than changing global npm config.
