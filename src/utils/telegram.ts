function webApp() {
  return window.Telegram?.WebApp;
}

export function initTelegramWebApp(): void {
  const tg = webApp();
  tg?.ready();
  tg?.expand();
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
