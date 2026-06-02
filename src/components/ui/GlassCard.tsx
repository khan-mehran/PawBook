import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', hover = true, onClick }) => {
  return (
    <motion.div
      whileHover={hover ? { y: -4, boxShadow: '0 0 30px rgba(255,107,53,0.15)' } : undefined}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={`
        bg-[var(--pb-glass-bg)] backdrop-blur-xl border border-[var(--pb-glass-border)] rounded-2xl
        hover:border-orange-500/30 transition-colors duration-300
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
