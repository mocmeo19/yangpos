import { ChefHat, ShoppingBasket, Wallet } from 'lucide-react';
import type { Dispatch, ReactNode } from 'react';
import { Button } from '@/components/ui/Button';
import { TicketDivider } from '@/components/ui/TicketDivider';
import { cn } from '@/lib/cn';
import { formatCurrency } from '@/lib/format-currency';
import { calculateItemsTotal, countItems } from '@/lib/order-totals';
import type { CartAction, CartLine } from '@/types/cart';
import { CartLineRow } from './CartLineRow';

export type OrderTicketVariant = 'panel' | 'sheet';

const VARIANT_CLASSES: Record<OrderTicketVariant, string> = {
  panel:
    'h-[calc(100dvh-3rem)] rounded-2xl border border-line bg-surface shadow-card',
  sheet: 'max-h-[88dvh] bg-surface',
};

export interface OrderTicketContent {
  title: string;
  subtitle: string;
  tableSelector: ReactNode;
  /** Ô chọn thẻ rung khi bán mang đi; `null` khi không dùng thẻ rung. */
  pagerSelector: ReactNode;
  notice: ReactNode;
  lines: readonly CartLine[];
  dispatch: Dispatch<CartAction>;
  blockedReason: string | null;
  isSubmitting: boolean;
  onSendToKitchen: () => void;
  /** `null` khi nhân viên không có quyền thu tiền: chỉ còn nút gửi bếp. */
  onCheckout: (() => void) | null;
}

interface OrderTicketProps extends OrderTicketContent {
  variant: OrderTicketVariant;
  headerActions: ReactNode;
}

export function OrderTicket({
  variant,
  headerActions,
  title,
  subtitle,
  tableSelector,
  pagerSelector,
  notice,
  lines,
  dispatch,
  blockedReason,
  isSubmitting,
  onSendToKitchen,
  onCheckout,
}: OrderTicketProps) {
  const hasLines = lines.length > 0;
  const canSubmit = hasLines && !blockedReason && !isSubmitting;
  const isNotched = variant === 'panel';

  return (
    <section
      aria-label="Phiếu gọi món"
      className={cn('flex flex-col', VARIANT_CLASSES[variant])}
    >
      <header className="flex items-start justify-between gap-3 px-5 pt-4 pb-3">
        <div className="min-w-0">
          <p className="font-mono text-[11px] font-semibold tracking-[0.2em] text-ink-faint uppercase">
            Phiếu gọi món
          </p>
          <h2 className="mt-1 truncate text-xl font-bold tracking-tight">
            {title}
          </h2>
          <p className="truncate text-sm text-ink-soft">{subtitle}</p>
        </div>
        <div className="-mr-2 flex shrink-0 items-center">{headerActions}</div>
      </header>

      <div className="flex flex-col gap-3 px-5 pb-4">
        {tableSelector}
        {pagerSelector}
        {notice}
      </div>

      <TicketDivider notched={isNotched} />

      <div className="min-h-0 flex-1 overflow-y-auto px-5">
        {hasLines ? (
          <ul className="divide-y divide-dashed divide-line">
            {lines.map((line) => (
              <CartLineRow
                key={line.menuItemId}
                line={line}
                dispatch={dispatch}
              />
            ))}
          </ul>
        ) : (
          <div className="flex h-full min-h-40 flex-col items-center justify-center gap-2 py-8 text-center text-ink-faint">
            <ShoppingBasket className="size-8" strokeWidth={1.5} />
            <p className="text-sm font-medium text-ink-soft">
              Phiếu đang trống
            </p>
            <p className="text-xs">Chọn món từ thực đơn để thêm vào phiếu</p>
          </div>
        )}
      </div>

      <TicketDivider notched={isNotched} />

      <footer className="flex flex-col gap-3 px-5 pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-sm text-ink-soft">
            Tổng cộng · {countItems(lines)} món
          </span>
          <span className="font-mono text-2xl font-semibold tracking-tight tabular-nums">
            {formatCurrency(calculateItemsTotal(lines))}
          </span>
        </div>
        {hasLines && blockedReason && (
          <p
            role="status"
            className="rounded-lg bg-warning-soft px-3 py-2 text-xs font-medium text-warning"
          >
            {blockedReason}
          </p>
        )}
        <div
          className={cn(
            'grid gap-2',
            onCheckout && 'grid-cols-[auto_minmax(0,1fr)]',
          )}
        >
          {onCheckout && (
            <Button
              variant="secondary"
              size="lg"
              disabled={!canSubmit}
              onClick={onCheckout}
            >
              <Wallet className="size-5" />
              Thanh toán
            </Button>
          )}
          <Button size="lg" disabled={!canSubmit} onClick={onSendToKitchen}>
            <ChefHat className="size-5" />
            {isSubmitting ? 'Đang gửi…' : 'Gửi bếp'}
          </Button>
        </div>
      </footer>
    </section>
  );
}
