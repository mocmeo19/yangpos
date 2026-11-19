'use client';

import { MonitorUp } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  CUSTOMER_DISPLAY_PATH,
  CUSTOMER_DISPLAY_WINDOW_NAME,
} from '@/lib/customer-display/customer-display-channel';

/** Mở màn hình khách ở cửa sổ riêng để kéo sang màn hình phụ; bấm lại chỉ đưa cửa sổ đó lên trước. */
export function CustomerDisplayButton() {
  function openCustomerDisplay() {
    const displayWindow = window.open(
      CUSTOMER_DISPLAY_PATH,
      CUSTOMER_DISPLAY_WINDOW_NAME,
      'popup,width=1280,height=720',
    );
    displayWindow?.focus();
  }

  return (
    <Button
      variant="secondary"
      size="icon"
      aria-label="Mở màn hình khách"
      title="Mở màn hình khách"
      onClick={openCustomerDisplay}
    >
      <MonitorUp className="size-5" />
    </Button>
  );
}
