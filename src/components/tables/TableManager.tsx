'use client';

import { LayoutGrid, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { PaymentDialog } from '@/components/orders/PaymentDialog';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import {
  FilterChips,
  type FilterChipOption,
} from '@/components/ui/FilterChips';
import { LoadingState } from '@/components/ui/LoadingState';
import { PageHeader } from '@/components/ui/PageHeader';
import { useActiveOrders } from '@/hooks/use-active-orders';
import { useCompletePayment } from '@/hooks/use-complete-payment';
import { useConfirm } from '@/hooks/use-confirm';
import { useDiningTables } from '@/hooks/use-dining-tables';
import { useNow } from '@/hooks/use-now';
import { useOpenTableInPos } from '@/hooks/use-open-table-in-pos';
import { usePrintOrderReceipt } from '@/hooks/use-print-order-receipt';
import { useReservationsInRange } from '@/hooks/use-reservations-in-range';
import { useStaffSession } from '@/hooks/use-staff-session';
import { useToast } from '@/hooks/use-toast';
import {
  addDays,
  parseDateInputValue,
  toDateInputValue,
} from '@/lib/day-range';
import { getErrorMessage } from '@/lib/get-error-message';
import { groupActiveOrdersByTable } from '@/lib/group-active-orders-by-table';
import { findUpcomingReservationsByTable } from '@/lib/reservation/find-upcoming-reservations-by-table';
import {
  RESERVATION_HOLD_MS,
  RESERVATION_UPCOMING_WINDOW_MS,
} from '@/lib/reservation/reservation-rules';
import {
  addDiningTable,
  deleteDiningTable,
  updateDiningTable,
} from '@/api-client/dining-table-api';
import type { CheckoutInput } from '@/types/checkout';
import type { DiningTable, DiningTableInput } from '@/types/dining-table';
import type { Order } from '@/types/order';
import { TableCard } from './TableCard';
import { TableFormDialog } from './TableFormDialog';

type TableFormState = { mode: 'create' } | { mode: 'edit'; table: DiningTable };
type TableFilter = 'all' | 'free' | 'occupied';

const ELAPSED_REFRESH_MS = 30_000;

function matchesFilter(isOccupied: boolean, filter: TableFilter): boolean {
  switch (filter) {
    case 'free':
      return !isOccupied;
    case 'occupied':
      return isOccupied;
    default:
      return true;
  }
}

export function TableManager() {
  const tables = useDiningTables();
  const activeOrders = useActiveOrders();
  const [filter, setFilter] = useState<TableFilter>('all');
  const [formState, setFormState] = useState<TableFormState | null>(null);
  const [payingOrder, setPayingOrder] = useState<Order | null>(null);
  const now = useNow(ELAPSED_REFRESH_MS);
  const showToast = useToast();
  const confirm = useConfirm();
  const openTableInPos = useOpenTableInPos();
  const completePayment = useCompletePayment();
  const printOrderReceipt = usePrintOrderReceipt();
  const { can } = useStaffSession();
  const canManageTables = can('tables.manage');

  const activeOrderByTable = useMemo(
    () => groupActiveOrdersByTable(activeOrders ?? []),
    [activeOrders],
  );
  // Neo theo ngày để địa chỉ truy vấn không đổi mỗi lần đồng hồ nhích; lọc theo giờ làm ở bước sau.
  const todayValue = toDateInputValue(new Date(now));
  const reservationRange = useMemo(() => {
    const today = parseDateInputValue(todayValue);
    return {
      start: today.getTime() - RESERVATION_HOLD_MS,
      end: addDays(today, 1).getTime() + RESERVATION_UPCOMING_WINDOW_MS,
    };
  }, [todayValue]);
  const nearbyReservations = useReservationsInRange(reservationRange);
  const upcomingReservationByTable = useMemo(
    () => findUpcomingReservationsByTable(nearbyReservations ?? [], now),
    [nearbyReservations, now],
  );

  if (!tables || !activeOrders) {
    return <LoadingState />;
  }

  const occupiedCount = tables.filter((table) =>
    activeOrderByTable.has(table.id),
  ).length;
  const filterOptions: FilterChipOption<TableFilter>[] = [
    { value: 'all', label: 'Tất cả', count: tables.length },
    {
      value: 'free',
      label: 'Bàn trống',
      count: tables.length - occupiedCount,
      dotClassName: 'bg-success',
    },
    {
      value: 'occupied',
      label: 'Có khách',
      count: occupiedCount,
      dotClassName: 'bg-brand',
    },
  ];
  const visibleTables = tables.filter((table) =>
    matchesFilter(activeOrderByTable.has(table.id), filter),
  );
  const payingTableName =
    tables.find((table) => table.id === payingOrder?.tableId)?.name ?? '';

  async function handleSubmit(input: DiningTableInput) {
    if (formState?.mode === 'edit') {
      await updateDiningTable(formState.table.id, input);
      showToast({ title: `Đã cập nhật ${input.name.trim()}` });
    } else {
      await addDiningTable(input);
      showToast({ title: `Đã thêm ${input.name.trim()}` });
    }
    setFormState(null);
  }

  async function handleDelete(table: DiningTable) {
    const isConfirmed = await confirm({
      title: `Xóa ${table.name}?`,
      description: 'Bàn sẽ không còn xuất hiện khi chọn bàn gọi món.',
      confirmLabel: 'Xóa bàn',
      tone: 'danger',
    });
    if (!isConfirmed) {
      return;
    }
    try {
      await deleteDiningTable(table.id);
      showToast({ title: `Đã xóa ${table.name}` });
    } catch (error) {
      showToast({
        tone: 'error',
        title: 'Không xóa được bàn',
        description: getErrorMessage(error),
      });
    }
  }

  async function handlePay(checkout: CheckoutInput) {
    if (!payingOrder) {
      return;
    }
    await completePayment(payingOrder, checkout);
    setPayingOrder(null);
  }

  const openCreateForm = () => setFormState({ mode: 'create' });
  const openEditForm = (table: DiningTable) =>
    setFormState({ mode: 'edit', table });

  return (
    <>
      <PageHeader
        title="Bàn"
        description={`${occupiedCount}/${tables.length} bàn đang có khách`}
        actions={
          canManageTables && (
            <Button onClick={openCreateForm}>
              <Plus className="size-4" />
              Thêm bàn
            </Button>
          )
        }
      />

      {tables.length === 0 && (
        <EmptyState
          icon={LayoutGrid}
          title="Chưa có bàn nào"
          description={
            canManageTables
              ? 'Thêm bàn để bắt đầu nhận đơn tại chỗ.'
              : 'Nhờ quản lý thêm bàn để bắt đầu nhận đơn tại chỗ.'
          }
          action={
            canManageTables && (
              <Button size="sm" onClick={openCreateForm}>
                <Plus className="size-4" />
                Thêm bàn đầu tiên
              </Button>
            )
          }
        />
      )}

      {tables.length > 0 && (
        <FilterChips
          className="mb-5"
          label="Lọc bàn"
          options={filterOptions}
          value={filter}
          onChange={setFilter}
        />
      )}

      {tables.length > 0 && visibleTables.length === 0 && (
        <EmptyState
          icon={LayoutGrid}
          title="Không có bàn nào phù hợp"
          description="Chọn bộ lọc khác để xem các bàn còn lại."
        />
      )}

      {visibleTables.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 2xl:grid-cols-6">
          {visibleTables.map((table) => (
            <TableCard
              key={table.id}
              table={table}
              activeOrder={activeOrderByTable.get(table.id)}
              now={now}
              upcomingReservation={upcomingReservationByTable.get(table.id)}
              onOpenInPos={openTableInPos}
              onPay={can('orders.pay') ? setPayingOrder : null}
              onPrintBill={(order) =>
                void printOrderReceipt(order, 'provisional')
              }
              onEdit={canManageTables ? openEditForm : null}
              onDelete={canManageTables ? handleDelete : null}
            />
          ))}
        </div>
      )}

      {formState && (
        <TableFormDialog
          table={formState.mode === 'edit' ? formState.table : undefined}
          onClose={() => setFormState(null)}
          onSubmit={handleSubmit}
        />
      )}

      {payingOrder && (
        <PaymentDialog
          order={payingOrder}
          tableName={payingTableName}
          onClose={() => setPayingOrder(null)}
          onConfirm={handlePay}
        />
      )}
    </>
  );
}
