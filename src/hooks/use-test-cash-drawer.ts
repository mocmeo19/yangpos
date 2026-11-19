'use client';

import { useState } from 'react';
import { getErrorMessage } from '@/lib/get-error-message';
import type { PrinterSettings } from '@/types/settings';
import { usePrinter } from './use-printer';
import { useToast } from './use-toast';

export function useTestCashDrawer() {
  const { openCashDrawer } = usePrinter();
  const showToast = useToast();
  const [isOpening, setIsOpening] = useState(false);

  async function testCashDrawer(printer: PrinterSettings) {
    setIsOpening(true);
    try {
      await openCashDrawer(printer);
      showToast({
        title: 'Đã gửi lệnh mở két',
        description:
          'Két không bật ra? Kiểm tra dây RJ11 đã cắm vào cổng DK của máy in.',
      });
    } catch (error) {
      showToast({
        tone: 'error',
        title: 'Chưa mở được két tiền',
        description: getErrorMessage(error),
      });
    } finally {
      setIsOpening(false);
    }
  }

  return { isOpening, testCashDrawer };
}
