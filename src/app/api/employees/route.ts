import { employeeInputSchema } from '@/server/api/api-schemas';
import { apiRoute, readJsonBody } from '@/server/api/api-route';
import { requireShopSession, requireStaff } from '@/server/auth/require-staff';
import {
  addEmployee,
  listEmployees,
} from '@/server/repositories/employee-repository';

// Màn hình khóa cần danh sách nhân viên để chọn người mở khóa; mã PIN đã băm không bao giờ trả về.
export const GET = apiRoute(async () => {
  await requireShopSession();
  return listEmployees();
});

export const POST = apiRoute(async (request) => {
  const { actor } = await requireStaff('staff.manage');
  return addEmployee(await readJsonBody(request, employeeInputSchema), actor);
});
