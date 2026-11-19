import { buildSampleEInvoice } from '@/lib/einvoice/build-sample-einvoice';
import type { Order } from '@/types/order';
import type { Receipt } from '@/types/receipt';
import type { AppSettings } from '@/types/settings';
import { buildReceipt } from './build-receipt';
import { createSampleOrder } from './create-sample-order';

const SAMPLE_TABLE_NAME = 'Bàn mẫu';

/** Bản thể hiện hóa đơn điện tử mẫu theo cài đặt đang chỉnh, dùng cho xem trước và in thử. */
export function buildSampleEInvoiceReceipt(
  settings: AppSettings,
  now: number,
): Receipt {
  const order: Order = {
    ...createSampleOrder(now),
    status: 'paid',
    paymentMethod: 'cash',
    paidAt: now,
  };
  return buildReceipt({
    order,
    tableName: SAMPLE_TABLE_NAME,
    settings,
    kind: 'test',
    printedAt: now,
    eInvoice: buildSampleEInvoice(order, settings.eInvoice, now),
  });
}
