import { toDateInputValue, type TimeRange } from '@/lib/day-range';

/** Phần đuôi tên tệp xuất theo kỳ, vd "2026-11-01_2026-11-30"; ngày cuối là ngày trước mốc kết thúc. */
export function buildPeriodFileSuffix({ start, end }: TimeRange): string {
  const firstDay = toDateInputValue(new Date(start));
  const lastDay = toDateInputValue(new Date(end - 1));
  return firstDay === lastDay ? firstDay : `${firstDay}_${lastDay}`;
}
