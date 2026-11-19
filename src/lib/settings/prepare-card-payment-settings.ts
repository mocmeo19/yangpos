import type { CardPaymentSettings } from '@/types/settings';

export function prepareCardPaymentSettings(
  cardPayment: CardPaymentSettings,
): CardPaymentSettings {
  const prepared: CardPaymentSettings = {
    ...cardPayment,
    terminalName: cardPayment.terminalName.trim(),
    terminalId: cardPayment.terminalId.trim().toUpperCase(),
    merchantId: cardPayment.merchantId.trim().toUpperCase(),
  };
  if (prepared.enabled && prepared.acceptedBrands.length === 0) {
    throw new Error('Chọn ít nhất một loại thẻ cửa hàng chấp nhận.');
  }
  return prepared;
}
