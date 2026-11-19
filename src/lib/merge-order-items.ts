import type { OrderItem } from '@/types/order';

function isSameLine(left: OrderItem, right: OrderItem): boolean {
  return left.menuItemId === right.menuItemId && left.note === right.note;
}

/** Cộng dồn số lượng cho các dòng trùng món và trùng ghi chú, giữ nguyên thứ tự gọi. */
export function mergeOrderItems(
  currentItems: readonly OrderItem[],
  addedItems: readonly OrderItem[],
): OrderItem[] {
  const merged = currentItems.map((item) => ({ ...item }));

  for (const addedItem of addedItems) {
    const existing = merged.find((item) => isSameLine(item, addedItem));
    if (existing) {
      existing.quantity += addedItem.quantity;
    } else {
      merged.push({ ...addedItem });
    }
  }

  return merged;
}
