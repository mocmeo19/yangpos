'use client';

import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react';
import { PrinterContext } from '@/contexts/printer-context';
import { useSettings } from '@/hooks/use-settings';
import { buildCashDrawerJob } from '@/lib/escpos/build-receipt-print-job';
import { printOnNetworkPrinter } from '@/lib/printing/print-on-network-printer';
import { sendToNetworkPrinter } from '@/lib/printing/send-to-network-printer';
import type { PrintReceiptOptions, ReceiptPrinter } from '@/types/printer';
import type { Receipt } from '@/types/receipt';
import type { PaperWidth, PrinterSettings } from '@/types/settings';
import { BrowserReceiptPrint } from './BrowserReceiptPrint';

interface BrowserPrintJob {
  receipt: Receipt;
  paperWidth: PaperWidth;
  copies: number;
}

const NO_PRINTER_MESSAGE =
  'Chưa chọn máy in. Vào Cài đặt › Máy in hóa đơn để thiết lập.';
const DRAWER_NEEDS_NETWORK_PRINTER =
  'Két tiền chỉ mở được qua máy in mạng LAN. Với máy in USB, hãy bật tùy chọn mở két trong driver máy in.';

/** Một đầu mối cho mọi thao tác in: chọn in qua trình duyệt hay gửi thẳng tới máy in mạng. */
export function PrinterProvider({ children }: { children: ReactNode }) {
  const { settings } = useSettings();
  const [browserJob, setBrowserJob] = useState<BrowserPrintJob | null>(null);
  const finishBrowserJobRef = useRef<(() => void) | null>(null);

  const handleBrowserPrintDone = useCallback(() => {
    finishBrowserJobRef.current?.();
    finishBrowserJobRef.current = null;
    setBrowserJob(null);
  }, []);

  const printReceipt = useCallback(
    async (receipt: Receipt, options: PrintReceiptOptions = {}) => {
      const printer = options.printer ?? settings.printer;
      switch (printer.mode) {
        case 'browser':
          await new Promise<void>((resolve) => {
            finishBrowserJobRef.current?.();
            finishBrowserJobRef.current = resolve;
            setBrowserJob({
              receipt,
              paperWidth: printer.paperWidth,
              copies: printer.copies,
            });
          });
          return;
        case 'network':
          await printOnNetworkPrinter(
            receipt,
            printer,
            options.openCashDrawer ?? false,
          );
          return;
        default:
          throw new Error(NO_PRINTER_MESSAGE);
      }
    },
    [settings.printer],
  );

  const openCashDrawer = useCallback(
    async (printerOverride?: PrinterSettings) => {
      const printer = printerOverride ?? settings.printer;
      if (printer.mode !== 'network') {
        throw new Error(DRAWER_NEEDS_NETWORK_PRINTER);
      }
      await sendToNetworkPrinter(printer, buildCashDrawerJob());
    },
    [settings.printer],
  );

  const receiptPrinter = useMemo<ReceiptPrinter>(
    () => ({ printReceipt, openCashDrawer }),
    [printReceipt, openCashDrawer],
  );

  return (
    <PrinterContext value={receiptPrinter}>
      {children}
      {browserJob && (
        <BrowserReceiptPrint
          receipt={browserJob.receipt}
          paperWidth={browserJob.paperWidth}
          copies={browserJob.copies}
          onDone={handleBrowserPrintDone}
        />
      )}
    </PrinterContext>
  );
}
