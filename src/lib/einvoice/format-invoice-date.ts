function pad(value: number): string {
  return String(value).padStart(2, '0');
}

/** Cách ghi ngày lập quen thuộc trên hóa đơn, vd "Ngày 07 tháng 11 năm 2026". */
export function formatInvoiceDate(timestamp: number): string {
  const date = new Date(timestamp);
  return `Ngày ${pad(date.getDate())} tháng ${pad(date.getMonth() + 1)} năm ${date.getFullYear()}`;
}
