import { useRef } from "react";
import type { CSSProperties } from "react";
import { AnimatePresence, motion, useIsPresent, useReducedMotion } from "framer-motion";
import {
  type NavigationType,
  UNSAFE_LocationContext,
  useLocation,
  useNavigationType,
  useOutlet,
} from "react-router-dom";
import { pageFadeVariants, pageVariants } from "@/styles/animaitons/page-animation";

/** 1 = push (yangi sahifa o'ngdan kiradi), -1 = pop (orqaga). */
export type PageDirection = 1 | -1;

interface PageTransitionProps {
  /** URL → sahifa kaliti. Faqat kalit o'zgarganda animatsiya bo'ladi. */
  getKey: (pathname: string) => string;
  getDirection: (from: string, to: string, navigationType: NavigationType) => PageDirection;
  /** Sahifa qatlamining padding'i — platformaga qarab. */
  className?: string;
  style?: CSSProperties;
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

/** iOS uslubidagi sahifa almashinuvi. Ota element `relative overflow-hidden` bo'lishi kerak. */
export function PageTransition({ getKey, getDirection, className = "", style }: PageTransitionProps) {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();
  const reduceMotion = useReducedMotion();
  const key = getKey(pathname);

  const nav = useRef<{ key: string; direction: PageDirection }>({ key, direction: 1 });
  if (nav.current.key !== key) {
    nav.current = { key, direction: getDirection(nav.current.key, key, navigationType) };
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
        // Soya faqat siljiganda (chap chetida) ko'rinadi, tinch holatda ota element uni kesadi.
        className={`absolute inset-0 overflow-auto bg-canvas shadow-md ${className}`}
        style={style}
      >
        <FrozenOutlet />
      </motion.div>
    </AnimatePresence>
  );
}
