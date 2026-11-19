import type { StoreSettings } from './settings';

export type ReceiptKind = 'final' | 'provisional' | 'test';

export interface ReceiptLine {
  name: string;
  note: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  /** Đơn vị tính, chỉ có khi in hóa đơn điện tử. */
  unit?: string;
}

export interface ReceiptPaymentInfo {
  methodLabel: string;
  cashReceived: number | null;
  change: number | null;
  cardSummary: string | null;
  approvalCode: string | null;
  transferNote: string | null;
}

export interface ReceiptTransferQr {
  payload: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  note: string;
}

export interface ReceiptEInvoiceRow {
  label: string;
  value: string;
}

/** Phần hóa đơn điện tử đã định dạng sẵn để bản in qua trình duyệt và máy in nhiệt giống nhau. */
export interface ReceiptEInvoice {
  heading: string;
  originNote: string;
  /** Ký hiệu mẫu số ghép ký hiệu hóa đơn, vd "1C26MAA". */
  symbol: string;
  number: string;
  issuedAt: number;
  sellerLines: string[];
  buyerLines: string[];
  summaryRows: ReceiptEInvoiceRow[];
  totalInWords: string;
  /** Chuỗi rỗng khi nhà cung cấp chưa trả mã của cơ quan thuế. */
  taxAuthorityCode: string;
  /** Mã tra cứu của nhà cung cấp, người mua nhập ở trang tra cứu để xem hóa đơn. */
  lookupCode: string | null;
  lookupSite: string;
  isSandbox: boolean;
}

/** Dữ liệu đã sẵn sàng để in, dùng chung cho bản in qua trình duyệt và máy in mạng. */
export interface Receipt {
  kind: ReceiptKind;
  title: string;
  store: StoreSettings;
  orderLabel: string;
  tableName: string;
  createdAt: number;
  printedAt: number;
  lines: ReceiptLine[];
  itemCount: number;
  total: number;
  payment: ReceiptPaymentInfo | null;
  transferQr: ReceiptTransferQr | null;
  /** Có khi đơn đã lập hóa đơn điện tử: bản in là bản thể hiện của hóa đơn. */
  eInvoice: ReceiptEInvoice | null;
  /** Số thẻ rung in to trên phiếu để khách đối chiếu khi tới lấy món. */
  pagerNumber: number | null;
}
