import { useRef } from "react";
import { AnimatePresence, motion, useIsPresent, useReducedMotion } from "framer-motion";
import {
  UNSAFE_LocationContext,
  useLocation,
  useNavigationType,
  useOutlet,
} from "react-router-dom";
import { pageFadeVariants, pageVariants } from "@/styles/animaitons/page-animation";

// Sidebar tartibi: pastdagi bo'limga o'tish — push (o'ngdan kiradi), yuqoridagiga — pop.
const PAGE_ORDER = ["/doska", "/profile", "/tasks", "/calendar", "/statistics", "/settings"];

// Faqat birinchi segment: /settings/members ↔ /settings/roles butun sahifani qayta animatsiya qilmaydi.
// "/" darhol /doska'ga yo'naltiriladi — bitta kalit, aks holda ilk yuklanishda sahifa "kirib keladi".
function pageKey(pathname: string): string {
  const segment = pathname.split("/")[1];
  return segment ? `/${segment}` : "/doska";
}

/**
 * Chiqib ketayotgan sahifa eski route va eski location'ni ko'rib turadi.
 * Aks holda u animatsiya davomida yangi sahifani chizib qo'yadi, ichidagi NavLink'lar esa aktivligini yo'qotadi.
 */
function FrozenOutlet() {
  const isPresent = useIsPresent();
  const outlet = useOutlet();
  const location = useLocation();
  const navigationType = useNavigationType();
  const frozen = useRef({ outlet, location });
  if (isPresent) frozen.current = { outlet, location };

  return (
    <UNSAFE_LocationContext.Provider value={{ location: frozen.current.location, navigationType }}>
      {frozen.current.outlet}
    </UNSAFE_LocationContext.Provider>
  );
}

export function PageTransition() {
  const { pathname } = useLocation();
  const reduceMotion = useReducedMotion();
  const key = pageKey(pathname);

  const nav = useRef({ key, direction: 1 });
  if (nav.current.key !== key) {
    const from = PAGE_ORDER.indexOf(nav.current.key);
    const to = PAGE_ORDER.indexOf(key);
    nav.current = { key, direction: to >= from ? 1 : -1 };
  }
  const { direction } = nav.current;

  return (
    <AnimatePresence initial={false} custom={direction}>
      <motion.div
        key={key}
        custom={direction}
        variants={reduceMotion ? pageFadeVariants : pageVariants}
        initial="enter"
        animate="center"
        exit="exit"
        // Har sahifa o'z scroll'iga ega va noshaffof — ostidagi sahifa ko'rinmasin.
        // Soya faqat siljiganda (chap chetida) ko'rinadi, tinch holatda <main> uni kesadi.
        className="absolute inset-0 overflow-auto bg-canvas p-6 shadow-md"
      >
        <FrozenOutlet />
      </motion.div>
    </AnimatePresence>
  );
}
