'use client';

import { useCallback, useEffect } from 'react';
import { useCalculatorStore } from '../store/calculatorStore';
import { safeEvaluate, formatDisplay } from '../utils/math';
import { soundManager } from '../utils/sound';
import { useCalculateMutation, useClearHistoryMutation } from './useHistory';

export function useCalculator() {
  const store = useCalculatorStore();
  const {
    display,
    expression,
    isNewNumber,
    hasCalculated,
    mode,
    soundEnabled,
    precisionMode,
    setDisplay,
    setExpression,
    setIsNewNumber,
    setHasCalculated,
    setPreviousResult,
    addHistory,
    memoryRecall,
    memoryAdd,
    memorySubtract,
    memoryClear,
    reset,
  } = store;

  // React Query Mutations
  const { mutate: mutateCalculate } = useCalculateMutation();
  const { mutate: mutateClearHistory } = useClearHistoryMutation();

  // ─── Input a digit ────────────────────────────────────────────────────

  const inputDigit = useCallback(
    (digit: string) => {
      if (soundEnabled) soundManager.keypress();

      if (hasCalculated) {
        setDisplay(digit);
        setExpression('');
        setIsNewNumber(false);
        setHasCalculated(false);
        return;
      }

      if (isNewNumber) {
        setDisplay(digit);
        setIsNewNumber(false);
      } else {
        if (display === '0' && digit === '0') return;
        if (display.length >= 20) return;
        setDisplay(display === '0' ? digit : display + digit);
      }
    },
    [display, isNewNumber, hasCalculated, soundEnabled, setDisplay, setExpression, setIsNewNumber, setHasCalculated]
  );

  // ─── Input decimal ────────────────────────────────────────────────────

  const inputDecimal = useCallback(() => {
    if (soundEnabled) soundManager.keypress();

    if (hasCalculated) {
      setDisplay('0.');
      setExpression('');
      setIsNewNumber(false);
      setHasCalculated(false);
      return;
    }

    if (isNewNumber) {
      setDisplay('0.');
      setIsNewNumber(false);
      return;
    }

    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  }, [display, isNewNumber, hasCalculated, soundEnabled, setDisplay, setExpression, setIsNewNumber, setHasCalculated]);

  // ─── Input operator ───────────────────────────────────────────────────

  const inputOperator = useCallback(
    (op: string) => {
      if (soundEnabled) soundManager.click();

      const operatorSymbol = op;
      if (hasCalculated) {
        setExpression(display + ' ' + operatorSymbol + ' ');
        setIsNewNumber(true);
        setHasCalculated(false);
        return;
      }

      if (!isNewNumber) {
        if (expression) {
          const fullExpr = expression + display;
          const result = safeEvaluate(fullExpr);
          if (result !== 'Error') {
            const formatted = formatDisplay(result, precisionMode ? 15 : 10);
            setDisplay(formatted);
            setExpression(formatted + ' ' + operatorSymbol + ' ');
            setPreviousResult(formatted);
          } else {
            setExpression(display + ' ' + operatorSymbol + ' ');
          }
        } else {
          setExpression(display + ' ' + operatorSymbol + ' ');
        }
      } else {
        // Replace last operator
        const trimmed = expression.trimEnd();
        const withoutLastOp = trimmed.slice(0, -1).trimEnd();
        setExpression(withoutLastOp + ' ' + operatorSymbol + ' ');
      }

      setIsNewNumber(true);
    },
    [display, expression, isNewNumber, hasCalculated, soundEnabled, precisionMode, setDisplay, setExpression, setIsNewNumber, setHasCalculated, setPreviousResult]
  );

  // ─── Calculate result ─────────────────────────────────────────────────

  const calculate = useCallback(() => {
    if (!expression && !display) return;

    const fullExpr = expression + display;
    const result = safeEvaluate(fullExpr);

    if (result === 'Error') {
      if (soundEnabled) soundManager.error();
      setDisplay('Error');
      setExpression('');
      setIsNewNumber(true);
      setHasCalculated(true);
      return;
    }

    if (soundEnabled) soundManager.calculate();

    const formatted = formatDisplay(result, precisionMode ? 15 : 10);

    addHistory({
      expression: fullExpr,
      result: formatted,
      mode,
    });

    // Backend save
    mutateCalculate({ expression: fullExpr, mode });

    setPreviousResult(display);
    setDisplay(formatted);
    setExpression('');
    setIsNewNumber(true);
    setHasCalculated(true);
  }, [display, expression, mode, soundEnabled, precisionMode, setDisplay, setExpression, setIsNewNumber, setHasCalculated, setPreviousResult, addHistory, mutateCalculate]);

  // ─── Clear ────────────────────────────────────────────────────────────

  const clear = useCallback(() => {
    if (soundEnabled) soundManager.clear();
    reset();
  }, [soundEnabled, reset]);

  // ─── Clear History Backend ────────────────────────────────────────────

  const clearHistoryBackend = useCallback(() => {
    store.clearHistory();
    mutateClearHistory();
  }, [store, mutateClearHistory]);

  // ─── Clear entry ──────────────────────────────────────────────────────

  const clearEntry = useCallback(() => {
    if (soundEnabled) soundManager.clear();
    setDisplay('0');
    setIsNewNumber(true);
  }, [soundEnabled, setDisplay, setIsNewNumber]);

  // ─── Backspace ────────────────────────────────────────────────────────

  const backspace = useCallback(() => {
    if (soundEnabled) soundManager.click();
    if (hasCalculated || display === 'Error') {
      clear();
      return;
    }
    if (display.length === 1 || (display.length === 2 && display.startsWith('-'))) {
      setDisplay('0');
      setIsNewNumber(true);
    } else {
      setDisplay(display.slice(0, -1));
    }
  }, [display, hasCalculated, soundEnabled, clear, setDisplay, setIsNewNumber]);

  // ─── Toggle sign ──────────────────────────────────────────────────────

  const toggleSign = useCallback(() => {
    if (soundEnabled) soundManager.click();
    if (display === '0' || display === 'Error') return;
    setDisplay(display.startsWith('-') ? display.slice(1) : '-' + display);
  }, [display, soundEnabled, setDisplay]);

  // ─── Percentage ───────────────────────────────────────────────────────

  const percentage = useCallback(() => {
    if (soundEnabled) soundManager.click();
    if (display === 'Error') return;
    const val = parseFloat(display) / 100;
    setDisplay(formatDisplay(val.toString()));
  }, [display, soundEnabled, setDisplay]);

  // ─── Scientific functions ─────────────────────────────────────────────

  const scientificFunction = useCallback(
    (fn: string) => {
      if (soundEnabled) soundManager.click();
      if (display === 'Error') return;

      let expr = '';
      switch (fn) {
        case 'sin': expr = `sin(${display})`; break;
        case 'cos': expr = `cos(${display})`; break;
        case 'tan': expr = `tan(${display})`; break;
        case 'asin': expr = `asin(${display})`; break;
        case 'acos': expr = `acos(${display})`; break;
        case 'atan': expr = `atan(${display})`; break;
        case 'log': expr = `log10(${display})`; break;
        case 'ln': expr = `log(${display})`; break;
        case 'sqrt': expr = `sqrt(${display})`; break;
        case 'square': expr = `(${display})^2`; break;
        case 'cube': expr = `(${display})^3`; break;
        case 'reciprocal': expr = `1/(${display})`; break;
        case 'factorial': expr = `factorial(${display})`; break;
        case 'abs': expr = `abs(${display})`; break;
        default: return;
      }

      const result = safeEvaluate(expr);
      if (result === 'Error') {
        if (soundEnabled) soundManager.error();
        setDisplay('Error');
      } else {
        const formatted = formatDisplay(result, precisionMode ? 15 : 10);
        addHistory({ expression: expr, result: formatted, mode });
        mutateCalculate({ expression: expr, mode });
        setDisplay(formatted);
      }
      setIsNewNumber(true);
      setHasCalculated(true);
    },
    [display, mode, soundEnabled, precisionMode, setDisplay, setIsNewNumber, setHasCalculated, addHistory, mutateCalculate]
  );

  // ─── Constants ────────────────────────────────────────────────────────

  const inputConstant = useCallback(
    (constant: string) => {
      if (soundEnabled) soundManager.click();
      switch (constant) {
        case 'pi':
          setDisplay(Math.PI.toString());
          break;
        case 'e':
          setDisplay(Math.E.toString());
          break;
      }
      setIsNewNumber(true);
      setHasCalculated(false);
    },
    [soundEnabled, setDisplay, setIsNewNumber, setHasCalculated]
  );

  // ─── Parentheses ──────────────────────────────────────────────────────

  const inputParenthesis = useCallback(
    (paren: string) => {
      if (soundEnabled) soundManager.click();
      if (paren === '(') {
        if (isNewNumber) {
          setExpression(expression + '(');
        } else {
          setExpression(expression + display + '×(');
          setIsNewNumber(true);
        }
      } else {
        if (!isNewNumber) {
          setExpression(expression + display + ')');
          setIsNewNumber(true);
        } else {
          setExpression(expression + ')');
        }
      }
    },
    [display, expression, isNewNumber, soundEnabled, setExpression, setIsNewNumber]
  );

  // ─── Memory functions ─────────────────────────────────────────────────

  const handleMemory = useCallback(
    (action: string) => {
      if (soundEnabled) soundManager.click();
      switch (action) {
        case 'MC':
          memoryClear();
          break;
        case 'MR': {
          const val = memoryRecall();
          setDisplay(val.toString());
          setIsNewNumber(true);
          break;
        }
        case 'M+':
          memoryAdd(parseFloat(display) || 0);
          setIsNewNumber(true);
          break;
        case 'M-':
          memorySubtract(parseFloat(display) || 0);
          setIsNewNumber(true);
          break;
      }
    },
    [display, soundEnabled, memoryRecall, memoryAdd, memorySubtract, memoryClear, setDisplay, setIsNewNumber]
  );

  // ─── Keyboard support ─────────────────────────────────────────────────

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default for calculator keys
      if (/^[0-9.+\-*/=()%]$/.test(e.key) || ['Enter', 'Backspace', 'Escape', 'Delete'].includes(e.key)) {
        e.preventDefault();
      }

      if (/^[0-9]$/.test(e.key)) {
        inputDigit(e.key);
      } else if (e.key === '.') {
        inputDecimal();
      } else if (e.key === '+') {
        inputOperator('+');
      } else if (e.key === '-') {
        inputOperator('−');
      } else if (e.key === '*') {
        inputOperator('×');
      } else if (e.key === '/') {
        inputOperator('÷');
      } else if (e.key === 'Enter' || e.key === '=') {
        calculate();
      } else if (e.key === 'Backspace') {
        backspace();
      } else if (e.key === 'Escape' || e.key === 'Delete') {
        clear();
      } else if (e.key === '%') {
        percentage();
      } else if (e.key === '(' || e.key === ')') {
        inputParenthesis(e.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inputDigit, inputDecimal, inputOperator, calculate, backspace, clear, percentage, inputParenthesis]);

  return {
    // State
    display,
    expression,
    mode: store.mode,
    theme: store.theme,
    soundEnabled: store.soundEnabled,
    precisionMode: store.precisionMode,
    history: store.history,
    historyOpen: store.historyOpen,
    memory: store.memory,

    // Actions
    inputDigit,
    inputDecimal,
    inputOperator,
    calculate,
    clear,
    clearEntry,
    backspace,
    toggleSign,
    percentage,
    scientificFunction,
    inputConstant,
    inputParenthesis,
    handleMemory,

    // Settings
    setMode: store.setMode,
    setTheme: store.setTheme,
    setSoundEnabled: store.setSoundEnabled,
    setPrecisionMode: store.setPrecisionMode,
    toggleHistory: store.toggleHistory,
    setHistoryOpen: store.setHistoryOpen,
    clearHistory: clearHistoryBackend,
    setDisplay: store.setDisplay,
  };
}
