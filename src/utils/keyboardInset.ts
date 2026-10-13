/** Toolbar yashirinishi (~50-80px) klaviatura deb hisoblanmasin. */
const MIN_KEYBOARD_HEIGHT = 120;

/**
 * Virtual klaviatura ochilganda ko'rinib turgan maydonni CSS o'zgaruvchilarga yozadi:
 *   --keyboard-inset — ekran pastidan klaviatura yopib turgan balandlik;
 *   --keyboard-top   — fokusdagi input ko'rinsin deb brauzer sahifani qancha yuqoriga surgani;
 *   --keyboard-open  — klaviatura ochiq bo'lsa 1 (inset 0 bo'lsa ham — pastdagi safe-area kerak emas).
 * Klaviatura yopiq bo'lsa hammasi olib tashlanadi (fallback 0).
 *
 * iOS Safari/PWA va Android Chrome'da klaviatura layout viewport'ni kichraytirmaydi — 100dvh
 * o'zgarmaydi, `fixed` modal'ning footer'i klaviatura ostida qoladi. Faqat `visualViewport`
 * kichrayadi, shuning uchun qiymat o'shandan olinadi.
 *
 * Telegram iOS va Android'da esa webview'ning o'zi klaviatura ustigacha qisqaradi (iOS — ~0.4 s
 * kechikib, Telegram-iOS `WebAppController.swift`). Shunda 100dvh allaqachon klaviatura ustida
 * tugaydi va inset qo'shilmaydi — aks holda klaviatura ikki marta ayirilib, modal yarmigacha
 * qisqaradi. Webview qisqarganda visualViewport hodisa bermasligi mumkin (uning o'lchami
 * o'zgarmaydi), shuning uchun window `resize` ham tinglanadi.
 *
 * Boot'da (main.tsx) bir marta chaqiriladi.
 */
export function trackKeyboardInset(): void {
  const vv = window.visualViewport;
  if (!vv) return;

  const root = document.documentElement;
  let frame = 0;
  // clientHeight — layout viewport balandligi. Klaviatura bo'lishi mumkin bo'lmagan paytdagi
  // qiymati (input fokusda emas) — host webview'ni qisqartirganini aniqlash uchun.
  let fullHeight = root.clientHeight;
  let lastVisibleHeight = fullHeight;

  const update = () => {
    frame = 0;
    const height = root.clientHeight;
    if (!isEditable(document.activeElement)) fullHeight = height;

    const hostResized = fullHeight - height > MIN_KEYBOARD_HEIGHT;
    const inset = hostResized ? 0 : Math.round(height - vv.height - vv.offsetTop);
    // Pinch-zoom ham vv.height'ni kichraytiradi — u klaviatura emas.
    const insetOpen = vv.scale < 1.01 && inset > MIN_KEYBOARD_HEIGHT;

    if (insetOpen) {
      root.style.setProperty("--keyboard-inset", `${inset}px`);
      root.style.setProperty("--keyboard-top", `${Math.round(vv.offsetTop)}px`);
    } else {
      root.style.removeProperty("--keyboard-inset");
      root.style.removeProperty("--keyboard-top");
    }
    if (insetOpen || hostResized) root.style.setProperty("--keyboard-open", "1");
    else root.style.removeProperty("--keyboard-open");

    // Modal ko'rinadigan maydonga qisqargach, fokusdagi input body scroll'idan tashqarida qolib ketmasin.
    const visibleHeight = height - (insetOpen ? inset : 0);
    if (visibleHeight < lastVisibleHeight) requestAnimationFrame(revealFocusedField);
    lastVisibleHeight = visibleHeight;
  };

  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };

  vv.addEventListener("resize", schedule);
  vv.addEventListener("scroll", schedule);
  window.addEventListener("resize", schedule);
  update();
}

function isEditable(el: Element | null): el is HTMLElement {
  return el instanceof HTMLElement && (el.matches("input, textarea, select") || el.isContentEditable);
}

function revealFocusedField() {
  const el = document.activeElement;
  if (!isEditable(el) || !el.closest('[role="dialog"], [role="alertdialog"]')) return;
  el.scrollIntoView({ block: "nearest" });
}

/**
 * CusDialog/CusDrawer positioner'i uchun: klaviatura ochiq bo'lsa modal faqat uning ustidagi
 * ko'rinib turgan maydonni egallaydi — footer tugmalari klaviatura ustida turadi.
 * Klaviatura yopiq bo'lsa Chakra'ning odatiy qiymatlari bilan bir xil (top: 0, height: 100dvh).
 */
export const KEYBOARD_AWARE_POSITIONER = {
  top: "var(--keyboard-top, 0px)",
  height: "calc(100dvh - var(--keyboard-top, 0px) - var(--keyboard-inset, 0px))",
} as const;
