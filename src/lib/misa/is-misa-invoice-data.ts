import type { MisaInvoiceData } from '@/types/misa-invoice-data';
import { CASH_REGISTER_SYMBOL_PATTERN } from './cash-register-symbol-pattern';

const REF_ID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MAX_LINES = 500;

/**
 * Server Action nhận dữ liệu thẳng từ trình duyệt nên kiểm tra lúc chạy các trường MISA dùng để
 * định danh và tính tiền; phần còn lại MISA tự kiểm tra kỹ khi phát hành.
 */
export function isMisaInvoiceData(input: unknown): input is MisaInvoiceData {
  if (typeof input !== 'object' || input === null) {
    return false;
  }
  const refId = Reflect.get(input, 'RefID');
  const symbol = Reflect.get(input, 'InvSeries');
  const lines = Reflect.get(input, 'OriginalInvoiceDetail');
  return (
    typeof refId === 'string' &&
    REF_ID_PATTERN.test(refId) &&
    typeof symbol === 'string' &&
    CASH_REGISTER_SYMBOL_PATTERN.test(symbol) &&
    Array.isArray(lines) &&
    lines.length > 0 &&
    lines.length <= MAX_LINES &&
    Array.isArray(Reflect.get(input, 'TaxRateInfo')) &&
    Number.isFinite(Reflect.get(input, 'TotalAmountOC'))
  );
}
