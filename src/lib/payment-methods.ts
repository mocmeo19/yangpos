import type { PaymentMethod } from '@/types/order';

export const PAYMENT_METHODS: readonly PaymentMethod[] = [
  'cash',
  'transfer',
  'card',
];

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  cash: 'Tiền mặt',
  transfer: 'Chuyển khoản',
  card: 'Thẻ',
};
