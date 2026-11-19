import type { AmountTone } from '@/types/amount-tone';

export function toAmountTone(amount: number): AmountTone {
  if (amount > 0) {
    return 'positive';
  }
  if (amount < 0) {
    return 'negative';
  }
  return 'neutral';
}
