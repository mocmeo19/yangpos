const NUMBER_DIGITS = 8;

/**
 * Số hóa đơn tối đa 8 chữ số, in đủ số 0 phía trước cho dễ đối chiếu. `null` là hóa đơn đang chờ
 * nhà cung cấp cấp số lúc phát hành.
 */
export function formatEInvoiceNumber(invoiceNumber: number | null): string {
  if (invoiceNumber === null) {
    return 'Chưa cấp số';
  }
  return String(invoiceNumber).padStart(NUMBER_DIGITS, '0');
}
