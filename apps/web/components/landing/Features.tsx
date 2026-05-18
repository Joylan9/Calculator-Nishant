'use client';

import React, { useEffect, useRef } from 'react';
import { createStaggerReveal } from '@/lib/animations/gsap';

const features = [
  {
    icon: '⚡',
    title: 'Precision Arithmetic',
    description: 'Powered by math.js for exact calculations. No floating point errors — ever.',
    accent: '#C9A84C',
  },
  {
    icon: '🔬',
    title: 'Scientific Mode',
    description: 'Trigonometry, logarithms, factorials, constants — everything you need for advanced math.',
    accent: '#2BFFD8',
  },
  {
    icon: '✨',
    title: 'Cinematic Motion',
    description: 'Every interaction is choreographed with spring physics and 60fps animations.',
    accent: '#A78BFA',
  },
  {
    icon: '🎹',
    title: 'Keyboard Native',
    description: 'Full keyboard support. Type naturally — numbers, operators, Enter to calculate.',
    accent: '#FF6B4A',
  },
  {
    icon: '📜',
    title: 'Calculation History',
    description: 'Every calculation is saved. Review, reuse, or clear — your math journey persisted.',
    accent: '#C9A84C',
  },
  {
    icon: '🎨',
    title: 'Three Themes',
    description: 'Obsidian, Midnight, and Phantom. Each crafted to feel like a different instrument.',
    accent: '#2BFFD8',
  },
];

export default function Features() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    createStaggerReveal(containerRef.current, '.feature-card');
  }, []);

  return (
    <section
      ref={containerRef}
      style={{
        padding: '120px 20px', maxWidth: '1100px', margin: '0 auto',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '64px' }}>
        <span style={{
          fontFamily: "'DM Mono', monospace", fontSize: '11px', letterSpacing: '0.15em',
          textTransform: 'uppercase', color: '#C9A84C',
        }}>
          Features
        </span>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem, 4vw, 3.5rem)',
          fontWeight: 300, color: '#FAFAF9', marginTop: '12px', letterSpacing: '-0.02em',
        }}>
          Engineered for Delight
        </h2>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '16px',
        }}
      >
        {features.map((f) => (
          <div
            key={f.title}
            className="feature-card"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '16px', padding: '32px', cursor: 'default',
              transition: 'border-color 300ms, background 300ms',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = `${f.accent}33`;
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
              e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
            }}
          >
            <div style={{ fontSize: '32px', marginBottom: '16px' }}>{f.icon}</div>
            <h3 style={{
              fontFamily: "'Outfit', sans-serif", fontSize: '18px', fontWeight: 500,
              color: '#FAFAF9', marginBottom: '8px',
            }}>
              {f.title}
            </h3>
            <p style={{
              fontFamily: "'Outfit', sans-serif", fontSize: '14px', lineHeight: 1.6,
              color: '#A8A8B3',
            }}>
              {f.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
