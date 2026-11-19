import { apiFetch } from '@/lib/api/api-fetch';
import { revalidateApi } from '@/lib/api/revalidate-api';
import type { CashEntry, CashEntryInput } from '@/types/cash-entry';
import { API_PATHS } from './api-paths';

const BASE = API_PATHS.cashEntries;

export async function addCashEntry(input: CashEntryInput): Promise<CashEntry> {
  const entry = await apiFetch<CashEntry>(BASE, 'POST', input);
  await revalidateApi(BASE, API_PATHS.finance);
  return entry;
}

export async function deleteCashEntry(id: string): Promise<void> {
  await apiFetch<void>(`${BASE}/${id}`, 'DELETE');
  await revalidateApi(BASE, API_PATHS.finance);
}
