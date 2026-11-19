import type { TextStyle } from '@/lib/escpos/receipt-canvas-writer';

/** Kiểu chữ đã co theo khổ giấy, dùng chung cho mọi phần của hóa đơn in nhiệt. */
export interface ReceiptTextStyles {
  storeName: TextStyle;
  title: TextStyle;
  total: TextStyle;
  body: TextStyle;
  small: TextStyle;
  centeredSmall: TextStyle;
  lineGap: number;
}
