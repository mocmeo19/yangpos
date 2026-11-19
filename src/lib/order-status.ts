import type { OrderStatus } from '@/types/order';

export const ACTIVE_ORDER_STATUSES: readonly OrderStatus[] = [
  'pending',
  'preparing',
  'served',
];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Chờ chế biến',
  preparing: 'Đang chế biến',
  served: 'Đã phục vụ',
  paid: 'Đã thanh toán',
  cancelled: 'Đã hủy',
};

export function isActiveOrderStatus(status: OrderStatus): boolean {
  return ACTIVE_ORDER_STATUSES.includes(status);
}

/** Trạng thái kế tiếp trong luồng bếp; `null` khi đơn chỉ còn chờ thanh toán hoặc đã đóng. */
export function getNextKitchenStatus(status: OrderStatus): OrderStatus | null {
  switch (status) {
    case 'pending':
      return 'preparing';
    case 'preparing':
      return 'served';
    default:
      return null;
  }
}
