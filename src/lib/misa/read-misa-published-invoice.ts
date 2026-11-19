import type { MisaPublishedInvoice } from '@/types/misa';
import { describeMisaError } from './describe-misa-error';
import { MisaApiError } from './misa-api-error';
import { readMisaField, readMisaText } from './read-misa-field';

// Gửi lại đúng RefID đã phát hành (vd mất mạng lúc chờ phản hồi) thì MISA báo trùng kèm số đã cấp.
const DUPLICATE_ERROR_CODES = new Set([
  'InvoiceDuplicated',
  'DuplicateInvoiceRefID',
]);
const MISA_SYMBOL_PATTERN = /^[12]([CK]\d{2}[A-Z]{3})$/;
const INVOICE_NUMBER_PATTERN = /^\d{1,8}$/;

function findResult(results: unknown, refId: string): unknown {
  if (!Array.isArray(results)) {
    return undefined;
  }
  const wanted = refId.toLowerCase();
  const match = results.find(
    (item) =>
      readMisaText(readMisaField(item, 'RefID'))?.toLowerCase() === wanted,
  );
  // Gửi một hóa đơn mà kết quả không ghi RefID thì kết quả duy nhất chính là của hóa đơn đó.
  return match ?? (results.length === 1 ? results[0] : undefined);
}

function parseInvoiceNumber(value: unknown): number | null {
  const text = typeof value === 'number' ? String(value) : readMisaText(value);
  if (!text || !INVOICE_NUMBER_PATTERN.test(text)) {
    return null;
  }
  const invoiceNumber = Number(text);
  return invoiceNumber > 0 ? invoiceNumber : null;
}

/** MISA ghép mẫu số vào đầu ký hiệu ("1C26MAA"); hóa đơn trong máy chỉ lưu phần sau ("C26MAA"). */
function toSeries(symbol: string | null): string | null {
  return symbol?.match(MISA_SYMBOL_PATTERN)?.[1] ?? null;
}

/** Đọc số, mã của cơ quan thuế và mã tra cứu MISA cấp cho hóa đơn có RefID tương ứng. */
export function readMisaPublishedInvoice(
  results: unknown,
  refId: string,
): MisaPublishedInvoice {
  const result = findResult(results, refId);
  if (result === undefined) {
    throw new MisaApiError(
      null,
      'MISA không trả kết quả phát hành cho hóa đơn này.',
    );
  }
  const errorCode = readMisaText(readMisaField(result, 'ErrorCode'));
  const invoiceNumber = parseInvoiceNumber(readMisaField(result, 'InvNo'));
  const isAlreadyPublished =
    errorCode !== null &&
    DUPLICATE_ERROR_CODES.has(errorCode) &&
    invoiceNumber !== null;
  if (errorCode && !isAlreadyPublished) {
    throw new MisaApiError(
      errorCode,
      describeMisaError(
        errorCode,
        readMisaText(readMisaField(result, 'DescriptionErrorCode')),
      ),
    );
  }
  if (invoiceNumber === null) {
    throw new MisaApiError(null, 'MISA không trả về số hóa đơn.');
  }
  return {
    series: toSeries(readMisaText(readMisaField(result, 'InvSeries'))),
    number: invoiceNumber,
    taxAuthorityCode: readMisaText(readMisaField(result, 'InvCode')) ?? '',
    lookupCode: readMisaText(readMisaField(result, 'TransactionID')) ?? '',
  };
}
