import type { Order } from '@/types/order';

/**
 * Đơn đã thu tiền. Không dựa vào trạng thái "paid" vì đơn có thẻ rung trả tiền trước vẫn ở lại
 * màn bếp tới khi khách nhận món.
 */
export function isOrderPaid(order: Order): boolean {
  return order.paidAt !== null;
}
