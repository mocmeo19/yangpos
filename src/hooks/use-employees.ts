'use client';

import { API_PATHS } from '@/api-client/api-paths';
import type { Employee } from '@/types/staff';
import { useApiQuery } from './use-api-query';

export function useEmployees(): Employee[] | undefined {
  return useApiQuery<Employee[]>(API_PATHS.employees);
}
