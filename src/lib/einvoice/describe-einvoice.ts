import { formatOrderNumber } from '@/lib/format-order-number';
import type { EInvoice } from '@/types/einvoice';
import { formatEInvoiceNumber } from './format-einvoice-number';

/** Tên gọi hóa đơn trong thông báo; hóa đơn còn chờ nhà cung cấp cấp số thì gọi theo số đơn. */
export function describeEInvoice(
  invoice: Pick<EInvoice, 'number' | 'orderNumber'>,
): string {
  if (invoice.number === null) {
    return `hóa đơn của đơn ${formatOrderNumber(invoice.orderNumber)}`;
  }
  return `hóa đơn số ${formatEInvoiceNumber(invoice.number)}`;
}
