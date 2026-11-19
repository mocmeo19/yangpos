import type { ReservationStatus } from '@/types/reservation';

export const RESERVATION_STATUS_LABELS: Record<ReservationStatus, string> = {
  booked: 'Đã đặt',
  seated: 'Đã đến',
  cancelled: 'Đã hủy',
  noShow: 'Không đến',
};

/** Lượt đặt đã kết thúc (hủy hoặc khách không đến) thì không còn giữ bàn. */
export function isClosedReservationStatus(status: ReservationStatus): boolean {
  return status === 'cancelled' || status === 'noShow';
}
