const percentFormatter = new Intl.NumberFormat('vi-VN', {
  style: 'percent',
  maximumFractionDigits: 0,
});

/** Nhận số phần trăm (12.5 nghĩa là 12,5%). */
export function formatPercent(percent: number): string {
  return percentFormatter.format(percent / 100);
}
