import { Info } from 'lucide-react';
import { formatCurrency } from '@/lib/format-currency';
import { formatOrderNumber } from '@/lib/format-order-number';
import { calculateItemsTotal, countItems } from '@/lib/order-totals';
import type { Order } from '@/types/order';

export function ActiveOrderNotice({ order }: { order: Order }) {
  return (
    <div className="flex items-start gap-2.5 rounded-xl border border-brand/20 bg-brand-soft px-3 py-2.5 text-xs leading-5 text-brand-dark">
      <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
      <p>
        Bàn đang có đơn{' '}
        <strong className="font-mono">{formatOrderNumber(order.number)}</strong>{' '}
        · {countItems(order.items)} món ·{' '}
        {formatCurrency(calculateItemsTotal(order.items))}. Món mới sẽ được thêm
        vào đơn này.
      </p>
    </div>
  );
}
