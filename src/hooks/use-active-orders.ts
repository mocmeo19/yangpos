'use client';

import { API_PATHS } from '@/api-client/api-paths';
import type { Order } from '@/types/order';
import { useApiQuery } from './use-api-query';

// Màn bếp, màn bàn và màn bán hàng phải thấy đơn do máy khác vừa gửi.
const ACTIVE_ORDERS_REFRESH_MS = 5_000;

export function useActiveOrders(): Order[] | undefined {
  return useApiQuery<Order[]>(`${API_PATHS.orders}?view=active`, {
    refreshIntervalMs: ACTIVE_ORDERS_REFRESH_MS,
  });
}
