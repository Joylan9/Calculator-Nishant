'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type CalculatorMode = 'standard' | 'scientific';
type CalculatorTheme = 'midnight' | 'obsidian' | 'phantom';

interface HistoryEntry {
  id: string;
  expression: string;
  result: string;
  mode: CalculatorMode;
  timestamp: number;
}

interface CalculatorState {
  // Display
  display: string;
  expression: string;
  previousResult: string;
  isNewNumber: boolean;
  hasCalculated: boolean;

  // Mode & Settings
  mode: CalculatorMode;
  theme: CalculatorTheme;
  soundEnabled: boolean;
  precisionMode: boolean;

  // History
  history: HistoryEntry[];
  historyOpen: boolean;

  // Memory
  memory: number;

  // Actions
  setDisplay: (value: string) => void;
  setExpression: (value: string) => void;
  setPreviousResult: (value: string) => void;
  setIsNewNumber: (value: boolean) => void;
  setHasCalculated: (value: boolean) => void;
  setMode: (mode: CalculatorMode) => void;
  setTheme: (theme: CalculatorTheme) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setPrecisionMode: (enabled: boolean) => void;
  addHistory: (entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => void;
  clearHistory: () => void;
  toggleHistory: () => void;
  setHistoryOpen: (open: boolean) => void;
  memoryAdd: (value: number) => void;
  memorySubtract: (value: number) => void;
  memoryRecall: () => number;
  memoryClear: () => void;
  reset: () => void;
}

const initialState = {
  display: '0',
  expression: '',
  previousResult: '',
  isNewNumber: true,
  hasCalculated: false,
  mode: 'standard' as CalculatorMode,
  theme: 'obsidian' as CalculatorTheme,
  soundEnabled: true,
  precisionMode: false,
  history: [] as HistoryEntry[],
  historyOpen: false,
  memory: 0,
};

export const useCalculatorStore = create<CalculatorState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setDisplay: (value) => set({ display: value }),
      setExpression: (value) => set({ expression: value }),
      setPreviousResult: (value) => set({ previousResult: value }),
      setIsNewNumber: (value) => set({ isNewNumber: value }),
      setHasCalculated: (value) => set({ hasCalculated: value }),
      setMode: (mode) => set({ mode }),
      setTheme: (theme) => set({ theme }),
      setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
      setPrecisionMode: (enabled) => set({ precisionMode: enabled }),

      addHistory: (entry) =>
        set((state) => ({
          history: [
            {
              ...entry,
              id: crypto.randomUUID(),
              timestamp: Date.now(),
            },
            ...state.history,
          ].slice(0, 100), // Keep last 100
        })),

      clearHistory: () => set({ history: [] }),
      toggleHistory: () => set((state) => ({ historyOpen: !state.historyOpen })),
      setHistoryOpen: (open) => set({ historyOpen: open }),

      memoryAdd: (value) => set((state) => ({ memory: state.memory + value })),
      memorySubtract: (value) => set((state) => ({ memory: state.memory - value })),
      memoryRecall: () => get().memory,
      memoryClear: () => set({ memory: 0 }),

      reset: () =>
        set({
          display: '0',
          expression: '',
          previousResult: '',
          isNewNumber: true,
          hasCalculated: false,
        }),
    }),
    {
      name: 'calc-app-store',
      partialize: (state) => ({
        theme: state.theme,
        soundEnabled: state.soundEnabled,
        precisionMode: state.precisionMode,
        history: state.history,
        memory: state.memory,
        mode: state.mode,
      }),
    }
  )
);
