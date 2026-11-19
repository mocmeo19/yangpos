import type { KeypadDigit, KeypadKey } from '@/types/keypad';

const KEYPAD_DIGITS: readonly KeypadDigit[] = [
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
];

/** Đổi phím trên bàn phím thật sang phím của bàn phím số; `null` với phím không dùng tới. */
export function toKeypadKey(key: string): KeypadKey | null {
  const digit = KEYPAD_DIGITS.find((candidate) => candidate === key);
  if (digit) {
    return digit;
  }
  switch (key) {
    case 'Backspace':
      return 'backspace';
    case 'Delete':
      return 'clear';
    default:
      return null;
  }
}
