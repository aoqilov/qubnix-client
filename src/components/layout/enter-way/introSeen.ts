/**
 * To'liq logo intro (QubnixLogoIntro) faqat birinchi ochilishda chiqadi, keyingi
 * ochilishlarda AuthLoading oddiy loading holatida (pulsatsiyali logo + matn).
 * Belgi intro oxirigacha ko'rilgandagina qo'yiladi: yarmida yopilsa — keyingi
 * ochilishda yana to'liq chiqadi.
 */
const INTRO_SEEN_KEY = "qubnix_intro_seen";

// Safari private rejimi va bloklangan saqlash localStorage'da xato tashlaydi.
export function hasSeenIntro(): boolean {
  try {
    return localStorage.getItem(INTRO_SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

export function markIntroSeen(): void {
  try {
    localStorage.setItem(INTRO_SEEN_KEY, "1");
  } catch {
    // Saqlab bo'lmasa — keyingi ochilishda intro yana chiqadi, xolos.
  }
}
