'use client';

import { useMemo } from 'react';
import { useBroadcastCustomerDisplay } from '@/hooks/use-broadcast-customer-display';
import { useOrderDraft } from '@/hooks/use-order-draft';
import {
  TAKEAWAY_LABEL,
  useTableNameResolver,
} from '@/hooks/use-table-name-resolver';
import type { CustomerDisplaySnapshot } from '@/types/customer-display';

/**
 * Đặt ở cấp layout cùng phiếu đang gọi, để màn hình khách vẫn cập nhật khi thu ngân chuyển sang
 * trang khác. Không hiển thị gì trên máy bán hàng.
 */
export function CustomerDisplayBroadcaster() {
  const { lines, serviceMode, selectedTableId } = useOrderDraft();
  const resolveTableName = useTableNameResolver();

  let destinationLabel = TAKEAWAY_LABEL;
  if (serviceMode === 'dineIn') {
    destinationLabel = selectedTableId ? resolveTableName(selectedTableId) : '';
  }

  const snapshot = useMemo<CustomerDisplaySnapshot>(
    () => ({
      lines: lines.map(
        ({ menuItemId, name, emoji, quantity, unitPrice, note }) => ({
          menuItemId,
          name,
          emoji,
          quantity,
          unitPrice,
          note,
        }),
      ),
      destinationLabel,
    }),
    [lines, destinationLabel],
  );

  useBroadcastCustomerDisplay(snapshot);
  return null;
}
