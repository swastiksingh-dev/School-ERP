import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { CARD_HOVER, CARD_TAP } from '../../constants/animations';

type Props = {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
  onClick?: () => void;
};

export function Card({ className = '', interactive, children, onClick }: Props) {
  const base = `rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card dark:border-slate-800 dark:bg-slate-900 ${className}`;
  if (interactive) {
    return (
      <motion.div whileHover={CARD_HOVER} whileTap={CARD_TAP} className={base} onClick={onClick}>
        {children}
      </motion.div>
    );
  }
  return <div className={base}>{children}</div>;
}
