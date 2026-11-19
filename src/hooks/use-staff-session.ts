'use client';

import { useContext } from 'react';
import {
  StaffSessionContext,
  type StaffSessionValue,
} from '@/contexts/staff-session-context';

export function useStaffSession(): StaffSessionValue {
  const value = useContext(StaffSessionContext);
  if (!value) {
    throw new Error(
      'useStaffSession phải được dùng bên trong StaffSessionProvider.',
    );
  }
  return value;
}
