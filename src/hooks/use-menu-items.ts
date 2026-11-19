'use client';

import { API_PATHS } from '@/api-client/api-paths';
import type { MenuItem } from '@/types/menu';
import { useApiQuery } from './use-api-query';

export function useMenuItems(): MenuItem[] | undefined {
  return useApiQuery<MenuItem[]>(API_PATHS.menuItems);
}
