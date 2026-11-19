import type { CashEntry } from './cash-entry';
import type { Order } from './order';

export interface CashBookRow {
  id: string;
  occurredAt: number;
  reference: string;
  description: string;
  receipt: number;
  payment: number;
  balance: number;
  /** Có với phiếu thu/chi lập tay; dòng tổng hợp bán hàng trong ngày thì không. */
  entryId: string | null;
}

export interface CashBook {
  openingBalance: number;
  rows: CashBookRow[];
  totalReceipts: number;
  totalPayments: number;
  closingBalance: number;
}

/** Toàn bộ dữ liệu trước thời điểm cuối kỳ, cần để tính tồn đầu kỳ. */
export interface CashBookSource {
  orders: Order[];
  entries: CashEntry[];
}
