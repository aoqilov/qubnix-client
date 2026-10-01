import type { Transition, Variants } from "framer-motion";

// iOS UINavigationController uslubi (desktop sahifalari uchun):
// push — yangi sahifa o'ngdan to'liq kiradi, eskisi 30% chapga suriladi va biroz xiralashadi;
// pop — teskarisi. `direction`: 1 = push, -1 = pop.
//
// Siljish `x` emas, to'g'ridan-to'g'ri `transform` orqali: framer-motion `x` ni har kadrda JS'da
// hisoblaydi (main thread), `transform` esa WAAPI orqali kompozitorda ishlaydi. Shunda yangi sahifa
// mount bo'layotganda yoki so'rov javobi kelib qayta render bo'lganda ham animatsiya to'xtab qolmaydi.
const OFFSCREEN = "translateX(100%)";
const PARALLAX = "translateX(-30%)";
const DIMMED = "brightness(0.94)";

// Apple'ning "critically damped" spring'i — sakrashsiz, oxirida yumshoq to'xtaydi.
export const pageTransition: Transition = { type: "spring", duration: 0.5, bounce: 0 };

// zIndex animatsiya qilinmaydi: kim ustida turishi darhol belgilanadi.
const layered: Transition = { default: pageTransition, zIndex: { duration: 0 } };

export const pageVariants: Variants = {
  enter: (direction: number) =>
    direction > 0
      ? { transform: OFFSCREEN, filter: "none", zIndex: 2 }
      : { transform: PARALLAX, filter: DIMMED, zIndex: 1 },
  center: (direction: number) => ({
    transform: "translateX(0%)",
    filter: "brightness(1)",
    zIndex: direction > 0 ? 2 : 1,
    transition: layered,
    // Tinch holatda transform, filter va zIndex qolmasin: transform/filter `position: fixed` bolalar
    // uchun yangi containing block yaratadi, zIndex esa stacking context — ichidagi toast/FAB'larning
    // z-* qiymatlari tashqaridagi elementlar (BottomTabBar, header) bilan solishtirilmay qolardi.
    transitionEnd: { transform: "none", filter: "none", zIndex: "auto" },
  }),
  exit: (direction: number) => ({
    ...(direction > 0
      ? { transform: PARALLAX, filter: DIMMED, zIndex: 1 }
      : { transform: OFFSCREEN, filter: "none", zIndex: 2 }),
    transition: layered,
  }),
};

// "Harakatni kamaytirish" yoqilgan bo'lsa — siljish o'rniga qisqa fade.
export const pageFadeVariants: Variants = {
  enter: { opacity: 0 },
  center: { opacity: 1, transition: { duration: 0.15 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};
