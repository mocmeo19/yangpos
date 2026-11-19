const timeFormatter = new Intl.DateTimeFormat('vi-VN', {
  hour: '2-digit',
  minute: '2-digit',
});

const dayMonthFormatter = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
});

const weekdayDateFormatter = new Intl.DateTimeFormat('vi-VN', {
  weekday: 'long',
  day: '2-digit',
  month: '2-digit',
});

export function formatWeekdayDate(timestamp: number): string {
  return weekdayDateFormatter.format(timestamp);
}

export function formatTime(timestamp: number): string {
  return timeFormatter.format(timestamp);
}

/** Dạng "07/11 · 14:30" quen thuộc trên hóa đơn và lịch sử đơn. */
export function formatDateTime(timestamp: number): string {
  return `${dayMonthFormatter.format(timestamp)} · ${timeFormatter.format(timestamp)}`;
}

const fullDateFormatter = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

/** Dạng "07/11/2026" dùng trên sổ sách và hóa đơn điện tử. */
export function formatDate(timestamp: number): string {
  return fullDateFormatter.format(timestamp);
}

export function formatFullDateTime(timestamp: number): string {
  return `${formatDate(timestamp)} ${formatTime(timestamp)}`;
}
