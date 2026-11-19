'use client';

import { API_PATHS } from '@/api-client/api-paths';
import type { DiningTable } from '@/types/dining-table';
import { useApiQuery } from './use-api-query';

export function useDiningTables(): DiningTable[] | undefined {
  return useApiQuery<DiningTable[]>(API_PATHS.tables);
}
