import { Armchair, ChevronRight } from 'lucide-react';
import { formatOrderNumber } from '@/lib/format-order-number';
import type { DiningTable } from '@/types/dining-table';
import type { Order } from '@/types/order';

interface TableSelectButtonProps {
  table: DiningTable | undefined;
  activeOrder: Order | undefined;
  onClick: () => void;
}

function describeTable(table: DiningTable, activeOrder: Order | undefined) {
  const status = activeOrder
    ? `Đang phục vụ ${formatOrderNumber(activeOrder.number)}`
    : 'Bàn trống';
  return `${table.seats} ghế · ${status}`;
}

export function TableSelectButton({
  table,
  activeOrder,
  onClick,
}: TableSelectButtonProps) {
  if (!table) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-haspopup="dialog"
        className="flex w-full items-center gap-3 rounded-xl border border-dashed border-brand/50 bg-brand-soft/60 px-3 py-2.5 text-left transition-colors hover:bg-brand-soft"
      >
        <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-surface text-brand shadow-card">
          <Armchair aria-hidden="true" className="size-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold">Chưa chọn bàn</span>
          <span className="block text-xs text-ink-soft">
            Chạm để chọn bàn cho khách
          </span>
        </span>
        <span className="flex shrink-0 items-center text-sm font-semibold text-brand">
          Chọn bàn
          <ChevronRight aria-hidden="true" className="size-4" />
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-haspopup="dialog"
      className="flex w-full items-center gap-3 rounded-xl border border-line bg-surface px-3 py-2.5 text-left shadow-card transition-colors hover:border-line-strong"
    >
      <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-ink text-white">
        <Armchair aria-hidden="true" className="size-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold">
          {table.name}
        </span>
        <span className="block truncate text-xs text-ink-soft">
          {describeTable(table, activeOrder)}
        </span>
      </span>
      <span className="flex shrink-0 items-center text-sm font-semibold text-brand">
        Đổi bàn
        <ChevronRight aria-hidden="true" className="size-4" />
      </span>
    </button>
  );
}
