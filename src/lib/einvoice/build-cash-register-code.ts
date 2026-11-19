import type { EInvoiceTemplate } from '@/types/einvoice';

const SEQUENCE_DIGITS = 9;

interface CashRegisterCodeInput {
  template: EInvoiceTemplate;
  issuedAt: number;
  taxAuthorityPrefix: string;
  terminalCode: string;
  sequence: number;
}

/**
 * Mã của cơ quan thuế trên hóa đơn khởi tạo từ máy tính tiền gồm 23 ký tự: M và loại hóa đơn, 2 số
 * cuối của năm, 5 ký tự cơ quan thuế cấp, 11 số do phần mềm bán hàng tự sinh. 11 số này ghép số
 * hiệu máy (2 số) với số thứ tự (9 số) để nhiều máy cùng cửa hàng không bao giờ trùng mã.
 */
export function buildCashRegisterCode({
  template,
  issuedAt,
  taxAuthorityPrefix,
  terminalCode,
  sequence,
}: CashRegisterCodeInput): string {
  const year = String(new Date(issuedAt).getFullYear()).slice(-2);
  const tail = `${terminalCode}${String(sequence).padStart(SEQUENCE_DIGITS, '0')}`;
  return `M${template}-${year}-${taxAuthorityPrefix}-${tail}`;
}
