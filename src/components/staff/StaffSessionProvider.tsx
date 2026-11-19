'use client';

import { useCallback, useMemo, type ReactNode } from 'react';
import { API_PATHS } from '@/api-client/api-paths';
import {
  lockStaffSession,
  unlockStaffSession,
} from '@/api-client/staff-session-api';
import {
  StaffSessionContext,
  type StaffSessionValue,
} from '@/contexts/staff-session-context';
import { useApiQuery } from '@/hooks/use-api-query';
import { hasPermission } from '@/lib/staff/has-permission';
import type { Permission, StaffSession, StaffSessionInfo } from '@/types/staff';

// Nhân viên bị đổi vai trò hay cho nghỉ từ máy khác thì máy này cập nhật hoặc tự khóa sau vài giây.
const STAFF_SESSION_REFRESH_MS = 30_000;

/**
 * Nhân viên đang dùng máy, do máy chủ quyết định qua cookie phiên nhân viên. Quyền hiển thị ở đây
 * chỉ để ẩn nút; máy chủ vẫn kiểm tra lại quyền ở mọi API ghi dữ liệu.
 */
export function StaffSessionProvider({ children }: { children: ReactNode }) {
  const info = useApiQuery<StaffSessionInfo | null>(API_PATHS.staffSession, {
    refreshIntervalMs: STAFF_SESSION_REFRESH_MS,
  });

  const session = useMemo<StaffSession>(() => {
    if (info === undefined) {
      return { status: 'loading' };
    }
    if (info === null) {
      return { status: 'locked' };
    }
    return { status: 'unlocked', employee: info.employee, role: info.role };
  }, [info]);

  const can = useCallback(
    (permission: Permission) =>
      session.status === 'unlocked' && hasPermission(session.role, permission),
    [session],
  );

  const value = useMemo<StaffSessionValue>(
    () => ({
      session,
      can,
      unlock: unlockStaffSession,
      lock: lockStaffSession,
    }),
    [session, can],
  );

  return <StaffSessionContext value={value}>{children}</StaffSessionContext>;
}
