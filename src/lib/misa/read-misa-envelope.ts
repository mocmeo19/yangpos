import type { MisaEnvelope } from '@/types/misa-envelope';
import { MisaApiError } from './misa-api-error';
import { parseMisaJson } from './parse-misa-json';
import { readMisaField, readMisaText } from './read-misa-field';

function readErrors(value: unknown): string | null {
  if (!Array.isArray(value)) {
    return readMisaText(value);
  }
  const messages = value.flatMap((item) => {
    const text = readMisaText(item);
    return text ? [text] : [];
  });
  return messages.length > 0 ? messages.join('; ') : null;
}

/** Chuẩn hóa phản hồi MISA; phản hồi không phải đối tượng JSON nghĩa là MISA đang gặp sự cố. */
export function readMisaEnvelope(body: unknown): MisaEnvelope {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    throw new MisaApiError(null, 'MISA trả về dữ liệu không đọc được.');
  }
  return {
    success: readMisaField(body, 'success') === true,
    errorCode: readMisaText(readMisaField(body, 'errorCode')),
    errorDescription:
      readMisaText(readMisaField(body, 'descriptionErrorCode')) ??
      readErrors(readMisaField(body, 'errors')),
    data: parseMisaJson(readMisaField(body, 'data')),
    publishInvoiceResult: parseMisaJson(
      readMisaField(body, 'publishInvoiceResult'),
    ),
  };
}
