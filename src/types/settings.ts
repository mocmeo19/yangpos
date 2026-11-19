import type { EInvoiceTemplate, VatRateCode } from './einvoice';
import type { EInvoiceProviderId } from './einvoice-provider';
import type { CardBrand } from './order';
import type { PagerSettings } from './pager';

export type PrinterMode = 'none' | 'browser' | 'network';
export type PaperWidth = 58 | 80;
export type ScannerTerminator = 'Enter' | 'Tab';

export interface StoreSettings {
  name: string;
  address: string;
  phone: string;
  taxCode: string;
  wifiName: string;
  wifiPassword: string;
  receiptFooter: string;
}

export interface PrinterSettings {
  mode: PrinterMode;
  paperWidth: PaperWidth;
  networkHost: string;
  networkPort: number;
  copies: number;
  autoPrintAfterPayment: boolean;
}

export interface CashDrawerSettings {
  enabled: boolean;
  openOnCashPayment: boolean;
}

export interface BankTransferSettings {
  enabled: boolean;
  /** Mã BIN Napas của ngân hàng nhận tiền, vd "970436". */
  bankBin: string;
  accountNumber: string;
  accountName: string;
  notePrefix: string;
  showQrOnReceipt: boolean;
}

export interface CardPaymentSettings {
  enabled: boolean;
  acceptedBrands: CardBrand[];
  terminalName: string;
  terminalId: string;
  merchantId: string;
  requireApprovalCode: boolean;
}

export interface ScannerSettings {
  enabled: boolean;
  terminator: ScannerTerminator;
  /** Khoảng cách tối đa giữa hai phím để coi là máy quét "gõ", người gõ tay chậm hơn nhiều. */
  maxKeyIntervalMs: number;
  minLength: number;
}

export interface EInvoiceSettings {
  enabled: boolean;
  template: EInvoiceTemplate;
  /** Hai chữ cái cuối của ký hiệu hóa đơn do người bán tự đặt, vd "AA". */
  seriesSuffix: string;
  /** Chuỗi 5 ký tự cơ quan thuế cấp khi đăng ký dùng hóa đơn khởi tạo từ máy tính tiền. */
  taxAuthorityPrefix: string;
  /** Số hiệu máy bán hàng, ghép vào mã hóa đơn để nhiều máy không bao giờ trùng mã. */
  terminalCode: string;
  sellerName: string;
  sellerTaxCode: string;
  sellerAddress: string;
  sellerPhone: string;
  defaultVatRate: VatRateCode;
  autoIssueOnPayment: boolean;
  providerId: EInvoiceProviderId;
  /** Trang người mua tra cứu hóa đơn, in ở cuối hóa đơn. */
  lookupUrl: string;
}

export interface AppSettings {
  store: StoreSettings;
  eInvoice: EInvoiceSettings;
  printer: PrinterSettings;
  cashDrawer: CashDrawerSettings;
  pager: PagerSettings;
  bankTransfer: BankTransferSettings;
  cardPayment: CardPaymentSettings;
  scanner: ScannerSettings;
}

export type SettingsSection = keyof AppSettings;

export const SETTINGS_RECORD_ID = 'app';

export interface SettingsState {
  settings: AppSettings;
  /** `false` khi chưa tải xong từ máy chủ; lúc đó `settings` đang là giá trị mặc định. */
  isLoaded: boolean;
}

/** Toàn bộ cài đặt nằm trong một bản ghi; phần nào chưa lưu sẽ dùng giá trị mặc định. */
export interface StoredSettings extends Partial<AppSettings> {
  id: typeof SETTINGS_RECORD_ID;
}
