import { getPrinterTargetError } from '@/lib/printer/printer-target';
import type { PrinterSettings } from '@/types/settings';

export function preparePrinterSettings(
  printer: PrinterSettings,
): PrinterSettings {
  const prepared: PrinterSettings = {
    ...printer,
    networkHost: printer.networkHost.trim(),
  };
  if (prepared.mode !== 'network') {
    return prepared;
  }
  const targetError = getPrinterTargetError(
    prepared.networkHost,
    prepared.networkPort,
  );
  if (targetError) {
    throw new Error(targetError);
  }
  return prepared;
}
