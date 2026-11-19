'use client';

import { useState } from 'react';
import { getErrorMessage } from '@/lib/get-error-message';
import { buildSampleEInvoiceReceipt } from '@/lib/receipt/build-sample-einvoice-receipt';
import { getSettingsSectionHref } from '@/lib/settings/get-settings-section-href';
import type { EInvoiceSettings } from '@/types/settings';
import { usePrinter } from './use-printer';
import { useSettings } from './use-settings';
import { useToast } from './use-toast';

/** In một hóa đơn điện tử mẫu bằng máy in đã lưu và cài đặt hóa đơn đang chỉnh, chưa cần lưu. */
export function useEInvoiceTestPrint() {
  const { settings } = useSettings();
  const { printReceipt } = usePrinter();
  const showToast = useToast();
  const [isPrinting, setIsPrinting] = useState(false);

  async function testPrint(eInvoiceDraft: EInvoiceSettings) {
    setIsPrinting(true);
    try {
      const receipt = buildSampleEInvoiceReceipt(
        { ...settings, eInvoice: eInvoiceDraft },
        Date.now(),
      );
      await printReceipt(receipt);
      if (settings.printer.mode === 'network') {
        showToast({ title: 'Đã gửi hóa đơn mẫu tới máy in' });
      }
    } catch (error) {
      showToast({
        tone: 'error',
        title: 'In thử chưa thành công',
        description: getErrorMessage(error),
        action: {
          label: 'Cài đặt máy in',
          href: getSettingsSectionHref('printer'),
        },
      });
    } finally {
      setIsPrinting(false);
    }
  }

  return { isPrinting, testPrint };
}
