import { NAVIGATION_ITEMS } from '@/data/navigation';
import { findNavItemForPath } from '@/lib/navigation/find-nav-item-for-path';
import type { StaffRole } from '@/types/staff';
import { hasPermission } from './has-permission';

/**
 * Trang nên chuyển tới sau khi mở khóa: `null` nếu được ở lại trang hiện tại, ngược lại là trang
 * đầu tiên vai trò được phép mở (vd nhân viên bếp vào thẳng màn Đơn hàng).
 */
export function resolveLandingPath(
  pathname: string,
  role: StaffRole,
): string | null {
  const currentItem = findNavItemForPath(pathname);
  if (!currentItem || hasPermission(role, currentItem.permission)) {
    return null;
  }
  const firstAllowedItem = NAVIGATION_ITEMS.find((item) =>
    hasPermission(role, item.permission),
  );
  return firstAllowedItem?.href ?? null;
}
