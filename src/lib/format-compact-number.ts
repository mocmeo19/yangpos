const compactFormatter = new Intl.NumberFormat('vi-VN', {
  notation: 'compact',
  maximumFractionDigits: 1,
});

/** Dạng rút gọn cho trục biểu đồ, vd 150000 → "150 N", 1200000 → "1,2 Tr". */
export function formatCompactNumber(value: number): string {
  return compactFormatter.format(value);
}
