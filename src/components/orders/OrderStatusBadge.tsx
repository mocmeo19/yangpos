import { cn } from '@/lib/cn';
import { ORDER_STATUS_LABELS } from '@/lib/order-status';
import type { OrderStatus } from '@/types/order';
import {
  ORDER_STATUS_ACCENT_CLASSES,
  ORDER_STATUS_BADGE_CLASSES,
} from './order-status-styles';

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap',
        ORDER_STATUS_BADGE_CLASSES[status],
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'size-1.5 rounded-full',
          ORDER_STATUS_ACCENT_CLASSES[status],
        )}
      />
      {ORDER_STATUS_LABELS[status]}
    </span>
  );
}
