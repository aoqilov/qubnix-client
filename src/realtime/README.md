# Real-time (SSE)

Backend `GET /api/v1/events` orqali Server-Sent Events oqimini yuboradi. Bu papka shu oqimga ulanadi va kelgan hodisaga qarab TanStack Query keshini yangilaydi. UI chiqarmaydi — natija faqat ro'yxatlarning o'zi yangilanishida ko'rinadi.

## Umumiy oqim

```
App.tsx
└─ <RealtimeBridge />                 sessiya "authenticated" bo'lganda ulanadi
   └─ connectRealtime(handlers)       connect.ts — transportni tanlaydi
      ├─ connectTelegramSse            fetch streaming + `initdata` header
      └─ connectWebSse                 EventSource + cookie (eski web sessiya)
            │
            ▼  hodisa
   onConnected    → resyncAll()                       barcha query'lar invalidate
   onEvent        → invalidateForEvent()              hodisa → query kalitlari
                  → lostAccessToSelectedWorkspace()   workspace'dan chiqarildikmi
   onUnauthorized → clearSession()
```

## 1. Qayerda ulanadi — `RealtimeBridge.tsx`

`App.tsx` da `<BrowserRouter>` ichida, `<AppRoutes />` dan oldin turadi:

- **`main.tsx` emas** — `enterWay()` tugamaguncha sessiya yo'q, oqim esa autentifikatsiya talab qiladi.
- **`AppRoutes` emas** — u `useRoutes` bilan shoxlarga bo'linadi (login / desktop / mobile), bu ulanishni keraksiz uzib-ulaydi.
- **`BrowserRouter` ichida** — workspace'dan chiqarilganda `/doska` ga `navigate` qilish uchun.

Effekt `sessionStatus === "authenticated"` bo'lganda ulanadi va `sessionStatus`, `initData` yoki `reconnectNonce` o'zgarsa qayta ulanadi. Cleanup kutilayotgan invalidate'larni bekor qiladi va oqimni yopadi.

`currentUserId` va `navigate` effekt bog'liqligiga qo'yilmagan, ref orqali o'qiladi — aks holda har navigatsiyada oqim qayta ochilardi.

**Fondan qaytish.** Mobil OS (ayniqsa Telegram WebView) fonda oqimni `error` bermasdan o'ldirishi mumkin. Shuning uchun `visibilitychange`: oyna ko'rinadigan bo'lsa va status `"live"` bo'lmasa — `reconnectNonce` oshiriladi, oqim noldan ochiladi.

## 2. Transport tanlash — `connect.ts`

URL: `${VITE_API_URL}/api/v1/events` (oxiridagi `/` olib tashlanadi).

| Shart | Transport | Sessiya qanday yuboriladi |
|---|---|---|
| `isTelegramMiniApp()` **yoki** `session.store` da `initData` bor | `connectTelegramSse` — fetch streaming | `initdata` header |
| Aks holda (init_data saqlanishidan oldingi eski web sessiya) | `connectWebSse` — `EventSource` | `qubnix_session` cookie, `withCredentials` |

Sabab: `EventSource` maxsus header yubora olmaydi, sessiya esa `initdata` header'ida (`api-config/interceptors.ts` dagi kabi). Hozirgi web login ham `init_data` saqlaydi, ya'ni amalda deyarli hamma joyda fetch transporti ishlaydi — nomidagi "telegram" tarixiy.

Modul darajasida bitta ulanish (`activeDisconnect`): yangi `connectRealtime()` chaqiruvi oldingisini yopadi, shuning uchun HMR yoki ikki marta mount ikkinchi oqim ochmaydi.

## 3. Transportlar

### `sse.client.telegram.ts` — fetch streaming

Bitta urinish (`attempt`):

1. `initData` yo'q → to'xtaydi.
2. `fetch(url, { headers: { initdata, Accept: "text/event-stream" }, cache: "no-store", signal })`.
3. Javob:
   - `401` → `onUnauthorized()`, **qayta urinilmaydi**;
   - boshqa `!ok` → `offline`, backoff bilan qayta urinish;
   - `response.body` yo'q (juda eski WebView) → `offline`, **to'xtaydi**. Real-time o'chadi, ilova oddiy refetch bilan ishlashda davom etadi.
4. Oqim ochildi → `failures = 0`, status `live` (`connected` kelishini kutmaydi).
5. `reader.read()` sikli: `TextDecoder` → `parseSseFrames(buffer)` → har bir kadr `handleFrameData` ga. Chala kadr `rest` bo'lib keyingi chunk'ka qo'shiladi.
6. Oqim tugadi (server yopdi / tarmoq uzildi) → `offline` → backoff → qayta urinish.

Tashqi `run()` sikli `closed` bo'lguncha aylanadi. `disconnect()` → `AbortController.abort()`; `AbortError` xato hisoblanmaydi.

