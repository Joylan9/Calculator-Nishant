'use client';

import React, { forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { useMagnetic } from '@/lib/hooks/useMagnetic';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'gold' | 'teal' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'ref'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  magnetic?: boolean;
  glow?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: `
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #FAFAF9;
  `,
  secondary: `
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.06);
    color: #A8A8B3;
  `,
  ghost: `
    background: transparent;
    border: 1px solid transparent;
    color: #A8A8B3;
  `,
  gold: `
    background: rgba(201, 168, 76, 0.12);
    border: 1px solid rgba(201, 168, 76, 0.3);
    color: #C9A84C;
  `,
  teal: `
    background: rgba(43, 255, 216, 0.08);
    border: 1px solid rgba(43, 255, 216, 0.25);
    color: #2BFFD8;
  `,
  danger: `
    background: rgba(255, 77, 77, 0.08);
    border: 1px solid rgba(255, 77, 77, 0.25);
    color: #FF4D4D;
  `,
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'padding: 6px 14px; font-size: 12px;',
  md: 'padding: 10px 20px; font-size: 14px;',
  lg: 'padding: 14px 28px; font-size: 16px;',
  xl: 'padding: 18px 36px; font-size: 18px;',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', magnetic = false, glow = false, fullWidth = false, children, style, ...props }, ref) => {
    const magneticHook = useMagnetic({ proximity: 80, maxTranslate: 10 });

    const combinedStyle: any = {
      ...parseStyleString(variantStyles[variant]),
      ...parseStyleString(sizeStyles[size]),
      fontFamily: "'Outfit', sans-serif",
      fontWeight: 500,
      borderRadius: '10px',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      letterSpacing: '0.02em',
      transition: 'background 150ms, border-color 150ms, box-shadow 150ms',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      width: fullWidth ? '100%' : undefined,
      boxShadow: glow ? '0 0 40px rgba(201, 168, 76, 0.1)' : undefined,
      ...style,
    };

    return (
      <motion.button
        ref={magnetic ? (magneticHook.ref as React.Ref<HTMLButtonElement>) : ref}
        whileTap={{ scale: 0.94 }}
        whileHover={{
          borderColor: 'rgba(255, 255, 255, 0.2)',
          background: 'rgba(255, 255, 255, 0.09)',
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        style={combinedStyle}
        onMouseLeave={magnetic ? magneticHook.handleMouseLeave : undefined}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

function parseStyleString(styleStr: string): React.CSSProperties {
  const style: Record<string, string> = {};
  styleStr.split(';').forEach((rule) => {
    const [prop, val] = rule.split(':').map((s) => s.trim());
    if (prop && val) {
      const camelProp = prop.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
      style[camelProp] = val;
    }
  });
  return style as React.CSSProperties;
}

export default Button;
