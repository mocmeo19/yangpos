const ALREADY_PUBLISHED_MESSAGE =
  'Hóa đơn đã phát hành trên MISA từ lần gửi trước nhưng MISA không trả lại số hóa đơn; tra cứu trên meinvoice.vn.';

const MISA_ERROR_MESSAGES = new Map<string, string>([
  [
    'InvalidAppID',
    'AppID tích hợp không đúng, kiểm tra MISA_MEINVOICE_APP_ID.',
  ],
  ['InactiveAppID', 'AppID tích hợp chưa được MISA kích hoạt.'],
  [
    'UnAuthorize',
    'Sai mã số thuế, tên đăng nhập hoặc mật khẩu tài khoản MISA meInvoice.',
  ],
  ['TokenExpiredCode', 'Phiên làm việc với MISA đã hết hạn.'],
  ['InvalidTokenCode', 'Phiên làm việc với MISA không hợp lệ.'],
  [
    'InvoiceTemplateNotExist',
    'Ký hiệu hóa đơn chưa có trên MISA, chọn lại ký hiệu trong Cài đặt → Hóa đơn điện tử.',
  ],
  [
    'InvoiceTemplateNotValidInDeclaration',
    'Tờ khai đăng ký với cơ quan thuế chưa có loại hóa đơn này.',
  ],
  [
    'DeclarationNotExist',
    'Chưa có tờ khai đăng ký sử dụng hóa đơn điện tử trên MISA.',
  ],
  [
    'InvalidDeclaration',
    'Tờ khai đăng ký sử dụng hóa đơn chưa được cơ quan thuế chấp nhận.',
  ],
  ['LicenseInfo_NotBuy', 'Tài khoản MISA chưa mua gói hóa đơn.'],
  ['LicenseInfo_OutOfInvoice', 'Đã dùng hết số hóa đơn trong gói MISA.'],
  ['LicenseInfo_Expired', 'Gói hóa đơn MISA đã hết hạn hoặc chưa thanh toán.'],
  ['InvalidTaxCode', 'Mã số thuế trên hóa đơn không hợp lệ.'],
  [
    'InvalidInvoiceDate',
    'Ngày hóa đơn sớm hơn hóa đơn cuối cùng đã phát hành trên MISA.',
  ],
  [
    'TaxRateInfo_VATRateName',
    'Thuế suất trên hóa đơn không hợp lệ với mẫu hóa đơn đang dùng.',
  ],
  ['ExistsInvoiceNextYear', 'Ký hiệu này đã có hóa đơn của năm sau.'],
  ['InvoiceQuantityTooLarge', 'Gửi quá nhiều hóa đơn trong một lần.'],
  ['InvoiceDuplicated', ALREADY_PUBLISHED_MESSAGE],
  ['DuplicateInvoiceRefID', ALREADY_PUBLISHED_MESSAGE],
  [
    'Exception',
    'Máy chủ MISA gặp lỗi không rõ nguyên nhân, thử lại sau ít phút.',
  ],
]);

// Mã lỗi dạng "RequireError_BuyerAddress": phần sau tiền tố là tên trường bị thiếu hoặc sai.
const FIELD_ERROR_PREFIXES = ['InvoiceDetail_', 'RequireError_'];

/** Diễn giải mã lỗi của MISA cho thu ngân, luôn giữ mã gốc để đối chiếu với tổng đài MISA. */
export function describeMisaError(
  code: string | null,
  description: string | null,
): string {
  if (!code) {
    return description ?? 'MISA báo lỗi nhưng không ghi rõ nguyên nhân.';
  }
  const message = MISA_ERROR_MESSAGES.get(code);
  if (message) {
    return `${message} (${code})`;
  }
  const fieldPrefix = FIELD_ERROR_PREFIXES.find((prefix) =>
    code.startsWith(prefix),
  );
  if (fieldPrefix) {
    return `MISA báo trường ${code.slice(fieldPrefix.length)} trên hóa đơn còn trống hoặc không hợp lệ (${code}).`;
  }
  return description ? `${description} (${code})` : `MISA báo lỗi ${code}.`;
}
