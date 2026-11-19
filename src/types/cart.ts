import type { MenuItem } from './menu';
import type { OrderItem } from './order';

/** Dòng trong phiếu đang gọi; `emoji` chỉ để hiển thị và không được lưu vào đơn. */
export interface CartLine extends OrderItem {
  emoji: string;
}

export type CartAction =
  | { type: 'add'; menuItem: MenuItem }
  | { type: 'changeQuantity'; menuItemId: string; delta: number }
  | { type: 'setNote'; menuItemId: string; note: string }
  | { type: 'remove'; menuItemId: string }
  | { type: 'clear' };
