'use client';

import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { createScrollReveal } from '@/lib/animations/gsap';

export default function CalculatorPreview() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [8, -8]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-8, 8]), { stiffness: 150, damping: 20 });

  useEffect(() => {
    if (!containerRef.current) return;
    createScrollReveal(containerRef.current);
  }, []);

  const handleMouse = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section
      ref={containerRef}
      style={{
        padding: '80px 20px 120px', display: 'flex', flexDirection: 'column',
        alignItems: 'center', position: 'relative',
      }}
    >
      <span style={{
        fontFamily: "'DM Mono', monospace", fontSize: '11px', letterSpacing: '0.15em',
        textTransform: 'uppercase', color: '#C9A84C', marginBottom: '12px',
      }}>
        Preview
      </span>
      <h2 style={{
        fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem, 4vw, 3rem)',
        fontWeight: 300, color: '#FAFAF9', marginBottom: '48px', textAlign: 'center',
        letterSpacing: '-0.02em',
      }}>
        Experience the Interface
      </h2>

      <motion.div
        onMouseMove={handleMouse}
        onMouseLeave={handleLeave}
        style={{
          rotateX, rotateY, transformPerspective: 1200,
          width: '100%', maxWidth: '380px',
        }}
      >
        <div style={{
          background: 'rgba(15,15,23,0.95)', backdropFilter: 'blur(40px)',
          border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 80px rgba(201,168,76,0.06)',
        }}>
          {/* Mock display */}
          <div style={{
            padding: '28px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)',
            textAlign: 'right',
          }}>
            <div style={{
              fontFamily: "'DM Mono', monospace", fontSize: '13px', color: '#5A5A6E', marginBottom: '8px',
            }}>
              sin(45) × 2 +
            </div>
            <div style={{
              fontFamily: "'DM Mono', monospace", fontSize: '40px', fontWeight: 300,
              color: '#FAFAF9', letterSpacing: '-0.02em',
              textShadow: '0 0 30px rgba(201,168,76,0.15)',
            }}>
              3.4142
            </div>
          </div>

          {/* Mock keypad */}
          <div style={{ padding: '12px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
            {['C', 'CE', '⌫', '÷', '7', '8', '9', '×', '4', '5', '6', '−', '1', '2', '3', '+', '±', '0', '.', '='].map((k) => {
              const isOp = ['÷', '×', '−', '+'].includes(k);
              const isAction = ['C', 'CE', '⌫'].includes(k);
              const isEq = k === '=';
              return (
                <div
                  key={k}
                  style={{
                    padding: '14px 0', textAlign: 'center', borderRadius: '10px',
                    fontFamily: isOp || isAction || isEq ? "'Outfit', sans-serif" : "'DM Mono', monospace",
                    fontSize: isAction ? '13px' : '16px',
                    background: isEq ? 'rgba(201,168,76,0.12)' : isOp ? 'rgba(201,168,76,0.06)' : isAction ? 'rgba(43,255,216,0.04)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${isEq ? 'rgba(201,168,76,0.25)' : isOp ? 'rgba(201,168,76,0.15)' : 'rgba(255,255,255,0.06)'}`,
                    color: isEq || isOp ? '#C9A84C' : isAction ? '#2BFFD8' : '#FAFAF9',
                  }}
                >
                  {k}
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* CTA below preview */}
      <motion.a
        href="/calculator"
        whileHover={{ y: -2 }}
        style={{
          marginTop: '40px', fontFamily: "'DM Mono', monospace", fontSize: '13px',
          color: '#C9A84C', textDecoration: 'none', letterSpacing: '0.05em',
          display: 'flex', alignItems: 'center', gap: '8px',
        }}
      >
        Try it live <span>→</span>
      </motion.a>
    </section>
  );
}
