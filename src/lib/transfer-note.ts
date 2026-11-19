import { normalizeSearchText } from './normalize-search-text';

export const MAX_TRANSFER_NOTE_PREFIX_LENGTH = 15;

/** Nội dung chuyển khoản và tên chủ tài khoản chỉ nên gồm chữ in hoa không dấu và số. */
export function toBankText(text: string): string {
  return normalizeSearchText(text)
    .toUpperCase()
    .replace(/[^A-Z0-9 ]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function buildTransferNote(prefix: string, orderNumber: number): string {
  const safePrefix = toBankText(prefix).slice(
    0,
    MAX_TRANSFER_NOTE_PREFIX_LENGTH,
  );
  const orderCode = String(orderNumber).padStart(4, '0');
  return safePrefix ? `${safePrefix} ${orderCode}` : orderCode;
}
