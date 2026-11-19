'use client';

import { API_PATHS } from '@/api-client/api-paths';
import type { EInvoice } from '@/types/einvoice';
import { useApiQuery } from './use-api-query';

/** `undefined` khi đang đọc, `null` khi đơn chưa có hóa đơn. */
export function useOrderEInvoice(orderId: string): EInvoice | null | undefined {
  return useApiQuery<EInvoice | null>(
    `${API_PATHS.orders}/${orderId}/einvoice`,
  );
}
