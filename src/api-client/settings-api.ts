import { apiFetch } from '@/lib/api/api-fetch';
import { revalidateApi } from '@/lib/api/revalidate-api';
import type { AppSettings, SettingsSection } from '@/types/settings';
import { API_PATHS } from './api-paths';

export async function saveSettingsSection<K extends SettingsSection>(
  section: K,
  value: AppSettings[K],
): Promise<void> {
  await apiFetch<void>(`${API_PATHS.settings}/${section}`, 'PUT', value);
  await revalidateApi(API_PATHS.settings);
}
