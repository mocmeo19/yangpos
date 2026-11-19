import type { EInvoiceProviderId } from './einvoice-provider';
import type { PaymentMethod } from './order';

/** Ký hiệu mẫu số: "1" là hóa đơn giá trị gia tăng, "2" là hóa đơn bán hàng. */
export type EInvoiceTemplate = '1' | '2';

/** "KCT": không chịu thuế GTGT; "KKKNT": không phải kê khai, tính nộp thuế GTGT. */
export type VatRateCode = '10' | '8' | '5' | '0' | 'KCT' | 'KKKNT';

/** "sandbox": hóa đơn lập ở chế độ thử nghiệm, không gửi tới cơ quan thuế. */
export type EInvoiceTransmissionStatus =
  'pending' | 'sent' | 'failed' | 'sandbox';

export type InvoiceBuyerKind = 'company' | 'individual';

/** Chỉ ghi khi người mua yêu cầu, theo Nghị định 70/2025/NĐ-CP. */
export interface InvoiceBuyer {
  kind: InvoiceBuyerKind;
  name: string;
  taxCode: string;
  /** Số định danh cá nhân (số căn cước) khi người mua là cá nhân. */
  personalId: string;
  address: string;
  phone: string;
  email: string;
}

export interface EInvoiceSeller {
  name: string;
  taxCode: string;
  address: string;
  phone: string;
}

/** Một dòng hàng hóa, dịch vụ trước khi tách tiền thuế. */
export interface PricedInvoiceLine {
  name: string;
  unit: string;
  quantity: number;
  /** Đơn giá đã gồm thuế, đúng giá bán trên thực đơn. */
  unitPrice: number;
  vatRate: VatRateCode;
}

export interface EInvoiceLine extends Omit<PricedInvoiceLine, 'vatRate'> {
  amount: number;
  /** `null` với hóa đơn bán hàng vì không ghi thuế suất. */
  vatRate: VatRateCode | null;
  amountBeforeTax: number;
}

export interface EInvoiceTaxLine {
  vatRate: VatRateCode;
  amountBeforeTax: number;
  vatAmount: number;
}

export interface InvoiceAmounts {
  lines: EInvoiceLine[];
  taxLines: EInvoiceTaxLine[];
  totalBeforeTax: number;
  totalVat: number;
  totalAmount: number;
}

export interface EInvoiceTransmission {
  status: EInvoiceTransmissionStatus;
  attemptedAt: number | null;
  message: string | null;
}

export interface EInvoice extends InvoiceAmounts {
  id: string;
  orderId: string;
  orderNumber: number;
  /** Nhà cung cấp phát hành; gửi lại luôn qua đúng nhà cung cấp này dù Cài đặt đã đổi. */
  providerId: EInvoiceProviderId;
  template: EInvoiceTemplate;
  /** Ký hiệu hóa đơn 6 ký tự, vd "C26MAA". */
  series: string;
  /** `null` khi nhà cung cấp cấp số lúc phát hành mà hóa đơn chưa phát hành xong. */
  number: number | null;
  /**
   * Mã của cơ quan thuế trên hóa đơn khởi tạo từ máy tính tiền, vd "M1-26-AB12C-01000000001";
   * chuỗi rỗng khi nhà cung cấp chưa trả mã.
   */
  taxAuthorityCode: string;
  /** Mã tra cứu nhà cung cấp cấp khi phát hành (MISA gọi là TransactionID), in cho người mua. */
  lookupCode: string | null;
  issuedAt: number;
  seller: EInvoiceSeller;
  buyer: InvoiceBuyer | null;
  paymentMethod: PaymentMethod;
  totalInWords: string;
  isSandbox: boolean;
  transmission: EInvoiceTransmission;
}

/** Nội dung dựng từ đơn hàng; ký hiệu, số và mã được cấp sau, trong cùng giao dịch lưu hóa đơn. */
export type EInvoiceContent = Omit<
  EInvoice,
  | 'id'
  | 'providerId'
  | 'series'
  | 'number'
  | 'taxAuthorityCode'
  | 'lookupCode'
  | 'issuedAt'
  | 'transmission'
>;

export interface EInvoiceSummary {
  count: number;
  totalBeforeTax: number;
  totalVat: number;
  totalAmount: number;
}
