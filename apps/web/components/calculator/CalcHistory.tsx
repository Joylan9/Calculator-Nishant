'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { slideInRight } from '@/lib/animations/framer';

interface HistoryEntry {
  id: string;
  expression: string;
  result: string;
  mode: string;
  timestamp: number;
}

interface CalcHistoryProps {
  isOpen: boolean;
  history: HistoryEntry[];
  onClose: () => void;
  onClear: () => void;
  onSelect: (result: string) => void;
}

export default function CalcHistory({ isOpen, history, onClose, onClear, onSelect }: CalcHistoryProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(4px)', zIndex: 40,
            }}
          />
          <motion.div
            variants={slideInRight}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{
              position: 'fixed', top: 0, right: 0, bottom: 0, width: '340px', maxWidth: '90vw',
              background: '#0F0F17', borderLeft: '1px solid rgba(255,255,255,0.08)',
              zIndex: 50, display: 'flex', flexDirection: 'column',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: '16px', fontWeight: 500, color: '#FAFAF9' }}>
                History
              </span>
              <div style={{ display: 'flex', gap: '8px' }}>
                {history.length > 0 && (
                  <button onClick={onClear} style={{
                    fontFamily: "'DM Mono', monospace", fontSize: '11px', padding: '4px 12px',
                    borderRadius: '6px', background: 'rgba(255,77,77,0.08)',
                    border: '1px solid rgba(255,77,77,0.2)', color: '#FF4D4D', cursor: 'pointer',
                  }}>
                    Clear All
                  </button>
                )}
                <button onClick={onClose} style={{
                  fontFamily: "'DM Mono', monospace", fontSize: '16px', padding: '4px 10px',
                  borderRadius: '6px', background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)', color: '#A8A8B3', cursor: 'pointer',
                }}>
                  ✕
                </button>
              </div>
            </div>

            {/* List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
              {history.length === 0 ? (
                <div style={{
                  textAlign: 'center', padding: '40px 20px',
                  fontFamily: "'DM Mono', monospace", fontSize: '13px', color: '#5A5A6E',
                }}>
                  No calculations yet
                </div>
              ) : (
                history.map((entry, idx) => (
                  <motion.button
                    key={entry.id}
                    onClick={() => { onSelect(entry.result); onClose(); }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0, transition: { delay: idx * 0.03 } }}
                    whileHover={{ background: 'rgba(255,255,255,0.06)' }}
                    style={{
                      width: '100%', textAlign: 'right', padding: '14px 16px',
                      borderRadius: '10px', background: 'transparent',
                      border: '1px solid transparent', cursor: 'pointer',
                      display: 'block', marginBottom: '4px',
                    }}
                  >
                    <div style={{
                      fontFamily: "'DM Mono', monospace", fontSize: '12px',
                      color: '#5A5A6E', marginBottom: '4px',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {entry.expression}
                    </div>
                    <div style={{
                      fontFamily: "'DM Mono', monospace", fontSize: '18px',
                      color: '#FAFAF9', fontWeight: 400,
                    }}>
                      = {entry.result}
                    </div>
                    <div style={{
                      fontFamily: "'DM Mono', monospace", fontSize: '9px',
                      color: '#3A3A4A', marginTop: '4px', textTransform: 'uppercase',
                    }}>
                      {new Date(entry.timestamp).toLocaleTimeString()} · {entry.mode}
                    </div>
                  </motion.button>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
