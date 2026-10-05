import { registerSW } from "virtual:pwa-register";
import { usePwaStore } from "@/store/pwa.store";
import { isTelegramMiniApp } from "@/utils/platform";

/** Ilova uzoq ochiq tursa ham yangi versiya shu oraliqda tekshiriladi. */
const UPDATE_CHECK_INTERVAL_MS = 30 * 60 * 1000;

/**
 * Boot'da (main.tsx) bir marta chaqiriladi.
 * - `beforeinstallprompt` sahifa ochilishi bilan keladi — profil ochilguncha kutmasdan ushlab qo'yiladi.
 * - Service worker faqat web'da: Telegram Mini App'ni har ochilishda o'zi qayta yuklaydi, SW u yerda
 *   eski versiyani keshdan berib qo'yishi mumkin (iOS Telegram'da esa umuman ishlamaydi).
 * - Yangi versiya yuklab bo'linganda o'zi qo'llanmaydi: `needRefresh` → PwaUpdateToast → user tasdiqlaydi.
 */
export function registerPwa() {
  const store = usePwaStore.getState();

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    store.setInstallPrompt(event);
  });
  window.addEventListener("appinstalled", () => store.markInstalled());

  if (import.meta.env.DEV || isTelegramMiniApp() || !("serviceWorker" in navigator)) return;

  const updateSW = registerSW({
    onNeedRefresh: () => store.setNeedRefresh(true),
    onRegisteredSW: (_url, registration) => {
      if (!registration) return;
      const check = () => {
        if (navigator.onLine) void registration.update();
      };
      setInterval(check, UPDATE_CHECK_INTERVAL_MS);
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") check();
      });
    },
  });
  store.setApplyUpdate(() => void updateSW(true));
}
