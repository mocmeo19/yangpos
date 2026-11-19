import type { EInvoice } from '@/types/einvoice';
import type { Order } from '@/types/order';

/** Đơn đã thu tiền nhưng chưa lập hóa đơn, cũ nhất trước để lập bù theo đúng thứ tự. */
export function findUninvoicedOrders(
  orders: readonly Order[],
  invoices: readonly EInvoice[],
): Order[] {
  const invoicedOrderIds = new Set(invoices.map((invoice) => invoice.orderId));
  return orders
    .filter((order) => !invoicedOrderIds.has(order.id))
    .sort((first, second) => (first.paidAt ?? 0) - (second.paidAt ?? 0));
}
