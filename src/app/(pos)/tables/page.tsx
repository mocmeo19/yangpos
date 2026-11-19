import type { Metadata } from 'next';
import { BrowserBoundary } from '@/components/layout/BrowserBoundary';
import { TableManager } from '@/components/tables/TableManager';

export const metadata: Metadata = {
  title: 'Bàn',
};

export default function TablesPage() {
  return (
    <BrowserBoundary>
      <TableManager />
    </BrowserBoundary>
  );
}
