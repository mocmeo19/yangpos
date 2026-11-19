export const MIN_PIN_LENGTH = 4;
export const MAX_PIN_LENGTH = 6;

const PIN_PATTERN = /^\d+$/;

export function isValidPinFormat(pin: string): boolean {
  return (
    PIN_PATTERN.test(pin) &&
    pin.length >= MIN_PIN_LENGTH &&
    pin.length <= MAX_PIN_LENGTH
  );
}

export function assertPinFormat(pin: string): void {
  if (!isValidPinFormat(pin)) {
    throw new Error(
      `Mã PIN phải gồm ${MIN_PIN_LENGTH}–${MAX_PIN_LENGTH} chữ số.`,
    );
  }
}
