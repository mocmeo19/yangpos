'use client';

import { API_PATHS, rangeQuery } from '@/api-client/api-paths';
import type { TimeRange } from '@/lib/day-range';
import type { PeriodSales } from '@/types/period-sales';
import { useApiQuery } from './use-api-query';

export function usePeriodSales({
  start,
  end,
}: TimeRange): PeriodSales | undefined {
  return useApiQuery<PeriodSales>(
    `${API_PATHS.reports}/period-sales?${rangeQuery(start, end)}`,
  );
}
