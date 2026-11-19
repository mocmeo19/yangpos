import type { MisaSeries } from '@/types/misa';
import { CASH_REGISTER_SYMBOL_PATTERN } from './cash-register-symbol-pattern';
import { readMisaField, readMisaText } from './read-misa-field';

function toSeries(template: unknown): MisaSeries[] {
  const symbol = readMisaText(readMisaField(template, 'InvSeries'));
  const isInactive = readMisaField(template, 'Inactive') === true;
  if (!symbol || isInactive || !CASH_REGISTER_SYMBOL_PATTERN.test(symbol)) {
    return [];
  }
  return [
    {
      symbol,
      name: readMisaText(readMisaField(template, 'TemplateName')) ?? symbol,
      allowsMultipleVatRates: readMisaField(template, 'IsMoreVATRate') === true,
    },
  ];
}

/** Từ danh sách mẫu MISA trả về, chỉ giữ ký hiệu hóa đơn máy tính tiền còn đang dùng. */
export function readMisaSeries(templates: unknown): MisaSeries[] {
  if (!Array.isArray(templates)) {
    return [];
  }
  return templates
    .flatMap(toSeries)
    .sort((first, second) => first.symbol.localeCompare(second.symbol));
}
