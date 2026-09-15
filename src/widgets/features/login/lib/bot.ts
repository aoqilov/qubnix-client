export const BOT_USERNAME =
  import.meta.env.VITE_TELEGRAM_BOT_USERNAME ?? "qubnix_bot";

export const BOT_URL = `https://t.me/${BOT_USERNAME}`;

/** Botni brauzer/Telegram ilovasida yangi oynada ochadi. */
export function openBot(startParam?: string) {
  const url = startParam ? `${BOT_URL}?start=${startParam}` : BOT_URL;
  window.open(url, "_blank", "noopener,noreferrer");
}
