'use client';

import { API_PATHS, rangeQuery } from '@/api-client/api-paths';
import type { TimeRange } from '@/lib/day-range';
import type { EInvoice } from '@/types/einvoice';
import { useApiQuery } from './use-api-query';

export function useEInvoicesInRange({
  start,
  end,
}: TimeRange): EInvoice[] | undefined {
  return useApiQuery<EInvoice[]>(
    `${API_PATHS.einvoices}?${rangeQuery(start, end)}`,
  );
}
