function webApp() {
  return window.Telegram?.WebApp;
}

export function initTelegramWebApp(): void {
  const tg = webApp();
  tg?.ready();
  tg?.expand();
  // requestFullscreen Bot API 8.0+ da qo'shilgan — eski klientlarda bu
  // metod umuman mavjud emas, shuning uchun expand() ham baribir chaqiriladi
  // (u eski klientlar uchun eng yaqin muqobil — maksimal balandlikka ochadi).
  tg?.requestFullscreen?.();
  // Header/body oq (#ffffff) — shuni Telegram'ga aytib qo'yamiz, aks holda
  // status-bar soat/ikonalari kontrast rangini noto'g'ri (masalan oq fonda
  // oq matn) tanlab, ko'rinmay qolishi mumkin (Bot API 6.1+).
  tg?.setHeaderColor?.("#ff0000");
  tg?.setBackgroundColor?.("#3b82f6");
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
