'use client';

import { useRef, useCallback, useEffect } from 'react';

interface MagneticOptions {
  proximity?: number;
  maxTranslate?: number;
  ease?: number;
}

export function useMagnetic(options: MagneticOptions = {}) {
  const { proximity = 80, maxTranslate = 10, ease = 0.15 } = options;
  const ref = useRef<HTMLElement>(null);
  const animationFrame = useRef<number>(0);
  const currentX = useRef(0);
  const currentY = useRef(0);
  const targetX = useRef(0);
  const targetY = useRef(0);

  const lerp = (start: number, end: number, factor: number) =>
    start + (end - start) * factor;

  const animate = useCallback(() => {
    currentX.current = lerp(currentX.current, targetX.current, ease);
    currentY.current = lerp(currentY.current, targetY.current, ease);

    if (ref.current) {
      ref.current.style.transform = `translate3d(${currentX.current}px, ${currentY.current}px, 0)`;
    }

    if (
      Math.abs(currentX.current - targetX.current) > 0.01 ||
      Math.abs(currentY.current - targetY.current) > 0.01
    ) {
      animationFrame.current = requestAnimationFrame(animate);
    }
  }, [ease]);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distX = e.clientX - centerX;
      const distY = e.clientY - centerY;
      const distance = Math.sqrt(distX * distX + distY * distY);

      if (distance < proximity) {
        const strength = 1 - distance / proximity;
        targetX.current = (distX / proximity) * maxTranslate * strength;
        targetY.current = (distY / proximity) * maxTranslate * strength;
      } else {
        targetX.current = 0;
        targetY.current = 0;
      }

      cancelAnimationFrame(animationFrame.current);
      animationFrame.current = requestAnimationFrame(animate);
    },
    [proximity, maxTranslate, animate]
  );

  const handleMouseLeave = useCallback(() => {
    targetX.current = 0;
    targetY.current = 0;
    cancelAnimationFrame(animationFrame.current);
    animationFrame.current = requestAnimationFrame(animate);
  }, [animate]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrame.current);
    };
  }, [handleMouseMove]);

  return { ref, handleMouseLeave };
}
