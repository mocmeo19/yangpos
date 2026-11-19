import type { InvoiceBuyer } from './einvoice';
import type { PaymentInput } from './order';

/** Những gì thu ngân nhập trong hộp thoại thanh toán. */
export interface CheckoutInput {
  payment: PaymentInput;
  /** Người mua ghi trên hóa đơn điện tử; `null` với khách lẻ không yêu cầu. */
  invoiceBuyer: InvoiceBuyer | null;
}
