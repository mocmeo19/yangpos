import type { Order } from '@/types/order';

/** Thẻ đang nằm trong tay khách: gắn với đơn còn mở, kể cả đơn đã thu tiền nhưng chưa lấy món. */
export function groupPagersInUse(
  activeOrders: readonly Order[],
): Map<number, Order> {
  const pagers = new Map<number, Order>();
  for (const order of activeOrders) {
    if (order.pagerNumber !== undefined) {
      pagers.set(order.pagerNumber, order);
    }
  }
  return pagers;
}
