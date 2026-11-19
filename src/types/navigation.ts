import type { LucideIcon } from 'lucide-react';
import type { Permission } from './staff';

export interface NavigationItem {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Mô tả ngắn hiện trong menu "Thêm" trên điện thoại. */
  description: string;
  /** Quyền cần có để thấy mục này và mở trang tương ứng (kể cả trang con). */
  permission: Permission;
}
