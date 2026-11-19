import type { Metadata } from 'next';
import { BrowserBoundary } from '@/components/layout/BrowserBoundary';
import { OrdersBoard } from '@/components/orders/OrdersBoard';

export const metadata: Metadata = {
  title: 'Đơn hàng',
};

export default function OrdersPage() {
  return (
    <BrowserBoundary>
      <OrdersBoard />
    </BrowserBoundary>
  );
}
