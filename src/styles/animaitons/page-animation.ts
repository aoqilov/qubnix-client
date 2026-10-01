import type { Transition, Variants } from "framer-motion";

// iOS UINavigationController uslubi (desktop sahifalari uchun):
// push — yangi sahifa o'ngdan to'liq kiradi, eskisi 30% chapga suriladi va biroz xiralashadi;
// pop — teskarisi. `direction`: 1 = push, -1 = pop.
const PARALLAX = "-30%";
const DIMMED = "brightness(0.94)";

// Apple'ning "critically damped" spring'i — sakrashsiz, oxirida yumshoq to'xtaydi.
export const pageTransition: Transition = { type: "spring", duration: 0.5, bounce: 0 };

// zIndex animatsiya qilinmaydi: kim ustida turishi darhol belgilanadi.
const layered: Transition = { default: pageTransition, zIndex: { duration: 0 } };

export const pageVariants: Variants = {
  enter: (direction: number) =>
    direction > 0
      ? { x: "100%", filter: "none", zIndex: 2 }
      : { x: PARALLAX, filter: DIMMED, zIndex: 1 },
  center: (direction: number) => ({
    x: 0,
    filter: "brightness(1)",
    zIndex: direction > 0 ? 2 : 1,
    transition: layered,
    // Tinch holatda filter va zIndex qolmasin: filter `position: fixed` bolalar uchun yangi
    // containing block yaratadi, zIndex esa stacking context — ichidagi toast/FAB'larning z-* qiymatlari
    // tashqaridagi elementlar (BottomTabBar, header) bilan solishtirilmay qolardi.
    transitionEnd: { filter: "none", zIndex: "auto" },
  }),
  exit: (direction: number) => ({
    ...(direction > 0
      ? { x: PARALLAX, filter: DIMMED, zIndex: 1 }
      : { x: "100%", filter: "none", zIndex: 2 }),
    transition: layered,
  }),
};

// "Harakatni kamaytirish" yoqilgan bo'lsa — siljish o'rniga qisqa fade.
export const pageFadeVariants: Variants = {
  enter: { opacity: 0 },
  center: { opacity: 1, transition: { duration: 0.15 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};
