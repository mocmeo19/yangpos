import {
  CalendarClock,
  Pencil,
  Plus,
  Printer,
  Trash2,
  Users,
  Wallet,
} from 'lucide-react';
import { ElapsedBadge } from '@/components/orders/ElapsedBadge';
import { OrderStatusBadge } from '@/components/orders/OrderStatusBadge';
import { Button } from '@/components/ui/Button';
import {
  DropdownMenu,
  type DropdownMenuItem,
} from '@/components/ui/DropdownMenu';
import { cn } from '@/lib/cn';
import { formatCurrency } from '@/lib/format-currency';
import { formatOrderNumber } from '@/lib/format-order-number';
import { formatTime } from '@/lib/format-time';
import { calculateItemsTotal, countItems } from '@/lib/order-totals';
import type { DiningTable } from '@/types/dining-table';
import type { Order } from '@/types/order';
import type { Reservation } from '@/types/reservation';

interface TableCardProps {
  table: DiningTable;
  activeOrder: Order | undefined;
  now: number;
  /** Lượt đặt sắp tới đang giữ bàn này, để không xếp khách vãng lai vào. */
  upcomingReservation: Reservation | undefined;
  onOpenInPos: (tableId: string) => void;
  /** `null` khi nhân viên không có quyền thu tiền. */
  onPay: ((order: Order) => void) | null;
  onPrintBill: (order: Order) => void;
  /** `null` khi nhân viên không có quyền quản lý bàn. */
  onEdit: ((table: DiningTable) => void) | null;
  onDelete: ((table: DiningTable) => void) | null;
}

function buildMenuItems(
  table: DiningTable,
  activeOrder: Order | undefined,
  {
    onPrintBill,
    onEdit,
    onDelete,
  }: Pick<TableCardProps, 'onPrintBill' | 'onEdit' | 'onDelete'>,
): DropdownMenuItem[] {
  const items: DropdownMenuItem[] = [];
  if (activeOrder) {
    items.push({
      label: 'In tạm tính',
      icon: Printer,
      onSelect: () => onPrintBill(activeOrder),
    });
  }
  if (onEdit) {
    items.push({
      label: 'Sửa bàn',
      icon: Pencil,
      onSelect: () => onEdit(table),
    });
  }
  if (onDelete) {
    items.push({
      label: 'Xóa bàn',
      icon: Trash2,
      tone: 'danger',
      onSelect: () => onDelete(table),
    });
  }
  return items;
}

export function TableCard({
  table,
  activeOrder,
  now,
  upcomingReservation,
  onOpenInPos,
  onPay,
  onPrintBill,
  onEdit,
  onDelete,
}: TableCardProps) {
  const menuItems = buildMenuItems(table, activeOrder, {
    onPrintBill,
    onEdit,
    onDelete,
  });

  return (
    <article
      className={cn(
        'flex flex-col gap-4 rounded-2xl border p-4 shadow-card transition-colors',
        activeOrder
          ? 'border-brand/30 bg-brand-soft/70'
          : 'border-line bg-surface',
      )}
    >
      <header className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h2 className="truncate text-lg font-bold tracking-tight">
            {table.name}
          </h2>
          <p className="flex items-center gap-1 text-xs text-ink-soft">
            <Users aria-hidden="true" className="size-3.5" />
            {table.seats} ghế
          </p>
        </div>
        {menuItems.length > 0 && (
          <DropdownMenu label={`Thao tác ${table.name}`} items={menuItems} />
        )}
      </header>

      {upcomingReservation && (
        <p className="flex items-center gap-1.5 rounded-lg bg-warning-soft px-2.5 py-1.5 text-xs font-semibold text-warning">
          <CalendarClock aria-hidden="true" className="size-3.5 shrink-0" />
          <span className="truncate">
            Đặt {formatTime(upcomingReservation.reservedAt)} ·{' '}
            {upcomingReservation.customerName} · {upcomingReservation.partySize}{' '}
            khách
          </span>
        </p>
      )}

      {activeOrder && (
        <>
          <div className="flex flex-1 flex-col gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <OrderStatusBadge status={activeOrder.status} />
              <ElapsedBadge since={activeOrder.createdAt} now={now} />
            </div>
            <p className="font-mono text-xs text-ink-soft">
              {formatOrderNumber(activeOrder.number)} ·{' '}
              {countItems(activeOrder.items)} món
            </p>
            <p className="font-mono text-xl font-semibold tabular-nums">
              {formatCurrency(calculateItemsTotal(activeOrder.items))}
            </p>
          </div>
          <div className="grid gap-2">
            {onPay && (
              <Button size="sm" onClick={() => onPay(activeOrder)}>
                <Wallet className="size-4" />
                Thanh toán
              </Button>
            )}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onOpenInPos(table.id)}
            >
              <Plus className="size-4" />
              Gọi thêm món
            </Button>
          </div>
        </>
      )}

      {!activeOrder && (
        <>
          <p className="flex flex-1 items-center gap-2 text-sm font-semibold text-success">
            <span
              aria-hidden="true"
              className="size-2 rounded-full bg-success"
            />
            Bàn trống
          </p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onOpenInPos(table.id)}
          >
            <Plus className="size-4" />
            Gọi món
          </Button>
        </>
      )}
    </article>
  );
}
