'use client';

import { Variants, Transition } from 'framer-motion';

// ─── Page Transitions ─────────────────────────────────────────────────────────

export const pageTransition: Transition = {
  duration: 0.4,
  ease: [0.16, 1, 0.3, 1],
};

export const pageVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

// ─── Stagger Container ───────────────────────────────────────────────────────

export const staggerContainer = (stagger = 0.08): Variants => ({
  initial: {},
  animate: {
    transition: {
      staggerChildren: stagger,
      delayChildren: 0.1,
    },
  },
});

// ─── Fade Up Items ────────────────────────────────────────────────────────────

export const fadeUpItem: Variants = {
  initial: { opacity: 0, y: 30 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

// ─── Scale In ─────────────────────────────────────────────────────────────────

export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

// ─── Button Press ─────────────────────────────────────────────────────────────

export const buttonPress = {
  whileTap: { scale: 0.94 },
  transition: {
    type: 'spring' as const,
    stiffness: 400,
    damping: 17,
  },
};

// ─── Slide In Drawer ──────────────────────────────────────────────────────────

export const slideInRight: Variants = {
  initial: { x: '100%', opacity: 0 },
  animate: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    x: '100%',
    opacity: 0,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  },
};

// ─── Digit Transition ─────────────────────────────────────────────────────────

export const digitVariants: Variants = {
  initial: { opacity: 0, y: 20, filter: 'blur(4px)' },
  animate: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    y: -20,
    filter: 'blur(4px)',
    transition: { duration: 0.15 },
  },
};

// ─── Glow Pulse ───────────────────────────────────────────────────────────────

export const glowPulse: Variants = {
  initial: { boxShadow: '0 0 0px rgba(201, 168, 76, 0)' },
  animate: {
    boxShadow: [
      '0 0 20px rgba(201, 168, 76, 0.1)',
      '0 0 40px rgba(201, 168, 76, 0.2)',
      '0 0 20px rgba(201, 168, 76, 0.1)',
    ],
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
  },
};

// ─── Card Hover ───────────────────────────────────────────────────────────────

export const cardHover = {
  whileHover: {
    y: -4,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  },
};

// ─── Tab Switch ───────────────────────────────────────────────────────────────

export const tabContentVariants: Variants = {
  initial: { opacity: 0, x: 20 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    x: -20,
    transition: { duration: 0.2 },
  },
};
