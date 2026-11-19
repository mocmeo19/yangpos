import type { PaymentMethod } from '@/types/order';
import type { AppSettings } from '@/types/settings';

export interface AfterPaymentPlan {
  printReceipt: boolean;
  openCashDrawer: boolean;
}

/** Két tiền chỉ mở được bằng lệnh gửi qua máy in mạng nên các chế độ in khác không mở két. */
export function planAfterPayment(
  settings: AppSettings,
  method: PaymentMethod,
): AfterPaymentPlan {
  const { printer, cashDrawer } = settings;
  return {
    printReceipt: printer.autoPrintAfterPayment && printer.mode !== 'none',
    openCashDrawer:
      method === 'cash' &&
      cashDrawer.enabled &&
      cashDrawer.openOnCashPayment &&
      printer.mode === 'network',
  };
}
