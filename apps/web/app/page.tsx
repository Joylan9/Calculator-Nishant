'use client';

import React, { useEffect } from 'react';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import CalculatorPreview from '@/components/landing/CalculatorPreview';
import { killAllScrollTriggers } from '@/lib/animations/gsap';

export default function LandingPage() {
  useEffect(() => {
    // Initialize Lenis smooth scroll for landing page
    let lenis: any = null;

    (async () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) return;

      try {
        const Lenis = (await import('@studio-freight/lenis')).default;
        lenis = new Lenis({ lerp: 0.08, smoothWheel: true });

        function raf(time: number) {
          lenis?.raf(time);
          requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
      } catch {
        // Lenis not available
      }
    })();

    return () => {
      lenis?.destroy();
      killAllScrollTriggers();
    };
  }, []);

  return (
    <main style={{
      background: 'var(--color-bg-primary, #0A0A0F)',
      minHeight: '100vh',
      overflow: 'hidden',
    }}>
      <Hero />
      <Features />
      <CalculatorPreview />

      {/* Footer */}
      <footer style={{
        padding: '40px 20px', borderTop: '1px solid rgba(255,255,255,0.06)',
        textAlign: 'center',
      }}>
        <span style={{
          fontFamily: "'DM Mono', monospace", fontSize: '11px',
          color: '#5A5A6E', letterSpacing: '0.05em',
        }}>
          Built with precision — Next.js · Three.js · Framer Motion · math.js
        </span>
      </footer>
    </main>
  );
}
