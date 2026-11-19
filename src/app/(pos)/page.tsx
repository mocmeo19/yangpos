import type { Metadata } from 'next';
import { BrowserBoundary } from '@/components/layout/BrowserBoundary';
import { PosScreen } from '@/components/pos/PosScreen';

export const metadata: Metadata = {
  title: 'Bán hàng',
};

export default function PosPage() {
  return (
    <BrowserBoundary>
      <PosScreen />
    </BrowserBoundary>
  );
}
