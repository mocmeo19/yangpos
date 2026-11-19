import { sendNetworkPrintJob } from '@/actions/printer-actions';
import { bytesToBase64 } from '@/lib/bytes/bytes-to-base64';
import { getPrinterTargetError } from '@/lib/printer/printer-target';
import type { PrinterSettings } from '@/types/settings';

export async function sendToNetworkPrinter(
  printer: PrinterSettings,
  data: Uint8Array,
): Promise<void> {
  const targetError = getPrinterTargetError(
    printer.networkHost,
    printer.networkPort,
  );
  if (targetError) {
    throw new Error(targetError);
  }
  const result = await sendNetworkPrintJob({
    host: printer.networkHost.trim(),
    port: printer.networkPort,
    payloadBase64: bytesToBase64(data),
  });
  if (!result.ok) {
    throw new Error(result.error);
  }
}
