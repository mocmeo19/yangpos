import type { Metadata } from 'next';
import { BrowserBoundary } from '@/components/layout/BrowserBoundary';
import { ReportsView } from '@/components/reports/ReportsView';

export const metadata: Metadata = {
  title: 'Báo cáo',
};

export default function ReportsPage() {
  return (
    <BrowserBoundary>
      <ReportsView />
    </BrowserBoundary>
  );
}
