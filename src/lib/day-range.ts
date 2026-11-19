export interface TimeRange {
  start: number;
  end: number;
}

/** Đọc chuỗi `YYYY-MM-DD` của input date thành mốc 0 giờ theo giờ địa phương. */
export function parseDateInputValue(dateValue: string): Date {
  const [year, month, day] = dateValue.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function toDateInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** Cộng theo ngày lịch thay vì cộng mili giây để không lệch khi có giờ tiết kiệm ánh sáng. */
export function addDays(date: Date, days: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}
