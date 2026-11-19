'use client';

import { useEffect, useState } from 'react';
import {
  isCustomerDisplayMessage,
  openCustomerDisplayChannel,
} from '@/lib/customer-display/customer-display-channel';
import type {
  CustomerDisplayMessage,
  CustomerDisplaySnapshot,
} from '@/types/customer-display';

const EMPTY_SNAPSHOT: CustomerDisplaySnapshot = {
  lines: [],
  destinationLabel: '',
};

/** Nhận phiếu đang gọi từ cửa sổ bán hàng; phiếu trống cho tới khi máy bán hàng trả lời. */
export function useCustomerDisplaySnapshot(): CustomerDisplaySnapshot {
  const [snapshot, setSnapshot] = useState(EMPTY_SNAPSHOT);

  useEffect(() => {
    const channel = openCustomerDisplayChannel();
    if (!channel) {
      return;
    }
    channel.onmessage = (event: MessageEvent<unknown>) => {
      if (
        isCustomerDisplayMessage(event.data) &&
        event.data.type === 'snapshot'
      ) {
        setSnapshot(event.data.snapshot);
      }
    };
    const request: CustomerDisplayMessage = { type: 'request' };
    channel.postMessage(request);
    return () => channel.close();
  }, []);

  return snapshot;
}
