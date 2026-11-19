import { Suspense, type ReactNode } from 'react';
import { LoadingState } from '@/components/ui/LoadingState';
import { BrowserOnly } from './BrowserOnly';

/**
 * Đặt trong từng page thay vì root layout: nếu chặn ở layout, segment trang không render được
 * khi Next.js kiểm tra instant navigation.
 */
export function BrowserBoundary({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<LoadingState />}>
      <BrowserOnly>{children}</BrowserOnly>
    </Suspense>
  );
}
