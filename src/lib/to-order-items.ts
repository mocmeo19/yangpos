import type { CartLine } from '@/types/cart';
import type { OrderItem } from '@/types/order';

/** Chỉ giữ các trường của món trong đơn để dữ liệu hiển thị của phiếu không bị gửi lên máy chủ. */
export function toOrderItems(lines: readonly CartLine[]): OrderItem[] {
  return lines.map(({ menuItemId, name, unitPrice, quantity, note }) => ({
    menuItemId,
    name,
    unitPrice,
    quantity,
    note,
  }));
}
