import type { Metadata } from 'next';
import { BrowserBoundary } from '@/components/layout/BrowserBoundary';
import { MenuManager } from '@/components/menu/MenuManager';

export const metadata: Metadata = {
  title: 'Thực đơn',
};

export default function MenuPage() {
  return (
    <BrowserBoundary>
      <MenuManager />
    </BrowserBoundary>
  );
}
