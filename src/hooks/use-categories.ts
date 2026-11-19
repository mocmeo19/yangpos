'use client';

import { API_PATHS } from '@/api-client/api-paths';
import type { Category } from '@/types/menu';
import { useApiQuery } from './use-api-query';

export function useCategories(): Category[] | undefined {
  return useApiQuery<Category[]>(API_PATHS.categories);
}
