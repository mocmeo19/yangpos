import { CARD_BRAND_LABELS } from '@/data/card-brands';
import { calculateItemsTotal } from '@/lib/order-totals';
import { PAYMENT_METHOD_LABELS } from '@/lib/payment-methods';
import type { Order, PaymentDetails } from '@/types/order';
import type { ReceiptPaymentInfo } from '@/types/receipt';

function describeCard({ cardBrand, cardLast4 }: PaymentDetails): string | null {
  const parts: string[] = [];
  if (cardBrand) {
    parts.push(CARD_BRAND_LABELS[cardBrand]);
  }
  if (cardLast4) {
    parts.push(`•••• ${cardLast4}`);
  }
  return parts.length > 0 ? parts.join(' ') : null;
}

/** Thông tin thanh toán đã ghi nhận của đơn, dùng cho hóa đơn in và màn hình chi tiết đơn. */
export function buildPaymentInfo(order: Order): ReceiptPaymentInfo | null {
  if (!order.paymentMethod) {
    return null;
  }
  const details = order.paymentDetails ?? {};
  const cashReceived = details.cashReceived ?? null;
  const total = calculateItemsTotal(order.items);
  return {
    methodLabel: PAYMENT_METHOD_LABELS[order.paymentMethod],
    cashReceived,
    change: cashReceived === null ? null : cashReceived - total,
    cardSummary: describeCard(details),
    approvalCode: details.approvalCode ?? null,
    transferNote: details.transferNote ?? null,
  };
}
