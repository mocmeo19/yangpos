import type { Metadata } from 'next';
import { BrowserBoundary } from '@/components/layout/BrowserBoundary';
import { ReservationsScreen } from '@/components/reservations/ReservationsScreen';

export const metadata: Metadata = {
  title: 'Đặt bàn',
};

export default function ReservationsPage() {
  return (
    <BrowserBoundary>
      <ReservationsScreen />
    </BrowserBoundary>
  );
}
