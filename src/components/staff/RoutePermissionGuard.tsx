'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { useStaffSession } from '@/hooks/use-staff-session';
import { findNavItemForPath } from '@/lib/navigation/find-nav-item-for-path';
import { AccessDenied } from './AccessDenied';

/**
 * Chặn mở trang bằng đường dẫn trực tiếp khi vai trò không có quyền. Lúc máy còn khóa thì vẫn
 * render trang vì màn hình khóa đã che phía trên.
 */
export function RoutePermissionGuard({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { session, can } = useStaffSession();
  const navItem = findNavItemForPath(pathname);

  if (session.status !== 'unlocked' || !navItem || can(navItem.permission)) {
    return children;
  }
  return <AccessDenied pageLabel={navItem.label} />;
}
