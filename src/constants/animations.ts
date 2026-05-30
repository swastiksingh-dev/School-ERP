export const EASE = [0.22, 1, 0.36, 1] as const;

export const PAGE = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.35, ease: EASE },
} as const;

export const STAGGER = {
  container: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.06, delayChildren: 0.03 },
    },
  },
  item: (i: number) => ({
    hidden: { opacity: 0, y: 12, scale: 0.97 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { delay: i * 0.05, duration: 0.3, ease: EASE },
    },
  }),
} as const;

export const FADE_IN = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.25, ease: EASE },
} as const;

export const SLIDE_UP = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 8 },
  transition: { duration: 0.3, ease: EASE },
} as const;

export const CARD_HOVER = { scale: 1.02 } as const;
export const CARD_TAP = { scale: 0.98 } as const;
