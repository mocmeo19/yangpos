import type { KeypadKey } from '@/types/keypad';
import { MAX_PIN_LENGTH } from './pin-format';

export function applyPinKey(pin: string, key: KeypadKey): string {
  switch (key) {
    case 'backspace':
      return pin.slice(0, -1);
    case 'clear':
      return '';
    case '000':
      return pin;
    default:
      return pin.length < MAX_PIN_LENGTH ? `${pin}${key}` : pin;
  }
}
