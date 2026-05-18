'use client';

import React, { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCalculator } from '@/lib/hooks/useCalculator';
import CalcDisplay from '@/components/calculator/CalcDisplay';
import CalcKeypad from '@/components/calculator/CalcKeypad';
import CalcHistory from '@/components/calculator/CalcHistory';
import { tabContentVariants } from '@/lib/animations/framer';

export default function CalculatorPage() {
  const calc = useCalculator();

  const copyResult = useCallback(() => {
    navigator.clipboard.writeText(calc.display).catch(() => {});
  }, [calc.display]);

  const themes = [
    { id: 'obsidian' as const, label: 'Obsidian' },
    { id: 'midnight' as const, label: 'Midnight' },
    { id: 'phantom' as const, label: 'Phantom' },
  ];

  return (
    <div
      data-theme={calc.theme}
      style={{
        minHeight: '100vh',
        background: 'var(--color-bg-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        fontFamily: "'Outfit', sans-serif",
      }}
    >
      {/* Background grid pattern */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)',
        backgroundSize: '64px 64px',
      }} />

      {/* Ambient glow */}
      <div style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '600px', height: '600px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width: '100%', maxWidth: '420px', position: 'relative', zIndex: 1,
        }}
      >
        {/* Top bar */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: '16px', padding: '0 4px',
        }}>
          <a href="/" style={{
            fontFamily: "'Cormorant Garamond', serif", fontSize: '18px', fontWeight: 500,
            color: '#C9A84C', textDecoration: 'none', letterSpacing: '-0.02em',
          }}>
            Calci
          </a>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            {/* Sound toggle */}
            <button onClick={() => calc.setSoundEnabled(!calc.soundEnabled)} title="Toggle sound" style={{
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '8px', padding: '6px 10px', cursor: 'pointer', fontSize: '14px',
              color: calc.soundEnabled ? '#2BFFD8' : '#5A5A6E',
            }}>
              {calc.soundEnabled ? '🔊' : '🔇'}
            </button>
            {/* Precision toggle */}
            <button onClick={() => calc.setPrecisionMode(!calc.precisionMode)} title="Precision mode" style={{
              fontFamily: "'DM Mono', monospace", fontSize: '10px',
              background: calc.precisionMode ? 'rgba(43,255,216,0.08)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${calc.precisionMode ? 'rgba(43,255,216,0.2)' : 'rgba(255,255,255,0.08)'}`,
              borderRadius: '8px', padding: '6px 10px', cursor: 'pointer',
              color: calc.precisionMode ? '#2BFFD8' : '#5A5A6E',
              letterSpacing: '0.05em', textTransform: 'uppercase',
            }}>
              PRE
            </button>
            {/* Copy */}
            <button onClick={copyResult} title="Copy result" style={{
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '8px', padding: '6px 10px', cursor: 'pointer', fontSize: '14px', color: '#A8A8B3',
            }}>
              📋
            </button>
            {/* History */}
            <button onClick={calc.toggleHistory} title="History" style={{
              background: calc.historyOpen ? 'rgba(201,168,76,0.1)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${calc.historyOpen ? 'rgba(201,168,76,0.25)' : 'rgba(255,255,255,0.08)'}`,
              borderRadius: '8px', padding: '6px 10px', cursor: 'pointer', fontSize: '14px',
              color: calc.historyOpen ? '#C9A84C' : '#A8A8B3',
            }}>
              🕐
            </button>
          </div>
        </div>

        {/* Mode tabs */}
        <div style={{
          display: 'flex', gap: '4px', marginBottom: '2px', padding: '4px',
          background: 'rgba(255,255,255,0.03)', borderRadius: '12px 12px 0 0',
          border: '1px solid rgba(255,255,255,0.06)', borderBottom: 'none',
        }}>
          {(['standard', 'scientific'] as const).map((m) => (
            <motion.button
              key={m}
              onClick={() => calc.setMode(m)}
              style={{
                flex: 1, padding: '10px', fontFamily: "'DM Mono', monospace", fontSize: '11px',
                letterSpacing: '0.08em', textTransform: 'uppercase', borderRadius: '8px',
                border: 'none', cursor: 'pointer', position: 'relative',
                background: calc.mode === m ? 'rgba(201,168,76,0.08)' : 'transparent',
                color: calc.mode === m ? '#C9A84C' : '#5A5A6E',
              }}
              whileTap={{ scale: 0.97 }}
            >
              {calc.mode === m && (
                <motion.div
                  layoutId="activeTab"
                  style={{
                    position: 'absolute', inset: 0, borderRadius: '8px',
                    border: '1px solid rgba(201,168,76,0.2)',
                    background: 'rgba(201,168,76,0.06)',
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <span style={{ position: 'relative', zIndex: 1 }}>{m}</span>
            </motion.button>
          ))}
        </div>

        {/* Calculator body */}
        <div style={{
          background: 'rgba(15,15,23,0.9)', backdropFilter: 'blur(40px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '0 0 16px 16px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 80px rgba(201,168,76,0.05)',
          overflow: 'hidden',
        }}>
          <CalcDisplay display={calc.display} expression={calc.expression} precisionMode={calc.precisionMode} />
          <AnimatePresence mode="wait">
            <motion.div key={calc.mode} variants={tabContentVariants} initial="initial" animate="animate" exit="exit">
              <CalcKeypad
                mode={calc.mode}
                onDigit={calc.inputDigit}
                onOperator={calc.inputOperator}
                onDecimal={calc.inputDecimal}
                onCalculate={calc.calculate}
                onClear={calc.clear}
                onClearEntry={calc.clearEntry}
                onBackspace={calc.backspace}
                onToggleSign={calc.toggleSign}
                onPercentage={calc.percentage}
                onScientific={calc.scientificFunction}
                onConstant={calc.inputConstant}
                onParenthesis={calc.inputParenthesis}
                onMemory={calc.handleMemory}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Theme switcher */}
        <div style={{
          display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '16px',
        }}>
          {themes.map((t) => (
            <button key={t.id} onClick={() => calc.setTheme(t.id)} title={t.label} style={{
              width: '8px', height: '8px', borderRadius: '50%', border: 'none', cursor: 'pointer',
              background: calc.theme === t.id ? '#C9A84C' : 'rgba(255,255,255,0.15)',
              transition: 'background 200ms',
            }} />
          ))}
        </div>
      </motion.div>

      {/* History drawer */}
      <CalcHistory
        isOpen={calc.historyOpen}
        history={calc.history}
        onClose={() => calc.setHistoryOpen(false)}
        onClear={calc.clearHistory}
        onSelect={(result) => calc.setDisplay(result)}
      />
    </div>
  );
}
