'use client';

import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

/**
 * Supabase 쿼리 시도 → 실패 또는 빈 결과 시 mock fallback.
 * DB에 데이터가 채워지면 자연스럽게 실제 데이터를 사용하게 됨.
 */
export function useQueryWithFallback<T>(
  key: string[],
  queryFn: () => Promise<T>,
  fallback: T,
  options?: Partial<UseQueryOptions<T>>
) {
  return useQuery<T>({
    queryKey: key,
    queryFn: async () => {
      try {
        const result = await queryFn();
        // If result is an array and empty, use fallback
        if (Array.isArray(result) && result.length === 0) return fallback;
        // If result is null/undefined, use fallback
        if (result == null) return fallback;
        return result;
      } catch {
        return fallback;
      }
    },
    ...options,
  });
}