`parseSseFrames.ts` — sof funksiya: `\r\n` ni normallashtiradi, `\n\n` bo'yicha kadrlarga bo'ladi, `event:` / `data:` (ko'p qatorli — `\n` bilan birlashadi) / `id:` ni o'qiydi, `:` bilan boshlanuvchi keep-alive izohlarni tashlaydi, `retry:` ni e'tiborsiz qoldiradi (backoff o'zimizda).

### `sse.client.web.ts` — EventSource + cookie

- `new EventSource(url, { withCredentials: true })`.
- `connected` va `SSE_EVENT_TYPES` dagi har bir tur uchun alohida `addEventListener` — ro'yxatda yo'q nom shunchaki eshitilmaydi.
- `onopen` → `failures = 0`, `live`.
- `onerror` → `failures++`, `offline`. Brauzer o'zi qayta ulanadi (server `retry: 3000` beradi). Faqat `readyState === CLOSED` bo'lsa (brauzer taslim bo'lgan) — backoff bilan yangi `EventSource` ochiladi.
- `EventSource` xato sababini bermaydi (401 ham oddiy `error`). Shuning uchun **3-xatoda** (`SESSION_PROBE_AFTER_FAILURES`) bitta `usersApi.me()` so'rovi yuboriladi: 401 bo'lsa — oqim yopiladi va `onUnauthorized()`.

### Backoff — `backoff.ts`

`min(1000 · 2^n, 30000) + random(0..500)` ms. `n` — ketma-ket xatolar soni va u chaqiruvdan **oldin** oshiriladi, shuning uchun amaldagi kutish: ~2s, 4s, 8s, 16s, keyin 30s. Jitter — ko'p mijoz bir vaqtda uzilsa serverga birdan urilmasligi uchun. Oqim muvaffaqiyatli ochilishi bilan hisob nolga qaytadi.

## 4. Protokol — `sse.types.ts`

**`connected`** — boshqaruv hodisasi, ulanish ochilganda server yuboradi → status `live` + `onConnected()` → `resyncAll()`.

**Ma'lumot hodisalari** — `SSE_EVENT_TYPES` ro'yxati (`project.*`, `organization.invitation.*`, `organization.member.*`, `task.*`, `routine.task_created`). Har birining `data:` qismi — JSON `SseEnvelope`:

```ts
{
  id, type, version,
  occurred_at,       // ISO-8601
  actor_id,          // hodisani keltirib chiqargan foydalanuvchi
  organization_id,   // null bo'lishi mumkin
  project_id,        // null bo'lishi mumkin
  resource_id,
  data,              // turga xos payload
}
```

Noma'lum hodisa nomi tashlanadi (DEV'da `console.warn`), buzuq JSON oqimni to'xtatmaydi.

**Server hodisa tarixini saqlamaydi** (`Last-Event-ID` ishlatilmaydi): uzilish davridagi hodisalar yo'qoladi. Shuning uchun har (qayta) ulanishda `resyncAll()` — `queryClient.invalidateQueries()` bilan barcha query'lar yangilanadi.

## 5. Hodisaga ishlov berish

### Kesh yangilash — `invalidation.ts`

`invalidateForEvent(queryClient, envelope, selfUserId)`:

