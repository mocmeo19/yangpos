'use client';

import { useCallback } from 'react';
import { findMenuItemByBarcode } from '@/lib/find-menu-item-by-barcode';
import type { MenuItem } from '@/types/menu';
import { useToast } from './use-toast';

/** Thêm món theo mã vừa quét và luôn báo kết quả, kể cả khi mã chưa gán cho món nào. */
export function useAddScannedMenuItem(
  menuItems: readonly MenuItem[],
  onAdd: (menuItem: MenuItem) => void,
): (code: string) => void {
  const showToast = useToast();

  return useCallback(
    (code: string) => {
      const menuItem = findMenuItemByBarcode(menuItems, code);
      if (!menuItem) {
        showToast({
          tone: 'error',
          title: `Chưa có món nào mang mã ${code}`,
          description: 'Gán mã vạch cho món trong mục Thực đơn.',
          action: { label: 'Mở thực đơn', href: '/menu' },
        });
        return;
      }
      if (!menuItem.isAvailable) {
        showToast({ tone: 'error', title: `${menuItem.name} đang tạm hết` });
        return;
      }
      onAdd(menuItem);
      showToast({
        title: `Đã thêm ${menuItem.name}`,
        description: `Mã ${code}`,
      });
    },
    [menuItems, onAdd, showToast],
  );
}
