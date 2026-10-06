/**
 * To'liq logo intro (QubnixLogoIntro) har yangi ochilishda bir marta chiqadi,
 * shu sessiyadagi keyingi yuklanishlarda AuthLoading oddiy loading holatida
 * (pulsatsiyali icon + spinner).
 *
 * sessionStorage — ataylab: sahifa yangilansa yoki OS fondagi tabni qayta
 * yuklasa saqlanib qoladi (intro takrorlanmaydi), ilova/tab yopilganda o'chadi
 * (qayta kirganda intro yana chiqadi). Telegram Mini App yopilganda WebView
 * bilan birga o'chadi; "minimize" qilinib qaytilganda JS qayta yuklanmaydi.
 *
 * Belgi intro oxirigacha ko'rilgandagina qo'yiladi.
 */
const INTRO_SEEN_KEY = "qubnix_intro_seen";

// Safari private rejimi va bloklangan saqlash storage'da xato tashlaydi.
export function hasSeenIntro(): boolean {
  try {
    return sessionStorage.getItem(INTRO_SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

export function markIntroSeen(): void {
  try {
    sessionStorage.setItem(INTRO_SEEN_KEY, "1");
  } catch {
    // Saqlab bo'lmasa — keyingi yuklanishda intro yana chiqadi, xolos.
  }
}
