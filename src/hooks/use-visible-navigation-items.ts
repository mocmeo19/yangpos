'use client';

import { useMemo } from 'react';
import { NAVIGATION_ITEMS } from '@/data/navigation';
import type { NavigationItem } from '@/types/navigation';
import { useStaffSession } from './use-staff-session';

/** Các mục điều hướng mà nhân viên đang dùng máy được phép mở. */
export function useVisibleNavigationItems(): NavigationItem[] {
  const { can } = useStaffSession();
  return useMemo(
    () => NAVIGATION_ITEMS.filter((item) => can(item.permission)),
    [can],
  );
}
