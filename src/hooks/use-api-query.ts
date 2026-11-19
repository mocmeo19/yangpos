'use client';

import useSWR from 'swr';
import { apiFetch } from '@/lib/api/api-fetch';

interface ApiQueryOptions {
  /**
   * Tự hỏi lại máy chủ theo chu kỳ để thấy thay đổi từ máy khác (vd màn bếp thấy đơn mới). Bỏ
   * trống thì chỉ tải lại khi quay lại tab hoặc sau khi chính máy này thay đổi dữ liệu.
   */
  refreshIntervalMs?: number;
}

function fetchJson<T>(path: string): Promise<T> {
  return apiFetch<T>(path);
}

/** `undefined` khi đang tải lần đầu; `path` là `null` thì không tải gì. */
export function useApiQuery<T>(
  path: string | null,
  { refreshIntervalMs = 0 }: ApiQueryOptions = {},
): T | undefined {
  const { data } = useSWR<T>(path, fetchJson<T>, {
    refreshInterval: refreshIntervalMs,
  });
  return data;
}
