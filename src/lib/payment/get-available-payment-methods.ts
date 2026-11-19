import { PAYMENT_METHODS } from '@/lib/payment-methods';
import type { PaymentMethod } from '@/types/order';
import type { AppSettings } from '@/types/settings';

/** Tiền mặt luôn có; chuyển khoản và thẻ chỉ hiện khi cửa hàng bật trong cài đặt. */
export function getAvailablePaymentMethods(
  settings: AppSettings,
): PaymentMethod[] {
  return PAYMENT_METHODS.filter((method) => {
    switch (method) {
      case 'transfer':
        return settings.bankTransfer.enabled;
      case 'card':
        return settings.cardPayment.enabled;
      default:
        return true;
    }
  });
}
