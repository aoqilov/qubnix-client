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
