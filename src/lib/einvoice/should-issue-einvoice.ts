import type { InvoiceBuyer } from '@/types/einvoice';
import type { EInvoiceSettings } from '@/types/settings';

/** Khách đã nhập thông tin người mua nghĩa là yêu cầu hóa đơn, nên luôn lập dù tắt tự động lập. */
export function shouldIssueEInvoice(
  settings: EInvoiceSettings,
  buyer: InvoiceBuyer | null,
): boolean {
  return settings.enabled && (settings.autoIssueOnPayment || buyer !== null);
}
