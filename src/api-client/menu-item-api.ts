import { apiFetch } from '@/lib/api/api-fetch';
import { revalidateApi } from '@/lib/api/revalidate-api';
import type { MenuItem, MenuItemInput } from '@/types/menu';
import { API_PATHS } from './api-paths';

const BASE = API_PATHS.menuItems;

export async function addMenuItem(input: MenuItemInput): Promise<MenuItem> {
  const menuItem = await apiFetch<MenuItem>(BASE, 'POST', input);
  await revalidateApi(BASE);
  return menuItem;
}

export async function updateMenuItem(
  id: string,
  input: MenuItemInput,
): Promise<void> {
  await apiFetch<void>(`${BASE}/${id}`, 'PUT', input);
  await revalidateApi(BASE);
}

export async function setMenuItemAvailability(
  id: string,
  isAvailable: boolean,
): Promise<void> {
  await apiFetch<void>(`${BASE}/${id}/availability`, 'PUT', { isAvailable });
  await revalidateApi(BASE);
}

export async function deleteMenuItem(id: string): Promise<void> {
  await apiFetch<void>(`${BASE}/${id}`, 'DELETE');
  await revalidateApi(BASE);
}
