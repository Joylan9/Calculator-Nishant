// ─── Calculation Types ────────────────────────────────────────────────────────

export type CalculatorMode = 'standard' | 'scientific';

export type CalculatorTheme = 'midnight' | 'obsidian' | 'phantom';

export interface CalculationStep {
  expression: string;
  result: string;
  operation: string;
}

export interface CalculationResult {
  expression: string;
  result: string;
  steps: CalculationStep[];
  timestamp: string;
  mode: CalculatorMode;
}

export interface HistoryEntry {
  _id: string;
  expression: string;
  result: string;
  steps: CalculationStep[];
  mode: CalculatorMode;
  createdAt: string;
  userId: string;
}

// ─── API Types ────────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  meta?: {
    total: number;
    limit: number;
    offset: number;
  };
}

export interface CalculateRequest {
  expression: string;
  mode: CalculatorMode;
}

export interface CalculateResponse {
  result: string;
  steps: CalculationStep[];
  timestamp: string;
}

export interface GuestAuthResponse {
  token: string;
  expiresAt: string;
}

export interface HistoryQueryParams {
  limit?: number;
  offset?: number;
}

// ─── UI Types ─────────────────────────────────────────────────────────────────

export type ButtonVariant = 'number' | 'operator' | 'function' | 'action' | 'equals';

export interface CalcButton {
  label: string;
  value: string;
  variant: ButtonVariant;
  span?: number;
  scientific?: boolean;
}

// ─── Settings ─────────────────────────────────────────────────────────────────

export interface CalculatorSettings {
  theme: CalculatorTheme;
  soundEnabled: boolean;
  precisionMode: boolean;
  decimalPlaces: number;
}
