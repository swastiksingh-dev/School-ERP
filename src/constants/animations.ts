export const PAGE = {
  initial: { opacity: 0, x: 16 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -12 },
  transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] },
} as const;

export const STAGGER = {
  container: {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.04 },
    },
  },
  item: (i: number) => ({
    hidden: { opacity: 0, y: 10, scale: 0.98 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { delay: i * 0.06, duration: 0.28, ease: [0.22, 1, 0.36, 1] },
    },
  }),
} as const;

export const CARD_HOVER = { scale: 1.02 } as const;
export const CARD_TAP = { scale: 0.98 } as const;
