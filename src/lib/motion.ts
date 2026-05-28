import type { Variants } from "framer-motion";

export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
export const EASE_IN_OUT_EXPO = [0.87, 0, 0.13, 1] as const;

/** Reveal a block by fading and rising from below — used for scroll reveals. */
export const reveal: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: EASE_OUT_EXPO },
  },
};

/** Split-line stagger — first child holds, rest cascade. */
export const stagger = (delay = 0.04, initial = 0): Variants => ({
  hidden: {},
  visible: {
    transition: {
      delayChildren: initial,
      staggerChildren: delay,
    },
  },
});

/** Mask reveal — clip a line as if curtain pulls back. */
export const maskReveal: Variants = {
  hidden: { clipPath: "inset(0 100% 0 0)" },
  visible: {
    clipPath: "inset(0 0% 0 0)",
    transition: { duration: 1.1, ease: EASE_IN_OUT_EXPO },
  },
};

/** A subtle word/char rise. */
export const wordRise: Variants = {
  hidden: { y: "100%", opacity: 0 },
  visible: {
    y: "0%",
    opacity: 1,
    transition: { duration: 0.85, ease: EASE_OUT_EXPO },
  },
};
