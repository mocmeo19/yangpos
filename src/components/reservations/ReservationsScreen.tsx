'use client';

import { CalendarPlus, CalendarX2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import {
  FilterChips,
  type FilterChipOption,
} from '@/components/ui/FilterChips';
import { LoadingState } from '@/components/ui/LoadingState';
import { PageHeader } from '@/components/ui/PageHeader';
import { useConfirm } from '@/hooks/use-confirm';
import { useDiningTables } from '@/hooks/use-dining-tables';
import { useNow } from '@/hooks/use-now';
import { useOpenTableInPos } from '@/hooks/use-open-table-in-pos';
import { useReservationsInRange } from '@/hooks/use-reservations-in-range';
import { useToast } from '@/hooks/use-toast';
import {
  addDays,
  parseDateInputValue,
  toDateInputValue,
} from '@/lib/day-range';
import { formatTime, formatWeekdayDate } from '@/lib/format-time';
import { getErrorMessage } from '@/lib/get-error-message';
import { isClosedReservationStatus } from '@/lib/reservation/reservation-status';
import { suggestReservationTime } from '@/lib/reservation/suggest-reservation-time';
import {
  addReservation,
  setReservationStatus,
  updateReservation,
} from '@/api-client/reservation-api';
import type {
  Reservation,
  ReservationInput,
  ReservationStatus,
} from '@/types/reservation';
import { DayNavigator } from './DayNavigator';
import {
  ReservationCard,
  type ReservationCardActions,
} from './ReservationCard';
import { ReservationFormDialog } from './ReservationFormDialog';
import { RESERVATION_STATUS_DOT_CLASSES } from './reservation-status-styles';

type ReservationFilter = 'all' | 'booked' | 'seated' | 'closed';
type ReservationFormState =
  { mode: 'create' } | { mode: 'edit'; reservation: Reservation };

const NOW_REFRESH_MS = 30_000;

const STATUS_CHANGE_CONFIRMS: Partial<
  Record<ReservationStatus, { title: string; confirmLabel: string }>
> = {
  cancelled: { title: 'Hủy lượt đặt bàn', confirmLabel: 'Hủy đặt bàn' },
  noShow: {
    title: 'Đánh dấu khách không đến',
    confirmLabel: 'Khách không đến',
  },
};

function matchesFilter(
  reservation: Reservation,
  filter: ReservationFilter,
): boolean {
  switch (filter) {
    case 'booked':
      return reservation.status === 'booked';
    case 'seated':
      return reservation.status === 'seated';
    case 'closed':
      return isClosedReservationStatus(reservation.status);
    default:
      return true;
  }
}

export function ReservationsScreen() {
  const now = useNow(NOW_REFRESH_MS);
  const todayValue = toDateInputValue(new Date(now));
  const [dayValue, setDayValue] = useState(todayValue);
  const [filter, setFilter] = useState<ReservationFilter>('all');
  const [formState, setFormState] = useState<ReservationFormState | null>(null);
  const range = useMemo(() => {
    const day = parseDateInputValue(dayValue);
    return { start: day.getTime(), end: addDays(day, 1).getTime() };
  }, [dayValue]);
  const reservations = useReservationsInRange(range);
  const tables = useDiningTables();
  const showToast = useToast();
  const confirm = useConfirm();
  const openTableInPos = useOpenTableInPos();

  if (!reservations || !tables) {
    return <LoadingState />;
  }

  const tableNames = new Map(tables.map((table) => [table.id, table.name]));
  const resolveTableName = (tableId: string | null) =>
    tableId ? (tableNames.get(tableId) ?? 'Bàn đã xóa') : null;
  const countBy = (target: ReservationFilter) =>
    reservations.filter((reservation) => matchesFilter(reservation, target))
      .length;
  const bookedGuests = reservations
    .filter((reservation) => reservation.status !== 'cancelled')
    .reduce((sum, reservation) => sum + reservation.partySize, 0);
  const filterOptions: FilterChipOption<ReservationFilter>[] = [
    { value: 'all', label: 'Tất cả', count: reservations.length },
    {
      value: 'booked',
      label: 'Chờ khách',
      count: countBy('booked'),
      dotClassName: RESERVATION_STATUS_DOT_CLASSES.booked,
    },
    {
      value: 'seated',
      label: 'Đã đến',
      count: countBy('seated'),
      dotClassName: RESERVATION_STATUS_DOT_CLASSES.seated,
    },
    {
      value: 'closed',
      label: 'Hủy, không đến',
      count: countBy('closed'),
      dotClassName: RESERVATION_STATUS_DOT_CLASSES.cancelled,
    },
  ];
  const visibleReservations = reservations.filter((reservation) =>
    matchesFilter(reservation, filter),
  );

  async function handleSubmit(input: ReservationInput) {
    if (formState?.mode === 'edit') {
      await updateReservation(formState.reservation.id, input);
      showToast({ title: `Đã cập nhật lượt đặt của ${input.customerName}` });
    } else {
      await addReservation(input);
      showToast({
        title: `Đã đặt bàn cho ${input.customerName.trim()}`,
        description: `${formatWeekdayDate(input.reservedAt)} · ${formatTime(input.reservedAt)}`,
      });
      setDayValue(toDateInputValue(new Date(input.reservedAt)));
    }
    setFormState(null);
  }

  async function changeStatus(
    reservation: Reservation,
    status: ReservationStatus,
  ): Promise<boolean> {
    const confirmCopy = STATUS_CHANGE_CONFIRMS[status];
    if (confirmCopy) {
      const isConfirmed = await confirm({
        title: `${confirmCopy.title} của ${reservation.customerName}?`,
        description: 'Bàn sẽ không còn được giữ cho lượt đặt này.',
        confirmLabel: confirmCopy.confirmLabel,
        cancelLabel: 'Quay lại',
        tone: 'danger',
      });
      if (!isConfirmed) {
        return false;
      }
    }
    try {
      await setReservationStatus(reservation.id, status);
      return true;
    } catch (error) {
      showToast({
        tone: 'error',
        title: 'Chưa cập nhật được lượt đặt',
        description: getErrorMessage(error),
      });
      return false;
    }
  }

  async function handleSeat(reservation: Reservation) {
    const isDone = await changeStatus(reservation, 'seated');
    if (!isDone) {
      return;
    }
    if (reservation.tableId) {
      openTableInPos(reservation.tableId);
      return;
    }
    showToast({
      title: `${reservation.customerName} đã đến`,
      description: 'Lượt đặt chưa xếp bàn, hãy chọn bàn khi gọi món.',
      action: { label: 'Gọi món', href: '/' },
    });
  }

  const actions: ReservationCardActions = {
    seat: (reservation) => void handleSeat(reservation),
    edit: (reservation) => setFormState({ mode: 'edit', reservation }),
    changeStatus: (reservation, status) =>
      void changeStatus(reservation, status),
  };
  const openCreateForm = () => setFormState({ mode: 'create' });

  return (
    <>
      <PageHeader
        title="Đặt bàn"
        description={`${formatWeekdayDate(range.start)} · ${reservations.length} lượt đặt, ${bookedGuests} khách`}
        actions={
          <Button onClick={openCreateForm}>
            <CalendarPlus className="size-4" />
            Đặt bàn mới
          </Button>
        }
      />

      <div className="mb-5 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <DayNavigator
          value={dayValue}
          todayValue={todayValue}
          onChange={setDayValue}
        />
        {reservations.length > 0 && (
          <FilterChips
            label="Lọc theo trạng thái"
            options={filterOptions}
            value={filter}
            onChange={setFilter}
          />
        )}
      </div>

      {visibleReservations.length === 0 && (
        <EmptyState
          icon={CalendarX2}
          title={
            reservations.length === 0
              ? 'Chưa có lượt đặt bàn nào trong ngày'
              : 'Không có lượt đặt ở trạng thái này'
          }
          description="Ghi lại tên, số khách và giờ đến khi khách gọi điện hoặc nhắn tin đặt bàn."
          action={
            <Button size="sm" variant="secondary" onClick={openCreateForm}>
              <CalendarPlus className="size-4" />
              Đặt bàn mới
            </Button>
          }
        />
      )}

      {visibleReservations.length > 0 && (
        <div className="flex flex-col gap-3">
          {visibleReservations.map((reservation) => (
            <ReservationCard
              key={reservation.id}
              reservation={reservation}
              tableName={resolveTableName(reservation.tableId)}
              now={now}
              actions={actions}
            />
          ))}
        </div>
      )}

      {formState && (
        <ReservationFormDialog
          reservation={
            formState.mode === 'edit' ? formState.reservation : undefined
          }
          defaultReservedAt={suggestReservationTime(
            parseDateInputValue(dayValue),
            now,
          )}
          tables={tables}
          onClose={() => setFormState(null)}
          onSubmit={handleSubmit}
        />
      )}
    </>
  );
}
