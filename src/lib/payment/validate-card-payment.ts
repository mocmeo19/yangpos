import type { CardPaymentDraft } from '@/types/payment-form';
import type { CardPaymentSettings } from '@/types/settings';

const LAST4_PATTERN = /^\d{4}$/;

/** Trả về lý do chưa thể xác nhận thanh toán thẻ, hoặc `null` khi đã đủ thông tin. */
export function validateCardPayment(
  card: CardPaymentDraft,
  settings: CardPaymentSettings,
): string | null {
  if (card.last4 && !LAST4_PATTERN.test(card.last4)) {
    return 'Nhập đủ 4 số cuối của thẻ hoặc để trống.';
  }
  if (settings.requireApprovalCode && !card.approvalCode.trim()) {
    return 'Nhập mã chuẩn chi in trên biên lai máy POS.';
  }
  return null;
}
