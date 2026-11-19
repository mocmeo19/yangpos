/** Trả về `null` khi kỳ trước bằng 0 vì khi đó phần trăm thay đổi không có ý nghĩa. */
export function calculatePercentChange(
  current: number,
  previous: number,
): number | null {
  if (previous === 0) {
    return null;
  }
  return ((current - previous) / previous) * 100;
}
