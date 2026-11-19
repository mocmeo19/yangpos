import type { Receipt } from '@/types/receipt';

export function getReceiptTotalLabel(receipt: Receipt): string {
  return receipt.eInvoice
    ? 'Tổng tiền thanh toán'
    : `Tổng cộng (${receipt.itemCount} món)`;
}