1. **O'z amalimiz filtrlanadi.** `actor_id === selfUserId` va tur `SELF_COVERED_TASK_EVENTS` da bo'lsa — hech narsa qilinmaydi: mahalliy mutation keshni allaqachon yangilagan, ikkinchi refetch keraksiz (masalan kanban'da statusni tez almashtirishda). `task.access_revoked` bu ro'yxatda yo'q — har doim ishlaydi.
2. **`keysFor()`** — hodisa → query kalit prefikslari:

   | Hodisa | Yangilanadigan kalitlar |
   |---|---|
   | `task.*`, `routine.task_created` | `PROJECTS_KEYS.list(org)`, `DOSKA_KEYS.workspaces()`, `DOSKA_KEYS.personal()` |
   | `project.created/updated/deleted` | `PROJECTS_KEYS.list(org)` |
   | `project.member_added/removed` | `PROJECTS_KEYS.list(org)`, `MEMBERS_KEYS.all(org)` |
   | `organization.invitation.created` | `INVITATIONS_KEYS.sent(org)`, `DOSKA_KEYS.invitations()` |
   | `organization.invitation.accepted` | takliflar + `MEMBERS_KEYS.all(org)` + `DOSKA_KEYS.workspaces()` |
   | `organization.invitation.rejected/cancelled` | takliflar + `MEMBERS_KEYS.all(org)` |
   | `organization.member.created` | `MEMBERS_KEYS.all(org)`, `DOSKA_KEYS.workspaces()` |
   | `organization.member.updated/removed` | `SETTINGS_KEYS.organization(org)` — butun tashkilot daraxti, `DOSKA_KEYS.workspaces()` |
   | `organization_id === null` | `["organizations"]` — hammasi, `DOSKA_KEYS.workspaces()`, `DOSKA_KEYS.personal()` |

   Kalitlar ierarxik: `PROJECTS_KEYS.list(org)` = `["organizations", org, "projects"]` ostida vazifalar ro'yxati, `task_counts`, kalendar va member-statistics yashaydi. Kalit quruvchilar feature hook'laridan **import qilinadi**, nusxalanmaydi — feature tomonda kalit o'zgarsa bu yer jimgina eskirib qolmasligi uchun.
3. **Debounce — 300 ms, kalit bo'yicha.** Bitta amal bir nechta hodisa beradi (`updated` + `assignees_changed` + `subtasks_changed`), ular bitta refetch'ga birlashadi.
4. **"Bo'sh" prefiks solishtirish** (`matchesKeyPrefix`). Id backend javobida son (`11`), hodisada matn (`"11"`) bo'lishi mumkin; React Query'ning qat'iy solishtiruvi bunda hech narsani topmaydi, shuning uchun qiymatlar `String()` orqali solishtiriladi.

### Workspace'dan chiqarilish — `membership.ts`

`organization.member.removed` hozir tanlangan workspace'da kelsa, payload'dagi user maydoniga tayanmasdan (sxemasi hujjatlanmagan) `organizationsApi.getById()` so'raladi. `403`/`404` → kirish yo'qolgan: `clearSelectedWorkspace()`, so'ng `RealtimeBridge` `/doska` ga `replace` bilan yo'naltiradi. So'rov davomida foydalanuvchi boshqa workspace tanlab ulgurgan bo'lsa — tegilmaydi.

### 401

Ikkala transport ham `onUnauthorized()` → `clearSession()` chaqiradi (web'da `AppRoutes` login ekraniga o'tadi), effekt cleanup'i oqimni yopadi.

## 6. Statuslar

`SseStatus = "connecting" | "live" | "offline"`. Hozircha UI'da ko'rsatilmaydi — faqat `RealtimeBridge` dagi `statusRef` (fondan qaytganda qayta ulanish qarori uchun) va DEV log'da ishlatiladi.

## 7. Yangi hodisa turi qo'shish

1. `sse.types.ts` → `SSE_EVENT_TYPES` ga nomni qo'shing.
2. `npm run typecheck` — `invalidation.ts` dagi `keysFor()` ning `default` shoxida (`const unhandled: never`) xato chiqadi. Shu `switch` ga `case` qo'shing.
3. Hodisani o'zimizning mutation ham keltirib chiqarsa va u keshni o'zi yangilasa — `SELF_COVERED_TASK_EVENTS` ga qo'shing.
4. Turga xos payload kerak bo'lsa — `sse.types.ts` da `<Name>Data` interfeysi (`TaskStatusChangedData` kabi).

Transportlarda alohida ish yo'q: web listener'lari `SSE_EVENT_TYPES` dan avtomatik qo'yiladi, fetch transporti `isSseEventType()` bilan tekshiradi.

## 8. Debug

`npm run dev` da konsolda `[sse]` prefiksi bilan:

- `[sse] connecting` / `live` / `offline` — status o'zgarishi;
- `[sse] event <type> org=… project=… actor=…` — kelgan hodisa;
- `[sse] invalidate [...] mos: N, aktiv: M` — kalit nechta query'ga mos keldi. `mos: 0` bo'lsa — xaritadagi kalit yoki id turi noto'g'ri.

## Fayllar

| Fayl | Vazifa |
|---|---|
| `index.ts` | Tashqi API: `connectRealtime`, `RealtimeBridge`, turlar |
| `RealtimeBridge.tsx` | Sessiyaga bog'lash, fondan qaytganda qayta ulanish, handler'lar |
| `connect.ts` | URL, transport forki, bitta ulanish kafolati |
| `sse.client.telegram.ts` | fetch streaming transporti (`initdata` header) |
| `sse.client.web.ts` | EventSource transporti (cookie) |
| `parseSseFrames.ts` | `text/event-stream` parser (faqat fetch transporti uchun) |
| `backoff.ts` | Qayta ulanish kechikishi, sessiya tekshiruvi chegarasi |
| `sse.types.ts` | Hodisa turlari, envelope, handler kontrakti |
| `invalidation.ts` | Hodisa → query kalitlari, debounce, resync |
| `membership.ts` | Tanlangan workspace'dan chiqarilganini aniqlash |
| `isAxiosUnauthorized.ts` | 401 tekshiruvi (web transportdagi sessiya probe'i uchun) |
