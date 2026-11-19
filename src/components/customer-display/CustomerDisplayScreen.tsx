'use client';

import { CUSTOMER_DISPLAY_ADS } from '@/data/customer-display-ads';
import { useCustomerDisplaySnapshot } from '@/hooks/use-customer-display-snapshot';
import { useSettings } from '@/hooks/use-settings';
import { AdCarousel } from './AdCarousel';
import { CustomerOrderPanel } from './CustomerOrderPanel';
import { FullscreenButton } from './FullscreenButton';

/** Màn hình quay ra phía khách: 2/3 chiếu quảng cáo, 1/3 hiện món đang gọi. */
export function CustomerDisplayScreen() {
  const snapshot = useCustomerDisplaySnapshot();
  const { settings } = useSettings();
  const storeName = settings.store.name || 'YangPOS';

  return (
    <main className="grid h-dvh grid-cols-1 grid-rows-[minmax(0,2fr)_minmax(0,3fr)] overflow-hidden bg-canvas md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] md:grid-rows-1">
      <div className="relative min-h-0">
        <AdCarousel slides={CUSTOMER_DISPLAY_ADS} storeName={storeName} />
        <FullscreenButton />
      </div>
      <div className="min-h-0 border-line md:border-l">
        <CustomerOrderPanel snapshot={snapshot} storeName={storeName} />
      </div>
    </main>
  );
}
