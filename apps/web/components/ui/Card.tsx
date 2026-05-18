'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface CardProps extends Omit<HTMLMotionProps<'div'>, 'ref'> {
  variant?: 'glass' | 'solid' | 'outline' | 'glow';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  children: React.ReactNode;
}

const paddingMap = {
  none: '0',
  sm: '16px',
  md: '24px',
  lg: '32px',
};

export default function Card({
  variant = 'glass',
  padding = 'md',
  hover = false,
  children,
  style,
  ...props
}: CardProps) {
  const baseStyle: any = {
    borderRadius: '16px',
    padding: paddingMap[padding],
    position: 'relative',
    overflow: 'hidden',
    ...style,
  };

  const variantStyles: Record<string, any> = {
    glass: {
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
    },
    solid: {
      background: '#14141F',
      border: '1px solid rgba(255, 255, 255, 0.06)',
    },
    outline: {
      background: 'transparent',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    },
    glow: {
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(201, 168, 76, 0.2)',
      boxShadow: '0 0 40px rgba(201, 168, 76, 0.08)',
    },
  };

  return (
    <motion.div
      style={{ ...baseStyle, ...variantStyles[variant] }}
      whileHover={
        hover
          ? {
              y: -4,
              borderColor: 'rgba(255, 255, 255, 0.15)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            }
          : undefined
      }
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
