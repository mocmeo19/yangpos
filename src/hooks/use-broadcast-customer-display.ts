'use client';

import { useEffect, useRef } from 'react';
import {
  isCustomerDisplayMessage,
  openCustomerDisplayChannel,
} from '@/lib/customer-display/customer-display-channel';
import type {
  CustomerDisplayMessage,
  CustomerDisplaySnapshot,
} from '@/types/customer-display';

/** Gửi phiếu đang gọi sang màn hình khách mỗi khi thay đổi, và khi màn hình khách vừa mở. */
export function useBroadcastCustomerDisplay(
  snapshot: CustomerDisplaySnapshot,
): void {
  const channelRef = useRef<BroadcastChannel | null>(null);
  const snapshotRef = useRef(snapshot);

  useEffect(() => {
    const channel = openCustomerDisplayChannel();
    if (!channel) {
      return;
    }
    channelRef.current = channel;
    channel.onmessage = (event: MessageEvent<unknown>) => {
      if (
        isCustomerDisplayMessage(event.data) &&
        event.data.type === 'request'
      ) {
        const reply: CustomerDisplayMessage = {
          type: 'snapshot',
          snapshot: snapshotRef.current,
        };
        channel.postMessage(reply);
      }
    };
    return () => {
      channel.close();
      channelRef.current = null;
    };
  }, []);

  useEffect(() => {
    snapshotRef.current = snapshot;
    const message: CustomerDisplayMessage = { type: 'snapshot', snapshot };
    channelRef.current?.postMessage(message);
  }, [snapshot]);
}
