import { ShoppingBasket } from 'lucide-react';
import { formatCurrency } from '@/lib/format-currency';
import { calculateItemsTotal, countItems } from '@/lib/order-totals';
import type { CartLine } from '@/types/cart';

interface MobileTicketBarProps {
  lines: readonly CartLine[];
  destinationLabel: string;
  onOpen: () => void;
}

export function MobileTicketBar({
  lines,
  destinationLabel,
  onOpen,
}: MobileTicketBarProps) {
  if (lines.length === 0) {
    return null;
  }

  const itemCount = countItems(lines);

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-haspopup="dialog"
      className="fixed inset-x-4 bottom-[calc(4.75rem+env(safe-area-inset-bottom))] z-30 flex items-center gap-3 rounded-2xl bg-ink py-2.5 pr-4 pl-2.5 text-white shadow-overlay motion-safe:animate-fade-in sm:inset-x-6 lg:hidden"
    >
      <span className="relative grid size-11 shrink-0 place-items-center rounded-xl bg-white/10">
        <ShoppingBasket aria-hidden="true" className="size-5" />
        <span
          key={itemCount}
          className="absolute -top-1.5 -right-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-[11px] font-bold motion-safe:animate-pop"
        >
          {itemCount}
        </span>
      </span>
      <span className="min-w-0 flex-1 text-left">
        <span className="block text-sm font-semibold">Xem phiếu gọi món</span>
        <span className="block truncate text-xs text-white/70">
          {destinationLabel}
        </span>
      </span>
      <span className="font-mono text-base font-semibold tabular-nums">
        {formatCurrency(calculateItemsTotal(lines))}
      </span>
    </button>
  );
}
