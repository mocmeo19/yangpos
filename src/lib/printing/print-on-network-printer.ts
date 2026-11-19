import { buildReceiptPrintJob } from '@/lib/escpos/build-receipt-print-job';
import { encodeRasterImage } from '@/lib/escpos/encode-raster-image';
import { renderReceiptBitmap } from '@/lib/escpos/render-receipt-bitmap';
import type { Receipt } from '@/types/receipt';
import type { PrinterSettings } from '@/types/settings';
import { sendToNetworkPrinter } from './send-to-network-printer';

export async function printOnNetworkPrinter(
  receipt: Receipt,
  printer: PrinterSettings,
  openCashDrawer: boolean,
): Promise<void> {
  const bitmap = await renderReceiptBitmap(receipt, printer.paperWidth);
  const job = buildReceiptPrintJob({
    raster: encodeRasterImage(bitmap),
    copies: printer.copies,
    openCashDrawer,
  });
  await sendToNetworkPrinter(printer, job);
}
