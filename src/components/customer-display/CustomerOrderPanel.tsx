'use client';

import { ShoppingBasket } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { TicketDivider } from '@/components/ui/TicketDivider';
import { formatCurrency } from '@/lib/format-currency';
import { calculateItemsTotal, countItems } from '@/lib/order-totals';
import type { CustomerDisplaySnapshot } from '@/types/customer-display';
import { CustomerOrderLine } from './CustomerOrderLine';

interface CustomerOrderPanelProps {
  snapshot: CustomerDisplaySnapshot;
  storeName: string;
}

export function CustomerOrderPanel({
  snapshot,
  storeName,
}: CustomerOrderPanelProps) {
  const { lines, destinationLabel } = snapshot;
  const listRef = useRef<HTMLDivElement>(null);
  const lineCount = lines.length;
  const hasLines = lineCount > 0;

  // Món mới được thêm vào cuối phiếu: cuộn xuống để khách luôn thấy món vừa gọi.
  useEffect(() => {
    const list = listRef.current;
    if (list && lineCount > 0) {
      list.scrollTo({ top: list.scrollHeight, behavior: 'smooth' });
    }
  }, [lineCount]);

  return (
    <section
      aria-label="Món quý khách đã chọn"
      className="flex h-full min-h-0 flex-col bg-surface"
    >
      <header className="flex items-start justify-between gap-4 px-8 pt-8 pb-5">
        <div className="min-w-0">
          <p className="font-mono text-xs font-semibold tracking-[0.2em] text-ink-faint uppercase">
            {storeName}
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight">
            Đơn của quý khách
          </h1>
        </div>
        {destinationLabel && (
          <span className="shrink-0 rounded-full bg-brand-soft px-3.5 py-1.5 text-sm font-semibold text-brand-dark">
            {destinationLabel}
          </span>
        )}
      </header>

      <TicketDivider />

      <div
        ref={listRef}
        aria-live="polite"
        className="min-h-0 flex-1 overflow-y-auto px-8"
      >
        {hasLines ? (
          <ul className="divide-y divide-dashed divide-line">
            {lines.map((line) => (
              <CustomerOrderLine key={line.menuItemId} line={line} />
            ))}
          </ul>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 py-10 text-center">
            <span className="grid size-20 place-items-center rounded-3xl bg-brand-soft text-brand">
              <ShoppingBasket className="size-10" strokeWidth={1.5} />
            </span>
            <p className="text-xl font-bold tracking-tight">
              Xin chào quý khách!
            </p>
            <p className="max-w-64 text-ink-soft">
              Món quý khách gọi sẽ hiện ở đây để tiện kiểm tra.
            </p>
          </div>
        )}
      </div>

      <TicketDivider />

      <footer className="flex flex-col gap-1 px-8 pt-5 pb-8">
        <div className="flex items-baseline justify-between text-ink-soft">
          <span>Số món</span>
          <span className="font-mono tabular-nums">{countItems(lines)}</span>
        </div>
        <div className="flex items-baseline justify-between gap-4">
          <span className="text-lg font-semibold">Tổng cộng</span>
          <span className="font-mono text-4xl font-semibold tracking-tight text-brand tabular-nums">
            {formatCurrency(calculateItemsTotal(lines))}
          </span>
        </div>
      </footer>
    </section>
  );
}
