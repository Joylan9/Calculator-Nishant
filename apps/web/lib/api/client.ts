import axios from 'axios';

// ─── Types (mirrored from shared) ─────────────────────────────────────────────

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  meta?: { total: number; limit: number; offset: number };
}

interface GuestAuthResponse {
  token: string;
  expiresAt: string;
}

interface CalculateResponse {
  result: string;
  steps: { expression: string; result: string; operation: string }[];
  timestamp: string;
}

interface HistoryEntry {
  _id: string;
  expression: string;
  result: string;
  steps: { expression: string; result: string; operation: string }[];
  mode: 'standard' | 'scientific';
  createdAt: string;
  userId: string;
}

// ─── Client ───────────────────────────────────────────────────────────────────

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('calc_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.error || error.message || 'An unknown error occurred';
    return Promise.reject(new Error(message));
  }
);

// ─── API Methods ──────────────────────────────────────────────────────────────

export const api = {
  auth: {
    async guestLogin(): Promise<ApiResponse<GuestAuthResponse>> {
      return apiClient.post('/auth/guest');
    },
  },
  calculation: {
    async calculate(expression: string, mode: string): Promise<ApiResponse<CalculateResponse>> {
      return apiClient.post('/calculate', { expression, mode });
    },
    async getHistory(limit = 50, offset = 0): Promise<ApiResponse<HistoryEntry[]>> {
      return apiClient.get('/history', { params: { limit, offset } });
    },
    async clearHistory(): Promise<ApiResponse<null>> {
      return apiClient.delete('/history');
    },
  },
};

export type { ApiResponse, GuestAuthResponse, CalculateResponse, HistoryEntry };
