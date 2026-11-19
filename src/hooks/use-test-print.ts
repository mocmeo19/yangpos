'use client';

import { useState } from 'react';
import { getErrorMessage } from '@/lib/get-error-message';
import { buildReceipt } from '@/lib/receipt/build-receipt';
import { createSampleOrder } from '@/lib/receipt/create-sample-order';
import { preparePrinterSettings } from '@/lib/settings/prepare-printer-settings';
import type { PrinterSettings } from '@/types/settings';
import { usePrinter } from './use-printer';
import { useSettings } from './use-settings';
import { useToast } from './use-toast';

const SAMPLE_TABLE_NAME = 'Bàn mẫu';

/** In một hóa đơn mẫu bằng cấu hình máy in đang chỉnh, chưa cần lưu. */
export function useTestPrint() {
  const { settings } = useSettings();
  const { printReceipt } = usePrinter();
  const showToast = useToast();
  const [isPrinting, setIsPrinting] = useState(false);

  async function testPrint(printerDraft: PrinterSettings) {
    setIsPrinting(true);
    try {
      const printer = preparePrinterSettings(printerDraft);
      const now = Date.now();
      const receipt = buildReceipt({
        order: createSampleOrder(now),
        tableName: SAMPLE_TABLE_NAME,
        settings: { ...settings, printer },
        kind: 'test',
        printedAt: now,
      });
      await printReceipt(receipt, { printer });
      if (printer.mode === 'network') {
        showToast({
          title: 'Đã gửi bản in thử',
          description: `Máy in ${printer.networkHost}:${printer.networkPort}`,
        });
      }
    } catch (error) {
      showToast({
        tone: 'error',
        title: 'In thử chưa thành công',
        description: getErrorMessage(error),
      });
    } finally {
      setIsPrinting(false);
    }
  }

  return { isPrinting, testPrint };
}
