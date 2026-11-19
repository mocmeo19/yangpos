import { apiFetch } from '@/lib/api/api-fetch';
import { revalidateApi } from '@/lib/api/revalidate-api';
import type { Employee, EmployeeInput } from '@/types/staff';
import { API_PATHS } from './api-paths';

const BASE = API_PATHS.employees;

// Người thao tác do máy chủ xác định từ phiên nhân viên, trình duyệt không tự khai.
async function revalidateEmployees(): Promise<void> {
  await revalidateApi(BASE, API_PATHS.staffSession);
}

export async function addEmployee(input: EmployeeInput): Promise<Employee> {
  const employee = await apiFetch<Employee>(BASE, 'POST', input);
  await revalidateEmployees();
  return employee;
}

export async function updateEmployee(
  id: string,
  input: EmployeeInput,
): Promise<void> {
  await apiFetch<void>(`${BASE}/${id}`, 'PUT', input);
  await revalidateEmployees();
}

export async function deleteEmployee(id: string): Promise<void> {
  await apiFetch<void>(`${BASE}/${id}`, 'DELETE');
  await revalidateEmployees();
}
