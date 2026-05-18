'use client';

import React from 'react';
import { motion } from 'framer-motion';

type KeyVariant = 'number' | 'operator' | 'function' | 'action' | 'equals';

interface KeyConfig {
  label: string;
  value: string;
  variant: KeyVariant;
  span?: number;
  action: () => void;
}

interface CalcKeypadProps {
  mode: 'standard' | 'scientific';
  onDigit: (d: string) => void;
  onOperator: (op: string) => void;
  onDecimal: () => void;
  onCalculate: () => void;
  onClear: () => void;
  onClearEntry: () => void;
  onBackspace: () => void;
  onToggleSign: () => void;
  onPercentage: () => void;
  onScientific: (fn: string) => void;
  onConstant: (c: string) => void;
  onParenthesis: (p: string) => void;
  onMemory: (action: string) => void;
}

const vc: Record<KeyVariant, { bg: string; bd: string; c: string; hb: string }> = {
  number: { bg: 'rgba(255,255,255,0.05)', bd: 'rgba(255,255,255,0.08)', c: '#FAFAF9', hb: 'rgba(255,255,255,0.1)' },
  operator: { bg: 'rgba(201,168,76,0.08)', bd: 'rgba(201,168,76,0.2)', c: '#C9A84C', hb: 'rgba(201,168,76,0.15)' },
  function: { bg: 'rgba(255,255,255,0.03)', bd: 'rgba(255,255,255,0.06)', c: '#A8A8B3', hb: 'rgba(255,255,255,0.08)' },
  action: { bg: 'rgba(43,255,216,0.05)', bd: 'rgba(43,255,216,0.15)', c: '#2BFFD8', hb: 'rgba(43,255,216,0.12)' },
  equals: { bg: 'rgba(201,168,76,0.15)', bd: 'rgba(201,168,76,0.35)', c: '#C9A84C', hb: 'rgba(201,168,76,0.25)' },
};

function buildStandard(p: CalcKeypadProps): KeyConfig[][] {
  return [
    [
      { label: 'C', value: 'c', variant: 'action', action: p.onClear },
      { label: 'CE', value: 'ce', variant: 'action', action: p.onClearEntry },
      { label: '⌫', value: 'bs', variant: 'action', action: p.onBackspace },
      { label: '÷', value: 'div', variant: 'operator', action: () => p.onOperator('÷') },
    ],
    [
      { label: '7', value: '7', variant: 'number', action: () => p.onDigit('7') },
      { label: '8', value: '8', variant: 'number', action: () => p.onDigit('8') },
      { label: '9', value: '9', variant: 'number', action: () => p.onDigit('9') },
      { label: '×', value: 'mul', variant: 'operator', action: () => p.onOperator('×') },
    ],
    [
      { label: '4', value: '4', variant: 'number', action: () => p.onDigit('4') },
      { label: '5', value: '5', variant: 'number', action: () => p.onDigit('5') },
      { label: '6', value: '6', variant: 'number', action: () => p.onDigit('6') },
      { label: '−', value: 'sub', variant: 'operator', action: () => p.onOperator('−') },
    ],
    [
      { label: '1', value: '1', variant: 'number', action: () => p.onDigit('1') },
      { label: '2', value: '2', variant: 'number', action: () => p.onDigit('2') },
      { label: '3', value: '3', variant: 'number', action: () => p.onDigit('3') },
      { label: '+', value: 'add', variant: 'operator', action: () => p.onOperator('+') },
    ],
    [
      { label: '±', value: 'pm', variant: 'function', action: p.onToggleSign },
      { label: '0', value: '0', variant: 'number', action: () => p.onDigit('0') },
      { label: '.', value: '.', variant: 'number', action: p.onDecimal },
      { label: '=', value: 'eq', variant: 'equals', action: p.onCalculate },
    ],
  ];
}

function buildScientific(p: CalcKeypadProps): KeyConfig[][] {
  return [
    [
      { label: 'MC', value: 'mc', variant: 'function', action: () => p.onMemory('MC') },
      { label: 'MR', value: 'mr', variant: 'function', action: () => p.onMemory('MR') },
      { label: 'M+', value: 'mp', variant: 'function', action: () => p.onMemory('M+') },
      { label: 'M−', value: 'mm', variant: 'function', action: () => p.onMemory('M-') },
    ],
    [
      { label: '(', value: 'lp', variant: 'function', action: () => p.onParenthesis('(') },
      { label: ')', value: 'rp', variant: 'function', action: () => p.onParenthesis(')') },
      { label: '%', value: 'pct', variant: 'function', action: p.onPercentage },
      { label: 'x!', value: 'fact', variant: 'function', action: () => p.onScientific('factorial') },
    ],
    [
      { label: 'sin', value: 'sin', variant: 'function', action: () => p.onScientific('sin') },
      { label: 'cos', value: 'cos', variant: 'function', action: () => p.onScientific('cos') },
      { label: 'tan', value: 'tan', variant: 'function', action: () => p.onScientific('tan') },
      { label: 'π', value: 'pi', variant: 'function', action: () => p.onConstant('pi') },
    ],
    [
      { label: 'log', value: 'log', variant: 'function', action: () => p.onScientific('log') },
      { label: 'ln', value: 'ln', variant: 'function', action: () => p.onScientific('ln') },
      { label: '√', value: 'sqrt', variant: 'function', action: () => p.onScientific('sqrt') },
      { label: 'e', value: 'euler', variant: 'function', action: () => p.onConstant('e') },
    ],
    [
      { label: 'x²', value: 'sq', variant: 'function', action: () => p.onScientific('square') },
      { label: 'x³', value: 'cb', variant: 'function', action: () => p.onScientific('cube') },
      { label: '1/x', value: 'rec', variant: 'function', action: () => p.onScientific('reciprocal') },
      { label: '|x|', value: 'abs', variant: 'function', action: () => p.onScientific('abs') },
    ],
  ];
}

export default function CalcKeypad(props: CalcKeypadProps) {
  const sci = props.mode === 'scientific' ? buildScientific(props) : [];
  const std = buildStandard(props);
  const allRows = [...sci, ...std];
  const isSci = props.mode === 'scientific';

  return (
    <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '6px', background: 'rgba(10,10,15,0.6)', borderRadius: '0 0 16px 16px' }}>
      {allRows.map((row, ri) => (
        <div key={ri} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
          {row.map((k) => {
            const s = vc[k.variant];
            return (
              <motion.button
                key={k.value}
                onClick={k.action}
                whileTap={{ scale: 0.94 }}
                whileHover={{ background: s.hb }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                aria-label={k.label}
                style={{
                  gridColumn: k.span ? `span ${k.span}` : undefined,
                  background: s.bg, border: `1px solid ${s.bd}`, color: s.c,
                  fontFamily: k.variant === 'number' || k.variant === 'equals' ? "'DM Mono', monospace" : "'Outfit', sans-serif",
                  fontSize: k.variant === 'function' ? '13px' : '18px',
                  fontWeight: k.variant === 'equals' ? 600 : 400,
                  padding: isSci ? '12px 8px' : '16px 8px',
                  borderRadius: '10px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  backdropFilter: 'blur(10px)', letterSpacing: '0.02em', outline: 'none',
                  boxShadow: k.variant === 'equals' ? '0 0 20px rgba(201,168,76,0.1)' : 'none',
                }}
              >
                {k.label}
              </motion.button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
