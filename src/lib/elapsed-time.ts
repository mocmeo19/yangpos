const MINUTE_MS = 60_000;
const MINUTES_PER_HOUR = 60;
const WARNING_AFTER_MINUTES = 15;
const LATE_AFTER_MINUTES = 30;

export type ElapsedTone = 'normal' | 'warning' | 'late';

export function getElapsedMinutes(since: number, now: number): number {
  return Math.max(0, Math.floor((now - since) / MINUTE_MS));
}

export function formatElapsed(minutes: number): string {
  if (minutes < 1) {
    return 'Vừa xong';
  }
  if (minutes < MINUTES_PER_HOUR) {
    return `${minutes} phút`;
  }
  const hours = Math.floor(minutes / MINUTES_PER_HOUR);
  const remainingMinutes = minutes % MINUTES_PER_HOUR;
  return remainingMinutes === 0
    ? `${hours} giờ`
    : `${hours} giờ ${remainingMinutes} phút`;
}

/** Mức cảnh báo cho thời gian khách chờ, giúp bếp nhận ra đơn bị trễ. */
export function getElapsedTone(minutes: number): ElapsedTone {
  if (minutes >= LATE_AFTER_MINUTES) {
    return 'late';
  }
  if (minutes >= WARNING_AFTER_MINUTES) {
    return 'warning';
  }
  return 'normal';
}
