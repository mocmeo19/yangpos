'use client';

import { API_PATHS, rangeQuery } from '@/api-client/api-paths';
import type { TimeRange } from '@/lib/day-range';
import type { Reservation } from '@/types/reservation';
import { useApiQuery } from './use-api-query';

// Khách gọi đặt bàn có thể được máy khác ghi nhận.
const RESERVATIONS_REFRESH_MS = 15_000;

/** Lượt đặt có giờ hẹn trong `[start, end)`, sắp theo giờ hẹn. */
export function useReservationsInRange({
  start,
  end,
}: TimeRange): Reservation[] | undefined {
  return useApiQuery<Reservation[]>(
    `${API_PATHS.reservations}?${rangeQuery(start, end)}`,
    { refreshIntervalMs: RESERVATIONS_REFRESH_MS },
  );
}
