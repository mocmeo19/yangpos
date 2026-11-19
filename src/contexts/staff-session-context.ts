'use client';

import { createContext } from 'react';
import type { Permission, StaffSession } from '@/types/staff';

export interface StaffSessionValue {
  session: StaffSession;
  /** Luôn `false` khi máy đang khóa hoặc chưa tải xong. */
  can: (permission: Permission) => boolean;
  /** Ném lỗi kèm thông báo khi PIN sai hoặc nhân viên đang bị tạm khóa vì sai nhiều lần. */
  unlock: (employeeId: string, pin: string) => Promise<void>;
  lock: () => Promise<void>;
}

export const StaffSessionContext = createContext<StaffSessionValue | null>(
  null,
);
