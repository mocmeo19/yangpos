import type {
  PaymentDetails,
  PaymentInput,
  PaymentMethod,
} from '@/types/order';
import type { CardPaymentDraft, PaymentFormValues } from '@/types/payment-form';

/** Bỏ các trường trống để lịch sử đơn chỉ lưu thông tin thu ngân thực sự đã nhập. */
function toCardDetails(card: CardPaymentDraft): PaymentDetails {
  const details: PaymentDetails = {};
  if (card.brand) {
    details.cardBrand = card.brand;
  }
  if (card.last4) {
    details.cardLast4 = card.last4;
  }
  const approvalCode = card.approvalCode.trim().toUpperCase();
  if (approvalCode) {
    details.approvalCode = approvalCode;
  }
  return details;
}

export function buildPaymentInput(
  method: PaymentMethod,
  values: PaymentFormValues,
): PaymentInput {
  switch (method) {
    case 'cash':
      return { method, details: { cashReceived: values.cashReceived } };
    case 'transfer':
      return { method, details: { transferNote: values.transferNote } };
    case 'card':
      return { method, details: toCardDetails(values.card) };
  }
}
