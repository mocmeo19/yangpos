import type { Order } from '@/types/order';

/** Đơn mẫu để in thử và xem trước hóa đơn khi chưa có đơn thật. */
export function createSampleOrder(now: number): Order {
  return {
    id: 'sample-order',
    number: 1,
    tableId: null,
    status: 'served',
    items: [
      {
        menuItemId: 'sample-pho',
        name: 'Phở bò tái',
        unitPrice: 55000,
        quantity: 2,
        note: 'Ít hành',
      },
      {
        menuItemId: 'sample-coffee',
        name: 'Cà phê sữa đá',
        unitPrice: 25000,
        quantity: 1,
        note: '',
      },
    ],
    createdAt: now,
    updatedAt: now,
    paidAt: null,
    paymentMethod: null,
  };
}
