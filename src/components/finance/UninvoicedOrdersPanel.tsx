'use client';

import { TriangleExclamationPoint } from 'lucide-react';
import { useState } from 'react';
import { IssueEInvoiceDialog } from '@/components/einvoice/IssueEInvoiceDialog';
import { Button } from '@/components/ui/Button';
import { useTableNameResolver } from '@/hooks/use-table-name-resolver';
import { formatCurrency } from '@/lib/format-currency';
import { formatOrderNumber } from '@/lib/format-order-number';
import { formatFullDateTime } from '@/lib/format-time';
import { calculateItemsTotal } from '@/lib/order-totals';
import type { Order } from '@/types/order';

const MAX_VISIBLE_ORDERS = 5;

/** Nhắc lập bù hóa đơn cho đơn đã thu tiền, cũ nhất trước để số hóa đơn đi theo thứ tự bán. */
export function UninvoicedOrdersPanel({
  orders,
}: {
  orders: readonly Order[];
}) {
  const resolveTableName = useTableNameResolver();
  const [issuingOrder, setIssuingOrder] = useState<Order | null>(null);
  const visibleOrders = orders.slice(0, MAX_VISIBLE_ORDERS);
  const hiddenCount = orders.length - visibleOrders.length;
  const total = orders.reduce(
    (sum, order) => sum + calculateItemsTotal(order.items),
    0,
  );

  return (
    <section
      aria-labelledby="uninvoiced-orders-title"
      className="rounded-2xl border border-warning/25 bg-warning-soft/60 p-4 sm:p-5"
    >
      <div className="flex items-start gap-3">
        <TriangleExclamationPoint
          aria-hidden="true"
          className="mt-0.5 size-5 shrink-0 text-warning"
        />
        <div className="min-w-0">
          <h2 id="uninvoiced-orders-title" className="font-semibold">
            {orders.length} đơn đã thu tiền chưa có hóa đơn
          </h2>
          <p className="text-sm text-ink-soft">
            Tổng {formatCurrency(total)}. Nghị định 70/2025/NĐ-CP yêu cầu lập
            hóa đơn cho từng lần bán hàng.
          </p>
        </div>
      </div>
      <ul className="mt-3 divide-y divide-line overflow-hidden rounded-xl border border-line bg-surface">
        {visibleOrders.map((order) => (
          <li
            key={order.id}
            className="flex flex-wrap items-center gap-x-3 gap-y-1 px-3.5 py-2.5 text-sm"
          >
            <span className="font-mono font-semibold">
              {formatOrderNumber(order.number)}
            </span>
            <span className="min-w-0 flex-1 truncate text-ink-soft">
              {resolveTableName(order.tableId)} ·{' '}
              {formatFullDateTime(order.paidAt ?? order.updatedAt)}
            </span>
            <span className="font-mono font-semibold tabular-nums">
              {formatCurrency(calculateItemsTotal(order.items))}
            </span>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIssuingOrder(order)}
            >
              Lập hóa đơn
            </Button>
          </li>
        ))}
      </ul>
      {hiddenCount > 0 && (
        <p className="mt-2 text-xs text-ink-soft">
          Còn {hiddenCount} đơn nữa, hiện lần lượt sau khi lập các đơn trên.
        </p>
      )}
      {issuingOrder && (
        <IssueEInvoiceDialog
          order={issuingOrder}
          tableName={resolveTableName(issuingOrder.tableId)}
          onClose={() => setIssuingOrder(null)}
        />
      )}
    </section>
  );
}
