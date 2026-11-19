import type { Metadata } from 'next';
import { FinanceScreen } from '@/components/finance/FinanceScreen';
import { BrowserBoundary } from '@/components/layout/BrowserBoundary';

export const metadata: Metadata = {
  title: 'Tài chính',
};

export default function FinancePage() {
  return (
    <BrowserBoundary>
      <FinanceScreen />
    </BrowserBoundary>
  );
}
