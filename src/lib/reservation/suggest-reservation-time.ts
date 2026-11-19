const SLOT_MINUTES = 30;
const DEFAULT_EVENING_HOUR = 19;

/**
 * Giờ gợi ý khi thêm lượt đặt: hôm nay thì lấy mốc nửa giờ kế tiếp, ngày khác thì 19:00 vì khách
 * thường đặt bữa tối.
 */
export function suggestReservationTime(day: Date, now: number): number {
  const startOfDay = new Date(day.getFullYear(), day.getMonth(), day.getDate());
  const isToday =
    now >= startOfDay.getTime() &&
    now <
      new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1).getTime();
  if (!isToday) {
    startOfDay.setHours(DEFAULT_EVENING_HOUR);
    return startOfDay.getTime();
  }
  const next = new Date(now);
  const minutesToNextSlot = SLOT_MINUTES - (next.getMinutes() % SLOT_MINUTES);
  next.setMinutes(next.getMinutes() + minutesToNextSlot, 0, 0);
  return next.getTime();
}
