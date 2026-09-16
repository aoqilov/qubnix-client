function webApp() {
  return window.Telegram?.WebApp;
}

// globals.css'dagi --bg-canvas bilan bir xil (light: --c-neutral-50,
// dark: --c-ink-950) — CSS o'zgaruvchisini o'qib bo'lmagani uchun (Telegram
// WebApp API hex talab qiladi) qiymatlar shu yerda qo'lda takrorlangan.
const TG_CHROME_COLOR = {
  light: "#f8fafc",
  dark: "#0c111d",
} as const;

// Header/body fonini joriy mavzuga (dark/light) moslab qo'yamiz, aks holda
// Telegram status-bar soat/ikonalari kontrast rangini noto'g'ri (masalan
// qorong'u fonda qora matn) tanlab, ko'rinmay qolishi mumkin (Bot API 6.1+).
export function syncTelegramChrome(isDark: boolean): void {
  const tg = webApp();
  const color = isDark ? TG_CHROME_COLOR.dark : TG_CHROME_COLOR.light;
  tg?.setHeaderColor?.(color);
  tg?.setBackgroundColor?.(color);
}

export function initTelegramWebApp(): void {
  const tg = webApp();
  tg?.ready();
  tg?.expand();
  // requestFullscreen Bot API 8.0+ da qo'shilgan — eski klientlarda bu
  // metod umuman mavjud emas, shuning uchun expand() ham baribir chaqiriladi
  // (u eski klientlar uchun eng yaqin muqobil — maksimal balandlikka ochadi).
  tg?.requestFullscreen?.();
  syncTelegramChrome(document.documentElement.classList.contains("dark"));
  // Aks holda pastga scroll qilib chegaraga yetganda Telegram buni
  // "pastga svayp" deb tushunib, mini-app'ni yopib/minimallashtirib
  // qo'yishi mumkin (Bot API 7.7+).
  tg?.disableVerticalSwipes?.();
}

export function getTelegramInitData(): string | null {
  return webApp()?.initData ?? null;
}

export function setBackButton(onClick: () => void): () => void {
  const back = webApp()?.BackButton;
  back?.show();
  back?.onClick(onClick);
  return () => {
    back?.offClick(onClick);
    back?.hide();
  };
}
