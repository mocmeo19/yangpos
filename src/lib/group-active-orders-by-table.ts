import type { Order } from '@/types/order';

/** Mỗi bàn có tối đa một đơn đang mở vì món gọi thêm được gộp vào đơn hiện có. */
export function groupActiveOrdersByTable(
  activeOrders: readonly Order[],
): Map<string, Order> {
  const ordersByTable = new Map<string, Order>();
  for (const order of activeOrders) {
    if (order.tableId) {
      ordersByTable.set(order.tableId, order);
    }
  }
  return ordersByTable;
}
