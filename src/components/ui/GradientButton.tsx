import React from 'react';
import { motion } from 'framer-motion';

interface GradientButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const GradientButton: React.FC<GradientButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  type = 'button',
}) => {
  const sizeClasses = {
    sm: 'px-4 py-1.5 text-sm',
    md: 'px-6 py-2.5 text-sm',
    lg: 'px-8 py-3 text-base',
  };

  const variantClasses = {
    primary: 'bg-gradient-to-r from-orange-500 to-violet-600 text-white hover:shadow-[0_0_25px_rgba(124,58,237,0.4)]',
    secondary: 'bg-gradient-to-r from-violet-600 to-teal-500 text-white hover:shadow-[0_0_25px_rgba(0,212,170,0.4)]',
    outline: 'bg-transparent border border-orange-500/50 text-orange-400 hover:border-orange-500 hover:bg-orange-500/10',
    ghost: 'bg-[var(--pb-hover)] text-[var(--pb-text)] hover:bg-[var(--pb-border)] border border-[var(--pb-border)]',
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.03 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        rounded-full font-semibold transition-all duration-200 cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {children}
    </motion.button>
  );
};

export default GradientButton;
