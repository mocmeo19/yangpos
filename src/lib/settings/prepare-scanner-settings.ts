import type { ScannerSettings } from '@/types/settings';

export const SCANNER_CODE_LENGTH_RANGE = { min: 1, max: 32 } as const;

export function prepareScannerSettings(
  scanner: ScannerSettings,
): ScannerSettings {
  const { min, max } = SCANNER_CODE_LENGTH_RANGE;
  const isValidLength =
    Number.isInteger(scanner.minLength) &&
    scanner.minLength >= min &&
    scanner.minLength <= max;
  if (!isValidLength) {
    throw new Error(`Độ dài mã tối thiểu từ ${min} đến ${max} ký tự.`);
  }
  return scanner;
}
