import { getEInvoiceProvider } from '@/lib/einvoice/providers/get-einvoice-provider';
import type { EInvoiceSettings } from '@/types/settings';

const TAX_CODE_PATTERN = /^\d{10}(-\d{3})?$/;
const SERIES_SUFFIX_PATTERN = /^[A-Z]{2}$/;
const TAX_AUTHORITY_PREFIX_PATTERN = /^[A-Z0-9]{5}$/;
const TERMINAL_CODE_PATTERN = /^(0[1-9]|[1-9]\d)$/;

function assertValid(isValid: boolean, message: string): void {
  if (!isValid) {
    throw new Error(message);
  }
}

/** Chuẩn hóa và kiểm tra cài đặt hóa đơn; chỉ bắt buộc đủ thông tin khi đã bật. */
export function prepareEInvoiceSettings(
  settings: EInvoiceSettings,
): EInvoiceSettings {
  const prepared: EInvoiceSettings = {
    ...settings,
    seriesSuffix: settings.seriesSuffix.trim().toUpperCase(),
    taxAuthorityPrefix: settings.taxAuthorityPrefix.trim().toUpperCase(),
    terminalCode: settings.terminalCode.trim(),
    sellerName: settings.sellerName.trim(),
    sellerTaxCode: settings.sellerTaxCode.replace(/\s/g, ''),
    sellerAddress: settings.sellerAddress.trim(),
    sellerPhone: settings.sellerPhone.trim(),
    lookupUrl: settings.lookupUrl.trim(),
  };
  if (!prepared.enabled) {
    return prepared;
  }
  assertValid(
    prepared.sellerName.length > 0,
    'Nhập tên người bán đúng như trên đăng ký thuế.',
  );
  assertValid(
    TAX_CODE_PATTERN.test(prepared.sellerTaxCode),
    'Mã số thuế người bán gồm 10 chữ số, hoặc dạng 0123456789-001 với chi nhánh.',
  );
  assertValid(
    prepared.sellerAddress.length > 0,
    'Nhập địa chỉ người bán theo đăng ký thuế.',
  );
  assertValid(
    SERIES_SUFFIX_PATTERN.test(prepared.seriesSuffix),
    'Hai ký tự cuối của ký hiệu hóa đơn là 2 chữ cái in hoa, vd AA.',
  );
  // Nhà cung cấp tự sinh mã của cơ quan thuế lúc phát hành nên máy bán hàng không cần hai thông tin sau.
  if (getEInvoiceProvider(prepared.providerId).numbering === 'provider') {
    return prepared;
  }
  assertValid(
    TAX_AUTHORITY_PREFIX_PATTERN.test(prepared.taxAuthorityPrefix),
    'Nhập đủ 5 ký tự cơ quan thuế cấp cho hóa đơn khởi tạo từ máy tính tiền.',
  );
  assertValid(
    TERMINAL_CODE_PATTERN.test(prepared.terminalCode),
    'Số hiệu máy bán hàng gồm 2 chữ số, từ 01 đến 99.',
  );
  return prepared;
}
