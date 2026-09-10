import type { Variants, Transition } from "framer-motion";

export const footerTabVariants: Variants = {
  enter: (direction: number) => ({ x: direction > 0 ? "100%" : "-100%" }),
  center: { x: "0%" },
  exit: (direction: number) => ({ x: direction > 0 ? "-100%" : "100%" }),
};

export const footerTabTransition: Transition = {
  duration: 0.25,
  ease: "easeInOut",
};
