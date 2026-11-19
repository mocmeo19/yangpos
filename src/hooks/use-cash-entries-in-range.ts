'use client';

import { API_PATHS, rangeQuery } from '@/api-client/api-paths';
import type { TimeRange } from '@/lib/day-range';
import type { CashEntry } from '@/types/cash-entry';
import { useApiQuery } from './use-api-query';

export function useCashEntriesInRange({
  start,
  end,
}: TimeRange): CashEntry[] | undefined {
  return useApiQuery<CashEntry[]>(
    `${API_PATHS.cashEntries}?${rangeQuery(start, end)}`,
  );
}
