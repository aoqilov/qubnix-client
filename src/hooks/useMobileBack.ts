import { useEffect } from "react";
import type { RefObject } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { isTelegramMiniApp } from "@/utils/platform";
import { setBackButton } from "@/utils/telegram";

// Chap chetdan shu masofa ichida boshlangan siljish "orqaga" jesti hisoblanadi — sahifa ichidagi
// gorizontal scroll (hafta qatori, tablar) bilan to'qnashmasligi uchun faqat chet zonasi.
const EDGE_ZONE = 24;
const MIN_DISTANCE = 60;

/** Ichki sahifaning ota yo'li: /settings/projects/5 → /settings/projects. Tab sahifalarda null. */
export function parentPath(pathname: string): string | null {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length < 2) return null;
  return `/${segments.slice(0, -1).join("/")}`;
}

/**
 * Ichki sahifadan orqaga qaytish: Telegram'ning o'z "Orqaga" tugmasi (Mini App ichida) va
 * chap chetdan o'ngga swipe. `ref` — swipe tinglanadigan element (sahifalar joylashgan qism);
 * drawer/dialog portal orqali tashqarida chiqadi, shuning uchun ularning ichidagi siljish sanalmaydi.
 */
export function useMobileBack(ref: RefObject<HTMLElement>) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const parent = parentPath(pathname);

  useEffect(() => {
    if (!parent || !isTelegramMiniApp()) return;
    return setBackButton(() => navigate(parent));
  }, [parent, navigate]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !parent) return;

    let startX = 0;
    let startY = 0;
    let tracking = false;

    const onStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      tracking = e.touches.length === 1 && touch.clientX <= EDGE_ZONE;
      startX = touch.clientX;
      startY = touch.clientY;
    };
    const onEnd = (e: TouchEvent) => {
      if (!tracking) return;
      tracking = false;
      const touch = e.changedTouches[0];
      const dx = touch.clientX - startX;
      const dy = touch.clientY - startY;
      if (dx >= MIN_DISTANCE && dx > Math.abs(dy) * 1.5) navigate(parent);
    };
    const onCancel = () => {
      tracking = false;
    };

    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchend", onEnd, { passive: true });
    el.addEventListener("touchcancel", onCancel, { passive: true });
    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchend", onEnd);
      el.removeEventListener("touchcancel", onCancel);
    };
  }, [ref, parent, navigate]);
}
