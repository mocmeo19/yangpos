import type { Metadata } from 'next';
import { BrowserBoundary } from '@/components/layout/BrowserBoundary';
import { SettingsScreen } from '@/components/settings/SettingsScreen';

export const metadata: Metadata = {
  title: 'Cài đặt',
};

export default function SettingsPage() {
  return (
    <BrowserBoundary>
      <SettingsScreen />
    </BrowserBoundary>
  );
}
