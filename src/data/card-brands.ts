import type { CardBrand } from '@/types/order';

export const CARD_BRANDS: readonly CardBrand[] = [
  'visa',
  'mastercard',
  'jcb',
  'amex',
  'napas',
];

export const CARD_BRAND_LABELS: Record<CardBrand, string> = {
  visa: 'Visa',
  mastercard: 'Mastercard',
  jcb: 'JCB',
  amex: 'Amex',
  napas: 'Napas',
};
