import { apiFetch } from '@/lib/api/api-fetch';
import { revalidateApi } from '@/lib/api/revalidate-api';
import type { Category } from '@/types/menu';
import { API_PATHS } from './api-paths';

const BASE = API_PATHS.categories;

export async function addCategory(name: string): Promise<Category> {
  const category = await apiFetch<Category>(BASE, 'POST', { name });
  await revalidateApi(BASE);
  return category;
}

export async function renameCategory(id: string, name: string): Promise<void> {
  await apiFetch<void>(`${BASE}/${id}`, 'PATCH', { name });
  await revalidateApi(BASE);
}

export async function deleteCategory(id: string): Promise<void> {
  await apiFetch<void>(`${BASE}/${id}`, 'DELETE');
  await revalidateApi(BASE);
}
