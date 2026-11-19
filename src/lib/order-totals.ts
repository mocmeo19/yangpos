import type { OrderItem } from '@/types/order';

export function calculateItemsTotal(items: readonly OrderItem[]): number {
  return items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
}

export function countItems(items: readonly OrderItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}
