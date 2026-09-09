# qubnix

React + TypeScript + Tailwind + Zustand + TanStack Query. Bitta repo, bitta shared core; ikkita mustaqil fork. Folder konvensiyasi `park-system-mobile-main` loyihasidagi naqshga mos (`widgets/features/<...>/` + yupqa `pages/`), rol o'rniga **platforma** bo'yicha bo'lingan.

- **Auth fork** (`src/bootstrap`) — Telegram ichida (`isTelegramMiniApp()`, `src/utils/platform.ts`) bo'lsa silent init-data auth, aks holda web foydalanuvchi token'siz bo'lsa `AuthGuard` uni `/login`ga yo'naltiradi (Telegram Login Widget).
- **Layout fork** (`src/hooks/useLayoutMode.ts`) — ekran kengligiga qarab (`min-width: 768px`), resize'ga reaktiv: keng ekran -> `AppLayout` (sidebar), tor ekran -> `MobileLayout` (bottom-tab).

Ikkovi bir-biriga bog'liq emas: Telegram Desktop (keng oyna) -> `AppLayout` + silent Telegram auth; brauzerda telefon (tor ekran) -> `MobileLayout`, login umuman yo'q ekranlar TMA silent-auth bilan ishlaydi.

## Struktura

```
src/
├── main.tsx, App.tsx            bootstrap -> QueryClientProvider -> BrowserRouter
├── api-config/                  axiosInstance, interceptors (Bearer + 401), queryClient
├── api/                         backend resursi bo'yicha papka: api/<resurs>/<resurs>.api.ts
├── types/                       API request/response type'lari (*.types.ts)
├── components/
│   ├── layout/web/               AppLayout + sidebar/ + header/
│   ├── layout/mobile/            MobileLayout + nav/ (BottomTabBar) + header/
│   └── ui/                       Button, Input, Modal, Toast
├── widgets/features/
│   ├── login/                    faqat web: api-siz, hooks/useTelegramWidgetLogin.ts + components/ + FeatureLogin.tsx
│   ├── web/<feature>/            components/ hooks/useApi<Feature>.ts types/ Feature<Name>.tsx
│   └── mobile/<feature>/         xuddi shu shablon
├── pages/                        YUPQA wrapper — faqat mos Feature'ni chaqiradi
├── routes/                       routes.web.tsx, routes.mobile.tsx (static), AppRoutes.tsx (layout fork + useRoutes)
├── middleware/AuthGuard.tsx      token yo'q -> /login
├── bootstrap/                    auth fork: bootstrap.web.ts / bootstrap.telegram.ts
├── store/                        Zustand: session.store.ts, ui.store.ts
├── hooks/, utils/, const/, theme/, types-global/, styles/
```

Yangi sahifa qo'shish:
1. `widgets/features/<web|mobile>/<feature>/` papkasini oldingi na'muna (masalan `dashboard`, `tasks`) tuzilishida yarating: `components/`, `hooks/useApi<Feature>.ts` (query key'lar + query/mutation'lar bitta faylda), `types/index.ts`, `Feature<Name>.tsx`.
2. `pages/<web|mobile>/<Name>.tsx` — bir qatorlik wrapper: `export default function Name() { return <Feature.../>; }`.
3. `routes/routes.web.tsx` yoki `routes.mobile.tsx`ga qo'shing.

Qoida: `widgets/features/<platform>/<feature>/` ichidagi narsa faqat o'sha feature uchun. Ikkinchi marta boshqa joyda kerak bo'lganda `components/ui/` yoki `hooks/`/`utils/`ga ko'chiring.

## Ishga tushirish

```bash
npm install
cp .env.example .env   # VITE_API_URL'ni to'ldiring
npm run dev
```

- `npm run build` — production build
- `npm run typecheck` — faqat TypeScript tekshiruvi
