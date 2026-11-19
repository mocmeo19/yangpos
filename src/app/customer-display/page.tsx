import type { Metadata } from 'next';
import { CustomerDisplayScreen } from '@/components/customer-display/CustomerDisplayScreen';
import { BrowserBoundary } from '@/components/layout/BrowserBoundary';
import { SettingsProvider } from '@/components/settings/SettingsProvider';

export const metadata: Metadata = {
  title: 'Màn hình khách',
};

/** Nằm ngoài nhóm (pos) để không có thanh điều hướng và màn hình khóa nhân viên. */
export default function CustomerDisplayPage() {
  return (
    <BrowserBoundary>
      <SettingsProvider>
        <CustomerDisplayScreen />
      </SettingsProvider>
    </BrowserBoundary>
  );
}
