import type { InvoiceBuyer } from '@/types/einvoice';

const TAX_CODE_PATTERN = /^\d{10}(-\d{3})?$/;
const PERSONAL_ID_PATTERN = /^\d{12}$/;
const PHONE_PATTERN = /^\+?\d{9,12}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function assertValid(isValid: boolean, message: string): void {
  if (!isValid) {
    throw new Error(message);
  }
}

function assertCompany(buyer: InvoiceBuyer): void {
  assertValid(buyer.name.length > 0, 'Nhập tên đơn vị mua hàng.');
  assertValid(
    TAX_CODE_PATTERN.test(buyer.taxCode),
    'Mã số thuế gồm 10 chữ số, hoặc dạng 0123456789-001 với chi nhánh.',
  );
  assertValid(buyer.address.length > 0, 'Nhập địa chỉ của đơn vị mua hàng.');
}

function assertIndividual(buyer: InvoiceBuyer): void {
  assertValid(buyer.name.length > 0, 'Nhập họ tên người mua.');
  assertValid(
    !buyer.personalId || PERSONAL_ID_PATTERN.test(buyer.personalId),
    'Số định danh cá nhân gồm 12 chữ số (số căn cước).',
  );
}

/** Chuẩn hóa thông tin người mua và ném lỗi kèm thông báo khi chưa hợp lệ. */
export function prepareInvoiceBuyer(buyer: InvoiceBuyer): InvoiceBuyer {
  const isCompany = buyer.kind === 'company';
  const prepared: InvoiceBuyer = {
    kind: buyer.kind,
    name: buyer.name.trim(),
    taxCode: isCompany ? buyer.taxCode.replace(/\s/g, '') : '',
    personalId: isCompany ? '' : buyer.personalId.replace(/\s/g, ''),
    address: buyer.address.trim(),
    phone: buyer.phone.replace(/[\s.]/g, ''),
    email: buyer.email.trim().toLowerCase(),
  };
  if (isCompany) {
    assertCompany(prepared);
  } else {
    assertIndividual(prepared);
  }
  assertValid(
    !prepared.phone || PHONE_PATTERN.test(prepared.phone),
    'Số điện thoại người mua chưa đúng.',
  );
  assertValid(
    !prepared.email || EMAIL_PATTERN.test(prepared.email),
    'Email nhận hóa đơn chưa đúng.',
  );
  return prepared;
}
