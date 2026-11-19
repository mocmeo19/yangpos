function pad(value: number): string {
  return String(value).padStart(2, '0');
}

/** Giá trị cho input datetime-local theo giờ địa phương, vd "2026-11-07T14:30". */
export function toDateTimeInputValue(timestamp: number): string {
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function parseDateTimeInputValue(value: string): number {
  const [datePart, timePart = '00:00'] = value.split('T');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hours, minutes] = timePart.split(':').map(Number);
  return new Date(year, month - 1, day, hours, minutes).getTime();
}
