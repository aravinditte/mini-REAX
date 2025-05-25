import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glass?: boolean;
}

export default function Card({ children, className = '', hover = false, glass = false }: CardProps) {
  const baseClasses = 'rounded-xl p-6 transition-all duration-300';
  const glassClasses = glass ? 'glass-effect' : 'bg-mx-surface border border-mx-surface-light';
  const hoverClasses = hover ? 'card-hover' : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`${baseClasses} ${glassClasses} ${hoverClasses} ${className}`}
    >
      {children}
    </motion.div>
  );
}
