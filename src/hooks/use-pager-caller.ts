'use client';

import { useCallback } from 'react';
import { formatOrderNumber } from '@/lib/format-order-number';
import { getErrorMessage } from '@/lib/get-error-message';
import { callPagerOverSerial } from '@/lib/pager/call-pager-over-serial';
import { formatPagerLabel } from '@/lib/pager/format-pager-label';
import { getSettingsSectionHref } from '@/lib/settings/get-settings-section-href';
import { markPagerCalled } from '@/api-client/order-api';
import type { Order } from '@/types/order';
import type { PagerConnection } from '@/types/pager';
import type { ToastOptions } from '@/types/toast';
import { useSettings } from './use-settings';
import { useToast } from './use-toast';

function describeCall(
  connection: PagerConnection,
  pagerNumber: number,
  orderLabel: string,
): ToastOptions {
  const pagerLabel = formatPagerLabel(pagerNumber).toLocaleLowerCase('vi-VN');
  switch (connection) {
    case 'serial':
      return {
        title: `Đã gọi ${pagerLabel}`,
        description: `Đơn ${orderLabel}`,
      };
    case 'manual':
      return {
        tone: 'info',
        title: `Gọi ${pagerLabel}`,
        description: `Đơn ${orderLabel} đã xong: bấm số ${pagerNumber} rồi CALL trên đế phát.`,
      };
  }
}

/**
 * Gọi thẻ rung của đơn. Đế phát bấm tay thì ứng dụng nhắc số thẻ cho nhân viên; gửi lệnh lỗi
 * cũng nhắc gọi tay để khách không phải chờ.
 */
export function usePagerCaller(): (order: Order) => Promise<void> {
  const { settings } = useSettings();
  const showToast = useToast();
  const { pager } = settings;

  return useCallback(
    async (order: Order) => {
      const { pagerNumber } = order;
      if (!pager.enabled || pagerNumber === undefined) {
        return;
      }
      const orderLabel = formatOrderNumber(order.number);
      try {
        if (pager.connection === 'serial') {
          await callPagerOverSerial(pager, pagerNumber);
        }
        await markPagerCalled(order.id);
        showToast(describeCall(pager.connection, pagerNumber, orderLabel));
      } catch (error) {
        showToast({
          tone: 'error',
          title: `Chưa gọi được thẻ số ${pagerNumber}`,
          description: `${getErrorMessage(error)} Bấm số ${pagerNumber} rồi CALL trên đế phát để gọi tay.`,
          action: {
            label: 'Cài đặt thẻ rung',
            href: getSettingsSectionHref('pager'),
          },
        });
      }
    },
    [pager, showToast],
  );
}
