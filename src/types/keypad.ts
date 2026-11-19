export type KeypadDigit =
  '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

export type KeypadKey = KeypadDigit | '000' | 'backspace' | 'clear';

export interface KeypadEntry {
  amount: number;
  /** Số đang hiện là số gợi ý; chữ số bấm tiếp theo sẽ thay hẳn số này thay vì viết nối vào. */
  replaceOnNextDigit: boolean;
}
