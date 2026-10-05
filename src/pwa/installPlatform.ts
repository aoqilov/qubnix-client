export type InstallPlatform = "ios" | "android" | "desktop";

/** Qaysi yo'riqnoma birinchi ochilsin. Telegram webview UA'si ham OS'ni ko'rsatadi. */
export function detectInstallPlatform(): InstallPlatform {
  const ua = navigator.userAgent;
  // iPadOS 13+ o'zini Mac deb ko'rsatadi — sensorli ekran orqali ajratiladi.
  if (/iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)) return "ios";
  if (/Android/.test(ua)) return "android";
  return "desktop";
}

/** Telegram ichidan "Brauzerda ochish" — o'rnatish yo'riqnomasi avtomatik ochiladigan web manzil. */
export function webInstallUrl(): string {
  const base = (import.meta.env.VITE_WEB_APP_URL || window.location.origin).replace(/\/+$/, "");
  return `${base}/profile?install=1`;
}
