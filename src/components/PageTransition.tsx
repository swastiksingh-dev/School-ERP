/* ─── PageTransition ───
 * Wraps route content with framer-motion enter/exit animations.
 * Uses the PAGE animation constants for consistent page transitions.
 */

import { AnimatePresence, motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { PAGE } from '../constants/animations';

export function PageTransition({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={PAGE.initial}
        animate={PAGE.animate}
        exit={PAGE.exit}
        transition={PAGE.transition}
        className="min-h-0 flex-1"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
