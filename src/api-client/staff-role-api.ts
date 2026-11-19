import { apiFetch } from '@/lib/api/api-fetch';
import { revalidateApi } from '@/lib/api/revalidate-api';
import type { StaffRole, StaffRoleInput } from '@/types/staff';
import { API_PATHS } from './api-paths';

const BASE = API_PATHS.staffRoles;

// Quyền của nhân viên đang dùng máy có thể vừa đổi nên tải lại cả phiên nhân viên.
async function revalidateRoles(): Promise<void> {
  await revalidateApi(BASE, API_PATHS.staffSession);
}

export async function addStaffRole(input: StaffRoleInput): Promise<StaffRole> {
  const role = await apiFetch<StaffRole>(BASE, 'POST', input);
  await revalidateRoles();
  return role;
}

export async function updateStaffRole(
  id: string,
  input: StaffRoleInput,
): Promise<void> {
  await apiFetch<void>(`${BASE}/${id}`, 'PUT', input);
  await revalidateRoles();
}

export async function deleteStaffRole(id: string): Promise<void> {
  await apiFetch<void>(`${BASE}/${id}`, 'DELETE');
  await revalidateRoles();
}
