import { Check, Users } from 'lucide-react';
import { cn } from '@/lib/cn';
import { formatCurrency } from '@/lib/format-currency';
import { calculateItemsTotal } from '@/lib/order-totals';
import type { DiningTable } from '@/types/dining-table';
import type { Order } from '@/types/order';

interface TableTileProps {
  table: DiningTable;
  activeOrder: Order | undefined;
  isSelected: boolean;
  onSelect: (tableId: string) => void;
}

function getTileClassName(isSelected: boolean, isOccupied: boolean): string {
  if (isSelected) {
    return 'border-ink bg-ink text-white shadow-raised';
  }
  if (isOccupied) {
    return 'border-brand/30 bg-brand-soft hover:border-brand';
  }
  return 'border-line bg-surface shadow-card hover:border-line-strong';
}

function getStatusClassName(isSelected: boolean, isOccupied: boolean): string {
  if (isSelected) {
    return 'text-white/80';
  }
  return isOccupied ? 'text-brand-dark' : 'text-success';
}

export function TableTile({
  table,
  activeOrder,
  isSelected,
  onSelect,
}: TableTileProps) {
  const isOccupied = Boolean(activeOrder);

  return (
    <button
      type="button"
      aria-pressed={isSelected}
      onClick={() => onSelect(table.id)}
      className={cn(
        'flex min-h-24 flex-col justify-between gap-2 rounded-xl border p-3 text-left transition-colors',
        getTileClassName(isSelected, isOccupied),
      )}
    >
      <span className="flex w-full items-start justify-between gap-1">
        <span className="line-clamp-2 text-sm leading-5 font-bold">
          {table.name}
        </span>
        {isSelected && <Check aria-hidden="true" className="size-4 shrink-0" />}
      </span>
      <span className="flex flex-col gap-0.5 text-xs">
        <span
          className={cn(
            'flex items-center gap-1',
            isSelected ? 'text-white/70' : 'text-ink-soft',
          )}
        >
          <Users aria-hidden="true" className="size-3" />
          {table.seats} ghế
        </span>
        <span
          className={cn(
            'font-mono font-semibold',
            getStatusClassName(isSelected, isOccupied),
          )}
        >
          {activeOrder
            ? formatCurrency(calculateItemsTotal(activeOrder.items))
            : 'Trống'}
        </span>
      </span>
    </button>
  );
}
