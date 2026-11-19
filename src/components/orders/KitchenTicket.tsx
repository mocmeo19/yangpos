import type { ReactNode } from 'react';
import { TicketDivider } from '@/components/ui/TicketDivider';
import { cn } from '@/lib/cn';
import { formatCurrency } from '@/lib/format-currency';
import { formatOrderNumber } from '@/lib/format-order-number';
import { formatTime } from '@/lib/format-time';
import { isOrderPaid } from '@/lib/is-order-paid';
import { calculateItemsTotal, countItems } from '@/lib/order-totals';
import type { Order } from '@/types/order';
import { ElapsedBadge } from './ElapsedBadge';
import { OrderPagerBadge } from './OrderPagerBadge';
import { ORDER_STATUS_ACCENT_CLASSES } from './order-status-styles';
import { OrderStatusBadge } from './OrderStatusBadge';

interface KitchenTicketProps {
  order: Order;
  tableName: string;
  now: number;
  actions: ReactNode;
  menu: ReactNode;
}

export function KitchenTicket({
  order,
  tableName,
  now,
  actions,
  menu,
}: KitchenTicketProps) {
  return (
    <article
      aria-label={`${tableName}, đơn ${formatOrderNumber(order.number)}`}
      className="flex flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-card motion-safe:animate-fade-in"
    >
      <div
        aria-hidden="true"
        className={cn('h-1.5', ORDER_STATUS_ACCENT_CLASSES[order.status])}
      />
      <header className="flex items-start justify-between gap-2 px-4 pt-3 pb-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-lg font-bold tracking-tight">
              {tableName}
            </h3>
            <ElapsedBadge since={order.createdAt} now={now} />
            <OrderPagerBadge order={order} />
          </div>
          <p className="mt-0.5 font-mono text-xs text-ink-soft">
            {formatOrderNumber(order.number)} · {formatTime(order.createdAt)}
            {isOrderPaid(order) && (
              <span className="font-sans font-semibold text-success">
                {' '}
                · Đã thu tiền
              </span>
            )}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <OrderStatusBadge status={order.status} />
          {menu}
        </div>
      </header>

      <TicketDivider />

      <ul className="flex-1 space-y-2.5 px-4 py-3.5">
        {order.items.map((item) => (
          <li
            key={`${item.menuItemId}-${item.note}`}
            className="flex gap-3 text-sm"
          >
            <span className="w-7 shrink-0 font-mono font-semibold text-brand">
              {item.quantity}×
            </span>
            <span className="min-w-0 flex-1">
              <span className="font-medium">{item.name}</span>
              {item.note && (
                <span className="mt-0.5 block text-xs text-brand-dark italic">
                  “{item.note}”
                </span>
              )}
            </span>
            <span className="font-mono text-xs whitespace-nowrap text-ink-soft tabular-nums">
              {formatCurrency(item.unitPrice * item.quantity)}
            </span>
          </li>
        ))}
      </ul>

      <TicketDivider />

      <footer className="flex flex-col gap-3 px-4 pt-3 pb-4">
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-ink-soft">
            {countItems(order.items)} món
          </span>
          <span className="font-mono text-lg font-semibold tabular-nums">
            {formatCurrency(calculateItemsTotal(order.items))}
          </span>
        </div>
        {actions}
      </footer>
    </article>
  );
}
