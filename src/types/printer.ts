import type { Receipt } from './receipt';
import type { PrinterSettings } from './settings';

export type PrinterActionResult = { ok: true } | { ok: false; error: string };

export interface PrintReceiptOptions {
  /** Cấu hình chưa lưu, dùng khi bấm "In thử" trong trang cài đặt. */
  printer?: PrinterSettings;
  openCashDrawer?: boolean;
}

export interface ReceiptPrinter {
  printReceipt: (
    receipt: Receipt,
    options?: PrintReceiptOptions,
  ) => Promise<void>;
  openCashDrawer: (printer?: PrinterSettings) => Promise<void>;
}
