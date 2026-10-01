import { useRef } from "react";
import type { PanInfo } from "framer-motion";

// Gorizontal siljish shu masofadan oshsa yoki tezligi yetarli bo'lsa — swipe.
const MIN_OFFSET = 60;
const MIN_VELOCITY = 400;
// Vertikal scroll swipe deb o'qilmasligi uchun: |dx| |dy| dan kamida shuncha marta katta.
const DOMINANCE = 1.5;

interface UseSwipeNavOptions {
  onNext: () => void;
  onPrev: () => void;
}

/**
 * Chapga surish — onNext, o'ngga surish — onPrev. Natijani `motion.div` ga yoying:
 * `<motion.div {...swipeProps}>`. Slider/input ustida boshlangan siljish yoki
 * `data-no-swipe` ichidagi element e'tiborga olinmaydi.
 */
export function useSwipeNav({ onNext, onPrev }: UseSwipeNavOptions) {
  const ignored = useRef(false);

  return {
    // Brauzer vertikal scroll'ni o'zi bajaradi, gorizontalni biz olamiz.
    style: { touchAction: "pan-y" as const },
    onPanStart: (event: PointerEvent | MouseEvent | TouchEvent) => {
      const target = event.target as Element | null;
      ignored.current = !!target?.closest?.("input, textarea, [data-no-swipe]");
    },
    onPanEnd: (_: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) => {
      if (ignored.current) return;
      const { x: dx, y: dy } = info.offset;
      if (Math.abs(dx) < Math.abs(dy) * DOMINANCE) return;
      const passed = Math.abs(dx) >= MIN_OFFSET || Math.abs(info.velocity.x) >= MIN_VELOCITY;
      if (!passed) return;
      if (dx < 0) onNext();
      else onPrev();
    },
  };
}
