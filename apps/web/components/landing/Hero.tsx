'use client';

import React, { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { createHeroTimeline, splitTextIntoSpans } from '@/lib/animations/gsap';
import { useMagnetic } from '@/lib/hooks/useMagnetic';
import Link from 'next/link';

const ParticleField = dynamic(() => import('@/components/three/ParticleField'), {
  ssr: false,
  loading: () => null,
});

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const hasAnimated = useRef(false);
  const magnetic = useMagnetic({ proximity: 100, maxTranslate: 12 });

  useEffect(() => {
    if (!containerRef.current || !titleRef.current || hasAnimated.current) return;
    hasAnimated.current = true;

    // Split title text into spans for character animation
    const chars = splitTextIntoSpans(titleRef.current);
    chars.forEach((span) => span.classList.add('hero-title-char'));

    createHeroTimeline(containerRef.current);
  }, []);

  return (
    <section
      ref={containerRef}
      style={{
        position: 'relative', minHeight: '100vh', display: 'flex',
        flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden', padding: '40px 20px',
      }}
    >
      <ParticleField />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '800px' }}>
        {/* Badge */}
        <motion.div className="hero-badge" style={{
          display: 'inline-flex', gap: '8px', marginBottom: '32px', alignItems: 'center',
        }}>
          <span style={{
            fontFamily: "'DM Mono', monospace", fontSize: '11px', letterSpacing: '0.12em',
            textTransform: 'uppercase', color: '#C9A84C',
            background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)',
            padding: '6px 16px', borderRadius: '20px',
          }}>
            ✦ Premium Calculator
          </span>
        </motion.div>

        {/* Title */}
        <h1
          ref={titleRef}
          style={{
            fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(3rem, 8vw, 7rem)',
            fontWeight: 300, lineHeight: 1.05, letterSpacing: '-0.03em',
            color: '#FAFAF9', marginBottom: '24px',
            textShadow: '0 0 80px rgba(201,168,76,0.15)',
          }}
        >
          Calculate with Elegance
        </h1>

        {/* Subtitle */}
        <p className="hero-subtitle" style={{
          fontFamily: "'Outfit', sans-serif", fontSize: '18px', lineHeight: 1.6,
          color: '#A8A8B3', maxWidth: '520px', margin: '0 auto 40px',
        }}>
          A cinematic calculator experience built with precision arithmetic,
          stunning animations, and an obsessive attention to detail.
        </p>

        {/* CTA */}
        <div className="hero-cta">
          <Link href="/calculator" style={{ textDecoration: 'none' }}>
            <motion.div
              ref={magnetic.ref as React.Ref<HTMLDivElement>}
              onMouseLeave={magnetic.handleMouseLeave}
              whileHover={{ scale: 1.02, boxShadow: '0 0 60px rgba(201,168,76,0.2)' }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '10px',
                padding: '16px 40px', borderRadius: '12px',
                background: 'linear-gradient(135deg, rgba(201,168,76,0.15), rgba(201,168,76,0.08))',
                border: '1px solid rgba(201,168,76,0.3)',
                fontFamily: "'Outfit', sans-serif", fontSize: '16px', fontWeight: 500,
                color: '#C9A84C', letterSpacing: '0.02em', cursor: 'pointer',
                boxShadow: '0 0 40px rgba(201,168,76,0.1)',
              }}
            >
              Launch Calculator
              <span style={{ fontSize: '20px' }}>→</span>
            </motion.div>
          </Link>
        </div>

        {/* Stats */}
        <div className="hero-badge" style={{
          display: 'flex', gap: '40px', justifyContent: 'center', marginTop: '60px',
        }}>
          {[
            { value: '15+', label: 'Digit Precision' },
            { value: '60fps', label: 'Smooth Motion' },
            { value: '2', label: 'Calc Modes' },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: "'DM Mono', monospace", fontSize: '24px', fontWeight: 300,
                color: '#C9A84C', lineHeight: 1,
              }}>
                {stat.value}
              </div>
              <div style={{
                fontFamily: "'DM Mono', monospace", fontSize: '10px',
                color: '#5A5A6E', marginTop: '6px', letterSpacing: '0.08em', textTransform: 'uppercase',
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
        }}
      >
        <span style={{
          fontFamily: "'DM Mono', monospace", fontSize: '10px',
          color: '#5A5A6E', letterSpacing: '0.1em', textTransform: 'uppercase',
        }}>
          Scroll
        </span>
        <div style={{
          width: '1px', height: '30px',
          background: 'linear-gradient(to bottom, rgba(201,168,76,0.4), transparent)',
        }} />
      </motion.div>
    </section>
  );
}
