'use client';

import { API_PATHS } from '@/api-client/api-paths';
import type { Order, OrderStatus } from '@/types/order';
import { useApiQuery } from './use-api-query';

type ClosedOrderStatus = Extract<OrderStatus, 'paid' | 'cancelled'>;

const CLOSED_ORDERS_REFRESH_MS = 30_000;

export function useClosedOrders(
  status: ClosedOrderStatus,
  limit: number,
): Order[] | undefined {
  return useApiQuery<Order[]>(
    `${API_PATHS.orders}?view=closed&status=${status}&limit=${limit}`,
    { refreshIntervalMs: CLOSED_ORDERS_REFRESH_MS },
  );
}
