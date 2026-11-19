import { apiFetch } from '@/lib/api/api-fetch';
import { revalidateApi } from '@/lib/api/revalidate-api';
import { API_PATHS } from './api-paths';

/** Máy chủ kiểm tra PIN; sai thì ném lỗi kèm thông báo (kể cả khi bị tạm khóa do sai nhiều lần). */
export async function unlockStaffSession(
  employeeId: string,
  pin: string,
): Promise<void> {
  await apiFetch<void>(API_PATHS.staffSession, 'POST', { employeeId, pin });
  await revalidateApi('/api/');
}

export async function lockStaffSession(): Promise<void> {
  await apiFetch<void>(API_PATHS.staffSession, 'DELETE');
  await revalidateApi(API_PATHS.staffSession);
}
