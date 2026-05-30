/* ─── Logo ───
 * Animated school logo component with configurable size (sm/md/lg).
 * Displays the school JPEG logo with a card-style shadow.
 */

import { motion } from 'framer-motion';

type Props = {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
};

const sizes = {
  sm: 'h-9 w-9',
  md: 'h-12 w-12',
  lg: 'h-16 w-16',
};

export function Logo({ className = '', size = 'md' }: Props) {
  return (
    <motion.img
      layout
      src="/logo.jpeg"
      alt="Blooming Bud Public School"
      className={`rounded-xl object-cover shadow-card ring-1 ring-black/5 ${sizes[size]} ${className}`}
    />
  );
}
