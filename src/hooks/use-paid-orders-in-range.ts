'use client';

import { API_PATHS, rangeQuery } from '@/api-client/api-paths';
import type { TimeRange } from '@/lib/day-range';
import type { Order } from '@/types/order';
import { useApiQuery } from './use-api-query';

export function usePaidOrdersInRange({
  start,
  end,
}: TimeRange): Order[] | undefined {
  return useApiQuery<Order[]>(
    `${API_PATHS.orders}?view=paid&${rangeQuery(start, end)}`,
  );
}
