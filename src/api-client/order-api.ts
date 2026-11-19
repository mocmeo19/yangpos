import { ApiError, apiFetch } from '@/lib/api/api-fetch';
import { revalidateApi } from '@/lib/api/revalidate-api';
import type { Order, PaymentInput, PlaceOrderInput } from '@/types/order';
import { API_PATHS, ORDER_DEPENDENT_PATHS } from './api-paths';

const BASE = API_PATHS.orders;
const NOT_FOUND = 404;

async function postOrderAction(id: string, action: string): Promise<void> {
  await apiFetch<void>(`${BASE}/${id}/${action}`, 'POST');
  await revalidateApi(...ORDER_DEPENDENT_PATHS);
}

/** `undefined` khi đơn không còn tồn tại. */
export async function findOrder(id: string): Promise<Order | undefined> {
  try {
    return await apiFetch<Order>(`${BASE}/${id}`);
  } catch (error) {
    if (error instanceof ApiError && error.status === NOT_FOUND) {
      return undefined;
    }
    throw error;
  }
}

export async function placeOrder(input: PlaceOrderInput): Promise<Order> {
  const order = await apiFetch<Order>(BASE, 'POST', input);
  await revalidateApi(...ORDER_DEPENDENT_PATHS);
  return order;
}

export async function advanceKitchenStatus(id: string): Promise<void> {
  await postOrderAction(id, 'advance');
}

export async function payOrder(
  id: string,
  payment: PaymentInput,
): Promise<Order> {
  const order = await apiFetch<Order>(`${BASE}/${id}/payment`, 'POST', payment);
  await revalidateApi(...ORDER_DEPENDENT_PATHS);
  return order;
}

export async function completePickup(id: string): Promise<void> {
  await postOrderAction(id, 'pickup');
}

export async function assignPager(
  id: string,
  pagerNumber: number | null,
): Promise<void> {
  await apiFetch<void>(`${BASE}/${id}/pager`, 'PUT', { pagerNumber });
  await revalidateApi(BASE);
}

export async function markPagerCalled(id: string): Promise<void> {
  await postOrderAction(id, 'pager');
}

export async function cancelOrder(id: string): Promise<void> {
  await postOrderAction(id, 'cancel');
}
