import type { KeypadEntry, KeypadKey } from '@/types/keypad';

/** Dưới 1 tỷ đồng: đủ cho mọi hóa đơn quán ăn và chặn việc bấm nhầm thừa số. */
export const MAX_KEYPAD_AMOUNT = 999_999_999;

/** Tính số tiền sau một lần bấm phím, giống cách nhập trên máy tính bỏ túi. */
export function applyKeypadKey(
  entry: KeypadEntry,
  key: KeypadKey,
): KeypadEntry {
  switch (key) {
    case 'backspace':
      // Số gợi ý đang được "chọn" như khi bôi đen chữ, nên xóa là xóa cả số.
      return {
        amount: entry.replaceOnNextDigit ? 0 : Math.floor(entry.amount / 10),
        replaceOnNextDigit: false,
      };
    case 'clear':
      return { amount: 0, replaceOnNextDigit: false };
    default: {
      const base = entry.replaceOnNextDigit ? 0 : entry.amount;
      const amount = Number(`${base}${key}`);
      if (amount > MAX_KEYPAD_AMOUNT) {
        return entry;
      }
      return { amount, replaceOnNextDigit: false };
    }
  }
}
