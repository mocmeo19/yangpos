import type { ReservationStatus } from '@/types/reservation';

export const RESERVATION_STATUS_BADGE_CLASSES: Record<
  ReservationStatus,
  string
> = {
  booked: 'bg-brand-soft text-brand-dark',
  seated: 'bg-success-soft text-success',
  cancelled: 'bg-ink/5 text-ink-soft',
  noShow: 'bg-danger-soft text-danger',
};

export const RESERVATION_STATUS_DOT_CLASSES: Record<ReservationStatus, string> =
  {
    booked: 'bg-brand',
    seated: 'bg-success',
    cancelled: 'bg-ink-faint',
    noShow: 'bg-danger',
  };
