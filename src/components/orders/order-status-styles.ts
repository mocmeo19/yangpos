import type { OrderStatus } from '@/types/order';

export const ORDER_STATUS_BADGE_CLASSES: Record<OrderStatus, string> = {
  pending: 'bg-amber-100 text-amber-800',
  preparing: 'bg-sky-100 text-sky-800',
  served: 'bg-violet-100 text-violet-800',
  paid: 'bg-success-soft text-success',
  cancelled: 'bg-ink/5 text-ink-soft',
};

/** Màu nhấn dùng cho chấm trạng thái và dải màu đầu phiếu bếp. */
export const ORDER_STATUS_ACCENT_CLASSES: Record<OrderStatus, string> = {
  pending: 'bg-amber-400',
  preparing: 'bg-sky-500',
  served: 'bg-violet-500',
  paid: 'bg-success',
  cancelled: 'bg-ink-faint',
};
