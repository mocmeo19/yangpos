import type { CardBrand } from './order';

/** Thông tin thu ngân chép lại từ biên lai của máy POS ngân hàng. */
export interface CardPaymentDraft {
  brand: CardBrand | null;
  last4: string;
  approvalCode: string;
}

export interface PaymentFormValues {
  cashReceived: number;
  transferNote: string;
  card: CardPaymentDraft;
}
