'use client';

import { API_PATHS } from '@/api-client/api-paths';
import type { StaffRole } from '@/types/staff';
import { useApiQuery } from './use-api-query';

export function useStaffRoles(): StaffRole[] | undefined {
  return useApiQuery<StaffRole[]>(API_PATHS.staffRoles);
}
