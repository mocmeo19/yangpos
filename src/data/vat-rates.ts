import type { VatRateCode } from '@/types/einvoice';

export const VAT_RATE_CODES: readonly VatRateCode[] = [
  '10',
  '8',
  '5',
  '0',
  'KCT',
  'KKKNT',
];

export const VAT_RATE_PERCENT: Record<VatRateCode, number> = {
  '10': 10,
  '8': 8,
  '5': 5,
  '0': 0,
  KCT: 0,
  KKKNT: 0,
};

/** Nhãn ngắn in trên hóa đơn. */
export const VAT_RATE_SHORT_LABELS: Record<VatRateCode, string> = {
  '10': '10%',
  '8': '8%',
  '5': '5%',
  '0': '0%',
  KCT: 'KCT',
  KKKNT: 'KKKNT',
};

/** Nhãn đầy đủ trong ô chọn thuế suất. */
export const VAT_RATE_LABELS: Record<VatRateCode, string> = {
  '10': '10%',
  '8': '8%',
  '5': '5%',
  '0': '0%',
  KCT: 'Không chịu thuế (KCT)',
  KKKNT: 'Không kê khai, tính nộp thuế (KKKNT)',
};
