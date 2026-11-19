import type { EInvoice, EInvoiceTransmission } from './einvoice';

export type EInvoiceProviderId = 'sandbox' | 'misa';

/**
 * "local": máy bán hàng cấp số và mã ngay khi lập hóa đơn. "provider": nhà cung cấp cấp số, mã lúc
 * phát hành nên hóa đơn chưa có số cho tới khi phát hành xong.
 */
export type EInvoiceNumbering = 'local' | 'provider';

/** Số, mã chính thức do nhà cung cấp trả về khi phát hành. */
export interface EInvoiceAssignment {
  series: string;
  number: number;
  taxAuthorityCode: string;
  lookupCode: string;
  /** Phát hành trên môi trường thử nghiệm của nhà cung cấp nên không có giá trị pháp lý. */
  isSandbox: boolean;
}

export interface EInvoiceTransmitResult {
  status: 'sent' | 'sandbox';
  message: string | null;
  /** `null` khi số và mã đã được cấp ở máy bán hàng. */
  assignment: EInvoiceAssignment | null;
}

/** Phần thay đổi trên hóa đơn sau một lần gửi, dùng để lưu và cập nhật bản đang hiển thị. */
export type EInvoiceTransmitChanges = {
  transmission: EInvoiceTransmission;
} & Partial<EInvoiceAssignment>;

/** Điểm nối với nhà cung cấp dịch vụ hóa đơn điện tử, bên chuyển dữ liệu hóa đơn tới cơ quan thuế. */
export interface EInvoiceProvider {
  id: EInvoiceProviderId;
  label: string;
  isSandbox: boolean;
  numbering: EInvoiceNumbering;
  /** Trang tra cứu hóa đơn của nhà cung cấp, gợi ý in trên hóa đơn khi chọn nhà cung cấp này. */
  lookupUrl: string;
  transmit: (invoice: EInvoice) => Promise<EInvoiceTransmitResult>;
}
