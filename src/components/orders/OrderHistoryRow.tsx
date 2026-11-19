import { ChevronRight, Receipt } from 'lucide-react';
import { cn } from '@/lib/cn';
import { formatCurrency } from '@/lib/format-currency';
import { formatOrderNumber } from '@/lib/format-order-number';
import { formatDateTime } from '@/lib/format-time';
import { calculateItemsTotal, countItems } from '@/lib/order-totals';
import { PAYMENT_METHOD_LABELS } from '@/lib/payment-methods';
import type { Order } from '@/types/order';

interface OrderHistoryRowProps {
  order: Order;
  tableName: string;
  onOpen: (order: Order) => void;
}

function describeClosure(order: Order): string {
  if (order.paymentMethod) {
    return PAYMENT_METHOD_LABELS[order.paymentMethod];
  }
  return 'Đã hủy';
}

export function OrderHistoryRow({
  order,
  tableName,
  onOpen,
}: OrderHistoryRowProps) {
  const isCancelled = order.status === 'cancelled';
  const closedAt = order.paidAt ?? order.updatedAt;

  return (
    <li>
      <button
        type="button"
        onClick={() => onOpen(order)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-muted sm:gap-4"
      >
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-surface-muted text-ink-soft">
          <Receipt aria-hidden="true" className="size-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-baseline gap-2">
            <span className="truncate font-semibold">{tableName}</span>
            <span className="font-mono text-xs text-ink-soft">
              {formatOrderNumber(order.number)}
            </span>
          </span>
          <span className="block truncate text-xs text-ink-soft">
            {formatDateTime(closedAt)} · {countItems(order.items)} món ·{' '}
            {describeClosure(order)}
          </span>
        </span>
        <span
          className={cn(
            'font-mono text-sm font-semibold whitespace-nowrap tabular-nums',
            isCancelled && 'text-ink-faint line-through',
          )}
        >
          {formatCurrency(calculateItemsTotal(order.items))}
        </span>
        <ChevronRight
          aria-hidden="true"
          className="size-4 shrink-0 text-ink-faint"
        />
      </button>
    </li>
  );
}
