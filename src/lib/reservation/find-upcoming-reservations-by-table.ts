import type { Reservation } from '@/types/reservation';
import {
  RESERVATION_HOLD_MS,
  RESERVATION_UPCOMING_WINDOW_MS,
} from './reservation-rules';

/**
 * Lượt đặt gần nhất của từng bàn còn đang giữ chỗ: sắp tới trong vài giờ, hoặc đã qua giờ hẹn nhưng
 * khách chưa tới và vẫn trong thời gian giữ bàn.
 */
export function findUpcomingReservationsByTable(
  reservations: readonly Reservation[],
  now: number,
): Map<string, Reservation> {
  const result = new Map<string, Reservation>();
  const sorted = [...reservations].sort((a, b) => a.reservedAt - b.reservedAt);
  for (const reservation of sorted) {
    const { tableId, status, reservedAt } = reservation;
    const isInWindow =
      reservedAt >= now - RESERVATION_HOLD_MS &&
      reservedAt <= now + RESERVATION_UPCOMING_WINDOW_MS;
    if (tableId && status === 'booked' && isInWindow && !result.has(tableId)) {
      result.set(tableId, reservation);
    }
  }
  return result;
}
