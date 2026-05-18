'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, HistoryEntry } from '../api/client';
import { useEffect } from 'react';

export function useAuth() {
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('calc_token');
      if (!token) {
        try {
          const res = await api.auth.guestLogin();
          if (res.success && res.data?.token) {
            localStorage.setItem('calc_token', res.data.token);
          }
        } catch {
          // Backend unavailable — calculator works offline via Zustand
        }
      }
    };
    initAuth();
  }, []);
}

export function useHistoryQuery(limit = 50, offset = 0) {
  return useQuery({
    queryKey: ['history', limit, offset],
    queryFn: async () => {
      const res = await api.calculation.getHistory(limit, offset);
      return res.data || [];
    },
  });
}

export function useClearHistoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.calculation.clearHistory(),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['history'] });
      const previousHistory = queryClient.getQueryData(['history', 50, 0]);
      queryClient.setQueryData(['history', 50, 0], []);
      return { previousHistory };
    },
    onError: (err, variables, context) => {
      if (context?.previousHistory) {
        queryClient.setQueryData(['history', 50, 0], context.previousHistory);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['history'] });
    },
  });
}

export function useCalculateMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ expression, mode }: { expression: string; mode: string }) =>
      api.calculation.calculate(expression, mode),
    onSuccess: (data, variables) => {
      if (data.success && data.data) {
        // Optimistically update history, though in real app we might rely on the backend save
        queryClient.invalidateQueries({ queryKey: ['history'] });
      }
    },
  });
}
