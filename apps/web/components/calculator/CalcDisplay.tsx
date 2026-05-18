'use client';

import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatWithCommas } from '@/lib/utils/math';
import { digitVariants } from '@/lib/animations/framer';

interface CalcDisplayProps {
  display: string;
  expression: string;
  precisionMode: boolean;
}

export default function CalcDisplay({ display, expression, precisionMode }: CalcDisplayProps) {
  const formattedDisplay = useMemo(() => {
    if (display === 'Error' || display === 'Infinity') return display;
    return formatWithCommas(display);
  }, [display]);

  const displayChars = formattedDisplay.split('');

  // Dynamic font size based on display length
  const fontSize = useMemo(() => {
    const len = formattedDisplay.length;
    if (len <= 8) return 'clamp(2.5rem, 6vw, 4rem)';
    if (len <= 12) return 'clamp(2rem, 5vw, 3rem)';
    if (len <= 16) return 'clamp(1.5rem, 4vw, 2.25rem)';
    return 'clamp(1.2rem, 3vw, 1.75rem)';
  }, [formattedDisplay]);

  return (
    <div
      style={{
        padding: '24px 28px',
        minHeight: '140px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        background: 'linear-gradient(180deg, rgba(10, 10, 15, 0.4) 0%, rgba(10, 10, 15, 0.8) 100%)',
        borderRadius: '16px 16px 0 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle grid background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          pointerEvents: 'none',
        }}
      />

      {/* Precision mode indicator */}
      {precisionMode && (
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '16px',
            fontFamily: "'DM Mono', monospace",
            fontSize: '9px',
            color: 'rgba(43, 255, 216, 0.6)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            background: 'rgba(43, 255, 216, 0.06)',
            padding: '3px 8px',
            borderRadius: '4px',
            border: '1px solid rgba(43, 255, 216, 0.15)',
          }}
        >
          PRECISION
        </div>
      )}

      {/* Expression line */}
      <div
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: '14px',
          color: 'rgba(168, 168, 179, 0.6)',
          marginBottom: '8px',
          minHeight: '20px',
          textAlign: 'right',
          width: '100%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          direction: 'rtl',
        }}
      >
        {expression || '\u00A0'}
      </div>

      {/* Result display with animated digits */}
      <div
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize,
          fontWeight: 400,
          color: display === 'Error' ? '#FF4D4D' : '#FAFAF9',
          letterSpacing: '-0.02em',
          lineHeight: 1.1,
          textAlign: 'right',
          width: '100%',
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'flex-end',
          flexWrap: 'nowrap',
          textShadow: display === 'Error' ? 'none' : '0 0 30px rgba(201, 168, 76, 0.15)',
        }}
      >
        <AnimatePresence mode="popLayout">
          {displayChars.map((char, i) => (
            <motion.span
              key={`${i}-${char}-${formattedDisplay.length}`}
              variants={digitVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              style={{ display: 'inline-block', minWidth: char === ',' ? '8px' : undefined }}
            >
              {char}
            </motion.span>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
