import { apiFetch } from '@/lib/api/api-fetch';
import { revalidateApi } from '@/lib/api/revalidate-api';
import type { DiningTable, DiningTableInput } from '@/types/dining-table';
import { API_PATHS } from './api-paths';

const BASE = API_PATHS.tables;

export async function addDiningTable(
  input: DiningTableInput,
): Promise<DiningTable> {
  const table = await apiFetch<DiningTable>(BASE, 'POST', input);
  await revalidateApi(BASE);
  return table;
}

export async function updateDiningTable(
  id: string,
  input: DiningTableInput,
): Promise<void> {
  await apiFetch<void>(`${BASE}/${id}`, 'PUT', input);
  await revalidateApi(BASE);
}

export async function deleteDiningTable(id: string): Promise<void> {
  await apiFetch<void>(`${BASE}/${id}`, 'DELETE');
  await revalidateApi(BASE);
}
