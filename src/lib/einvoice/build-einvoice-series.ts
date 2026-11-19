/**
 * Ký hiệu hóa đơn khởi tạo từ máy tính tiền: "C" (có mã của cơ quan thuế), 2 số cuối của năm lập,
 * "M" (máy tính tiền) và 2 chữ cái người bán tự đặt, vd "C26MAA".
 */
export function buildEInvoiceSeries(issuedAt: number, suffix: string): string {
  const year = String(new Date(issuedAt).getFullYear()).slice(-2);
  return `C${year}M${suffix}`;
}
