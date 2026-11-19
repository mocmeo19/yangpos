'use client';

import { API_PATHS } from '@/api-client/api-paths';
import type { CashBookSource } from '@/types/cash-book';
import { useApiQuery } from './use-api-query';

/** Mọi đơn đã thu tiền và mọi phiếu trước cuối kỳ vì tồn đầu kỳ cộng dồn từ ngày đầu tiên. */
export function useCashBookSource(end: number): CashBookSource | undefined {
  return useApiQuery<CashBookSource>(
    `${API_PATHS.finance}/cash-book?end=${end}`,
  );
}
