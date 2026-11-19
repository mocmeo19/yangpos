const BANKNOTE_STEPS = [10000, 50000, 100000, 200000, 500000];
const MAX_SUGGESTIONS = 4;

/** Gợi ý số tiền khách đưa: đúng số tiền và các mức làm tròn lên theo mệnh giá phổ biến. */
export function suggestCashAmounts(total: number): number[] {
  const suggestions = new Set<number>([total]);

  for (const step of BANKNOTE_STEPS) {
    suggestions.add(Math.ceil(total / step) * step);
  }

  return [...suggestions]
    .filter((amount) => amount >= total && amount > 0)
    .sort((left, right) => left - right)
    .slice(0, MAX_SUGGESTIONS);
}
