import type { EInvoice } from './einvoice';
import type { Order } from './order';

/** Đơn đã thu tiền trong kỳ cùng hóa đơn của chính các đơn đó, kể cả hóa đơn lập sau kỳ. */
export interface PeriodSales {
  orders: Order[];
  invoices: EInvoice[];
}
