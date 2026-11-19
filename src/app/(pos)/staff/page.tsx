import type { Metadata } from 'next';
import { BrowserBoundary } from '@/components/layout/BrowserBoundary';
import { StaffScreen } from '@/components/staff/StaffScreen';

export const metadata: Metadata = {
  title: 'Nhân viên',
};

export default function StaffPage() {
  return (
    <BrowserBoundary>
      <StaffScreen />
    </BrowserBoundary>
  );
}
