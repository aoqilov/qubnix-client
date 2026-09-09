export type StaticPlatform = "pathtg" | "pathweb";

// Telegram bot/domen hali sozlanmagani uchun haqiqiy Telegram aniqlash
// vaqtincha TO'XTATILGAN. Shu qiymatni qo'lda o'zgartirib ikkala
// rejimni (tg / web) haqiqiy Telegram'siz sinab ko'rish mumkin.
//
// Bot + domen tayyor bo'lganda buni qaytaring va pastdagi funksiyani
// asl holiga o'zgartiring:
//   export function isTelegramMiniApp(): boolean {
//     return Boolean(window.Telegram?.WebApp?.initData);
//   }
export const STATIC_PLATFORM: StaticPlatform = "pathtg";

export function isTelegramMiniApp(): boolean {
  return STATIC_PLATFORM === "pathtg";
}
