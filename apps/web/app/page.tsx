'use client';

import React, { useEffect } from 'react';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import CalculatorPreview from '@/components/landing/CalculatorPreview';
import { killAllScrollTriggers } from '@/lib/animations/gsap';

export default function LandingPage() {
  useEffect(() => {
    return () => {
      killAllScrollTriggers();
    };
  }, []);

  return (
    <main style={{
      background: 'var(--color-bg-primary, #0A0A0F)',
      minHeight: '100vh',
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
