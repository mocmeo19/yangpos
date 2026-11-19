import {
  Ban,
  CalendarClock,
  DoorOpen,
  Pencil,
  Phone,
  RotateCcw,
  UserX,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  DropdownMenu,
  type DropdownMenuItem,
} from '@/components/ui/DropdownMenu';
import { cn } from '@/lib/cn';
import { formatTime } from '@/lib/format-time';
import { RESERVATION_LATE_AFTER_MS } from '@/lib/reservation/reservation-rules';
import {
  isClosedReservationStatus,
  RESERVATION_STATUS_LABELS,
} from '@/lib/reservation/reservation-status';
import type { Reservation, ReservationStatus } from '@/types/reservation';
import { RESERVATION_STATUS_BADGE_CLASSES } from './reservation-status-styles';

const MINUTE_MS = 60_000;

export interface ReservationCardActions {
  seat: (reservation: Reservation) => void;
  edit: (reservation: Reservation) => void;
  changeStatus: (reservation: Reservation, status: ReservationStatus) => void;
}

interface ReservationCardProps {
  reservation: Reservation;
  /** `null` khi chưa xếp bàn. */
  tableName: string | null;
  now: number;
  actions: ReservationCardActions;
}

function buildMenuItems(
  reservation: Reservation,
  actions: ReservationCardActions,
): DropdownMenuItem[] {
  const items: DropdownMenuItem[] = [
    { label: 'Sửa', icon: Pencil, onSelect: () => actions.edit(reservation) },
  ];
  if (reservation.phone) {
    items.push({
      label: 'Gọi cho khách',
      icon: Phone,
      onSelect: () => {
        window.location.href = `tel:${reservation.phone}`;
      },
    });
  }
  if (reservation.status === 'booked') {
    items.push(
      {
        label: 'Khách không đến',
        icon: UserX,
        onSelect: () => actions.changeStatus(reservation, 'noShow'),
      },
      {
        label: 'Hủy đặt bàn',
        icon: Ban,
        tone: 'danger',
        onSelect: () => actions.changeStatus(reservation, 'cancelled'),
      },
    );
  }
  if (isClosedReservationStatus(reservation.status)) {
    items.push({
      label: 'Khôi phục lượt đặt',
      icon: RotateCcw,
      onSelect: () => actions.changeStatus(reservation, 'booked'),
    });
  }
  return items;
}

export function ReservationCard({
  reservation,
  tableName,
  now,
  actions,
}: ReservationCardProps) {
  const { status } = reservation;
  const isBooked = status === 'booked';
  const lateMs = now - reservation.reservedAt;
  const isLate = isBooked && lateMs > RESERVATION_LATE_AFTER_MS;
  const isClosed = isClosedReservationStatus(status);

  return (
    <article
      className={cn(
        'flex flex-col gap-3 rounded-2xl border bg-surface p-4 shadow-card sm:flex-row sm:items-center sm:gap-5',
        isLate ? 'border-warning/40' : 'border-line',
        isClosed && 'opacity-60',
      )}
    >
      <div className="flex items-center gap-4 sm:w-24 sm:flex-col sm:items-start sm:gap-1">
        <p className="font-mono text-2xl font-semibold tabular-nums">
          {formatTime(reservation.reservedAt)}
        </p>
        <span
          className={cn(
            'rounded-full px-2.5 py-0.5 text-xs font-semibold',
            RESERVATION_STATUS_BADGE_CLASSES[status],
          )}
        >
          {RESERVATION_STATUS_LABELS[status]}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="truncate text-lg font-bold tracking-tight">
            {reservation.customerName}
          </h3>
          {isLate && (
            <span className="rounded-full bg-warning-soft px-2.5 py-0.5 text-xs font-semibold text-warning">
              Trễ {Math.floor(lateMs / MINUTE_MS)} phút
            </span>
          )}
        </div>
        <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-soft">
          <span className="inline-flex items-center gap-1">
            <Users aria-hidden="true" className="size-3.5" />
            {reservation.partySize} khách
          </span>
          <span className="inline-flex items-center gap-1">
            <CalendarClock aria-hidden="true" className="size-3.5" />
            {tableName ?? 'Chưa xếp bàn'}
          </span>
          {reservation.phone && (
            <span className="font-mono">{reservation.phone}</span>
          )}
        </p>
        {reservation.note && (
          <p className="mt-1 text-sm text-brand-dark italic">
            “{reservation.note}”
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 self-end sm:self-center">
        {isBooked && (
          <Button size="sm" onClick={() => actions.seat(reservation)}>
            <DoorOpen className="size-4" />
            Khách đã đến
          </Button>
        )}
        <DropdownMenu
          label={`Thao tác đặt bàn ${reservation.customerName}`}
          items={buildMenuItems(reservation, actions)}
        />
      </div>
    </article>
  );
}
